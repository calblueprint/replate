#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping React Native app and Rails server...${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$SCRIPT_DIR/.pids"

# Stop Rails server
if [ -f "$PID_DIR/rails.pid" ]; then
  RAILS_PID=$(cat "$PID_DIR/rails.pid")
  if kill -0 "$RAILS_PID" 2>/dev/null; then
    echo -e "${RED}Stopping Rails server (PID: $RAILS_PID)...${NC}"
    kill "$RAILS_PID"
    rm "$PID_DIR/rails.pid"
    echo -e "${RED}✓ Rails server stopped${NC}"
  else
    echo -e "${BLUE}Rails server was not running${NC}"
    rm "$PID_DIR/rails.pid"
  fi
fi

# Stop Expo/React Native
# Try to find Expo process by name (since it might not have a PID file if running in foreground)
if [ -f "$PID_DIR/expo.pid" ]; then
  EXPO_PID=$(cat "$PID_DIR/expo.pid")
  if kill -0 "$EXPO_PID" 2>/dev/null; then
    echo -e "${RED}Stopping React Native app (PID: $EXPO_PID)...${NC}"
    kill "$EXPO_PID"
    rm "$PID_DIR/expo.pid"
    echo -e "${RED}✓ React Native app stopped${NC}"
  else
    echo -e "${BLUE}React Native app was not running${NC}"
    rm "$PID_DIR/expo.pid"
  fi
else
  # Try to find and kill Expo processes
  EXPO_PIDS=$(pgrep -f "expo start\|expo-router\|metro" | grep -v $$ || true)
  if [ -n "$EXPO_PIDS" ]; then
    echo -e "${RED}Stopping React Native app...${NC}"
    echo "$EXPO_PIDS" | xargs kill 2>/dev/null || true
    echo -e "${RED}✓ React Native app stopped${NC}"
  fi
fi

# Clean up .pids directory if empty
if [ -d "$PID_DIR" ] && [ -z "$(ls -A "$PID_DIR")" ]; then
  rmdir "$PID_DIR"
fi

echo -e "${BLUE}Done!${NC}"

