# Looking Glass - Complete Network Diagnostics Platform

<div align="center">

![Looking Glass](https://img.shields.io/badge/Looking%20Glass-Network%20Diagnostics-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Next.js](https://img.shields.io/badge/Next.js%2016-Frontend-000000)
![Monorepo](https://img.shields.io/badge/Monorepo-Structure-orange)

**A modern, open-source Looking Glass platform for network transparency and diagnostics**

[Live Demo](https://rackoona.com) • [GitHub Repository](https://github.com/rackoona/lookingglass) • [Documentation](#documentation)

</div>

---

## 🌟 About This Project

Looking Glass is a comprehensive network diagnostics platform originally developed by [**Rackoona**](https://rackoona.com) to provide transparency and real-time network insights to customers and network engineers worldwide. We believe in open standards and community-driven development, which is why we've made this powerful tool available as open-source software.

### What is Rackoona?

[**Rackoona**](https://rackoona.com) is a next-generation network infrastructure provider committed to transparency, performance, and customer empowerment. We built this Looking Glass platform to give our customers unprecedented visibility into our network performance and routing decisions. Now, we're sharing it with the networking community to help others build better, more transparent networks.

**Why Rackoona chose to open-source this:**
- 🌐 **Network Transparency**: We believe customers deserve full visibility into their infrastructure
- 🤝 **Community Collaboration**: Better tools emerge from shared knowledge
- 🚀 **Innovation**: Open-source accelerates development and adoption
- 💡 **Industry Standards**: Contributing to better networking practices

---

## 📦 Monorepo Structure

This is a monorepo containing both frontend and backend components:

```
lookingglass/
├── backend/          # FastAPI backend server
│   ├── app/         # Application code
│   ├── Dockerfile   # Backend container
│   └── README.md    # Backend documentation
├── frontend/        # Next.js web interface
│   ├── app/        # Next.js app directory
│   ├── components/ # React components
│   ├── Dockerfile  # Frontend container
│   └── README.md   # Frontend documentation
└── README.md       # This file (main documentation)
```

### 🔧 Backend
**Location**: [`/backend`](./backend)

A high-performance FastAPI-based backend providing:
- Real-time network diagnostics (ping, traceroute, MTR)
- IPv4 and IPv6 support
- Speedtest capabilities (100MB, 1GB, 10GB)
- Rate limiting and security features
- RESTful API with streaming support

**Tech Stack**: Python 3.10+, FastAPI, Uvicorn, Pydantic

[📖 Backend Documentation](./backend/README.md)

### 🎨 Frontend
**Location**: [`/frontend`](./frontend)

A modern, responsive web interface built with:
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Multi-location support
- Dark mode with theme switcher
- Real-time streaming output

**Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS

[📖 Frontend Documentation](./frontend/README.md)

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have:
- **Docker & Docker Compose** (recommended) OR
- **Node.js 20+** and **Python 3.10+** (for manual installation)
- **System packages** (for backend): `iputils-ping`, `mtr`, `traceroute`

### Option 1: Full Stack Deployment with Docker Compose (Recommended)

This is the fastest way to get both frontend and backend running together.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/rackoona/lookingglass.git
cd lookingglass
```

#### Step 2: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your network information:

```env
# Network Information
NETWORK_LOCATION="Amsterdam, Netherlands"
NETWORK_MAP_URL="https://www.google.com/maps/place/Amsterdam"
NETWORK_FACILITY="Your Datacenter Name"
NETWORK_FACILITY_URL="https://www.peeringdb.com/fac/xxxx"
NETWORK_IPV4="203.0.113.1"
NETWORK_IPV6="2001:db8::1"
```

#### Step 3: Create Docker Compose Configuration

Create `docker-compose.yml` in the root `lookingglass` directory:

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
    ports:
      - "8000:8000"
    cap_add:
      - NET_RAW  # Required for ping/traceroute
    env_file:
      - ./backend/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - looking-glass-network

  frontend:
    build:
      context: ./frontend
      args:
        # Single location setup
        NEXT_PUBLIC_API_URL: "http://localhost:8000"
        
        # OR Multi-location setup (comment out NEXT_PUBLIC_API_URL above)
        # NEXT_PUBLIC_LOCATIONS: '[{"id":"ams","name":"Amsterdam","url":"http://localhost:8000"}]'
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - looking-glass-network

networks:
  looking-glass-network:
    driver: bridge
```

#### Step 4: Launch the Platform

```bash
# From the lookingglass root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### Step 5: Access Your Looking Glass

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

🎉 **Congratulations!** Your Looking Glass platform is now running!

---

### Option 2: Manual Installation (Development)

For development or when Docker is not available.

#### Backend Setup

```bash
# From the lookingglass root directory
cd backend

# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run backend
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at http://localhost:8000

#### Frontend Setup

```bash
# From the lookingglass root directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Configure environment
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > .env.local

# Run frontend
npm run dev
```

Frontend will be available at http://localhost:3000

---

## 🌍 Multi-Location Deployment (Recommended Architecture)

One of the most powerful features is multi-location support, perfect for providers with global infrastructure (like Rackoona's worldwide network).

### Recommended Architecture: One Frontend, Multiple Backends

**Why this architecture?**
- ✅ **Resource Efficient**: Single frontend instance serves all locations
- ✅ **Better User Experience**: Seamless switching between locations without page reloads
- ✅ **Easier Maintenance**: Update UI once, applies to all locations
- ✅ **Cost Effective**: Reduced hosting costs and bandwidth
- ✅ **Centralized Management**: Single deployment for the frontend
- ✅ **Scalable**: Add new locations by deploying only backend instances

### Architecture Diagram

```
                    ┌─────────────────────────────────────────┐
                    │    Frontend (Single Instance)           │
                    │    • Hosted in one location             │
                    │    • Location selector dropdown         │
                    │    • Manages all backend connections    │
                    └──────────────┬──────────────────────────┘
                                   │
                   ┌───────────────┼───────────────┬──────────────┐
                   │               │               │              │
                   ▼               ▼               ▼              ▼
            ┌──────────┐    ┌──────────┐   ┌──────────┐   ┌──────────┐
            │ Backend  │    │ Backend  │   │ Backend  │   │ Backend  │
            │Amsterdam │    │New York  │   │Singapore │   │Frankfurt │
            │:8000     │    │:8000     │   │:8000     │   │:8000     │
            │          │    │          │   │          │   │          │
            │ Ping     │    │ Ping     │   │ Ping     │   │ Ping     │
            │Traceroute│    │Traceroute│   │Traceroute│   │Traceroute│
            │ MTR      │    │ MTR      │   │ MTR      │   │ MTR      │
            │Speedtest │    │Speedtest │   │Speedtest │   │Speedtest │
            └──────────┘    └──────────┘   └──────────┘   └──────────┘
```

**How it works:**
1. Deploy **one frontend** instance (can be anywhere, or use a CDN)
2. Deploy **multiple backend** instances in different geographic locations
3. Frontend connects to the selected backend based on user choice
4. Users get real diagnostics from each specific location

### Deployment Steps

#### Step 1: Deploy Backend Instances

Deploy a backend instance in each geographic location where you want to provide diagnostics:

```bash
# On Amsterdam server
cd lookingglass/backend
docker build -t looking-glass-backend .
docker run -d -p 8000:8000 --cap-add=NET_RAW --env-file .env looking-glass-backend

# On New York server
cd lookingglass/backend
docker build -t looking-glass-backend .
docker run -d -p 8000:8000 --cap-add=NET_RAW --env-file .env looking-glass-backend

# Repeat for each location...
```

#### Step 2: Deploy Single Frontend

Deploy the frontend once (can be on any server):

```bash
# Frontend .env.local configuration
NEXT_PUBLIC_LOCATIONS='[
  {"id":"ams","name":"Amsterdam, Netherlands","url":"https://ams-lg.example.com"},
  {"id":"nyc","name":"New York, United States","url":"https://nyc-lg.example.com"},
  {"id":"sin","name":"Singapore","url":"https://sin-lg.example.com"},
  {"id":"fra","name":"Frankfurt, Germany","url":"https://fra-lg.example.com"}
]'
```

```bash
cd lookingglass/frontend
docker build --build-arg NEXT_PUBLIC_LOCATIONS='[...]' -t looking-glass-frontend .
docker run -d -p 3000:80 looking-glass-frontend
```

#### Step 3: Configure DNS and SSL

Point your domain to the frontend, and ensure each backend location has proper SSL certificates.

**Pro Tip**: This is exactly how Rackoona deploys Looking Glass across our global network, giving customers real-time visibility from any location while minimizing infrastructure costs.

### Resource Comparison

**Traditional Approach** (Frontend + Backend per location):
```
Location 1: Frontend + Backend = 2 containers
Location 2: Frontend + Backend = 2 containers
Location 3: Frontend + Backend = 2 containers
Location 4: Frontend + Backend = 2 containers
─────────────────────────────────────────────
Total: 8 containers, 4x frontend maintenance
```

**Recommended Approach** (One Frontend, Multiple Backends):
```
Central:    Frontend           = 1 container
Location 1: Backend            = 1 container
Location 2: Backend            = 1 container
Location 3: Backend            = 1 container
Location 4: Backend            = 1 container
─────────────────────────────────────────────
Total: 5 containers, 1x frontend maintenance
Savings: 3 containers (37.5% reduction)
```

**Benefits Summary:**
- 💰 **Cost Savings**: ~40% reduction in infrastructure costs
- 🔧 **Easier Maintenance**: Update UI once instead of N times
- ⚡ **Better Performance**: Users don't reload pages when switching locations
- 🌐 **Scalability**: Add new locations without frontend changes
- 📊 **Centralized Analytics**: Single point for user behavior tracking

---

## 🔧 Configuration Guide

### Backend Configuration

All backend configuration is done via environment variables in `backend/.env`:

```env
# Network Information (all optional)
NETWORK_LOCATION="Amsterdam, Netherlands"
NETWORK_MAP_URL="https://www.google.com/maps/place/Amsterdam"
NETWORK_FACILITY="Equinix AM7"
NETWORK_FACILITY_URL="https://www.peeringdb.com/fac/1234"
NETWORK_IPV4="203.0.113.1"
NETWORK_IPV6="2001:db8::1"
```

### Frontend Configuration

Frontend uses `NEXT_PUBLIC_*` environment variables in `frontend/.env.local`:

**Single Location**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Multiple Locations**:
```bash
NEXT_PUBLIC_LOCATIONS='[{"id":"loc1","name":"Location 1","url":"https://api1.example.com"},{"id":"loc2","name":"Location 2","url":"https://api2.example.com"}]'
```

For detailed configuration options, see:
- [Backend Configuration](./backend/README.md#configuration)
- [Frontend Environment Variables](./frontend/ENV.md)

---

## 🔒 Production Deployment

### Security Checklist

- [ ] Configure rate limiting (enabled by default)
- [ ] Set up reverse proxy (Nginx/Caddy) with HTTPS
- [ ] Configure CORS properly for your domain
- [ ] Use environment variables for sensitive data
- [ ] Enable firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Reverse Proxy Example (Nginx)

```nginx
# Backend
server {
    listen 443 ssl http2;
    server_name api-lg.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Disable buffering for streaming responses
        proxy_buffering off;
    }
}

# Frontend
server {
    listen 443 ssl http2;
    server_name lg.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Production Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "127.0.0.1:8000:8000"  # Bind to localhost only
    cap_add:
      - NET_RAW
    env_file:
      - ./backend/.env
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_URL: "https://api-lg.example.com"
    ports:
      - "127.0.0.1:3000:80"  # Bind to localhost only
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 📊 Features Overview

### Network Diagnostics
- ✅ **Ping (IPv4/IPv6)**: ICMP echo tests with real-time output
- ✅ **Traceroute (IPv4/IPv6)**: Complete path discovery with hop latency
- ✅ **MTR (My Traceroute)**: Combined ping and traceroute analysis
- ✅ **Real-time Streaming**: Live command output in the browser

### Speedtest
- ✅ **Multiple Test Sizes**: 100MB, 1GB, 10GB downloads
- ✅ **Accurate Measurements**: Proper headers for client-side calculations
- ✅ **Efficient Streaming**: Minimal memory footprint

### Network Information
- ✅ **Location Details**: Server location and facility information
- ✅ **IP Detection**: Shows visitor's public IP address
- ✅ **Network Endpoints**: Published IPv4/IPv6 addresses

### User Experience
- ✅ **Modern UI**: Clean, responsive design with dark mode
- ✅ **Multi-Location**: Switch between global locations instantly
- ✅ **Real-time Updates**: Live streaming of diagnostic results
- ✅ **Mobile Friendly**: Fully responsive across all devices

### Security & Performance
- ✅ **Rate Limiting**: Per-IP limits to prevent abuse
- ✅ **Input Validation**: Protection against command injection
- ✅ **Concurrency Control**: System-wide operation limits
- ✅ **Health Checks**: Built-in monitoring endpoints

---

## 🛠️ API Documentation

Once the backend is running, comprehensive API documentation is available:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/network/info` | Network and location information |
| POST | `/lookingglass/ping` | IPv4 ping test |
| POST | `/lookingglass/ping6` | IPv6 ping test |
| POST | `/lookingglass/traceroute` | IPv4 traceroute |
| POST | `/lookingglass/traceroute6` | IPv6 traceroute |
| POST | `/lookingglass/mtr` | IPv4 MTR test |
| POST | `/lookingglass/mtr6` | IPv6 MTR test |
| GET | `/speedtest/100M` | 100MB download test |
| GET | `/speedtest/1G` | 1GB download test |
| GET | `/speedtest/10G` | 10GB download test |
| GET | `/health` | Health check |

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/lookingglass.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes in the appropriate directory (`backend/` or `frontend/`)
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to the branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep backend and frontend changes in separate commits when possible

---

## 📖 Documentation

### Component Documentation

- **[Backend Documentation](./backend/README.md)** - API reference, configuration, deployment
- **[Frontend Documentation](./frontend/README.md)** - Setup, configuration, customization
- **[Environment Variables Guide](./frontend/ENV.md)** - Complete configuration reference

### Troubleshooting

Common issues and solutions:

**Issue**: Backend can't execute ping/traceroute  
**Solution**: Ensure Docker container has `NET_RAW` capability or run with appropriate permissions

**Issue**: Frontend can't connect to backend  
**Solution**: Check CORS configuration and ensure `NEXT_PUBLIC_API_URL` is correct

**Issue**: Rate limiting too strict  
**Solution**: Adjust rate limits in backend configuration (see backend README)

**Issue**: Monorepo dependencies not installing  
**Solution**: Make sure you're in the correct directory (`backend/` or `frontend/`) when installing dependencies

For more help, check the [GitHub Issues](https://github.com/rackoona/lookingglass/issues).

---

## 🌟 Why Choose This Looking Glass?

### Built by Network Engineers, for Network Engineers

This platform was developed by [**Rackoona**](https://rackoona.com) with real-world requirements in mind:

- **Production-Ready**: Battle-tested in Rackoona's global network infrastructure
- **Scalable**: Designed to handle high traffic and multiple locations
- **Resource Efficient**: One frontend, multiple backends architecture reduces costs by ~40%
- **Secure**: Built with security best practices from day one
- **Modern**: Uses cutting-edge technologies for best performance
- **Open Source**: Free to use, modify, and deploy
- **Monorepo Structure**: Easy to manage and deploy as a single unit

### Rackoona's Commitment to Open Source

At [Rackoona](https://rackoona.com), we believe that transparency and collaboration make the internet better for everyone. By open-sourcing our Looking Glass platform, we're:

- **Empowering** network operators with professional-grade tools
- **Contributing** to the networking community's shared knowledge
- **Promoting** transparency in network operations
- **Accelerating** innovation through collaboration

### Who Uses This?

- 🏢 **Network Providers**: Offer transparency to customers
- 🔧 **Data Centers**: Showcase network performance
- 🌐 **ISPs**: Provide diagnostic tools to users
- 🎓 **Educational Institutions**: Teaching networking concepts
- 💼 **Enterprises**: Internal network diagnostics

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE files in each component directory for details.

---

## 🙏 Acknowledgments

### Built With

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives

### Credits

Originally developed by the [**Rackoona**](https://rackoona.com) team as part of our mission to provide transparent, high-performance network infrastructure. Special thanks to all contributors who have helped improve this project.

---

## 💬 Support & Community

### Get Help

- 📚 **Documentation**: Check the README files in each component directory
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/rackoona/lookingglass/issues)
- 💡 **Feature Requests**: Open an issue with your ideas
- 📧 **Commercial Support**: <support@rackoona.com>

### Stay Connected

- 🌐 **Website**: [rackoona.com](https://rackoona.com)
- 💼 **Enterprise Solutions**: Contact us for custom deployments and support
- 🚀 **Rackoona Platform**: Experience this Looking Glass in production on our network

---

## 🎯 Roadmap

Future enhancements we're considering:

- [ ] BGP route lookup functionality
- [ ] Historical performance data and graphs
- [ ] Email notifications for monitoring
- [ ] API authentication for private deployments
- [ ] Mobile native applications
- [ ] Integration with network monitoring tools
- [ ] Automated network topology visualization
- [ ] Monorepo tooling improvements

Want to contribute to any of these? Check out our [GitHub repository](https://github.com/rackoona/lookingglass) and join the development!

---

<div align="center">

**Made with ❤️ by [Rackoona](https://rackoona.com)**

*Building transparent, high-performance network infrastructure for the modern internet*

[Website](https://rackoona.com) • [GitHub](https://github.com/rackoona/lookingglass) • [Documentation](#documentation)

</div>
