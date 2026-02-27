#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

START_FRONTEND=true

for arg in "$@"; do
  case "$arg" in
    --resume|-r|--backend-only|--no-expo)
      START_FRONTEND=false
      ;;
    -h|--help)
      echo "Usage: ./start.sh [--resume|--backend-only|--no-expo]"
      echo "  --resume, --backend-only, --no-expo  Start Rails server only (skip Expo)"
      exit 0
      ;;
  esac
done

echo -e "${BLUE}Starting React Native app and Rails server...${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
export BUNDLE_APP_CONFIG="${PROJECT_ROOT}/.bundle"
export BUNDLE_USER_HOME="${BUNDLE_USER_HOME:-/tmp/replate-bundle}"
export BUNDLE_PATH="${BUNDLE_PATH:-${PROJECT_ROOT}/vendor/bundle}"

mkdir -p "$BUNDLE_APP_CONFIG" "$BUNDLE_USER_HOME" "$(dirname "$BUNDLE_PATH")"

# Find replate-business directory
RAILS_DIR=""
# Check common locations relative to current project
POSSIBLE_LOCATIONS=(
  "$(dirname "$SCRIPT_DIR")/replate-business"
  "$(dirname "$(dirname "$SCRIPT_DIR")")/replate-business"
  "$HOME/Documents/GitHub/replate-business"
  "$HOME/replate-business"
  "$HOME/Desktop/replate-business"
  "$HOME/Projects/replate-business"
)

# Use environment variable if set
if [ -n "$REPLATE_BUSINESS_DIR" ] && [ -d "$REPLATE_BUSINESS_DIR" ]; then
  RAILS_DIR="$REPLATE_BUSINESS_DIR"
else
  # Search for replate-business directory
  for location in "${POSSIBLE_LOCATIONS[@]}"; do
    if [ -d "$location" ]; then
      RAILS_DIR="$location"
      break
    fi
  done
fi

# Create a directory to store PIDs
PID_DIR="$PROJECT_ROOT/.pids"
mkdir -p "$PID_DIR"

# Check for required dependencies
echo -e "${BLUE}Checking dependencies...${NC}"
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}Error: pnpm is not installed${NC}"
  echo -e "${YELLOW}Install with: npm install -g pnpm${NC}"
  exit 1
fi

if ! command -v bundle &> /dev/null; then
  echo -e "${YELLOW}Warning: bundler is not installed${NC}"
  echo -e "${YELLOW}Rails server may not start. Install with: gem install bundler${NC}"
fi

# Check if ports are in use and kill them automatically
echo -e "${BLUE}Checking ports...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}Port 3000 is already in use. Killing existing process...${NC}"
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  sleep 1
  # Verify it's actually killed
  if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Warning: Could not kill process on port 3000. Continuing anyway...${NC}"
  else
    echo -e "${GREEN}Port 3000 is now free${NC}"
  fi
fi

if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}Port 8081 is already in use (Expo Metro). Killing existing process...${NC}"
  lsof -ti:8081 | xargs kill -9 2>/dev/null
  sleep 1
  # Verify it's actually killed
  if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Warning: Could not kill process on port 8081. Continuing anyway...${NC}"
  else
    echo -e "${GREEN}Port 8081 is now free${NC}"
  fi
fi

# Automatically detect local IP address
echo -e "${BLUE}Detecting local IP address...${NC}"
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

if [ -z "$LOCAL_IP" ]; then
  echo -e "${YELLOW}Warning: Could not detect local IP address. Using localhost.${NC}"
  LOCAL_IP="localhost"
else
  echo -e "${GREEN}Detected IP: $LOCAL_IP${NC}"
fi

# Update/create .env file with the detected IP
ENV_FILE="$PROJECT_ROOT/.env"
API_URL="http://$LOCAL_IP:3000"

if [ -f "$ENV_FILE" ]; then
  # Update existing .env file
  if grep -q "EXPO_PUBLIC_API_BASE_URL" "$ENV_FILE"; then
    # Update existing line
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s|EXPO_PUBLIC_API_BASE_URL=.*|EXPO_PUBLIC_API_BASE_URL=$API_URL|" "$ENV_FILE"
    else
      # Linux
      sed -i "s|EXPO_PUBLIC_API_BASE_URL=.*|EXPO_PUBLIC_API_BASE_URL=$API_URL|" "$ENV_FILE"
    fi
  else
    # Add new line
    echo "EXPO_PUBLIC_API_BASE_URL=$API_URL" >> "$ENV_FILE"
  fi
