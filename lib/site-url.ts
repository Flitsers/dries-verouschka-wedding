import "server-only";

const DEVELOPMENT_FALLBACK_ORIGIN = "http://localhost:3000";

function siteUrlError(message: string): Error {
  return new Error(`Invalid NEXT_PUBLIC_SITE_URL: ${message}`);
}

export function getCanonicalSiteOrigin(): string {
  const configuredValue = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredValue) {
    if (process.env.NODE_ENV !== "production") {
      return DEVELOPMENT_FALLBACK_ORIGIN;
    }

    throw siteUrlError("a canonical HTTPS origin is required in production");
  }

  let siteUrl: URL;

  try {
    siteUrl = new URL(configuredValue);
  } catch {
    throw siteUrlError("the value must be a valid absolute URL");
  }

  if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
    throw siteUrlError("only HTTP or HTTPS URLs are supported");
  }

  const isOriginOnly = /^https?:\/\/[^/?#]+\/?$/i.test(configuredValue);

  if (
    !isOriginOnly ||
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw siteUrlError(
      "provide an origin only, without credentials, a path, query, or hash",
    );
  }

  if (process.env.NODE_ENV === "production") {
    if (siteUrl.protocol !== "https:") {
      throw siteUrlError("production requires HTTPS");
    }

    const hostname = siteUrl.hostname.toLowerCase().replace(/\.$/, "");
    const isLoopback =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname.startsWith("127.");

    if (isLoopback) {
      throw siteUrlError("localhost and loopback origins are not allowed in production");
    }
  }

  return siteUrl.origin;
}

export function getCanonicalInvitationUrl(code: string): string {
  return `${getCanonicalSiteOrigin()}/i/${encodeURIComponent(code)}`;
}
