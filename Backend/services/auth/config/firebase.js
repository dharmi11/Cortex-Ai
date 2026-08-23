import "dotenv/config";

import { cert, initializeApp } from "firebase-admin";

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
const key = process.env.FIREBASE_PRIVATE_KEY;


export const app = initializeApp({
  credential: cert(serviceAccount),
});