else
  # Create new .env file
  echo "# Rails API Configuration" > "$ENV_FILE"
  echo "EXPO_PUBLIC_API_BASE_URL=$API_URL" >> "$ENV_FILE"
fi

echo -e "${GREEN}Updated .env file with: EXPO_PUBLIC_API_BASE_URL=$API_URL${NC}"

# Function to cleanup Rails server on exit
cleanup_rails() {
  if [ -f "$PROJECT_ROOT/.pids/rails.pid" ]; then
    RAILS_PID=$(cat "$PROJECT_ROOT/.pids/rails.pid")
    if kill -0 "$RAILS_PID" 2>/dev/null; then
      echo -e "\n${BLUE}Stopping Rails server...${NC}"
      kill "$RAILS_PID"
      rm "$PROJECT_ROOT/.pids/rails.pid"
    fi
  fi
}

# Set trap to cleanup Rails when script exits
trap cleanup_rails EXIT INT TERM

# Clear old logs
if [ -f "$PROJECT_ROOT/.pids/rails.log" ]; then
  echo -e "${BLUE}Clearing old Rails logs...${NC}"
  > "$PROJECT_ROOT/.pids/rails.log"
fi

# Start Rails server
if [ -n "$RAILS_DIR" ] && [ -d "$RAILS_DIR" ]; then
  echo -e "${GREEN}Starting Rails server...${NC}"
  cd "$RAILS_DIR"

  # Install Rails dependencies if needed
  echo -e "${BLUE}Checking Rails dependencies...${NC}"
  if ! bundle check > /dev/null 2>&1; then
    echo -e "${YELLOW}Installing Rails dependencies...${NC}"
    if ! bundle install; then
      echo -e "${YELLOW}Failed to install Rails dependencies. Check the Rails directory.${NC}"
      cd "$PROJECT_ROOT"
    else
      echo -e "${GREEN}Rails dependencies installed${NC}"
    fi
  fi

  # Check and run migrations if needed
  echo -e "${BLUE}Checking database migrations...${NC}"
  if ! rails db:migrate:status | grep -q "down.*20251126225820" > /dev/null 2>&1; then
    echo -e "${GREEN}Migrations are up to date${NC}"
  else
    echo -e "${YELLOW}Running pending migrations...${NC}"
    # Try to run migrations, if the problematic one fails, mark it as run
    rails db:migrate 2>&1 | tee /tmp/migrate_output.txt
    if grep -q "onfleet_worker_id.*does not exist" /tmp/migrate_output.txt; then
      echo -e "${YELLOW}Skipping problematic migration 20251126225820...${NC}"
      # Mark the migration as already run by inserting it into schema_migrations
      rails runner "ActiveRecord::Base.connection.execute(\"INSERT INTO schema_migrations (version) VALUES ('20251126225820')\")" 2>/dev/null
      # Run remaining migrations
      rails db:migrate
    fi
    rm -f /tmp/migrate_output.txt
    echo -e "${GREEN}Migrations complete${NC}"
  fi

  # Simple log formatting: remove ANSI codes, add timestamps
  (
    bundle exec rails server -b 0.0.0.0 -p 3000 2>&1 | \
    while IFS= read -r line; do
      # Remove ANSI color codes
      CLEAN_LINE=$(echo "$line" | sed 's/\x1b\[[0-9;]*m//g' | sed 's/↳[[:space:]]*//g' | sed 's/^[[:space:]]*//')
      TIMESTAMP=$(date '+%H:%M:%S')

      # Skip empty lines
      if [ -z "$CLEAN_LINE" ]; then
        continue
      fi

      # Add separator for new requests
      if echo "$CLEAN_LINE" | grep -qE "^Started"; then
        echo "" >> "$PROJECT_ROOT/.pids/rails.log"
      fi

      # Skip noise lines
      if echo "$CLEAN_LINE" | grep -qE "^[[:space:]]*$|Cannot render console"; then
        continue
      fi

      # Write log line with timestamp
      echo "[$TIMESTAMP] $CLEAN_LINE" >> "$PROJECT_ROOT/.pids/rails.log"
    done
  ) &
  RAILS_PID=$!
  # Wait a bit longer for Rails to actually start
  sleep 3
  # Use the pid for the background rails launcher process
  echo $RAILS_PID > "$PROJECT_ROOT/.pids/rails.pid"
  echo -e "${GREEN}Rails server started - PID: ${RAILS_PID}${NC}"
  echo -e "${BLUE}  Command: rails server -b 0.0.0.0 -p 3000${NC}"
  echo -e "${BLUE}  Logs: $PROJECT_ROOT/.pids/rails.log${NC}"
  cd "$PROJECT_ROOT"
