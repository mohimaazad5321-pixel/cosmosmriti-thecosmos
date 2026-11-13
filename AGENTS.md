<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules (CosmoSmriti)

- Artifact content lives only in `src/data/artifacts-*.ts` typed by `src/data/types.ts`; UI renders it generically — never hardcode a per-artifact screen.
- Factual claims (dates, coordinates, figures) must trace to a `sources` entry; mark coordinates `landing-site` unless measured from orbit — the museum's credibility depends on it.
- 3D worlds: pure-TS terrain/projection in `src/game/`, R3F drawing in `src/components/world/`; per-frame state stays in refs, never React state — keeps the canvas from re-rendering.
- The explore route is `ssr: false` and the scene is memoised; HUD state must not be passed in a way that re-creates the Canvas.
- Progress is anonymous zustand `persist` with `skipHydration`, rehydrated in `__root` — avoids SSR hydration mismatches.
- In-world objects are procedural reconstructions and must stay labelled "not an authentic NASA model" until verified NASA models replace them.
- Sound only plays from user gestures through `src/lib/sound.ts`, which respects the mute setting.
