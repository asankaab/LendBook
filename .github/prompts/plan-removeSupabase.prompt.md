## Plan: Replace Supabase with Neon Data API and Vercel Blob

TL;DR – remove every Supabase client call, auth and storage logic, and replace them with a Neon‑auth/Data‑API based implementation plus Vercel Blob for avatar handling.  This will require a new `neon` helper, rewrites of `api.js` and `AuthProvider`, updates to configuration, environment variables and documentation, and removal of the `@supabase/supabase-js` dependency.

**Steps**
1. **Audit & clean references**
   - Search for `supabase` (already done) and build a list of impacted files.
   - Delete or rename `src/lib/supabase.js` and `src/lib/supabase-lazy.js` once replacements exist.
   - Remove any direct import of `supabase` from components (only `AuthProvider` and `api.js` currently).

2. **New Neon helper module**
   - Add `src/lib/neon.js` which exports:
     * functions to perform Neon Data API requests (`select`, `insert`, `update`, `delete`, `upsert`, or a generic `query` that accepts SQL/JSON`).
     * an auth wrapper matching the surface of `supabase.auth` (getSession, onAuthStateChange, signInWithPassword/Google/OTP, signOut) using neon‑auth endpoints.
   - Read environment variables `VITE_NEON_DATA_URL`, `VITE_NEON_DATA_KEY`, `VITE_NEON_AUTH_URL`, etc.
   - Provide fallback warnings if variables missing.
   - Add documentation comments with links to Neon Data API and neon‑auth docs.

3. **Rewrite `src/lib/api.js`**
   - Replace every `supabase.from(...).xxx` call with the equivalent Neon API fetch using the helper from step 2.
   - Convert `upsert` logic (people table) to either a SQL upsert statement or two separate operations.
   - Update `uploadAvatar`/`deleteAvatar` to use Vercel Blob HTTP endpoints (use `fetch` or the `@vercel/blob` package).
   - Maintain existing return shapes so calling code requires minimal changes.
   - Add new helper `_handleError(response)` if necessary.

4. **Update `AuthProvider.jsx`**
   - Replace supabase imports with the neon auth helper.
   - Re‑implement `useEffect` logic to call `neon.getSession()` and subscribe to `neon.onAuthStateChange()`.
   - Map neon user object to the previous shape (`user.id`, `user.email`, etc.).
   - Keep the same exposed methods (`signInWithGoogle`, etc.) but forward to neon auth equivalents.

5. **Modify other code**
   - No component should import supabase directly; after step 1 there should be none.
   - Components using `api` remain unchanged; they will work once `api.js` is updated.

6. **Configuration changes**
   - Update `vite.config.js`:
     * Remove the manual chunk entry for `'supabase'`.
     * Adjust `runtimeCaching.urlPattern` entries to match Neon Data API and neon‑auth endpoints instead of `/rest/v1/...` and `/auth/v1/...`.
     * Add any new caching patterns for the Vercel Blob URL if avatars are served from there.
   - Remove Supabase from the `build.rollupOptions.manualChunks` list.
   - Remove any PWA comments referencing Supabase.

7. **Environment & docs updates**
   - Delete `VITE_SUPABASE_*` variables from `.env` and update `.env.example` (if exists) with Neon variables.
   - Revise `STORAGE_SETUP.md` to describe creating a Vercel Blob bucket/container and how the client should build avatar URLs.
   - Update `README.md` and other project docs with new setup instructions (Neon project, auth configuration, API key, data migration steps, etc.).
   - Update `seed.sql` comments – remove Supabase‑specific lines and adjust for generic Postgres/Neon.

8. **Dependencies**
   - Remove `@supabase/supabase-js` from `dependencies` and `package-lock.json`.
   - Add `@neon/auth` or whatever the official neon‑auth npm package is, plus `@vercel/blob` (or `@vercel/edge-config` if chosen) and any lightweight fetch helper if needed.
   - Run `npm install` or equivalent and verify `npm run dev` still builds.

9. **Migration & data transfer**
   - Provide instructions for exporting the current Supabase Postgres database and importing it into Neon (pg_dump/pg_restore or SQL scripts). The schema (`supabase_schema.sql`/`seed.sql`) will largely stay the same.
   - Document any differences: e.g. authentication tables will no longer be managed by Supabase; neon‑auth may create its own tables or you might implement custom ones.

10. **Verification**
    1. Start with a fresh checkout and .env configured for Neon + Vercel Blob.
    2. Run `npm run dev` and confirm no compilation errors/warnings about missing imports or environment variables.
    3. Walk through user flows in the browser:
       - Sign up/sign in via all supported methods (Google, password, magic link) and confirm `AuthProvider` updates state.
       - Create/update/delete transactions and people; ensure they persist in Neon (query the database or use a dashboard).
       - Update profile info, change currency, upload/delete avatar; verify blob operations succeed and public URLs are correct.
       - Use the dashboard charts and stats to confirm query-derived data matches expectations.
    4. Inspect network requests to verify endpoints now point to Neon Data API and Vercel Blob rather than supabase domains.
    5. Run `npm run lint` and address any new lint violations due to added/removed code.

11. **Cleanup**
    - After migration, delete any leftover Supabase utility files and update gitignore if necessary.
    - Remove or rename `STORAGE_SETUP.md` if replaced; commit with new instructions.

**Relevant files**
- `src/lib/api.js` — rewrite queries and storage helpers.
- `src/contexts/AuthProvider.jsx` — swap out auth implementation.
- `src/lib/neon.js` (new) — Neon Data API + auth wrapper.
- `src/lib/supabase.js`, `src/lib/supabase-lazy.js` — remove/replace.
- `vite.config.js` — update caching patterns and chunks.
- `.env` / documentation files — environment variables update.
- `STORAGE_SETUP.md`, `README.md`, `seed.sql` — documentation.
- `package.json` — dependencies adjustments.

**Decisions**
- We'll keep the existing client‑side architecture: the React app continues issuing requests directly to the Neon Data API (similar to Supabase) rather than building a separate server layer; the Neon Data API will be secured with a service key that lives in the client environment (like the Supabase anon key).
- The auth surface from neon‑auth will be modeled closely on the old `supabase.auth` API to minimise changes in the UI code.
- Avatar management will migrate from Supabase Storage to Vercel Blob; we will implement only the necessary endpoints.
- Caching rules in the PWA will map to the new endpoints.

**Further Considerations**
1. **Transaction upserts** – Neon Data API may not support upsert on a unique constraint the same way Supabase does; we might need to craft a PostgreSQL `INSERT ... ON CONFLICT` SQL string. Decide early whether `api.createTransaction` will call a custom SQL endpoint or run two queries.
2. **Auth table migration** – neon‑auth may require its own schema; we should clarify whether we will keep existing users or start fresh. Option A: export current `auth.users` table and import; Option B: require users to re‑signup.
3. **Rate limiting / security** – exposing Neon service key in frontend has the same risk as Supabase anon key. If the user later wants to move to a server API, we can iterate.

Once you're happy with this plan, let me know and I can outline the first implementation steps or help craft code snippets to kick off the work.
