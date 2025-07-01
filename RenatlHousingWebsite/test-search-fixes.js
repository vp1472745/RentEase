// test-search-fixes.js
// Test script to verify search functionality fixes

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testSearchFixes() {
  console.log('🧪 Testing Search Fixes...\n');

  try {
    // Test 1: Search for properties in Junnardeo (should return empty array, not 404)
    console.log('1️⃣ Testing search for Junnardeo properties...');
    try {
      const response = await axios.get(`${BASE_URL}/properties/search?city=Junnardeo`);
      console.log('✅ Search response status:', response.status);
      console.log('✅ Properties found:', response.data.length);
      console.log('✅ Response is array:', Array.isArray(response.data));
    } catch (error) {
      console.log('❌ Search failed:', error.response?.status, error.response?.data?.message);
    }

    // Test 2: Search with no filters (should return all properties)
    console.log('\n2️⃣ Testing search with no filters...');
    try {
      const response = await axios.get(`${BASE_URL}/properties/search`);
      console.log('✅ Search response status:', response.status);
      console.log('✅ Properties found:', response.data.length);
    } catch (error) {
      console.log('❌ Search failed:', error.response?.status, error.response?.data?.message);
    }

    // Test 3: Search log without authentication (should not fail)
    console.log('\n3️⃣ Testing search log without authentication...');
    try {
      const response = await axios.post(`${BASE_URL}/user/search-log`, {
        searchTerm: 'test search',
        device: 'test device',
        name: 'test user',
        email: 'test@example.com'
      });
      console.log('✅ Search log response:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Search log correctly rejected unauthenticated request');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data?.message);
      }
    }

    // Test 4: Search log with authentication (if token available)
    console.log('\n4️⃣ Testing search log with authentication...');
    const token = process.env.TEST_TOKEN; // Set this environment variable if you have a valid token
    if (token) {
      try {
        const response = await axios.post(`${BASE_URL}/user/search-log`, {
          searchTerm: 'authenticated test search',
          device: 'test device',
          name: 'test user',
          email: 'test@example.com'
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('✅ Authenticated search log response:', response.status);
      } catch (error) {
        console.log('❌ Authenticated search log failed:', error.response?.status, error.response?.data?.message);
      }
    } else {
      console.log('⏭️ Skipping authenticated test (no token provided)');
    }

    console.log('\n✅ Search fixes test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSearchFixes(); 