# Looking Glass Frontend

A modern, React-based frontend for network diagnostics, powered by Next.js 16 and Tailwind CSS v4.

> **Part of the Looking Glass Monorepo**  
> This is the frontend component. For the backend API, see [`../backend`](../backend). For the complete documentation, see the [main README](../README.md).

## Project Links

- **Main Repository**: [https://github.com/rackoona/lookingglass](https://github.com/rackoona/lookingglass)
- **Website**: [https://rackoona.com](https://rackoona.com)

## Features

- **Network Info**: Displays current location, facility, and IP details
- **Looking Glass**: Real-time streaming execution of `ping`, `ping6`, `traceroute`, `traceroute6`, `mtr`, and `mtr6` commands
- **Speed Test**: Direct file download tests for 100MB, 1GB, and 10GB files
- **Multi-Location Support**: Switch between multiple Looking Glass endpoints dynamically
- **Dark Mode**: Built-in theme switcher with system preference detection
- **Responsive Design**: Fully responsive UI optimized for desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ (recommended: 20.18.0)
- npm or yarn
- A running instance of the Looking Glass Backend (see [`../backend`](../backend))

### Installation

1. **Clone the monorepo:**

   ```bash
   git clone https://github.com/rackoona/lookingglass.git
   cd lookingglass/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env.local` file in the root directory:

   ```bash
   touch .env.local
   ```

   Add your configuration (see [Environment Variables](#environment-variables) section below).

4. **Run Development Server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: For running both backend and frontend together, see the [main README](../README.md#quick-start-guide).

## Environment Variables

The frontend uses Next.js environment variables. All public variables must be prefixed with `NEXT_PUBLIC_`.

### Required Variables

Create a `.env.local` file with the following variables:

#### Single Location Setup

If you have only one Looking Glass backend:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Multi-Location Setup

If you have multiple Looking Glass backends in different locations:

```bash
# List of locations in JSON format
NEXT_PUBLIC_LOCATIONS='[
  {
    "id": "ams",
    "name": "Amsterdam, Netherlands",
    "url": "https://ams-lg.example.com"
  },
  {
    "id": "nyc",
    "name": "New York, United States",
    "url": "https://nyc-lg.example.com"
  },
  {
    "id": "sin",
    "name": "Singapore",
    "url": "https://sin-lg.example.com"
  }
]'
```

**Note**: If `NEXT_PUBLIC_LOCATIONS` is not set, the app will fall back to using `NEXT_PUBLIC_API_URL` as a single "Default Location".

### Environment Variable Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | string | No* | `http://localhost:8000` | Default backend API URL (used if `NEXT_PUBLIC_LOCATIONS` is not set) |
| `NEXT_PUBLIC_LOCATIONS` | JSON string | No* | - | Array of location objects for multi-location support |

\* At least one of these variables should be set. If neither is set, the app will use `http://localhost:8000` as the default.

### Location Object Schema

Each location in `NEXT_PUBLIC_LOCATIONS` must have the following structure:

```typescript
{
  "id": string,      // Unique identifier (e.g., "ams", "nyc")
  "name": string,    // Display name (e.g., "Amsterdam, Netherlands")
  "url": string      // Full backend API URL (e.g., "https://ams-lg.example.com")
}
```

### Example Configurations

#### Development (Single Location)

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Production (Multi-Location)

```bash
# .env.production
NEXT_PUBLIC_LOCATIONS='[{"id":"ams","name":"Amsterdam","url":"https://ams.lg.rackoona.com"},{"id":"fra","name":"Frankfurt","url":"https://fra.lg.rackoona.com"},{"id":"sin","name":"Singapore","url":"https://sin.lg.rackoona.com"}]'
```

## Development

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run Jest tests

### Code Quality

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier with automatic formatting on save
- **Git Hooks**: Husky + lint-staged for pre-commit checks
- **Type Safety**: Full TypeScript support

### Project Structure

```
rackoona_looking_glass_frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix UI)
│   ├── app-header.tsx    # Header with theme toggle and location selector
│   ├── network-info.tsx  # Network information card
│   ├── looking-glass.tsx # Looking Glass tool
│   ├── speed-test.tsx    # Speed test component
│   ├── theme-provider.tsx # Theme context provider
│   └── location-provider.tsx # Location context provider
├── hooks/                # Custom React hooks
│   ├── use-network-info.ts
│   ├── use-looking-glass.ts
│   └── use-mobile.ts
├── lib/                  # Utility libraries
│   ├── api/             # API client and endpoints
│   │   ├── client.ts    # Axios instance
│   │   ├── types.ts     # TypeScript types
│   │   └── endpoints/   # API endpoint functions
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── Dockerfile           # Production Docker image
```

## Docker Deployment

### Building the Docker Image

```bash
docker build -t looking-glass-frontend \
  --build-arg NEXT_PUBLIC_LOCATIONS='[{"id":"ams","name":"Amsterdam","url":"https://ams-lg.example.com"}]' \
  .
```

### Running the Container

```bash
docker run -p 80:80 looking-glass-frontend
```

### Docker Compose Example

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        NEXT_PUBLIC_LOCATIONS: '[{"id":"ams","name":"Amsterdam","url":"https://backend:8000"}]'
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: looking-glass-backend:latest
    ports:
      - "8000:8000"
    restart: unless-stopped
```

## API Integration

The frontend communicates with the Looking Glass backend (located in [`../backend`](../backend)) via REST and streaming APIs.

### Backend Setup

Before running the frontend, ensure you have the backend running. Follow the setup instructions in the [backend README](../backend/README.md#installation).

### Endpoints Used

- `GET /network/info` - Fetch network information
- `POST /lookingglass/ping` - Execute ping (streaming)
- `POST /lookingglass/ping6` - Execute ping6 (streaming)
- `POST /lookingglass/traceroute` - Execute traceroute (streaming)
- `POST /lookingglass/traceroute6` - Execute traceroute6 (streaming)
- `POST /lookingglass/mtr` - Execute mtr (streaming)
- `POST /lookingglass/mtr6` - Execute mtr6 (streaming)

### CORS Configuration

Ensure your backend allows requests from your frontend domain. Example FastAPI CORS configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lg.example.com"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Build Errors

**Issue**: `Cannot find module '../lightningcss.linux-x64-gnu.node'`

**Solution**: This is a known issue with Tailwind CSS v4 and Docker builds. The Dockerfile includes fixes for this. Ensure you're using the latest Dockerfile with build tools installed.

**Issue**: Environment variables not working

**Solution**: 
- Ensure variables are prefixed with `NEXT_PUBLIC_`
- For Docker builds, pass them as `--build-arg`
- Restart the dev server after changing `.env.local`

### Runtime Errors

**Issue**: "Failed to load network information"

**Solution**: Check that:
1. Backend is running and accessible
2. `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_LOCATIONS` is correctly set
3. CORS is properly configured on the backend

**Issue**: Location selector shows "Default Location" instead of configured locations

**Solution**: Verify `NEXT_PUBLIC_LOCATIONS` is valid JSON and properly formatted.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Components

- **Backend API**: [`../backend`](../backend) - FastAPI-based backend for network diagnostics
- **Main Documentation**: [`../README.md`](../README.md) - Complete monorepo documentation and deployment guides

## Support

For issues and questions:

- **GitHub Issues**: [https://github.com/rackoona/lookingglass/issues](https://github.com/rackoona/lookingglass/issues)
- **Website**: [https://rackoona.com](https://rackoona.com)
- **Commercial Support**: <support@rackoona.com>
