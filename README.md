# Dispatch

Plan a field-service team's day: which technician does which job, in what order, arriving
inside the customer's booked window. Then keep the plan working as the day goes wrong.

> **Status: foundation only.** The project layout, tooling, distance and time-window helpers
> (server) and a placeholder web app exist and are tested. The data model, API, travel times,
> route optimiser, dispatcher board and technician app are not built yet. See
> [the plan](docs/PLAN.md).

## What it will do

- **Jobs and people**: customers, sites, jobs with booked windows, durations and required
  skills; technicians with skills, shifts, breaks and a start location.
- **Travel times**: a matrix of road travel times from a routing engine, cached, with
  straight-line distance as the floor and a clearly labelled fallback.
- **Planning**: assign and order jobs so every visit starts inside its window, every
  technician has the skills, and total travel and overtime are as low as possible.
- **The day going wrong**: an emergency job, a technician off sick, a job that overruns. The
  plan is repaired with as few changes as possible, and customers whose time moves are listed.
- **Two screens**: a dispatcher's board with a map and timeline, and a mobile-friendly
  technician view of today's jobs.

Sample customers and technicians are made up.

## What exists today

| Part | What it does |
|---|---|
| `server/src/geo.ts` | Great-circle distance, and bounding boxes that work near the poles and across the antimeridian |
| `server/src/timewindow.ts` | Parses booked windows like `08:00-12:00`, intersects them with shifts, removes breaks, and finds the latest start that still fits a visit |
| `web/` | React and Vite app with a placeholder page and display helpers |

## Quickstart

Requires Node 22 or newer.

```bash
make setup     # install locked server and web dependencies
make check     # format check, type checks and tests
make dev-web   # run the web app on http://localhost:5173
make help      # list every target
```

## Licence

MIT. See [LICENSE](LICENSE).
