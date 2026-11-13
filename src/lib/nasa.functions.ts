import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

export interface Apod {
  title: string;
  date: string;
  explanation: string;
  mediaType: "image" | "video" | "other";
  url: string | null;
  hdUrl: string | null;
  thumbnailUrl: string | null;
  copyright: string | null;
  pageUrl: string;
}

export type ApodResult = { ok: true; apod: Apod } | { ok: false; error: string };

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

/**
 * NASA Astronomy Picture of the Day, fetched on the server so a NASA API key (secret NASA_API_KEY)
 * never reaches the browser. Falls back to NASA's shared, rate-limited DEMO_KEY when no key is set.
 */
export const getApod = createServerFn({ method: "GET" }).handler(async (): Promise<ApodResult> => {
  const key = process.env["NASA_API_KEY"] || "DEMO_KEY";
  try {
    // note: the `thumbs=true` option currently makes the APOD service return HTTP 500, so it isn't used
    const url = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(key)}`;
    let res = await fetch(url, { headers: { accept: "application/json" } });
    // the APOD service has brief 5xx hiccups; one retry usually succeeds
    if (res.status >= 500) res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      console.error("APOD request failed", res.status);
      return { ok: false, error: res.status === 429 ? "NASA's picture service is busy right now. Try again in an hour." : "NASA's picture service is unavailable right now." };
    }
    const j = (await res.json()) as Record<string, unknown>;
    // same picture for everyone all day; let caches absorb repeat visits (DEMO_KEY is rate-limited)
    setResponseHeader("cache-control", "public, max-age=1800");
    const date = str(j["date"]) ?? "";
    const media = str(j["media_type"]);
    const compact = date.replace(/-/g, "").slice(2);
    return {
      ok: true,
      apod: {
        title: str(j["title"]) ?? "Astronomy Picture of the Day",
        date,
        explanation: str(j["explanation"]) ?? "",
        mediaType: media === "image" || media === "video" ? media : "other",
        url: str(j["url"]),
        hdUrl: str(j["hdurl"]),
        thumbnailUrl: str(j["thumbnail_url"]),
        copyright: str(j["copyright"])?.replace(/\s+/g, " ") ?? null,
        pageUrl: compact.length === 6 ? `https://apod.nasa.gov/apod/ap${compact}.html` : "https://apod.nasa.gov/apod/astropix.html",
      },
    };
  } catch (e) {
    console.error("APOD fetch error", e);
    return { ok: false, error: "Couldn't reach NASA's picture service." };
  }
});
