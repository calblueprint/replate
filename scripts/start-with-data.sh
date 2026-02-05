#!/bin/bash

# Script to start both Rails backend and React Native app with fresh test data

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Replate development environment with fresh data...${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Find replate-business directory (same logic as start.sh)
RAILS_DIR=""
POSSIBLE_LOCATIONS=(
  "$(dirname "$PROJECT_ROOT")/replate-business"
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

# Check if Rails directory was found
if [ -z "$RAILS_DIR" ] || [ ! -d "$RAILS_DIR" ]; then
  echo -e "${RED}Error: replate-business directory not found!${NC}"
  echo -e "${YELLOW}Searched in:${NC}"
  for location in "${POSSIBLE_LOCATIONS[@]}"; do
    echo -e "${YELLOW}  - $location${NC}"
  done
  echo ""
  echo -e "${YELLOW}Solutions:${NC}"
  echo -e "${YELLOW}  1. Clone replate-business as a sibling directory${NC}"
  echo -e "${YELLOW}  2. Set REPLATE_BUSINESS_DIR environment variable:${NC}"
  echo -e "${YELLOW}     export REPLATE_BUSINESS_DIR=/path/to/replate-business${NC}"
  exit 1
fi

echo -e "${GREEN}Found Rails backend at: $RAILS_DIR${NC}"

# Check if Rails server is running and kill it
echo -e "${YELLOW}Checking for existing Rails processes...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "  Stopped existing Rails server" || echo "  No Rails server running"

# Navigate to Rails backend
echo ""
echo -e "${BLUE}Setting up Rails backend...${NC}"
cd "$RAILS_DIR" || exit

# Clear old test data and seed fresh data
echo -e "${YELLOW}Clearing old test data...${NC}"
bundle exec rails db:seed:clear_test 2>/dev/null || echo "  No clear_test task found"

echo -e "${YELLOW}Seeding fresh test data with current dates...${NC}"
bundle exec rails db:complete_seed

if [ $? -ne 0 ]; then
  echo -e "${RED}Warning: Seeding may have failed. Check the Rails logs.${NC}"
fi

# Start Rails server in background
echo -e "${GREEN}Starting Rails server on http://localhost:3000${NC}"
bundle exec rails server -d

# Give Rails a moment to start
sleep 2

# Verify Rails started
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}Warning: Rails server may not have started. Check Rails logs.${NC}"
fi

# Navigate to React Native app
echo ""
echo -e "${BLUE}Starting React Native app...${NC}"
cd "$PROJECT_ROOT" || exit

# Clear Expo cache
echo -e "${YELLOW}Clearing Expo cache...${NC}"
rm -rf .expo 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null

# Start Expo using pnpm (project's package manager)
echo -e "${GREEN}Starting Expo...${NC}"
pnpm start -c

echo ""
echo -e "${GREEN}✅ Development environment ready!${NC}"
echo ""
echo "📱 Mobile App: Scan QR code or press 'i' for iOS simulator"
echo "🌐 Rails API: http://localhost:3000"
echo ""
echo "🔑 Test Login:"
echo "   Email: test@driver.com"
echo "   Password: Password123!"