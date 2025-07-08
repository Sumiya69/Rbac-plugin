// Minimal RBAC server for testing
const http = require('http');
const url = require('url');

const PORT = 8080;

// In-memory data store
const policies = [
  {
    id: '1',
    entityReference: 'user:default/admin',
    permission: 'catalog-entity',
    policy: 'read',
    effect: 'allow'
  },
  {
    id: '2', 
    entityReference: 'user:default/admin',
    permission: 'catalog-entity',
    policy: 'create',
    effect: 'allow'
  }
];

const plugins = [
  {
    name: 'catalog',
    version: '1.0.0'
  }
];

const permissions = [
  {
    name: 'catalog-entity',
    type: 'basic'
  }
];

function handleCORS(req, res) {
  // Very permissive CORS for debugging
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  console.log(`CORS headers set for ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    console.log('Responding to preflight OPTIONS request');
    res.writeHead(200);
    res.end();
    return true;
  }
  return false;
}

const server = http.createServer((req, res) => {
  if (handleCORS(req, res)) return;

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${new Date().toISOString()} - ${req.method} ${path}`);

  // Set JSON response header
  res.setHeader('Content-Type', 'application/json');

  try {
    if (path === '/api/rbac/health' || path === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    
    } else if (path === '/api/rbac/policies' || path === '/policies') {
      res.writeHead(200);
      res.end(JSON.stringify(policies));
    
    } else if (path === '/api/rbac/plugins' || path === '/plugins') {
      res.writeHead(200);
      res.end(JSON.stringify(plugins));
    
    } else if (path === '/api/rbac/permissions' || path === '/permissions') {
      res.writeHead(200);
      res.end(JSON.stringify(permissions));
    
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found', path: path }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`RBAC server running on http://localhost:${PORT}`);
  console.log(`Server also accessible on http://0.0.0.0:${PORT}`);
  console.log('Available endpoints:');
  console.log('  /api/rbac/health');
  console.log('  /api/rbac/policies');
  console.log('  /api/rbac/plugins');
  console.log('  /api/rbac/permissions');
  console.log('  /health (alternative)');
  console.log('  /policies (alternative)');
  console.log('  /plugins (alternative)');
  console.log('  /permissions (alternative)');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop other processes using this port.`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down RBAC server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
