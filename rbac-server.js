const express = require('express');

const app = express();
const PORT = 8080;

// Manual CORS middleware instead of using cors package
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for debugging
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'false'); // Set to false when using *
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Simple in-memory user store
let users = [
  {
    id: 'user1',
    username: 'guest',
    email: 'guest@example.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// RBAC API endpoints
app.get('/api/rbac/policies', (req, res) => {
  res.json({
    data: [
      {
        id: '1',
        entityReference: 'role:default/admin',
        permission: 'catalog-entity',
        policy: 'read',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      },
      {
        id: '2',
        entityReference: 'role:default/admin',
        permission: 'catalog-entity',
        policy: 'create',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      },
      {
        id: '3',
        entityReference: 'role:default/admin',
        permission: 'catalog-entity',
        policy: 'update',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      },
      {
        id: '4',
        entityReference: 'role:default/admin',
        permission: 'catalog-entity',
        policy: 'delete',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      },
      {
        id: '5',
        entityReference: 'role:default/user',
        permission: 'catalog-entity',
        policy: 'read',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      }
    ]
  });
});

app.get('/api/rbac/plugins', (req, res) => {
  res.json([
    { 
      name: 'catalog', 
      displayName: 'Catalog',
      permissions: [
        {
          name: 'catalog-entity',
          displayName: 'Catalog Entity',
          resourceType: 'catalog-entity',
          actions: ['create', 'read', 'update', 'delete']
        }
      ]
    },
    { 
      name: 'scaffolder', 
      displayName: 'Scaffolder',
      permissions: [
        {
          name: 'scaffolder-action',
          displayName: 'Scaffolder Action',
          resourceType: 'scaffolder-template', 
          actions: ['use', 'read']
        }
      ]
    },
    { 
      name: 'techdocs', 
      displayName: 'TechDocs',
      permissions: [
        {
          name: 'techdocs-document',
          displayName: 'TechDocs Document',
          resourceType: 'techdocs-document',
          actions: ['read']
        }
      ]
    }
  ]);
});

app.get('/api/rbac/permissions', (req, res) => {
  res.json([
    {
      pluginId: 'catalog',
      name: 'catalog-entity',
      displayName: 'Catalog Entity',
      resourceType: 'catalog-entity',
      policies: ['create', 'read', 'update', 'delete']
    },
    {
      pluginId: 'scaffolder',
      name: 'scaffolder-action',
      displayName: 'Scaffolder Action', 
      resourceType: 'scaffolder-template',
      policies: ['use', 'read']
    },
    {
      pluginId: 'techdocs',
      name: 'techdocs-document',
      displayName: 'TechDocs Document',
      resourceType: 'techdocs-document',
      policies: ['read']
    }
  ]);
});

app.get('/api/rbac/users', (req, res) => {
  res.json({
    users: users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }))
  });
});

app.post('/api/rbac/users/register', (req, res) => {
  const { username, email, role = 'user' } = req.body;
  
  if (!username || !email) {
    return res.status(400).json({ 
      error: 'Username and email are required' 
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(409).json({ 
      error: 'User with this username or email already exists' 
    });
  }
  
  // Create new user
  const newUser = {
    id: `user${users.length + 1}`,
    username,
    email,
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }
  });
});

app.get('/api/rbac/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'RBAC API Server is running',
    users: users.length,
    timestamp: new Date().toISOString()
  });
});

// Additional endpoint patterns that the RBAC frontend might expect
// Some RBAC plugins expect these without the /api/rbac prefix
app.get('/policies', (req, res) => {
  res.json({
    data: [
      {
        id: '1',
        entityReference: 'role:default/admin',
        permission: 'catalog-entity',
        policy: 'read',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      },
      {
        id: '2',
        entityReference: 'role:default/admin',
        permission: 'catalog-entity',
        policy: 'create',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      },
      {
        id: '3',
        entityReference: 'role:default/user',
        permission: 'catalog-entity',
        policy: 'read',
        effect: 'allow',
        metadata: { source: 'csv-file' }
      }
    ]
  });
});

app.get('/plugins', (req, res) => {
  res.json([
    { 
      name: 'catalog', 
      displayName: 'Catalog',
      permissions: [
        {
          name: 'catalog-entity',
          displayName: 'Catalog Entity',
          resourceType: 'catalog-entity',
          actions: ['create', 'read', 'update', 'delete']
        }
      ]
    },
    { 
      name: 'scaffolder', 
      displayName: 'Scaffolder',
      permissions: [
        {
          name: 'scaffolder-action',
          displayName: 'Scaffolder Action',
          resourceType: 'scaffolder-template', 
          actions: ['use', 'read']
        }
      ]
    }
  ]);
});

app.get('/permissions', (req, res) => {
  res.json([
    {
      pluginId: 'catalog',
      name: 'catalog-entity',
      displayName: 'Catalog Entity',
      resourceType: 'catalog-entity',
      policies: ['create', 'read', 'update', 'delete']
    },
    {
      pluginId: 'scaffolder',
      name: 'scaffolder-action',
      displayName: 'Scaffolder Action', 
      resourceType: 'scaffolder-template',
      policies: ['use', 'read']
    }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RBAC API Server running on http://localhost:${PORT}`);
  console.log(`Server binding to all interfaces (0.0.0.0:${PORT})`);
  console.log('Available endpoints:');
  console.log('  GET /api/rbac/policies');
  console.log('  GET /api/rbac/plugins');
  console.log('  GET /api/rbac/permissions');
  console.log('  GET /api/rbac/users');
  console.log('  POST /api/rbac/users/register');
  console.log('  GET /api/rbac/health');
  console.log('  GET /policies');
  console.log('  GET /plugins');
  console.log('  GET /permissions');
  console.log('\n🚀 RBAC Server is ready for testing!');
});
