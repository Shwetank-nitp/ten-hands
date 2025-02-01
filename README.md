# CoSketch

## Summary

This project is a collaborative real-time drawing platform designed to bring people together for fun and creative activities. Built as a monorepo managed by [Turborepo](https://turbo.build/repo), it enables users to interact in a shared digital space, fostering collaboration and enjoyment through interactive drawing sessions. The repository contains three main applications (`CoSketch`, `http`, and `wss`) located in the `apps` directory, along with a `packages` directory that houses shared packages used across these services.

### Key Features

- **Real-Time Collaboration**: Users can draw and interact simultaneously, making it an engaging platform for group activities.
- **Modular Architecture**: Organized into distinct applications and shared packages for better code reusability and maintainability.
- **Shared Packages**: Common utilities, configurations, and schemas are stored in the `packages` directory, ensuring consistency across all services.
- **Efficient Build System**: Utilizes Turborepo's caching and parallelization capabilities to speed up build times and improve developer productivity.

## Directory Structure

```
.
├── .turbo/
├── .vscode/
├── apps/
│   ├── CoSketch/
│   ├── http/
│   ├── wss/
├── node_modules/
├── packages/
│   ├── backend-common/
│   ├── db/
│   ├── eslint-config/
│   ├── typescript-config/
│   ├── ui/
│   └── zod-schema/
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json
```

## Guide to Install and Setup Locally

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v19 or later)
- pnpm (required)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shwetank-nitp/ten-hands.git
cd ten-hands
```

### Step 2: Install Dependencies

We recommend using pnpm for managing dependencies due to its performance benefits and compatibility with Turborepo.

run this command on the root directory

```bash
pnpm install
```

### Step 3: Configure Environment Variables and Config Variables

Each application may require specific environment variables. Create `.env` files in the respective application directories (`apps/http`, `apps/wss`) and configure them according to the application's requirements.

please follow the sample.env.local in (`apps/http`, `apps/wss`) for better claity.

Example `.env` file:

```plaintext
PORT=3000
DATABASE_URL=your-database-url
```

in CoSketch service go to `apps/CoSketch/src/configs/urls.ts` and make sure match the base urls of backend with there PORT number you initialized in the .env file

### Step 4: Start the Applications

To start all applications and their dependencies, run the following command:

```bash
pnpm run dev
```

or

```bash
npm run dev
```

This command will leverage Turborepo's capabilities to efficiently build and start all services.

### Step 5: Development Workflow

During development, you can use Turborepo's built-in commands to manage tasks such as building, testing, and linting.

#### Build All Applications

```bash
pnpm run build
```

#### Run Tests

```bash
pnpm run test
```

#### Lint Code

```bash
pnpm run lint
```

### Additional Tips

- **Code Sharing**: When adding new shared packages, make sure they are properly versioned and referenced in the `package.json` files of the applications that use them.
- **Performance Optimization**: Take advantage of Turborepo's caching mechanism to minimize rebuild times during development.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
