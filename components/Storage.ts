export type CahierDesCharges = {
  companyName: string;
  contactEmail: string;
  region: "Qu?bec" | "Canada (hors QC)" | "USA";
  services: Array<{ id: string; quantity?: number }>;
  notes?: string;
  signedDataUrl?: string;
  signedAt?: string;
  paymentLink?: string;
};

const KEY = "iamarketing.cahier";
const SETTINGS_KEY = "iamarketing.settings";

export function saveCahier(cahier: CahierDesCharges) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cahier));
}

export function loadCahier(): CahierDesCharges | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export type Settings = {
  paymentLink?: string;
};

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

