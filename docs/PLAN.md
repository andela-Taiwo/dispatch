# Plan

Dispatch is built in sessions, each with a clear success test. Later sessions build on
earlier ones.

| # | Session | Success |
|---|---|---|
| 1 | Data model, Postgres schema and API (Fastify): customers, sites, jobs, booked windows, skills, technicians, shifts and breaks, with validation and a seed of a made-up company | API tests cover every resource; a job whose window cannot fit its duration is refused with a reason; a seed creates a realistic day |
| 2 | Travel times: a pluggable matrix provider (a routing engine in development, a recorded fixture in tests), caching, and a straight-line fallback that is labelled | No travel time is shorter than the great-circle distance allows; the cache is invalidated when a site moves; tests never call the network |
| 3 | Planner: assign and order jobs per technician, respecting windows, skills, shifts and breaks, minimising travel and overtime | An independent checker proves every rule on every plan; on small days the result matches a brute-force optimum; on large days it beats a nearest-neighbour baseline |
| 4 | Repair during the day: emergency jobs, a technician off sick, overruns, with minimal changes and a list of customers whose time moves | Repairs keep every rule; tests bound how many jobs move; customers are notified once per change |
| 5 | Dispatcher board: map, technician timelines, drag a job to another technician with the reason shown when it cannot go there | Playwright covers dragging a job, being refused with a reason, and repairing after a sick call |
| 6 | Technician app and live updates: today's jobs on a phone-sized screen, start and finish a job, live status on the board over WebSocket | Playwright covers a technician finishing a job and the board updating; offline actions sync when the connection returns |
| 7 | Scale: 200 technicians and 3,000 jobs a day, profiling and benchmarks | Planning the large day runs within a set budget; benchmarks fail the build on regression |

## Rules

- An independent checker validates every plan and never imports the planner.
- Tests never call a live routing engine or map service. Travel times in tests come from
  recorded fixtures.
- Sample data is made up. No real customers, addresses or technicians.
- Tests that need Postgres use a separate test database and never touch a developer's data.
