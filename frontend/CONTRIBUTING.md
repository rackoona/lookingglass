# Contributing to Looking Glass

Thank you for your interest in contributing to Looking Glass!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/looking-glass.git`
3. Install dependencies: `npm install`
4. Create a `.env.local` file: `cp .env.example .env.local`
5. Start development server: `npm run dev`

## Development Guidelines

- **Architecture**: 
  - Logic should be separated into custom hooks in `hooks/`.
  - UI components reside in `components/`.
  - API logic is in `lib/api/`.
- **Styling**: We use Tailwind CSS and shadcn/ui.
- **Linting**: 
  - Prettier runs automatically on commit.
  - Run `npm run lint` to check for issues.

## Pull Requests

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit your changes (husky will run checks)
4. Push to your fork
5. Open a Pull Request

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

