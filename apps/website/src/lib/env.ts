export const LIB_NAME = "refirebase";

const SITE_ORIGIN = `https://${LIB_NAME}.gelzin.com`;
const REPO_SLUG = `refirebase/${LIB_NAME}`;

export const site = {
  name: "Refirebase",
  description:
    "The easiest Firebase API — Firestore, Realtime Database, Storage, Auth, and Admin in one TypeScript class.",
  url: SITE_ORIGIN,
} as const;

export const repo = {
  url: `https://github.com/${REPO_SLUG}`,
  apiRepo: `https://api.github.com/repos/${REPO_SLUG}`,
  apiUrl: `https://api.github.com/repos/${REPO_SLUG}/releases/latest`,
} as const;
