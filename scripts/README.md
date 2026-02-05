# Development Scripts

## Prerequisites

Before using these scripts, ensure you have:

1. **pnpm installed**: `npm install -g pnpm`
2. **Rails backend cloned**: The `replate-business` repo should be:
   - A sibling directory (`../replate-business`), OR
   - Specified via `REPLATE_BUSINESS_DIR` environment variable

## Quick Start with Fresh Data

To start the development environment with fresh test data:

```bash
# From the mobile app directory
pnpm start:fresh
```

This will:
1. Find the Rails backend automatically
2. Clear old test data from the database
3. Seed fresh data with current dates (today and tomorrow)
4. Start the Rails backend server
5. Clear Expo cache and start the mobile app

## Available Scripts

```bash
# Recommended: Start everything with auto-IP detection
./start.sh

# Start with fresh test data (clears and reseeds database)
pnpm start:fresh

# Start Expo with cleared cache only
pnpm start:clean

# Just seed the backend with fresh data (requires backend setup)
pnpm backend:seed

# Just start the Rails server (requires backend setup)
pnpm backend:start

# Normal Expo start
pnpm start
```

## Test Credentials

After running the seed script, you can login with:
- **Email:** test@driver.com
- **Password:** Password123!

The seed creates:
- 6 test drivers (test@driver.com + driver1-5@test.com)
- 5 partner organizations (NPOs)
- 8 donor locations (restaurants, cafes, grocery stores)
- ~16 assigned tasks for today and tomorrow
- ~8 unassigned tasks for "Available Pickups"

## Manual Backend Seeding

If you need to manually run the seed task from the Rails directory:

```bash
# Option 1: Using environment variable
export REPLATE_BUSINESS_DIR=/path/to/replate-business
cd $REPLATE_BUSINESS_DIR

# Option 2: If it's a sibling directory
cd ../replate-business

# Then run:
bundle exec rails db:clear_test    # Clear old test data
bundle exec rails db:complete_seed # Create fresh test data
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REPLATE_BUSINESS_DIR` | Custom path to the Rails backend. If not set, scripts look for `../replate-business` and common locations. |

## Notes

- Tasks are always created for "today" and "tomorrow" based on the current date
- The seed script uses `delete_all` instead of `destroy_all` to avoid triggering Onfleet callbacks
- All test emails contain "test" or "driver" in them for easy identification
- Test data is automatically cleared before reseeding to avoid duplicates

## Troubleshooting

### "replate-business directory not found"

Set the environment variable:
```bash
export REPLATE_BUSINESS_DIR=/path/to/replate-business
```

Or clone it as a sibling directory:
```bash
cd ..
git clone <repo-url> replate-business
```

### Backend scripts fail

The `backend:seed` and `backend:start` scripts assume the backend is at `../replate-business`. Use `./start.sh` or `pnpm start:fresh` for automatic path detection.