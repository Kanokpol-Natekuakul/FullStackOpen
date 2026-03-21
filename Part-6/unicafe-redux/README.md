# Unicafe Redux (Part-6)

This folder contains a small Redux reducer implementation and tests for the Unicafe exercise.

Setup

1. Remove git metadata if you cloned an external repo:

```bash
cd Part-6/unicafe-redux
rm -rf .git
```

2. Install dependencies and run tests:

```bash
npm install
npm test
```

Files

- `src/reducer.js` — Redux reducer implementing `GOOD`, `OK`, `BAD`, and `RESET`.
- `src/reducer.test.js` — Unit tests using `vitest` and `deep-freeze`.
