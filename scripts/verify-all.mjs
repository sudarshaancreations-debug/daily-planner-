// Comprehensive Automated Verification Suite for NIMORA & MCP Hub
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log(`\n🧪 Starting NIMORA Automated Verification against: ${BASE_URL}\n`);
  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health Endpoint Test
  await assertTest('Health endpoint returns 200 and ok status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok' || data.version !== '1.0.0') {
      throw new Error(`Unexpected payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. MCP Discovery Test
  await assertTest('MCP server returns 16 tool capabilities on GET', async () => {
    const res = await fetch(`${BASE_URL}/api/mcp`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.tools) || data.tools.length !== 16) {
      throw new Error(`Expected 16 tools, got ${data.tools?.length}`);
    }
  });

  // 3. MCP JSON-RPC create_task Test
  let createdTaskId = '';
  await assertTest('MCP create_task creates new task via JSON-RPC 2.0', async () => {
    const res = await fetch(`${BASE_URL}/api/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'create_task',
          arguments: {
            title: 'Verify Project Handover',
            priority: 'high',
            category: 'Work',
            tags: ['test', 'handover'],
          },
        },
        id: 101,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const content = JSON.parse(data.result.content[0].text);
    if (!content.id || content.title !== 'Verify Project Handover') {
      throw new Error(`Invalid created task: ${JSON.stringify(content)}`);
    }
    createdTaskId = content.id;
  });

  // 4. MCP JSON-RPC list_tasks Test
  await assertTest('MCP list_tasks retrieves newly created task', async () => {
    const res = await fetch(`${BASE_URL}/api/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'list_tasks',
          arguments: { category: 'Work' },
        },
        id: 102,
      }),
    });
    const data = await res.json();
    const content = JSON.parse(data.result.content[0].text);
    if (!Array.isArray(content.tasks) || content.count < 1) {
      throw new Error('Task list empty');
    }
  });

  // 5. MCP JSON-RPC complete_task Test
  await assertTest('MCP complete_task marks task as done', async () => {
    const res = await fetch(`${BASE_URL}/api/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'complete_task',
          arguments: { id: createdTaskId },
        },
        id: 103,
      }),
    });
    const data = await res.json();
    const content = JSON.parse(data.result.content[0].text);
    if (content.status !== 'done') {
      throw new Error(`Expected status done, got: ${content.status}`);
    }
  });

  // 6. MCP JSON-RPC get_stats Test
  await assertTest('MCP get_stats aggregates task metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'get_stats',
          arguments: {},
        },
        id: 104,
      }),
    });
    const data = await res.json();
    const stats = JSON.parse(data.result.content[0].text);
    if (typeof stats.total !== 'number' || typeof stats.completed !== 'number') {
      throw new Error(`Malformed stats: ${JSON.stringify(stats)}`);
    }
  });

  // 7. PWA Manifest Static Verification
  await assertTest('PWA manifest.json is valid and accessible', async () => {
    const res = await fetch(`${BASE_URL}/manifest.json`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.name || data.display !== 'standalone') {
      throw new Error(`Invalid manifest structure: ${JSON.stringify(data)}`);
    }
  });

  // 8. OpenAPI 3.1 Spec Verification
  await assertTest('OpenAPI 3.1 spec is valid and defines paths', async () => {
    const res = await fetch(`${BASE_URL}/openapi.json`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.openapi !== '3.1.0' || !data.paths['/api/mcp']) {
      throw new Error(`Missing /api/mcp path in OpenAPI spec`);
    }
  });

  // Summary
  console.log(`\n========================================`);
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
