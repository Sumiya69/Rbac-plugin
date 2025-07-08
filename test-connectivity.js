const http = require('http');

console.log('Testing connectivity to RBAC endpoints...');

// Test different endpoints
const endpoints = [
  'http://localhost:8080/api/rbac/health',
  'http://localhost:8080/api/rbac/policies',
  'http://localhost:7007/api/rbac/policies',
  'http://localhost:3000/api/rbac/policies'
];

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          url: url,
          status: res.statusCode,
          data: data.substring(0, 200) // First 200 chars
        });
      });
    });
    
    request.on('error', (err) => {
      resolve({
        url: url,
        error: err.message
      });
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      resolve({
        url: url,
        error: 'Timeout'
      });
    });
  });
}

async function testAll() {
  console.log('Starting connectivity tests...\n');
  
  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      console.log(`Testing: ${result.url}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      } else {
        console.log(`  Status: ${result.status}`);
        console.log(`  Data: ${result.data}`);
      }
      console.log('');
    } catch (err) {
      console.log(`Failed to test ${endpoint}: ${err.message}\n`);
    }
  }
}

testAll().then(() => {
  console.log('Connectivity tests completed.');
  process.exit(0);
}).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
