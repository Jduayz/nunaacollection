import {
  observeAdminAuth,
  resetAdminPassword,
  signInAdmin,
  signOutAdmin,
  verifyAdminEmail
} from './firebase-client.js?v=20260725-4';

const adminConfig = window.NUNAA_CONFIG || {};
const allowedAdminUids = Array.isArray(adminConfig.firebaseAdminUids)
  ? adminConfig.firebaseAdminUids
  : [];

const authPanel = document.getElementById('adminAuthPanel');
const authForm = document.getElementById('adminAuthForm');
const authEmail = document.getElementById('adminAuthEmail');
const authPassword = document.getElementById('adminAuthPassword');
const authMessage = document.getElementById('adminAuthMessage');
const resetPasswordButton = document.getElementById('adminResetPassword');
const adminHeader = document.getElementById('adminHeader');
const adminApp = document.getElementById('adminApp');
const adminIdentity = document.getElementById('adminIdentity');
const signOutButton = document.getElementById('adminSignOutButton');

let adminAppLoaded = false;
let handlingUnauthorizedUser = false;

function showAuthMessage(message, type = 'info') {
  authMessage.textContent = message;
  authMessage.className = `admin-auth-message ${type}`;
}

function showSignedOutState() {
  authPanel.hidden = false;
  adminHeader.hidden = true;
  adminApp.hidden = true;
  adminIdentity.textContent = '';
}

async function showSignedInState(user) {
  authPanel.hidden = true;
  adminHeader.hidden = false;
  adminApp.hidden = false;
  adminIdentity.textContent = user.email || user.uid;

  if (!adminAppLoaded) {
    adminAppLoaded = true;
    await import('./admin.js?v=20260725-4');
  }
}

async function rejectUnauthorizedUser(message) {
  if (handlingUnauthorizedUser) return;
  handlingUnauthorizedUser = true;
  try {
    await signOutAdmin();
    showSignedOutState();
    showAuthMessage(message, 'error');
  } finally {
    handlingUnauthorizedUser = false;
  }
}

authForm.addEventListener('submit', async event => {
  event.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value;
  showAuthMessage('กำลังเข้าสู่ระบบ...');

  try {
    const credential = await signInAdmin(email, password);
    const user = credential.user;

    if (!user.emailVerified) {
      await verifyAdminEmail(user);
      await rejectUnauthorizedUser('ส่งอีเมลยืนยันแล้ว กรุณายืนยันอีเมลก่อนเข้าสู่ระบบอีกครั้ง');
      return;
    }

    if (!allowedAdminUids.includes(user.uid)) {
      await rejectUnauthorizedUser('บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ดูแล Nunaa');
      return;
    }

    authPassword.value = '';
    showAuthMessage('');
    await showSignedInState(user);
  } catch (error) {
    showAuthMessage('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจอีเมลและรหัสผ่าน', 'error');
  }
});

resetPasswordButton.addEventListener('click', async () => {
  const email = authEmail.value.trim();
  if (!email) {
    showAuthMessage('กรุณากรอกอีเมลก่อนขอเปลี่ยนรหัสผ่าน', 'error');
    return;
  }

  try {
    await resetAdminPassword(email);
    showAuthMessage('ส่งลิงก์เปลี่ยนรหัสผ่านแล้ว กรุณาตรวจอีเมล', 'success');
  } catch (error) {
    showAuthMessage('ยังส่งลิงก์เปลี่ยนรหัสผ่านไม่ได้ กรุณาลองใหม่', 'error');
  }
});

signOutButton.addEventListener('click', () => {
  signOutAdmin().catch(() => {
    showAuthMessage('ออกจากระบบไม่สำเร็จ กรุณาลองใหม่', 'error');
  });
});

observeAdminAuth(user => {
  if (!user) {
    showSignedOutState();
    return;
  }

  if (!user.emailVerified) {
    rejectUnauthorizedUser('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ').catch(() => {});
    return;
  }

  if (!allowedAdminUids.includes(user.uid)) {
    rejectUnauthorizedUser('บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ดูแล Nunaa').catch(() => {});
    return;
  }

  showSignedInState(user).catch(() => {
    showAuthMessage('เปิดหน้าแอดมินไม่สำเร็จ กรุณาลองใหม่', 'error');
  });
});

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
