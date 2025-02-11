#!/bin/bash

# Set the API URL
API_URL="http://localhost:5001/api"

echo "🧪 Testing Library Endpoints"
echo "===================================="

# First, get auth token (we need this for protected routes)
echo "🔑 Getting auth token..."
AUTH_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}')
TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token acquired"
echo -e "\n"

echo "1️⃣  Testing Library Creation (Protected Route)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "name": "Test Library",
    "address": {
        "street": "123 Library Street",
        "city": "London",
        "postcode": "SW1A 1AA",
        "borough": "Westminster"
    },
    "location": {
        "coordinates": [-0.1276, 51.5074]
    },
    "openingHours": {
        "monday": { "open": "09:00", "close": "17:00" },
        "tuesday": { "open": "09:00", "close": "17:00" }
    },
    "description": "A test library"
}'
echo -e "\n"

echo "2️⃣  Testing Get All Libraries (Public Route)"
curl -X GET $API_URL/libraries
echo -e "\n"

echo "3️⃣  Testing Get Single Library"
# Get the first library ID from the list
LIBRARY_ID=$(curl -s -X GET $API_URL/libraries | grep -o '"_id":"[^"]*' | head -1 | grep -o '[^"]*$')
curl -X GET "$API_URL/libraries/$LIBRARY_ID"
echo -e "\n"

echo "4️⃣  Testing Library Creation without Auth (Should Fail)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-d '{
    "name": "Test Library 2",
    "address": {
        "street": "456 Library Street",
        "city": "London",
        "postcode": "SW1A 1AA",
        "borough": "Westminster"
    }
}'
echo -e "\n"

echo "5️⃣  Testing Library Update (Protected Route)"
curl -X PUT "$API_URL/libraries/$LIBRARY_ID" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "name": "Updated Test Library",
    "description": "This library has been updated"
}'
echo -e "\n"

echo "6️⃣  Testing Library Delete (Protected Route)"
curl -X DELETE "$API_URL/libraries/$LIBRARY_ID" \
-H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "7️⃣  Testing Delete Non-Existent Library (Should Fail)"
curl -X DELETE "$API_URL/libraries/123456789012345678901234" \
-H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "8️⃣  Testing Library Creation with Invalid Data (Should Fail)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "name": "A",
    "address": {
        "street": "",
        "postcode": "INVALID"
    }
}'
echo -e "\n"

echo "9️⃣  Testing Library Creation with Invalid Opening Hours (Should Fail)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "name": "Test Library",
    "address": {
        "street": "123 Library Street",
        "city": "London",
        "postcode": "SW1A 1AA",
        "borough": "Westminster"
    },
    "location": {
        "coordinates": [-0.1276, 51.5074]
    },
    "openingHours": {
        "monday": { "open": "10:00", "close": "09:00" },
        "tuesday": { "open": "invalid", "close": "17:00" },
        "wednesday": { "open": "10:00" }
    }
}'
echo -e "\n"

echo "🔟 Testing Library Creation without Opening Hours (Should Pass)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "name": "Test Library No Hours",
    "address": {
        "street": "123 Library Street",
        "city": "London",
        "postcode": "SW1A 1AA",
        "borough": "Westminster"
    },
    "location": {
        "coordinates": [-0.1276, 51.5074]
    }
}'
echo -e "\n"

echo "1️⃣1️⃣ Testing Duplicate Library Creation (Should Warn)"
curl -X POST $API_URL/libraries \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
    "name": "Test Library",
    "address": {
        "street": "123 Library Street",
        "city": "London",
        "postcode": "SW1A 1AA",
        "borough": "Westminster"
    },
    "location": {
        "coordinates": [-0.1276, 51.5074]
    }
}'
echo -e "\n" 