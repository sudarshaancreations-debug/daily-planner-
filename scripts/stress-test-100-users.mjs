// 100+ Concurrent Users Stress & Load Test for NIMORA SaaS
// Simulates 100 concurrent users executing realistic workflow cycles simultaneously.

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const CONCURRENT_USERS = parseInt(process.env.USERS || '100', 10);
const REQUESTS_PER_USER = 6; // Home, Health, Tools, Create Task, List Tasks, Get Stats

async function runSingleUserSession(userId) {
  const timings = [];
  const errors = [];

  async function measure(name, reqFn) {
    const start = performance.now();
    try {
      const res = await reqFn();
      const elapsed = performance.now() - start;
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      timings.push({ name, elapsed, status: res.status });
      return res;
    } catch (err) {
      const elapsed = performance.now() - start;
      errors.push({ name, elapsed, error: err.message });
      throw err;
    }
  }

  try {
    // 1. User loads Home Web App
    await measure('GET /', () => fetch(`${TARGET_URL}/`));

    // 2. Client checks API health
    await measure('GET /api/health', () => fetch(`${TARGET_URL}/api/health`));

    // 3. User queries available AI/MCP tools
    await measure('GET /api/mcp', () => fetch(`${TARGET_URL}/api/mcp`));

    // 4. User creates a scheduled task via MCP API
    let createdTaskId = null;
    await measure('POST /api/mcp (create_task)', async () => {
      const res = await fetch(`${TARGET_URL}/api/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'create_task',
            arguments: {
              title: `Executive Meeting with Client #${userId}`,
              priority: 'high',
              category: 'Work',
              time: '14:30',
              tags: [`user-${userId}`, 'stress-test'],
            },
          },
          id: userId * 10 + 1,
        }),
      });
      const data = await res.json();
      if (data.result?.content?.[0]?.text) {
        const parsed = JSON.parse(data.result.content[0].text);
        createdTaskId = parsed.id;
      }
      return res;
    });

    // 5. User lists tasks
    await measure('POST /api/mcp (list_tasks)', () =>
      fetch(`${TARGET_URL}/api/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'list_tasks',
            arguments: { category: 'Work' },
          },
          id: userId * 10 + 2,
        }),
      })
    );

    // 6. User queries dashboard stats
    await measure('POST /api/mcp (get_stats)', () =>
      fetch(`${TARGET_URL}/api/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: { name: 'get_stats', arguments: {} },
          id: userId * 10 + 3,
        }),
      })
    );

    return { userId, success: true, timings, errors };
  } catch (err) {
    return { userId, success: false, timings, errors };
  }
}

async function main() {
  console.log('===============================================================');
  console.log(`🚀 NIMORA SaaS 100+ Concurrent User Load & Stress Benchmark`);
  console.log(`🎯 Target Endpoint: ${TARGET_URL}`);
  console.log(`👥 Concurrent Simulated Users: ${CONCURRENT_USERS}`);
  console.log(`📊 Expected Total Operations: ${CONCURRENT_USERS * REQUESTS_PER_USER}`);
  console.log('===============================================================\n');

  const overallStart = performance.now();

  // Launch 100 users simultaneously using Promise.all
  const userPromises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userPromises.push(runSingleUserSession(i));
  }

  const results = await Promise.all(userPromises);
  const overallElapsed = (performance.now() - overallStart) / 1000;

  // Aggregate stats
  let totalSuccessfulRequests = 0;
  let totalFailedRequests = 0;
  const allLatencies = [];

  results.forEach((r) => {
    totalSuccessfulRequests += r.timings.length;
    totalFailedRequests += r.errors.length;
    r.timings.forEach((t) => allLatencies.push(t.elapsed));
  });

  allLatencies.sort((a, b) => a - b);
  const minLatency = allLatencies[0] || 0;
  const maxLatency = allLatencies[allLatencies.length - 1] || 0;
  const avgLatency =
    allLatencies.reduce((sum, v) => sum + v, 0) / (allLatencies.length || 1);
  const p50 = allLatencies[Math.floor(allLatencies.length * 0.5)] || 0;
  const p95 = allLatencies[Math.floor(allLatencies.length * 0.95)] || 0;
  const p99 = allLatencies[Math.floor(allLatencies.length * 0.99)] || 0;

  const totalOps = totalSuccessfulRequests + totalFailedRequests;
  const rps = (totalOps / overallElapsed).toFixed(1);

  console.log('\n=================== 📈 TEST RESULTS SUMMARY ===================');
  console.log(`⏱ Total Benchmark Duration:    ${overallElapsed.toFixed(2)} seconds`);
  console.log(`👥 Total Simulated Users:       ${CONCURRENT_USERS}`);
  console.log(`⚡ Throughput (RPS):             ${rps} requests/sec`);
  console.log(`📦 Total HTTP Operations:       ${totalOps}`);
  console.log(`✅ Successful Requests:         ${totalSuccessfulRequests} (${((totalSuccessfulRequests / (totalOps || 1)) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed Requests:             ${totalFailedRequests}`);
  console.log('---------------------------------------------------------------');
  console.log('⏱ Latency Distribution:');
  console.log(`  • Minimum Latency:            ${minLatency.toFixed(2)} ms`);
  console.log(`  • 50th Percentile (p50):      ${p50.toFixed(2)} ms`);
  console.log(`  • Average Latency:            ${avgLatency.toFixed(2)} ms`);
  console.log(`  • 95th Percentile (p95):      ${p95.toFixed(2)} ms`);
  console.log(`  • 99th Percentile (p99):      ${p99.toFixed(2)} ms`);
  console.log(`  • Maximum Latency:            ${maxLatency.toFixed(2)} ms`);
  console.log('===============================================================\n');

  if (totalFailedRequests > 0) {
    console.error(`⚠️ Detected ${totalFailedRequests} failures! Details:`);
    results
      .filter((r) => r.errors.length > 0)
      .slice(0, 5)
      .forEach((r) => console.error(`User #${r.userId}:`, r.errors));
    process.exit(1);
  } else {
    console.log('🎉 VERDICT: The backend passed 100 concurrent user load test with 0% failure rate!');
  }
}

main();
