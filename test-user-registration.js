const http = require('http');

async function testUserRegistration() {
  // Test data
  const testUser = {
    username: 'testuser1',
    email: 'testuser1@example.com',
    role: 'user'
  };

  console.log('Testing user registration...');
  
  // Prepare the POST request
  const postData = JSON.stringify(testUser);
  
  const options = {
    hostname: 'localhost',
    port: 7007,
    path: '/api/rbac/users/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', data);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testGetUsers() {
  console.log('\nTesting get users...');
  
  const options = {
    hostname: 'localhost',
    port: 7007,
    path: '/api/rbac/users',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', data);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
      reject(error);
    });

    req.end();
  });
}

async function main() {
  try {
    // Wait a bit for server to be ready
    console.log('Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test user registration
    await testUserRegistration();
    
    // Test getting users
    await testGetUsers();
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

main();
