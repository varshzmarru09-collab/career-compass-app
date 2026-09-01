import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseAppConfig {
  projectId: string;
  appId?: string;
  apiKey?: string;
  authDomain?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

function loadFirebaseConfig(): FirebaseAppConfig {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse firebase-applet-config.json:', e);
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID || 'probable-unfolding-2thv3',
    firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || 'ai-studio-careercompass-1d84451d-008f-4ae6-9b3e-2b0eedf5addb',
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID || 'probable-unfolding-2thv3'}.firebaseapp.com`,
  };
}

export function initFirebase(): { app: FirebaseApp | null; db: Firestore | null } {
  if (firestoreDb) {
    return { app: firebaseApp, db: firestoreDb };
  }

  try {
    const config = loadFirebaseConfig();
    if (!config.projectId) {
      console.warn('Firebase projectId not found. Using in-memory fallback store.');
      return { app: null, db: null };
    }

    firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();

    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      try {
        firestoreDb = getFirestore(firebaseApp, config.firestoreDatabaseId);
      } catch (err) {
        console.warn(`Could not connect to custom firestore database '${config.firestoreDatabaseId}', falling back to default database:`, err);
        firestoreDb = getFirestore(firebaseApp);
      }
    } else {
      firestoreDb = getFirestore(firebaseApp);
    }

    console.log(`[Firebase] Hosted Firestore initialized successfully for project: ${config.projectId}`);
    return { app: firebaseApp, db: firestoreDb };
  } catch (err) {
    console.error('[Firebase] Initialization error:', err);
    return { app: null, db: null };
  }
}

export { firestoreDb };
