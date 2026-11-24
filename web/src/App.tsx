import { formatDistance } from "./lib/format";

export function App() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h1>Dispatch</h1>
      <p>Foundation only: the job board and map arrive with the API.</p>
      <p>Example: a job {formatDistance(12_345)} from the depot.</p>
    </main>
  );
}
