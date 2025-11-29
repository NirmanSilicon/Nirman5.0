import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // privateKey may contain escaped newlines; replace them
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Fallback to default application credentials (useful in deployed environments)
    try {
      admin.initializeApp();
    } catch (err) {
      console.warn("Firebase Admin initialization skipped (missing env vars)");
    }
  }
}

export async function verifyFirebaseIdToken(idToken: string) {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    console.error("Failed to verify Firebase ID token:", err);
    return null;
  }
}
