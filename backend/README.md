# Looking Glass Backend

A modern, high-performance Looking Glass server built with FastAPI. Originally developed for [Rackoona.com](https://rackoona.com), now available as open-source software for the networking community.

> **Part of the Looking Glass Monorepo**  
> This is the backend API component. For the web frontend, see [`../frontend`](../frontend). For the complete documentation, see the [main README](../README.md).

## Project Links

- **Main Repository**: [https://github.com/rackoona/lookingglass](https://github.com/rackoona/lookingglass)
- **Website**: [https://rackoona.com](https://rackoona.com)

## About

This Looking Glass server provides network diagnostic tools (ping, traceroute, MTR) and speedtest capabilities through a clean REST API. It was designed to serve as the backend infrastructure for Rackoona's network transparency platform, enabling customers and network engineers to perform real-time diagnostics from various geographic locations.

The backend is designed to work seamlessly with the Looking Glass Frontend (located in [`../frontend`](../frontend)), a modern React-based web interface built with Next.js.

## Features

### Network Diagnostics
- **Ping (IPv4/IPv6)**: ICMP echo tests with configurable parameters
- **Traceroute (IPv4/IPv6)**: Path discovery with hop-by-hop latency
- **MTR (My Traceroute)**: Combined ping and traceroute functionality for comprehensive path analysis
- **Real-time Streaming**: Live output streaming for all diagnostic tools

### Speedtest
- **Multiple Test Sizes**: 100MB, 1GB, and 10GB download tests
- **Efficient Streaming**: Generator-based data delivery for minimal memory footprint
- **Accurate Measurements**: Proper headers for client-side speed calculation

### Network Information
- **Location Details**: Server location, facility information, and map links
- **IP Address Reporting**: Displays client's public IP address
- **Looking Glass Endpoints**: Published IPv4 and IPv6 addresses for the server

### Security & Performance
- **Rate Limiting**: Per-IP rate limits to prevent abuse
- **Concurrency Control**: System-wide limits on simultaneous diagnostic operations
- **Input Validation**: Comprehensive validation to prevent command injection
- **Non-root Execution**: Runs with minimal required capabilities

## Requirements

### System Requirements
- Python 3.10 or higher
- System packages: `iputils-ping`, `mtr`, `traceroute`
- Docker (optional, recommended for production)

### Python Dependencies
- FastAPI
- Uvicorn
- Pydantic v2
- SlowAPI (rate limiting)
- python-dotenv

## Installation

### Quick Start with Docker (Recommended)

```bash
# Clone the monorepo
git clone https://github.com/rackoona/lookingglass.git
cd lookingglass/backend

# Create environment configuration
cp .env.example .env
# Edit .env with your settings

# Build and run
docker build -t looking-glass-backend .
docker run -d \
  -p 8000:8000 \
  --cap-add=NET_RAW \
  --env-file .env \
  --name looking-glass-backend \
  looking-glass-backend
```

The API will be available at `http://localhost:8000`. Interactive API documentation is accessible at `http://localhost:8000/docs`.

**Note**: For running both backend and frontend together, see the [main README](../README.md#quick-start-guide).

### Manual Installation

```bash
# Clone the monorepo
git clone https://github.com/rackoona/lookingglass.git
cd lookingglass/backend

# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Create environment configuration
cp .env.example .env
# Edit .env with your settings

# Run the server
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers
```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Network Information
NETWORK_LOCATION="Amsterdam, Netherlands"
NETWORK_MAP_URL="https://www.google.com/maps/place/Amsterdam"
NETWORK_FACILITY="Your Datacenter Name"
NETWORK_FACILITY_URL="https://www.peeringdb.com/fac/xxxx"
NETWORK_IPV4="203.0.113.1"
NETWORK_IPV6="2001:db8::1"
```

All configuration variables are optional. If not provided, the API will return default values or empty strings.

## API Endpoints

### Network Information
- `GET /network/info` - Returns server location, facility details, and client IP address

### Looking Glass Tools
- `POST /lookingglass/ping` - Execute IPv4 ping test
- `POST /lookingglass/ping6` - Execute IPv6 ping test
- `POST /lookingglass/traceroute` - Execute IPv4 traceroute
- `POST /lookingglass/traceroute6` - Execute IPv6 traceroute
- `POST /lookingglass/mtr` - Execute IPv4 MTR test
- `POST /lookingglass/mtr6` - Execute IPv6 MTR test

### Speedtest
- `GET /speedtest/100M` - Download 100MB test file
- `GET /speedtest/1G` - Download 1GB test file
- `GET /speedtest/10G` - Download 10GB test file

### Health Check
- `GET /health` - Service health status

## API Documentation

Once the server is running, comprehensive interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Security Considerations

### Rate Limiting
The following rate limits are enforced per client IP:
- Looking Glass operations: 2 requests per minute
- Speedtest (100M/1G): 2 requests per minute
- Speedtest (10G): 1 request per minute

### Concurrency Limits
A maximum of 20 simultaneous diagnostic operations can run system-wide to prevent resource exhaustion.

### Input Validation
All user inputs are validated using Pydantic models with strict regex patterns to prevent command injection attacks.

### Proxy Configuration
When deployed behind a reverse proxy (Nginx, Cloudflare, etc.), the server trusts `X-Forwarded-For` and `X-Real-IP` headers for client IP detection. Ensure your proxy is configured correctly to set these headers.

## Development

### Project Structure
```
.
├── app/
│   ├── core/           # Core utilities (rate limiter)
│   ├── domain/         # Domain logic (services, models)
│   │   ├── lookingglass/
│   │   ├── network/
│   │   └── speedtest/
│   ├── routes/         # API routes
│   └── main.py         # Application entry point
├── Dockerfile
├── pyproject.toml      # Project dependencies
└── uv.lock            # Locked dependencies
```

### Running Linters

```bash
# Check code style
uv run ruff check app/

# Format code
uv run ruff format app/

# Type checking
uv run mypy app/
```

## Production Deployment

### Full Stack Docker Compose Example

Deploy both backend and frontend together:

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./lookingglass_backend
    ports:
      - "8000:8000"
    cap_add:
      - NET_RAW
    env_file:
      - ./lookingglass_backend/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  frontend:
    build:
      context: ./lookingglass_frontend
      args:
        NEXT_PUBLIC_API_URL: "http://backend:8000"
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Backend Only Docker Compose

```yaml
version: '3.8'

services:
  looking-glass:
    build: .
    ports:
      - "8000:8000"
    cap_add:
      - NET_RAW
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

### Reverse Proxy Configuration (Nginx)

```nginx
location / {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Disable buffering for streaming responses
    proxy_buffering off;
}
```

## Contributing

Contributions are welcome. Please ensure your code:
1. Passes all linting checks (`ruff check` and `ruff format`)
2. Passes type checking (`mypy`)
3. Follows the existing project structure
4. Includes appropriate documentation

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Credits

Originally developed by the [Rackoona](https://rackoona.com) team as part of our network infrastructure platform. We believe in transparency and open standards in the networking industry, which is why we've made this tool available to the community.

## Related Components

- **Web Frontend**: [`../frontend`](../frontend) - Modern React-based web interface built with Next.js
- **Main Documentation**: [`../README.md`](../README.md) - Complete monorepo documentation and deployment guides

## Support

For issues, questions, or contributions:

- **GitHub Issues**: [https://github.com/rackoona/lookingglass/issues](https://github.com/rackoona/lookingglass/issues)
- **Website**: [https://rackoona.com](https://rackoona.com)
- **Commercial Support**: <support@rackoona.com>

## Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework
- [Uvicorn](https://www.uvicorn.org/) - ASGI server
- [Pydantic](https://docs.pydantic.dev/) - Data validation
- [SlowAPI](https://github.com/laurentS/slowapi) - Rate limiting
