import type { TestPingResponse } from '@sanpo/types';

// Inside docker, web reaches nest-api by its service name on the shared network.
// Override with NEST_API_URL for local/non-docker runs (e.g. http://localhost:4000).
const NEST_API_URL = process.env.NEST_API_URL ?? 'http://nest-api:4000';

async function fetchPing(): Promise<TestPingResponse> {
  // no-store so every load actually hits nest-api (connectivity test)
  const res = await fetch(`${NEST_API_URL}/api/ping`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`nest-api responded ${res.status}`);
  }
  return res.json();
}

export default async function Home() {
  let result: TestPingResponse | null = null;
  let error: string | null = null;

  try {
    result = await fetchPing();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>web → nest-api connectivity test!!</h1>
      <p>Target: {NEST_API_URL}/api/ping</p>
      {error ? (
        <p style={{ color: 'red' }}>❌ Failed: {error}</p>
      ) : (
        <div>
          <p style={{ color: 'green' }}>✅ Connected</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
