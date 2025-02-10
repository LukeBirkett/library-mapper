#!/bin/bash

# Set the API URL
API_URL="http://localhost:5001/api"

# Store the authentication token
AUTH_TOKEN=""

echo "🧪 Testing Library Endpoints"
echo "===================================="

echo "🔑 Getting auth token first..."
AUTH_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}')
AUTH_TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token acquired"
echo -e "\n"

echo "1️⃣  Testing Library Creation (Requires Auth)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $AUTH_TOKEN" \
-d '{
    "name": "Test Library",
    "address": {
        "street": "123 Library Street",
        "city": "London",
        "postcode": "SW1A 1AA",
        "borough": "Westminster"
    },
    "openingHours": {
        "monday": { "open": "09:00", "close": "17:00" },
        "tuesday": { "open": "09:00", "close": "17:00" }
    },
    "description": "A test library"
}'
echo -e "\n"

echo "2️⃣  Testing Get All Libraries (Public)"
curl -X GET $API_URL/libraries
echo -e "\n"

echo "3️⃣  Testing Library Search by Postcode"
curl -X GET "$API_URL/libraries/search?postcode=SW1A"
echo -e "\n"

echo "4️⃣  Testing Library Creation with Invalid Data (Should Fail)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $AUTH_TOKEN" \
-d '{
    "name": "Test Library"
}'
echo -e "\n" 