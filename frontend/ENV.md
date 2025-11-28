# Environment Variables Configuration

This document describes all environment variables used by the Looking Glass Frontend.

## Quick Start

Create a `.env.local` file in the root directory and configure your environment variables:

```bash
# Copy this template
cp ENV.md .env.local
# Then edit .env.local with your values
```

## Configuration Options

### Option 1: Single Location Setup

Use this if you have only one Looking Glass backend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Option 2: Multi-Location Setup (Recommended)

Use this if you have multiple Looking Glass backends in different locations:

```bash
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

**Important**: The JSON must be on a single line when used in `.env.local`:

```bash
NEXT_PUBLIC_LOCATIONS='[{"id":"ams","name":"Amsterdam, Netherlands","url":"https://ams-lg.example.com"},{"id":"nyc","name":"New York, United States","url":"https://nyc-lg.example.com"}]'
```

## Environment Variables Reference

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | string | No* | `http://localhost:8000` | Default backend API URL |
| `NEXT_PUBLIC_LOCATIONS` | JSON string | No* | - | Array of location objects for multi-location support |

\* **Note**: At least one of these variables should be set. If neither is set, the app will use `http://localhost:8000` as the default.

## Location Object Schema

Each location in `NEXT_PUBLIC_LOCATIONS` must follow this structure:

```typescript
{
  "id": string,      // Unique identifier (e.g., "ams", "nyc", "sin")
  "name": string,    // Display name shown in UI (e.g., "Amsterdam, Netherlands")
  "url": string      // Full backend API URL (e.g., "https://ams-lg.example.com")
}
```

### Field Requirements

- **id**: Must be unique across all locations. Use short, lowercase identifiers (e.g., "ams", "nyc", "fra")
- **name**: User-friendly display name. Can include city, country, or any descriptive text
- **url**: Complete URL including protocol (http/https) and port if needed. No trailing slash.

## Examples

### Development Environment

Single backend running locally:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Staging Environment

Multiple local backends for testing:

```bash
# .env.local
NEXT_PUBLIC_LOCATIONS='[{"id":"local1","name":"Local Server 1","url":"http://localhost:8001"},{"id":"local2","name":"Local Server 2","url":"http://localhost:8002"}]'
```

### Production Environment

Multiple production backends in different regions:

```bash
# .env.production
NEXT_PUBLIC_LOCATIONS='[{"id":"ams","name":"Amsterdam","url":"https://ams.lg.rackoona.com"},{"id":"fra","name":"Frankfurt","url":"https://fra.lg.rackoona.com"},{"id":"nyc","name":"New York","url":"https://nyc.lg.rackoona.com"},{"id":"sin","name":"Singapore","url":"https://sin.lg.rackoona.com"}]'
```

### Docker Build

Pass environment variables as build arguments:

```bash
docker build \
  --build-arg NEXT_PUBLIC_LOCATIONS='[{"id":"ams","name":"Amsterdam","url":"https://ams-lg.example.com"}]' \
  -t looking-glass-frontend .
```

### Docker Compose

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
    environment:
      - NODE_ENV=production
```

## Validation

The application will validate your configuration on startup:

- If `NEXT_PUBLIC_LOCATIONS` is set but contains invalid JSON, an error will be logged to the console
- If neither `NEXT_PUBLIC_LOCATIONS` nor `NEXT_PUBLIC_API_URL` is set, the app will fall back to `http://localhost:8000`
- The first location in the array will be selected by default

## Troubleshooting

### Issue: Environment variables not loading

**Solution**:
1. Ensure variables are prefixed with `NEXT_PUBLIC_`
2. Restart the development server after changing `.env.local`
3. For production builds, ensure variables are set before running `npm run build`

### Issue: Invalid JSON in NEXT_PUBLIC_LOCATIONS

**Solution**:
1. Validate your JSON using a tool like [jsonlint.com](https://jsonlint.com/)
2. Ensure the entire JSON is on a single line in `.env.local`
3. Check for proper escaping of quotes
4. Remove any trailing commas

### Issue: Location selector shows "Default Location"

**Solution**:
1. Verify `NEXT_PUBLIC_LOCATIONS` is set correctly
2. Check browser console for parsing errors
3. Ensure the JSON structure matches the schema above

### Issue: CORS errors when connecting to backend

**Solution**:
1. Ensure your backend has CORS properly configured
2. Add your frontend domain to the backend's allowed origins
3. Check that the URLs in `NEXT_PUBLIC_LOCATIONS` are correct and accessible

## Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use HTTPS in production** - Always use `https://` URLs for production backends
3. **Keep IDs short** - Use 3-4 character location IDs (e.g., "ams", "nyc", "sin")
4. **Be descriptive with names** - Include city and country for clarity
5. **Test thoroughly** - Verify all locations are accessible before deploying
6. **Document your setup** - Keep a separate document with your production configuration

## Security Notes

- Environment variables prefixed with `NEXT_PUBLIC_` are embedded in the client-side JavaScript bundle
- Do not store sensitive information (API keys, secrets) in `NEXT_PUBLIC_*` variables
- Backend URLs will be visible to end users in the browser
- Ensure your backend implements proper authentication and rate limiting

