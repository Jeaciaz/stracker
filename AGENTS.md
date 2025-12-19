# AGENTS.md

## Build/Lint/Test Commands
- **Dev (all packages)**: `bun run dev`
- **Client dev**: `cd packages/client && npm run dev`
- **Client build**: `cd packages/client && npm run build`
- **Server dev**: `cd packages/server && bun --watch --env-file=../../.env src/server.ts`
- **Database migrate**: `bun migrate`
- **No lint/test commands found** - run TypeScript compiler for type checking: `tsc --noEmit`

## Code Style Guidelines
- **Language**: TypeScript with strict mode enabled (`"strict": true`)
- **Runtime**: Bun with ESNext target
- **Frontend**: SolidJS with JSX preserve (`"jsx": "preserve"`, `"jsxImportSource": "solid-js"`)
- **Backend**: Effect functional programming with Layer composition
- **Imports**: Use path aliases (`@app/*`, `@features/*`, `@pages/*`, `@shared/*`, `@domain/*`)
- **Data fetching**: @tanstack/solid-query with queryOptions
- **Types**: Strict typing, no implicit any, use Effect schemas
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error handling**: Effect for functional error handling, no try/catch in business logic
- **Formatting**: No explicit formatter configured, follow existing code style
- **Architecture**: Feature-based organization with lib/ui separation</content>
