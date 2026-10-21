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
  apiKey:            "AIzaSyB_IbJ_tOTGpl1z2Ko7L-j2l0Ke3g_mgtE",
  authDomain:        "vhc-website-8ae2c.firebaseapp.com",
  projectId:         "vhc-website-8ae2c",
  storageBucket:     "vhc-website-8ae2c.firebasestorage.app",  // unused — Storage is the paid one
  messagingSenderId: "816833634636",
  appId:             "1:816833634636:web:b6b6004e3c7e58d3cb6fe9"
};

/* The Google account allowed to manage the site. Signing in with any other
   Google account is refused with a clear message.

   This is a convenience check only — the real enforcement is the matching
   email in firestore.rules, which Google's servers apply and nobody can
   bypass. Change BOTH if the site ever moves to another account. */
const ADMIN_EMAIL = "vijayshreehealthcare@gmail.com";

/* LOCAL MODE is on whenever Firebase hasn't been configured yet. */
const IS_LOCAL_MODE = !FIREBASE_CONFIG.projectId || !FIREBASE_CONFIG.apiKey;
