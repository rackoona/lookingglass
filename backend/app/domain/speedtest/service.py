from collections.abc import Generator


class SpeedtestService:
    CHUNK_SIZE_BYTES = 1024 * 1024  # 1MB
    MB_TO_BYTES = 1024 * 1024
    GB_TO_MB = 1024

    def __init__(self, chunk_size_bytes: int = CHUNK_SIZE_BYTES) -> None:
        self.chunk_size_bytes = chunk_size_bytes
        self._dummy_chunk = b"0" * self.chunk_size_bytes

    def generate_dummy_data(self, size_mb: int) -> Generator[bytes, None, None]:
        """Generate dummy data chunks of requested size in MB."""
        if size_mb <= 0:
            raise ValueError("Size must be positive integer")
        for _ in range(size_mb):
            yield self._dummy_chunk

    @staticmethod
    def get_filename(size_label: str) -> str:
        return f"speedtest_rackoona_{size_label}.bin"

    @classmethod
    def mb_100(cls) -> int:
        return 100

    @classmethod
    def mb_1g(cls) -> int:
        return cls.GB_TO_MB

    @classmethod
    def mb_10g(cls) -> int:
        return cls.GB_TO_MB * 10

    def get_response_headers(self, size_label: str, size_mb: int) -> dict[str, str]:
        filename = self.get_filename(size_label)
        return {
            "Content-Disposition": f"attachment; filename={filename}",
            "Content-Length": str(self.get_file_size_bytes(size_mb)),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }

    def get_file_size_bytes(self, size_mb: int) -> int:
        if size_mb <= 0:
            raise ValueError("Size must be positive integer")
        return size_mb * self.MB_TO_BYTES
