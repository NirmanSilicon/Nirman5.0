import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testAPIEndpoint() {
  try {
    console.log('🧪 Testing Medicine Search API Endpoint...\n');
    console.log(`API URL: ${API_URL}\n`);

    // Test disease search
    console.log('1. Testing disease search for "flu"...');
    try {
      const response = await fetch(`${API_URL}/api/medicines/search?disease=flu`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success! Found ${data.count || 0} medicines`);
        if (data.medicines && data.medicines.length > 0) {
          console.log('   Sample medicines:');
          data.medicines.slice(0, 3).forEach(m => {
            console.log(`   - ${m.brandName || m.genericName}`);
          });
        }
      } else {
        console.error(`❌ Error: ${data.error || 'Unknown error'}`);
        console.error(`   Message: ${data.message || 'No message'}`);
        if (data.details) {
          console.error(`   Details: ${data.details}`);
        }
      }
    } catch (err) {
      console.error('❌ Request failed:', err.message);
    }

    // Test symptom search
    console.log('\n2. Testing symptom search for "fever"...');
    try {
      const response = await fetch(`${API_URL}/api/medicines/search?symptom=fever`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success! Found ${data.count || 0} medicines`);
        if (data.medicines && data.medicines.length > 0) {
          console.log('   Sample medicines:');
          data.medicines.slice(0, 3).forEach(m => {
            console.log(`   - ${m.brandName || m.genericName}`);
          });
        }
      } else {
        console.error(`❌ Error: ${data.error || 'Unknown error'}`);
        console.error(`   Message: ${data.message || 'No message'}`);
        if (data.details) {
          console.error(`   Details: ${data.details}`);
        }
      }
    } catch (err) {
      console.error('❌ Request failed:', err.message);
    }

    console.log('\n✅ API tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPIEndpoint()
  .then(() => {
    console.log('\n✅ Process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Process failed:', error);
    process.exit(1);
  });

