# Replate Mobile App

A React Native mobile application for Replate food rescue volunteers, built with Expo Router.

## Prerequisites

### Required

- **Node.js** (v18 or later) - We recommend using [nvm](https://github.com/nvm-sh/nvm)
- **pnpm** - This project enforces pnpm as the package manager
  ```sh
  npm install -g pnpm
  ```
- **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Backend (Required for full functionality)

The app connects to the **replate-business** Rails backend. You need to:

1. Clone the `replate-business` repository as a sibling directory:
   ```sh
   # From your projects folder
   git clone <replate-business-repo-url> replate-business
   ```

2. **Or** set the `REPLATE_BUSINESS_DIR` environment variable:
   ```sh
   export REPLATE_BUSINESS_DIR=/path/to/replate-business
   ```

## Quick Start

### Option 1: Start Everything (Recommended)

This starts both the Rails backend and Expo app with automatic IP detection:

```sh
./start.sh
```

The script will:
- Find the Rails backend automatically
- Install dependencies if needed
- Run database migrations
- Detect your local IP for mobile device connections
- Start both servers

### Option 2: Start with Fresh Test Data

If you need to reset the database with fresh test data:

```sh
pnpm start:fresh
```

### Option 3: Manual Start

```sh
# Terminal 1 - Rails backend
cd ../replate-business
bundle install
rails db:migrate
rails server -b 0.0.0.0 -p 3000

# Terminal 2 - Expo app
pnpm install
pnpm start
```

## Environment Configuration

Copy the example environment file:

```sh
cp .env.example .env
```

The `start.sh` script automatically updates the API URL with your local IP. For manual configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | Rails API base URL | `http://localhost:3000` |
| `REPLATE_BUSINESS_DIR` | Custom path to Rails backend | (auto-detected) |

## Test Credentials

After seeding the database:

- **Email:** `test@driver.com`
- **Password:** `Password123!`

## Development Scripts

```sh
pnpm start              # Start Expo
pnpm start:fresh        # Reset data + start everything
pnpm start:clean        # Clear Expo cache + start

pnpm lint:check         # Run ESLint
pnpm lint:fix           # Fix ESLint issues
pnpm prettier:check     # Check formatting
pnpm prettier:fix       # Fix formatting
pnpm tsc                # TypeScript type check
```

## Stopping the Servers

```sh
./stop.sh
```

## Project Structure

```
src/
├── app/                # Expo Router pages
│   ├── (tabs)/         # Tab navigation screens
│   ├── auth/           # Authentication flows
│   ├── donation-details/
│   ├── pickup-details/
│   └── onboarding/
├── components/         # Reusable UI components
├── styles/             # Shared styles and themes
└── utils/              # Utilities and contexts
```

## Troubleshooting

### "replate-business directory not found"

Either:
1. Clone `replate-business` as a sibling to this repo
2. Set `REPLATE_BUSINESS_DIR` environment variable

### Port already in use

The `start.sh` script automatically kills existing processes on ports 3000 and 8081. If issues persist:

```sh
lsof -ti:3000 | xargs kill -9
lsof -ti:8081 | xargs kill -9
```

### Can't connect from phone

Ensure your phone and computer are on the same WiFi network. The `start.sh` script auto-detects your IP, but you can manually set it in `.env`.