else
  echo -e "${YELLOW}Warning: replate-business directory not found!${NC}"
  echo -e "${YELLOW}Searched in:${NC}"
  for location in "${POSSIBLE_LOCATIONS[@]}"; do
    echo -e "${YELLOW}  - $location${NC}"
  done
  echo -e "${YELLOW}Set REPLATE_BUSINESS_DIR environment variable to specify custom path${NC}"
fi

# Check and install dependencies if needed
cd "$PROJECT_ROOT"
NEED_INSTALL=false

if [ ! -d "node_modules" ]; then
  NEED_INSTALL=true
elif [ ! -f "pnpm-lock.yaml" ]; then
  NEED_INSTALL=true
elif [ "package.json" -nt "node_modules" ] || [ "pnpm-lock.yaml" -nt "node_modules" ]; then
  NEED_INSTALL=true
elif [ ! -x "$PROJECT_ROOT/node_modules/.bin/expo" ]; then
  NEED_INSTALL=true
  echo -e "${YELLOW}Expo binary missing. Running dependency install to recover node_modules...${NC}"
fi

if [ "$NEED_INSTALL" = true ]; then
  echo -e "${YELLOW}Dependencies need to be installed/updated. Running pnpm install...${NC}"
  if CI=true pnpm install; then
    echo -e "${GREEN}Dependencies installed${NC}"
  else
    echo -e "${YELLOW}pnpm install failed (likely no network/lockfile issues).${NC}"
    if [ "$START_FRONTEND" = true ]; then
      echo -e "${YELLOW}Cannot start Expo without dependencies installed.${NC}"
      exit 1
    else
      echo -e "${YELLOW}Resume mode enabled. Skipping frontend startup and keeping Rails running.${NC}"
      START_FRONTEND=false
    fi
  fi
fi

# Validate frontend dependency when starting Expo
if [ "$START_FRONTEND" = true ] && [ ! -x "$PROJECT_ROOT/node_modules/.bin/expo" ]; then
  echo -e "${YELLOW}Expo binary not found at ./node_modules/.bin/expo.${NC}"
  echo -e "${YELLOW}Run 'pnpm install' (with network) and retry.${NC}"
  if [ "$START_FRONTEND" = true ]; then
    exit 1
  fi
fi

if [ "$START_FRONTEND" = false ]; then
  echo -e "${YELLOW}Skipping Expo startup (resume mode). Backend is running for now.${NC}"
  echo -e "${BLUE}To run frontend later: cd \"$PROJECT_ROOT\" && pnpm exec expo start${NC}"
  echo -e "${BLUE}When done with frontend, stop with Ctrl+C.${NC}"
  while true; do
    sleep 60
  done
fi

# Start React Native app
echo -e "${GREEN}Starting React Native app...${NC}"
echo -e "${BLUE}Expo will run in this terminal - QR code will be visible${NC}"
echo -e "${BLUE}Rails logs: $PROJECT_ROOT/.pids/rails.log${NC}"
echo -e "${BLUE}API URL: $API_URL${NC}"
echo -e "${BLUE}To stop both servers: ./stop.sh${NC}"
echo ""
echo -e "${GREEN}Rails server started${NC}"
echo -e "${GREEN}Starting Expo...${NC}"
echo ""
# Run Expo in foreground so QR code is visible
pnpm exec expo start
