import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  getFirestore
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const firebaseConfig = Object.freeze({
  apiKey: 'AIzaSyAnerxI4XATX9hombqmug67b1AZKJqfSOw',
  authDomain: 'nunaacollection-70b06.firebaseapp.com',
  projectId: 'nunaacollection-70b06',
  storageBucket: 'nunaacollection-70b06.firebasestorage.app',
  messagingSenderId: '934739145193',
  appId: '1:934739145193:web:188293264ad42671a35b78',
  measurementId: 'G-K9X60P9Y7D'
});

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestoreDb = getFirestore(firebaseApp);

const authReady = setPersistence(firebaseAuth, browserLocalPersistence);

async function signInAdmin(email, password) {
  await authReady;
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

async function signOutAdmin() {
  await authReady;
  return signOut(firebaseAuth);
}

async function resetAdminPassword(email) {
  await authReady;
  return sendPasswordResetEmail(firebaseAuth, email);
}

async function verifyAdminEmail(user) {
  await authReady;
  return sendEmailVerification(user);
}

async function getAdminIdToken(forceRefresh = false) {
  await authReady;
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('กรุณาเข้าสู่ระบบผู้ดูแลอีกครั้ง');
  return user.getIdToken(forceRefresh);
}

function observeAdminAuth(callback) {
  return onAuthStateChanged(firebaseAuth, callback);
}

export {
  firebaseApp,
  firebaseAuth,
  firestoreDb,
  getAdminIdToken,
  observeAdminAuth,
  resetAdminPassword,
  signInAdmin,
  signOutAdmin,
  verifyAdminEmail
};
