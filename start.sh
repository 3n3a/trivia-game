#!/bin/bash
#
# Start Script
#

echo "=================================="
echo "==        Trivia Game           =="
echo "=================================="
echo ""
echo "Migrating..."

npx prisma migrate deploy

echo "Starting..."

npm start
