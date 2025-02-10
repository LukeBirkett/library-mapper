#!/bin/bash

# Set the API URL
API_URL="http://localhost:5001/api"

echo "🧪 Testing Authentication Endpoints"
echo "===================================="

echo "1️⃣  Testing User Registration"
curl -X POST $API_URL/auth/register \
-H "Content-Type: application/json" \
-d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
}'
echo -e "\n"

echo "2️⃣  Testing User Login"
curl -X POST $API_URL/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}'
echo -e "\n"

echo "3️⃣  Testing Registration with Existing Email (Should Fail)"
curl -X POST $API_URL/auth/register \
-H "Content-Type: application/json" \
-d '{
    "username": "testuser2",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User 2"
}'
echo -e "\n"

echo "4️⃣  Testing Login with Wrong Password (Should Fail)"
curl -X POST $API_URL/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "wrongpassword"
}'
echo -e "\n"

echo "5️⃣  Testing Protected Route Access (with token)"
TOKEN=$(curl -s -X POST $API_URL/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

curl -X GET $API_URL/auth/me \
-H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "6️⃣  Testing Protected Route Access (without token - should fail)"
curl -X GET $API_URL/auth/me
echo -e "\n" 