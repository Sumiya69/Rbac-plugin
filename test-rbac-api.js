const http = require('http');

async function testRBACAPI() {
  const endpoints = [
    '/api/rbac/plugins',
    '/api/rbac/policies', 
    '/api/rbac/permission-policies',
    '/api/rbac/permissions',
    '/api/rbac/policy-metadata',
    '/api/rbac/users'
  ];

  console.log('Testing RBAC API endpoints...\n');

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest('GET', endpoint);
      console.log(`✅ ${endpoint}: ${result.statusCode}`);
      console.log(`   Response: ${result.data.substring(0, 100)}...`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
    console.log('');
  }
}

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 7007,
      path: path,
      method: method
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Wait for server to be ready, then test
console.log('Waiting for server to be ready...');
setTimeout(testRBACAPI, 15000);
