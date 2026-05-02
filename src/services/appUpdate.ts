import { CURRENT_APP_VERSION, UPDATE_MANIFEST_URL } from "../config/appUpdate";

export type AvailableAppUpdate = {
  apkUrl: string;
  latestVersion: string;
  message: string;
  title: string;
};

type UpdateManifest = {
  apkUrl: string;
  latestVersion: string;
  message?: string;
  title?: string;
};

const UPDATE_CHECK_TIMEOUT_MS = 8000;

export async function checkForAppUpdate(): Promise<AvailableAppUpdate | null> {
  const response = await fetchWithTimeout(UPDATE_MANIFEST_URL, UPDATE_CHECK_TIMEOUT_MS);

  if (!response.ok) {
    throw new Error(`Update check failed with status ${response.status}`);
  }

  const manifest = parseManifest(await response.json());

  if (compareVersions(manifest.latestVersion, CURRENT_APP_VERSION) <= 0) {
    return null;
  }

  return {
    apkUrl: manifest.apkUrl,
    latestVersion: manifest.latestVersion,
    message: manifest.message ?? "A newer Scam Shield APK is available from GitHub.",
    title: manifest.title ?? "Update available"
  };
}

function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeout = new Promise<Response>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Update check timed out")), timeoutMs);
  });

  return Promise.race([fetch(url), timeout]).finally(() => clearTimeout(timeoutId));
}

function parseManifest(value: unknown): UpdateManifest {
  if (!isRecord(value)) {
    throw new Error("Update manifest must be an object");
  }

  const latestVersion = value.latestVersion;
  const apkUrl = value.apkUrl;

  if (typeof latestVersion !== "string" || latestVersion.trim().length === 0) {
    throw new Error("Update manifest latestVersion is required");
  }

  if (typeof apkUrl !== "string" || !apkUrl.startsWith("https://")) {
    throw new Error("Update manifest apkUrl must be an HTTPS URL");
  }

  return {
    apkUrl,
    latestVersion,
    message: typeof value.message === "string" ? value.message : undefined,
    title: typeof value.title === "string" ? value.title : undefined
  };
}

function compareVersions(left: string, right: string): number {
  const leftParts = normalizeVersion(left);
  const rightParts = normalizeVersion(right);
  const size = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < size; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart > rightPart) {
      return 1;
    }

    if (leftPart < rightPart) {
      return -1;
    }
  }

  return 0;
}

function normalizeVersion(version: string): number[] {
  return version
    .trim()
    .replace(/^v/i, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

