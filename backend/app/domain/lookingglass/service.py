import asyncio
from collections.abc import AsyncGenerator

from app.domain.lookingglass.models import MTRRequest, PingRequest, TracerouteRequest


class LookingGlassService:
    """Service for looking glass operations"""

    # Security: Server-side controlled parameters to prevent abuse
    PING_COUNT = 15
    PING_TIMEOUT = 2
    PING_SIZE = 56

    TRACEROUTE_MAX_HOPS = 30
    TRACEROUTE_WAIT_TIME = 3

    MTR_REPORT_CYCLES = 10
    MTR_NO_DNS = True  # Faster, avoids DNS lookups
    MAX_CONCURRENT_TESTS = 20  # Limit total concurrent diagnostics
    _semaphore = asyncio.Semaphore(MAX_CONCURRENT_TESTS)

    def __init__(self) -> None:
        self.max_execution_time = 60  # Increased to accommodate longer operations

    async def _execute_command_stream(
        self, cmd: list[str], command_name: str
    ) -> AsyncGenerator[bytes, None]:
        """
        Execute a command and stream the output line by line as bytes.
        At the end, yield a message indicating success/failure/exit code.
        """
        process = None
        try:
            try:
                # Use semaphore to limit concurrency
                async with self._semaphore:
                    process = await asyncio.create_subprocess_exec(
                        *cmd,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.STDOUT,
                    )
            except FileNotFoundError:
                msg = f"\n--- Error: '{cmd[0]}' command not found on system ---\n"
                yield msg.encode()
                return

            assert process.stdout is not None
            while True:
                try:
                    line = await asyncio.wait_for(
                        process.stdout.readline(), timeout=self.max_execution_time
                    )
                    if not line:
                        break
                    yield line
                except asyncio.TimeoutError:
                    if process:
                        process.terminate()
                        try:
                            await asyncio.wait_for(process.wait(), timeout=5.0)
                        except asyncio.TimeoutError:
                            process.kill()
                            await process.wait()

                    msg = (
                        f"\n--- Unexpected error: Command {command_name} "
                        "timed out ---\n"
                    )
                    yield msg.encode()
                    return
                except Exception as e:
                    yield f"\n--- Unexpected error: {str(e)} ---\n".encode()
                    return

            await process.wait()
            if process.returncode != 0:
                msg = (
                    f"Command {command_name} failed with return code "
                    f"{process.returncode}"
                )
                raise RuntimeError(msg)

            return

        except Exception as e:
            # Re-raise the specific runtime error with return code
            if isinstance(e, RuntimeError):
                raise
            raise RuntimeError(f"Failed to execute {command_name}") from e

    async def ping_stream(self, request: PingRequest) -> AsyncGenerator[bytes, None]:
        """
        Stream ping output line by line in real-time.
        Uses server-defined parameters to prevent abuse.
        """
        cmd = [
            "ping",
            "-c",
            str(self.PING_COUNT),
            "-W",
            str(self.PING_TIMEOUT),
            "-s",
            str(self.PING_SIZE),
            request.target,
        ]

        async for chunk in self._execute_command_stream(cmd, "Ping"):
            yield chunk

    async def ping6_stream(self, request: PingRequest) -> AsyncGenerator[bytes, None]:
        """
        Stream ping6 (IPv6) output line by line in real-time.
        Uses server-defined parameters to prevent abuse.
        """
        cmd = [
            "ping6",
            "-c",
            str(self.PING_COUNT),
            "-W",
            str(self.PING_TIMEOUT),
            "-s",
            str(self.PING_SIZE),
            request.target,
        ]

        async for chunk in self._execute_command_stream(cmd, "Ping6"):
            yield chunk

    async def traceroute_stream(
        self, request: TracerouteRequest
    ) -> AsyncGenerator[bytes, None]:
        """
        Stream traceroute output in real-time.
        Uses server-defined parameters to prevent abuse.
        """
        cmd = [
            "traceroute",
            "-m",
            str(self.TRACEROUTE_MAX_HOPS),
            "-w",
            str(self.TRACEROUTE_WAIT_TIME),
            request.target,
        ]

        async for chunk in self._execute_command_stream(cmd, "Traceroute"):
            yield chunk

    async def traceroute6_stream(
        self, request: TracerouteRequest
    ) -> AsyncGenerator[bytes, None]:
        """
        Stream traceroute6 (IPv6) output in real-time.
        Uses server-defined parameters to prevent abuse.
        """
        cmd = [
            "traceroute6",
            "-m",
            str(self.TRACEROUTE_MAX_HOPS),
            "-w",
            str(self.TRACEROUTE_WAIT_TIME),
            request.target,
        ]

        async for chunk in self._execute_command_stream(cmd, "Traceroute6"):
            yield chunk

    async def mtr_stream(self, request: MTRRequest) -> AsyncGenerator[bytes, None]:
        """
        Stream MTR (My Traceroute) output in real-time.
        Uses server-defined parameters to prevent abuse.
        """
        cmd = [
            "mtr",
            "--report",
            "--report-cycles",
            str(self.MTR_REPORT_CYCLES),
        ]

        if self.MTR_NO_DNS:
            cmd.append("--no-dns")

        cmd.append(request.target)

        async for chunk in self._execute_command_stream(cmd, "MTR"):
            yield chunk

    async def mtr6_stream(self, request: MTRRequest) -> AsyncGenerator[bytes, None]:
        """
        Stream MTR6 (My Traceroute for IPv6) output in real-time.
        Uses server-defined parameters to prevent abuse.
        """
        cmd = [
            "mtr",
            "-6",  # Force IPv6
            "--report",
            "--report-cycles",
            str(self.MTR_REPORT_CYCLES),
        ]

        if self.MTR_NO_DNS:
            cmd.append("--no-dns")

        cmd.append(request.target)

        async for chunk in self._execute_command_stream(cmd, "MTR6"):
            yield chunk
