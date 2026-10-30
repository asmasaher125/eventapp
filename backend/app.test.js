const test = require('node:test');
const assert = require('node:assert');
const app = require('./app');
test('health endpoint returns ok', async () => {
  const server = app.listen(0);
  const res = await fetch('http://127.0.0.1:' + server.address().port + '/health');
  assert.strictEqual(res.status, 200);
  server.close();
});
