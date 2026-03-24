## PAO-L Kiosk UI

Interactive kiosk interface for the PAO-L alcohol breath test station, built with Next.js App Router. The frontend can run against the real kiosk backend or an in-browser mock depending on `APP_MODE`.

## Quick start

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy `.env.example` (or create `.env`) and set the desired mode:

   ```bash
   APP_MODE=dev
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws # used only in prod mode
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000)

## APP_MODE reference

`APP_MODE` is resolved at build time and exposed to the client as `NEXT_PUBLIC_APP_MODE`. It controls how the kiosk experience behaves:

| Mode       | Backend connection | Behaviour | UI helpers |
|------------|--------------------|-----------|------------|
| `dev`      | Mocked             | Auto-progresses through the full flow with scripted demo data. Useful for fast UI development. | Overlay shortcut buttons to replay the demo or reset mock state. |
| `interface`| Mocked             | Stays on the current screen until you manually navigate. No auto-commands are sent. | Overlay provides Previous/Next step navigation and buttons to render pass/fail results. |
| `prod`     | Real WebSocket     | Live kiosk behaviour. Auto navigation, error recovery, and command dispatch use the backend. | Overlay hidden. |

### Switching modes quickly

- Edit `APP_MODE` in `.env`, then restart `npm run dev` so the value is baked into the bundle.
- During `dev`/`interface` modes, a banner appears in the top-left corner showing the active mode and exposing mock controls.

## Project structure highlights

- `src/context/KioskContext.js` — exposes kiosk state and hides whether we are talking to the backend or mocks.
- `src/hooks/useKiosk.js` — real WebSocket implementation for production mode.
- `src/hooks/useMockKiosk.js` — deterministic mock environment used in non-prod modes.
- `src/app/ModeOverlay.js` — developer overlay for mode awareness and manual navigation.

## Production readiness checklist

- Set `APP_MODE=prod` and configure `NEXT_PUBLIC_WS_URL` to target the live backend.
- Verify the kiosk can connect over WebSocket before deployment.
- Disable the overlay by building with `APP_MODE=prod`.
