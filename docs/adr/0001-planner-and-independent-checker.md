# 0001: Own planner, independent checker, recorded travel times

## Status

Accepted

## Context

Field-service planning is a vehicle routing problem with time windows and skills. Solvers
exist (OR-Tools, VROOM), but the hard part of this product is repairing a plan during the day
with as few visible changes as possible, and explaining why a job cannot go to a technician.
Both need full control of the planning logic. Travel times come from a routing engine, which
is slow, rate-limited and not something tests should depend on.

## Decision

- Dispatch implements its own planner and repair logic in the server.
- A separate checker validates every plan against the rules (windows, skills, shifts, breaks,
  no overlaps) directly from the data. It never imports the planner.
- On small instances, a brute-force search gives the true optimum to compare against.
- Travel times come through a provider interface. Development uses a local routing engine;
  tests use recorded matrices; the straight-line distance is a floor no provider may undercut.

## Consequences

- Plan quality is measured, not assumed: against the optimum on small days and a simple
  baseline on large ones.
- Recorded travel-time fixtures must be refreshed deliberately when the sample area changes.
