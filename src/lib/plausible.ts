/** Existing Plausible CE site id. Must stay first in `data-domain`. */
export const PLAUSIBLE_SITE_DOMAIN = "margies.app";

const ALIAS_HOSTS = ["www.margies.app"] as const;

/**
 * Tracker `data-domain` for every public host. Plausible CE v2 splits on commas
 * and records into each matching site; only `PLAUSIBLE_SITE_DOMAIN` exists, so
 * that name stays first and extra hosts are aliases, not a second property.
 */
export function plausibleDataDomain(): string {
  const hosts = new Set<string>([PLAUSIBLE_SITE_DOMAIN, ...ALIAS_HOSTS]);
  const fromEnv = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? "";
  for (const part of fromEnv.split(",")) {
    const host = part.trim().toLowerCase().replace(/^www\./, "");
    if (host) hosts.add(host);
  }
  const rest = [...hosts].filter((host) => host !== PLAUSIBLE_SITE_DOMAIN).sort();
  return [PLAUSIBLE_SITE_DOMAIN, ...rest].join(",");
}
