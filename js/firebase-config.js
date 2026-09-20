/* ============================================================
   FIREBASE CONFIG
   ------------------------------------------------------------
   Paste the config from the Firebase console here when the
   project is ready:
     Firebase console → Project settings → General
     → "Your apps" → Web app → SDK setup and configuration
   ------------------------------------------------------------
   LEAVE IT AS-IS FOR NOW and everything runs in LOCAL MODE:
   the admin panel saves to this browser's own storage, so the
   whole site + admin can be built and tested with no Firebase
   account at all. Fill `projectId` + `apiKey` in and the site
   switches itself over to Firebase automatically.
   ============================================================ */

const FIREBASE_CONFIG = {
  apiKey:            "",
  authDomain:        "",
  projectId:         "",
  storageBucket:     "",   // unused — we never touch Firebase Storage (paid)
  messagingSenderId: "",
  appId:             ""
};

/* Which admin email is allowed to sign in. Leave "" to allow any
   account that exists in Firebase Authentication. */
const ADMIN_EMAIL = "";

/* LOCAL MODE is on whenever Firebase hasn't been configured yet. */
const IS_LOCAL_MODE = !FIREBASE_CONFIG.projectId || !FIREBASE_CONFIG.apiKey;
