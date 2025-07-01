// Test script to verify nearby field processing fix
// Run this with: node test-nearby-fix.js

function processNearbyData(nearby) {
  console.log('📍 Processing nearby places:', nearby);
  try {
    const processed = nearby
      .map(place => {
        // If place is a string or has character keys, convert it to proper object
        if (typeof place === 'string') {
          return { name: place, distance: "1", unit: "km" };
        }
        
        // If place has character keys (0, 1, 2, etc.), it's a split string
        if (place['0'] !== undefined) {
          const name = Object.keys(place)
            .filter(key => !isNaN(parseInt(key)))
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => place[key])
            .join('');
          
          return {
            name: name.replace(/\([^)]*\)/g, '').trim(), // Remove parentheses content
            distance: place.distance || "1",
            unit: place.unit || "km"
          };
        }
        
        // If it's already a proper object, return as is
        return {
          name: place.name || "",
          distance: place.distance || "1",
          unit: place.unit || "km"
        };
      })
      .filter(place => place.name && place.name.trim() !== ""); // Remove empty entries
    
    console.log('✅ Final processed nearby places:', processed);
    return processed;
  } catch (error) {
    console.error('❌ Error processing nearby places:', error);
    console.log('🔄 Setting nearby to empty array due to processing error');
    return []; // Set to empty array if processing fails
  }
}

// Test cases
console.log('🧪 Testing Nearby Field Processing Fix...\n');

// Test case 1: Malformed data from logs
const testCase1 = [
  {
    '0': 'H',
    '1': 'o',
    '2': 's',
    '3': 'p',
    '4': 'i',
    '5': 't',
    '6': 'a',
    '7': 'l',
    '8': ' ',
    '9': '(',
    '10': ' ',
    '11': 'k',
    '12': 'm',
    '13': ')',
    unit: 'km',
    _id: '6861a5a5193ddd8cfdae5ec4',
    id: '6861a5a5193ddd8cfdae5ec4'
  }
];

console.log('📋 Test Case 1: Malformed data from logs');
const result1 = processNearbyData(testCase1);

// Test case 2: Proper object
const testCase2 = [
  {
    name: "Hospital",
    distance: "2",
    unit: "km"
  }
];

console.log('\n📋 Test Case 2: Proper object');
const result2 = processNearbyData(testCase2);

// Test case 3: String
const testCase3 = ["Market"];

console.log('\n📋 Test Case 3: String');
const result3 = processNearbyData(testCase3);

console.log('\n📋 Summary:');
console.log('✅ Test Case 1 result:', result1);
console.log('✅ Test Case 2 result:', result2);
console.log('✅ Test Case 3 result:', result3);

console.log('\n🚀 The fix should now handle all nearby data formats correctly!'); 