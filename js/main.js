document.addEventListener('DOMContentLoaded', () => {
const qs = (sel, parent = document) => parent.querySelector(sel);
const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));
function escapeHtml(value) {
const span = document.createElement('span');
span.textContent = value == null ? '' : String(value);
return span.innerHTML;
}
function isSafeUrl(value) {
if (typeof value !== 'string') return false;
const trimmed = value.trim();
if (!trimmed) return false;
try {
const url = new URL(trimmed, window.location.origin);
return url.protocol === 'http:' || url.protocol === 'https:';
} catch (err) {
return false;
}
}
function safeUrl(value) {
return isSafeUrl(value) ? value.trim() : '';
}
const body = document.body;
const pageKey = body.dataset.page || '';
const layoutMode = body.dataset.layout || 'default';
const LATEST_LIMIT = 8;
function setActiveNav() {
const current = body.dataset.page || '';
qsa('.nav-link[data-page]').forEach((link) => {
const isActive = link.getAttribute('data-page') === current;
link.classList.toggle('active', isActive);
if (isActive) {
link.setAttribute('aria-current', 'page');
} else {
link.removeAttribute('aria-current');
}
});
}
function renderLayout() {
const header = qs('#siteHeader');
if (header) {
header.innerHTML = `
        <div class="promo-bar">
          <div class="container promo-inner">
            <span>New drop: Midnight Heights is live for members.</span>
            <a class="promo-link" href="music.html">Listen now</a>
          </div>
        </div>
        <nav class="navbar navbar-expand-lg navbar-light container py-3">
          <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
            <span class="brand-mark">RP</span>
            <span class="brand-text">RyzePlus</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navMain">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2" id="navLinks">
              <li class="nav-item"><a class="nav-link" data-page="home" href="index.html#vault">Vault</a></li>
              <li class="nav-item"><a class="nav-link" data-page="music" href="music.html">Music</a></li>
              <li class="nav-item"><a class="nav-link" data-page="plans" href="plans.html">Membership</a></li>
              <li class="nav-item"><a class="nav-link" data-page="account" href="account.html">Account</a></li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Explore</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="index.html#features">Features</a></li>
                  <li><a class="dropdown-item" href="index.html#playlists">Playlists</a></li>
                  <li><a class="dropdown-item" href="plans.html#faq">FAQ</a></li>
                  <li><a class="dropdown-item" href="index.html#testimonials">Member voices</a></li>
                </ul>
              </li>
            </ul>
            <div class="nav-utilities">
              <button class="theme-toggle" id="themeToggle" type="button" aria-pressed="false" aria-label="Toggle color theme">Theme: Light</button>
            </div>
            <div class="nav-auth" id="navAuthArea">
              <a class="btn btn-ghost" href="auth.html">Log in</a>
              <a class="btn btn-primary" href="auth.html">Join RyzePlus</a>
            </div>
          </div>
        </nav>
      `;
}
const footer = qs('#siteFooter');
if (footer) {
footer.innerHTML = `
        <div class="container">
          <div class="footer-top">
            <div>
              <h3 class="brand-text">RyzePlus</h3>
              <p class="text-muted">Music drops, member vaults, and creator-led stories.</p>
            </div>
            <div class="footer-links">
              <a href="index.html#vault">Vault</a>
              <a href="music.html">Music</a>
              <a href="plans.html">Membership</a>
              <a href="account.html">Account</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© <span id="year"></span> RyzePlus</span>
            <div class="dropdown">
              <button class="btn btn-ghost btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Site settings
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <button class="dropdown-item text-danger" type="button" id="hardCacheClearBtn">Hard clear cache</button>
                </li>
              </ul>
            </div>
            <span class="footer-meta"><a href="#">Terms</a> · <a href="#">Privacy</a> · <a href="#">Support</a></span>
          </div>
        </div>
      `;
}
setActiveNav();
}
if (layoutMode !== 'minimal') {
renderLayout();
}
const settingsKey = 'ryzeSettings';
const themeToggle = qs('#themeToggle');
function readSettings() {
try {
const raw = localStorage.getItem(settingsKey);
return raw ? JSON.parse(raw) : {};
} catch (e) {
return {};
}
}
function writeSettings(partial) {
const current = readSettings();
const next = { ...current, ...partial };
localStorage.setItem(settingsKey, JSON.stringify(next));
return next;
}
function setTheme(mode) {
const theme = mode === 'dark' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);
if (themeToggle) {
themeToggle.textContent = `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`;
themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}
}
function initTheme() {
const settings = readSettings();
const stored = settings.theme || localStorage.getItem('ryzeTheme');
if (stored) {
setTheme(stored);
writeSettings({ theme: stored });
localStorage.removeItem('ryzeTheme');
return;
}
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const fallback = prefersDark ? 'dark' : 'light';
setTheme(fallback);
writeSettings({ theme: fallback });
}
initTheme();
if (themeToggle) {
themeToggle.addEventListener('click', () => {
const current = document.documentElement.getAttribute('data-theme') || 'light';
const next = current === 'dark' ? 'light' : 'dark';
setTheme(next);
writeSettings({ theme: next });
});
}
const hardCacheClearBtn = qs('#hardCacheClearBtn');
if (hardCacheClearBtn) {
hardCacheClearBtn.addEventListener('click', () => {
hardClearCache();
});
}
const statusToast = qs('#statusToast');
let noticeTimer = null;
function showNotice(message) {
if (statusToast) {
statusToast.textContent = message;
if (noticeTimer) window.clearTimeout(noticeTimer);
noticeTimer = window.setTimeout(() => {
statusToast.textContent = '';
}, 3200);
return;
}
alert(message);
}
function preserveAuthStorage() {
const preserved = {};
for (let i = 0; i < localStorage.length; i += 1) {
const key = localStorage.key(i);
if (key && key.startsWith('firebase:')) {
preserved[key] = localStorage.getItem(key);
}
}
return preserved;
}
async function hardClearCache() {
const message = currentUser
? 'This will clear cached data and preferences, but keep you signed in. Continue?'
: 'This will clear cached data and preferences. You may need to sign in again. Continue?';
if (!window.confirm(message)) return;
const preserved = preserveAuthStorage();
localStorage.clear();
Object.keys(preserved).forEach((key) => {
const value = preserved[key];
if (value !== null) localStorage.setItem(key, value);
});
sessionStorage.clear();
try {
if ('caches' in window) {
const names = await caches.keys();
await Promise.all(names.map((name) => caches.delete(name)));
}
} catch (err) {
console.warn('CacheStorage clear failed', err);
}
try {
if ('serviceWorker' in navigator) {
const regs = await navigator.serviceWorker.getRegistrations();
regs.forEach((reg) => reg.unregister());
}
} catch (err) {
console.warn('Service worker cleanup failed', err);
}
sessionStorage.setItem('ryzeForceFresh', '1');
showNotice('Cache cleared. Reloading latest data…');
window.setTimeout(() => window.location.reload(), 400);
}
let revealObserver = null;
function registerReveal(root = document) {
const items = qsa('[data-reveal]', root);
if (!items.length) return;
items.forEach((item) => {
item.classList.add('reveal');
if (revealObserver) {
revealObserver.observe(item);
} else {
item.classList.add('is-visible');
}
});
}
function initReveal() {
if ('IntersectionObserver' in window) {
revealObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
revealObserver.unobserve(entry.target);
}
});
}, { threshold: 0.2 });
}
registerReveal();
}
const onboardingKey = 'ryzeOnboarded';
function initOnboarding() {
if (pageKey !== 'home' || isAuthPage) return;
const settings = readSettings();
const onboarded = settings.onboarded || localStorage.getItem(onboardingKey);
if (onboarded) return;
if (qs('#onboardingOverlay')) return;
const overlay = document.createElement('div');
overlay.className = 'onboarding-overlay';
overlay.id = 'onboardingOverlay';
overlay.innerHTML = `
      <div class="onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">
        <h2 id="onboardingTitle">Welcome to RyzePlus</h2>
        <p class="text-muted">Start with a few quick steps to unlock the full experience.</p>
        <div class="onboarding-steps">
          <div class="onboarding-step">
            <span>Create your account</span>
            <span class="text-muted">2 min</span>
          </div>
          <div class="onboarding-step">
            <span>Activate All-Access</span>
            <span class="text-muted">One plan</span>
          </div>
          <div class="onboarding-step">
            <span>Save your first release</span>
            <span class="text-muted">Instant</span>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-primary" id="onboardingStart">Get started</button>
          <button class="btn btn-ghost" id="onboardingBrowse">Browse music</button>
          <button class="btn btn-outline-dark" id="onboardingClose">Maybe later</button>
        </div>
      </div>
    `;
document.body.appendChild(overlay);
overlay.classList.add('active');
const closeModal = () => {
overlay.classList.remove('active');
writeSettings({ onboarded: '1' });
localStorage.removeItem(onboardingKey);
window.setTimeout(() => overlay.remove(), 0);
};
const closeBtn = qs('#onboardingClose', overlay);
const startBtn = qs('#onboardingStart', overlay);
const browseBtn = qs('#onboardingBrowse', overlay);
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (startBtn) startBtn.addEventListener('click', () => {
closeModal();
navigateTo('plans.html');
});
if (browseBtn) browseBtn.addEventListener('click', () => {
closeModal();
navigateTo('music.html');
});
overlay.addEventListener('click', (event) => {
if (event.target === overlay) closeModal();
});
}
function navigateTo(url) {
window.location.href = url;
}
function formatDate(d) {
if (!d) return '';
try {
const dt = new Date(d);
return dt.toLocaleDateString();
} catch (e) {
return d;
}
}
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const isAuthPage = body.classList.contains('auth-page') || pageKey === 'auth';
const authToggle = qs('.auth-toggle');
const authTabs = qsa('.auth-tab');
const authPanels = qsa('.auth-panel');
if (authToggle) {
authTabs.forEach((tab) => {
tab.addEventListener('click', () => {
const mode = tab.getAttribute('data-auth');
authTabs.forEach((t) => t.classList.remove('active'));
tab.classList.add('active');
authToggle.classList.toggle('is-signup', mode === 'signup');
authPanels.forEach((panel) => panel.classList.toggle('active', panel.id === `auth-${mode}`));
});
});
}
const RYZE_RUNTIME_CONFIG = window.RYZE_RUNTIME_CONFIG || {};
const FIREBASE_CONFIG = RYZE_RUNTIME_CONFIG.firebase || null;
const authMessage = qs('#authMessage');
const authStatus = qs('#authStatus');
let firebaseAuth = null;
let firestoreDb = null;
let currentUser = null;
let profileCloseHandlerAttached = false;
function isFirebaseConfigured() {
return FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.authDomain;
}
function showAuthMessage(msg) {
if (authMessage) {
authMessage.textContent = msg;
return;
}
showNotice(msg);
}
function formatAuthError(err) {
if (!err || !err.code) return 'Unable to sign in. Please try again.';
const map = {
'auth/invalid-email': 'That email address is invalid.',
'auth/user-disabled': 'This user account has been disabled.',
'auth/user-not-found': 'No account found for that email.',
'auth/wrong-password': 'Incorrect password. Try again.',
'auth/email-already-in-use': 'That email is already registered.',
'auth/weak-password': 'Password should be at least 6 characters.',
'auth/unauthorized-domain': 'This domain is not authorized in Firebase console.',
'auth/popup-blocked': 'Popup was blocked. Allow popups for this site and try again.',
'auth/popup-closed-by-user': 'Sign-in popup closed before completion.',
'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
'auth/operation-not-allowed': 'Google sign-in is disabled in Firebase console.'
};
return map[err.code] || err.message || 'Authentication failed.';
}
function initAppCheck() {
const appCheckConfig = RYZE_RUNTIME_CONFIG.appCheck || null;
if (!appCheckConfig || !appCheckConfig.siteKey) return;
if (typeof firebase === 'undefined' || typeof firebase.appCheck !== 'function') return;
const host = window.location.hostname;
const allowDebugToken = host === 'localhost' || host === '127.0.0.1';
if (appCheckConfig.debugToken && allowDebugToken) {
self.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckConfig.debugToken;
}
const appCheck = firebase.appCheck();
appCheck.activate(appCheckConfig.siteKey, true);
}
function initFirebase() {
if (window.location.protocol === 'file:') {
showAuthMessage('Open this site with a local server (http://localhost). Firebase Auth does not work on file:// URLs.');
return;
}
if (!isFirebaseConfigured()) {
showAuthMessage('Add your Firebase config in js/runtime-config.js (see js/runtime-config.example.js) to enable sign-in.');
return;
}
if (typeof firebase === 'undefined') {
showAuthMessage('Firebase SDK failed to load.');
return;
}
if (!firebase.apps.length) {
firebase.initializeApp(FIREBASE_CONFIG);
}
initAppCheck();
firebaseAuth = firebase.auth();
firestoreDb = firebase.firestore();
firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
firebaseAuth.onIdTokenChanged(async (user) => {
currentUser = user || null;
updateAccountUI();
updateNavAuth();
updateAuthStatus();
updateSecurityPanel();
updateProfileCompletion();
renderActivity();
if (currentUser) {
await loadUserProfile();
updateProfileCompletion();
} else {
clearUserForms();
}
});
}
const authEmailSignIn = qs('#authEmailSignIn');
const authEmailSignUp = qs('#authEmailSignUp');
const authReset = qs('#authReset');
const authEmail = qs('#authEmail');
const authPassword = qs('#authPassword');
const authDisplayName = qs('#authDisplayName');
const authEmailSignup = qs('#authEmailSignup');
const authPasswordSignup = qs('#authPasswordSignup');
if (authEmailSignIn) {
authEmailSignIn.addEventListener('click', async () => {
if (!firebaseAuth) {
showAuthMessage('Firebase is not configured yet.');
return;
}
const email = authEmail ? authEmail.value.trim() : '';
const password = authPassword ? authPassword.value.trim() : '';
if (!email || !password) {
showAuthMessage('Enter email and password.');
return;
}
try {
await firebaseAuth.signInWithEmailAndPassword(email, password);
showAuthMessage('Signed in successfully.');
if (isAuthPage) navigateTo('index.html');
} catch (err) {
showAuthMessage(formatAuthError(err));
}
});
}
if (authEmailSignUp) {
authEmailSignUp.addEventListener('click', async () => {
if (!firebaseAuth) {
showAuthMessage('Firebase is not configured yet.');
return;
}
const email = authEmailSignup ? authEmailSignup.value.trim() : (authEmail ? authEmail.value.trim() : '');
const password = authPasswordSignup ? authPasswordSignup.value.trim() : (authPassword ? authPassword.value.trim() : '');
const displayNameValue = authDisplayName ? authDisplayName.value.trim() : '';
if (!email || !password) {
showAuthMessage('Enter email and password.');
return;
}
try {
await firebaseAuth.createUserWithEmailAndPassword(email, password);
if (firebaseAuth.currentUser && displayNameValue) {
await firebaseAuth.currentUser.updateProfile({ displayName: displayNameValue });
}
showAuthMessage('Account created.');
if (firebaseAuth.currentUser) {
firebaseAuth.currentUser.sendEmailVerification().catch(() => {});
}
if (displayNameValue) {
await saveUserProfile({ displayName: displayNameValue });
}
if (isAuthPage) navigateTo('index.html');
} catch (err) {
showAuthMessage(formatAuthError(err));
}
});
}
if (authReset) {
authReset.addEventListener('click', async () => {
if (!firebaseAuth) {
showAuthMessage('Firebase is not configured yet.');
return;
}
const email = authEmail ? authEmail.value.trim() : (authEmailSignup ? authEmailSignup.value.trim() : '');
if (!email) {
showAuthMessage('Enter your email so we can send a reset link.');
return;
}
try {
await firebaseAuth.sendPasswordResetEmail(email);
showAuthMessage('Password reset email sent.');
} catch (err) {
showAuthMessage(formatAuthError(err));
}
});
}
function updateAuthStatus() {
if (!authStatus) return;
if (currentUser) {
const verified = currentUser.emailVerified ? 'Verified email' : 'Email not verified';
authStatus.textContent = `Signed in as ${currentUser.email || 'member'} · ${verified}`;
} else {
authStatus.textContent = 'Sign in to unlock full member benefits.';
}
}
const accountStatusCard = qs('#accountStatusCard');
const membershipStatus = qs('#membershipStatus');
const membershipRenewal = qs('#membershipRenewal');
const manageBillingBtn = qs('#manageBillingBtn');
const overviewActions = qs('#overviewActions');
const accountSubtitle = qs('#accountSubtitle');
const billingPlan = qs('#billingPlan');
const billingNext = qs('#billingNext');
const paymentHistory = qs('#paymentHistory');
const downloadCount = qs('#downloadCount');
function updateAccountUI() {
if (!accountStatusCard) return;
if (currentUser) {
const safeEmail = escapeHtml(currentUser.email || 'member');
const safeEmailStatus = currentUser.emailVerified ? 'Verified' : 'Not verified';
const verifyAction = currentUser.emailVerified
? ''
: '<button class="btn btn-link px-0" id="verifyEmailInline">Send verification email</button>';
accountStatusCard.innerHTML = `
        <h3>Welcome back</h3>
        <p class="text-muted">Signed in as ${safeEmail}.</p>
        <div class="account-detail">
          <span>Email status</span>
          <strong>${safeEmailStatus}</strong>
        </div>
        ${verifyAction}
        <div class="d-flex flex-wrap gap-2 mt-3">
          <button class="btn btn-ghost" id="signOutBtn">Sign out</button>
          <button class="btn btn-primary" id="syncBillingBtn">Sync billing</button>
        </div>
      `;
const signOutBtn = qs('#signOutBtn');
if (signOutBtn) {
signOutBtn.addEventListener('click', () => firebaseAuth && firebaseAuth.signOut());
}
const syncBillingBtn = qs('#syncBillingBtn');
if (syncBillingBtn) {
syncBillingBtn.addEventListener('click', () => {
localStorage.setItem('membershipStatus', 'Active — All-Access');
localStorage.setItem('membershipRenewal', 'Renews in 29 days');
localStorage.setItem('billingPlan', 'All-Access');
localStorage.setItem('billingNext', 'Next payment: in 29 days');
recordPayment('Subscription sync · All-Access');
updateMembershipStatus();
updateBillingPanel();
showNotice('Billing details synced.');
});
}
const verifyEmailInline = qs('#verifyEmailInline');
if (verifyEmailInline) {
verifyEmailInline.addEventListener('click', async () => {
try {
await currentUser.sendEmailVerification();
showAuthMessage('Verification email sent.');
updateAuthStatus();
updateSecurityPanel();
} catch (err) {
showAuthMessage(formatAuthError(err));
}
});
}
} else {
accountStatusCard.innerHTML = `
        <h3>Signed out</h3>
        <p class="text-muted">Log in to see your library, membership status, and purchases.</p>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-primary" href="auth.html">Log in</a>
          <a class="btn btn-ghost" href="auth.html">Create account</a>
        </div>
      `;
}
if (accountSubtitle) {
accountSubtitle.textContent = currentUser
? 'Manage your membership, saved tracks, and account settings.'
: 'Sign in to see your member status.';
}
if (overviewActions) {
overviewActions.innerHTML = currentUser
? '<button class="btn btn-outline-dark" id="overviewSignOut">Sign out</button>'
: '<a class="btn btn-primary" href="auth.html">Sign in</a>';
const overviewSignOut = qs('#overviewSignOut');
if (overviewSignOut) overviewSignOut.addEventListener('click', () => firebaseAuth && firebaseAuth.signOut());
}
}
function updateNavAuth() {
const navAuthArea = qs('#navAuthArea');
if (!navAuthArea) return;
if (currentUser) {
const name = escapeHtml(currentUser.displayName || currentUser.email || 'Member');
navAuthArea.innerHTML = `
        <div class="nav-profile" id="profileMenu">
          <button class="profile-toggle" id="profileToggle">${name}</button>
          <div class="profile-menu" role="menu">
            <a href="account.html">Dashboard</a>
            <a href="account.html#panel-settings">Settings</a>
            <a href="plans.html">Billing</a>
            <button type="button" id="navSignOut">Sign out</button>
          </div>
        </div>
      `;
const profileToggle = qs('#profileToggle');
const profileMenu = qs('#profileMenu');
if (profileToggle) {
profileToggle.addEventListener('click', (e) => {
e.stopPropagation();
if (profileMenu) profileMenu.classList.toggle('open');
});
}
if (!profileCloseHandlerAttached) {
document.addEventListener('click', (e) => {
const menu = qs('#profileMenu');
if (menu && !menu.contains(e.target)) menu.classList.remove('open');
});
profileCloseHandlerAttached = true;
}
const navSignOut = qs('#navSignOut');
if (navSignOut) {
navSignOut.addEventListener('click', () => firebaseAuth && firebaseAuth.signOut());
}
} else {
navAuthArea.innerHTML = `
        <a class="btn btn-ghost" href="auth.html">Log in</a>
        <a class="btn btn-primary" href="auth.html">Join RyzePlus</a>
      `;
}
}
function updateMembershipStatus() {
if (!membershipStatus || !membershipRenewal) return;
const status = localStorage.getItem('membershipStatus') || 'No active plan';
const renewal = localStorage.getItem('membershipRenewal') || 'Connect PayPal to sync billing.';
membershipStatus.textContent = status;
membershipRenewal.textContent = renewal;
}
function recordPayment(entry) {
const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
history.unshift(entry);
localStorage.setItem('paymentHistory', JSON.stringify(history.slice(0, 6)));
saveUserData({ billing: getBillingState() });
}
function updateBillingPanel() {
if (billingPlan) {
billingPlan.textContent = localStorage.getItem('billingPlan') || 'No active plan';
}
if (billingNext) {
billingNext.textContent = localStorage.getItem('billingNext') || 'Next payment: —';
}
if (paymentHistory) {
const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
paymentHistory.innerHTML = '';
if (history.length === 0) {
const li = document.createElement('li');
li.textContent = 'No payments found.';
paymentHistory.appendChild(li);
} else {
history.forEach((item) => {
const li = document.createElement('li');
li.textContent = item;
paymentHistory.appendChild(li);
});
}
}
}
if (manageBillingBtn) {
manageBillingBtn.addEventListener('click', () => {
if (!currentUser) {
navigateTo('auth.html');
return;
}
showNotice('Billing portal will open once PayPal webhooks are connected.');
});
}
const dashboardLinks = qsa('.dash-link');
const dashboardPanels = qsa('.dash-panel');
dashboardLinks.forEach((link) => {
link.addEventListener('click', () => {
const target = link.getAttribute('data-panel');
dashboardLinks.forEach((btn) => btn.classList.remove('active'));
link.classList.add('active');
dashboardPanels.forEach((panel) => {
panel.classList.toggle('active', panel.id === `panel-${target}`);
});
});
});
const prefEmails = qs('#prefEmails');
const prefDrops = qs('#prefDrops');
const prefOffline = qs('#prefOffline');
const prefUpdates = qs('#prefUpdates');
const savePrefsBtn = qs('#savePrefsBtn');
const displayName = qs('#displayName');
const profileNote = qs('#profileNote');
const saveProfileBtn = qs('#saveProfileBtn');
function clearUserForms() {
if (displayName) displayName.value = '';
if (profileNote) profileNote.value = '';
if (prefEmails) prefEmails.checked = false;
if (prefDrops) prefDrops.checked = false;
if (prefOffline) prefOffline.checked = false;
if (prefUpdates) prefUpdates.checked = false;
}
function getUserDocRef() {
if (!firestoreDb || !currentUser) return null;
return firestoreDb.collection('users').doc(currentUser.uid);
}
async function saveUserData(partial) {
const ref = getUserDocRef();
if (!ref) return;
try {
await ref.set(partial, { merge: true });
} catch (err) {
console.error(err);
}
}
function getDownloadCount() {
return parseInt(localStorage.getItem('downloadCount') || '0', 10);
}
function setDownloadCount(count, persist = true) {
const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
localStorage.setItem('downloadCount', String(safeCount));
if (downloadCount) downloadCount.textContent = String(safeCount);
if (persist) {
saveUserData({ stats: { downloadCount: safeCount } });
}
}
function getBillingState() {
return {
membershipStatus: localStorage.getItem('membershipStatus') || '',
membershipRenewal: localStorage.getItem('membershipRenewal') || '',
billingPlan: localStorage.getItem('billingPlan') || '',
billingNext: localStorage.getItem('billingNext') || '',
paymentHistory: JSON.parse(localStorage.getItem('paymentHistory') || '[]')
};
}
function setBillingState(state, persist = true) {
if (!state || typeof state !== 'object') return;
if (Object.prototype.hasOwnProperty.call(state, 'membershipStatus')) {
localStorage.setItem('membershipStatus', state.membershipStatus || '');
}
if (Object.prototype.hasOwnProperty.call(state, 'membershipRenewal')) {
localStorage.setItem('membershipRenewal', state.membershipRenewal || '');
}
if (Object.prototype.hasOwnProperty.call(state, 'billingPlan')) {
localStorage.setItem('billingPlan', state.billingPlan || '');
}
if (Object.prototype.hasOwnProperty.call(state, 'billingNext')) {
localStorage.setItem('billingNext', state.billingNext || '');
}
if (Object.prototype.hasOwnProperty.call(state, 'paymentHistory') && Array.isArray(state.paymentHistory)) {
localStorage.setItem('paymentHistory', JSON.stringify(state.paymentHistory));
}
if (persist) {
saveUserData({ billing: getBillingState() });
}
}
async function loadUserProfile() {
if (!firestoreDb || !currentUser) return;
try {
const doc = await firestoreDb.collection('users').doc(currentUser.uid).get();
if (doc.exists) {
const data = doc.data() || {};
const profile = data.profile || {};
const prefs = data.preferences || {};
if (displayName) displayName.value = profile.displayName || currentUser.displayName || '';
if (profileNote) profileNote.value = profile.note || '';
if (prefEmails) prefEmails.checked = !!prefs.emails;
if (prefDrops) prefDrops.checked = !!prefs.drops;
if (prefOffline) prefOffline.checked = !!prefs.offline;
if (prefUpdates) prefUpdates.checked = !!prefs.updates;
applyRemoteUserData(data);
} else {
if (displayName) displayName.value = currentUser.displayName || '';
applyRemoteUserData({});
}
} catch (err) {
console.error(err);
}
}
async function saveUserProfile(partialProfile) {
if (!firestoreDb || !currentUser) return;
try {
const ref = getUserDocRef();
if (!ref) return;
const payload = {
profile: {
displayName: partialProfile.displayName || currentUser.displayName || '',
note: partialProfile.note || ''
},
updatedAt: firebase.firestore.FieldValue.serverTimestamp()
};
if (partialProfile.preferences) {
payload.preferences = partialProfile.preferences;
}
await ref.set(payload, { merge: true });
} catch (err) {
console.error(err);
}
}
function applyRemoteUserData(data) {
const source = data && typeof data === 'object' ? data : {};
const localLibrary = getLibrary();
if (Array.isArray(source.library)) {
saveLibrary(source.library, false);
} else if (localLibrary.length) {
saveUserData({ library: localLibrary });
}
const localActivity = getActivity();
if (Array.isArray(source.activity)) {
saveActivity(source.activity, false);
} else if (localActivity.length) {
saveUserData({ activity: localActivity });
}
const remoteCount = source.stats && Number.isFinite(source.stats.downloadCount)
? source.stats.downloadCount
: null;
if (remoteCount !== null) {
setDownloadCount(remoteCount, false);
} else {
const localCount = getDownloadCount();
if (localCount) saveUserData({ stats: { downloadCount: localCount } });
}
if (source.billing) {
setBillingState(source.billing, false);
} else {
const localBilling = getBillingState();
if (localBilling && (localBilling.membershipStatus || localBilling.paymentHistory.length)) {
saveUserData({ billing: localBilling });
}
}
renderLibrary();
renderActivity();
updateMembershipStatus();
updateBillingPanel();
initializeDashboardStats();
}
if (savePrefsBtn) {
savePrefsBtn.addEventListener('click', async () => {
if (!currentUser) {
navigateTo('auth.html');
return;
}
const prefs = {
emails: prefEmails ? prefEmails.checked : false,
drops: prefDrops ? prefDrops.checked : false,
offline: prefOffline ? prefOffline.checked : false,
updates: prefUpdates ? prefUpdates.checked : false
};
await saveUserProfile({ preferences: prefs });
showNotice('Preferences saved.');
updateProfileCompletion();
});
}
if (saveProfileBtn) {
saveProfileBtn.addEventListener('click', async () => {
if (!currentUser) {
navigateTo('auth.html');
return;
}
const profile = {
displayName: displayName ? displayName.value.trim() : '',
note: profileNote ? profileNote.value.trim() : ''
};
if (firebaseAuth && firebaseAuth.currentUser && profile.displayName) {
await firebaseAuth.currentUser.updateProfile({ displayName: profile.displayName });
}
await saveUserProfile(profile);
updateNavAuth();
updateProfileCompletion();
showNotice('Profile saved.');
});
}
const verifyEmailBtn = qs('#verifyEmailBtn');
const resetPasswordBtn = qs('#resetPasswordBtn');
const emailVerifyStatus = qs('#emailVerifyStatus');
function updateSecurityPanel() {
if (!emailVerifyStatus) return;
if (currentUser) {
emailVerifyStatus.textContent = currentUser.emailVerified
? 'Your email is verified.'
: 'Your email is not verified yet.';
} else {
emailVerifyStatus.textContent = 'Sign in to verify your email.';
}
if (verifyEmailBtn) verifyEmailBtn.disabled = !currentUser;
if (resetPasswordBtn) resetPasswordBtn.disabled = !currentUser && !(authEmail && authEmail.value.trim());
}
if (verifyEmailBtn) {
verifyEmailBtn.addEventListener('click', async () => {
if (!currentUser) {
navigateTo('auth.html');
return;
}
try {
await currentUser.sendEmailVerification();
showAuthMessage('Verification email sent.');
updateSecurityPanel();
} catch (err) {
showAuthMessage(formatAuthError(err));
}
});
}
if (resetPasswordBtn) {
resetPasswordBtn.addEventListener('click', async () => {
if (!firebaseAuth) {
showAuthMessage('Firebase is not configured yet.');
return;
}
const email = currentUser ? currentUser.email : (authEmail ? authEmail.value.trim() : '');
if (!email) {
showAuthMessage('Enter your email so we can send a reset link.');
return;
}
try {
await firebaseAuth.sendPasswordResetEmail(email);
showAuthMessage('Password reset email sent.');
} catch (err) {
showAuthMessage(formatAuthError(err));
}
});
}
const downloadAllBtn = qs('#downloadAllBtn');
if (downloadAllBtn) {
downloadAllBtn.addEventListener('click', () => {
showNotice('Download all will be available when file hosting is connected.');
});
}
const requestDataBtn = qs('#requestDataBtn');
const deviceSyncBtn = qs('#deviceSyncBtn');
const clearActivityBtn = qs('#clearActivityBtn');
const newSupportBtn = qs('#newSupportBtn');
const viewRoadmapBtn = qs('#viewRoadmapBtn');
const deleteAccountBtn = qs('#deleteAccountBtn');
if (requestDataBtn) {
requestDataBtn.addEventListener('click', () => {
showNotice('Data export request received. You will get an email shortly.');
});
}
if (deviceSyncBtn) {
deviceSyncBtn.addEventListener('click', () => {
showNotice('Device sync started. Your library will update soon.');
});
}
if (clearActivityBtn) {
clearActivityBtn.addEventListener('click', () => {
localStorage.setItem('ryzeActivity', '[]');
renderActivity();
showNotice('Activity cleared.');
});
}
if (newSupportBtn) {
newSupportBtn.addEventListener('click', () => {
showNotice('Support ticket created. We will reply within 24 hours.');
});
}
if (viewRoadmapBtn) {
viewRoadmapBtn.addEventListener('click', () => {
showNotice('Roadmap coming soon.');
});
}
if (deleteAccountBtn) {
deleteAccountBtn.addEventListener('click', () => {
showNotice('Account deletion request submitted. Support will follow up.');
});
}
const exportJsonBtn = qs('#exportJsonBtn');
const exportCsvBtn = qs('#exportCsvBtn');
const clearLibraryBtn = qs('#clearLibraryBtn');
function downloadFile(filename, content, type) {
const blob = new Blob([content], { type });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = filename;
document.body.appendChild(link);
link.click();
link.remove();
URL.revokeObjectURL(url);
}
function exportLibrary(format) {
const items = getLibrary();
if (!items.length) {
showNotice('Your library is empty.');
return;
}
if (format === 'csv') {
const header = 'id,title,artist\n';
const rows = items.map((item) => {
const title = `"${(item.title || '').replace(/"/g, '""')}"`;
const artist = `"${(item.artist || '').replace(/"/g, '""')}"`;
return `${item.id},${title},${artist}`;
});
downloadFile('ryzeplus-library.csv', header + rows.join('\n'), 'text/csv');
showNotice('Library exported as CSV.');
return;
}
downloadFile('ryzeplus-library.json', JSON.stringify(items, null, 2), 'application/json');
showNotice('Library exported as JSON.');
}
if (exportJsonBtn) {
exportJsonBtn.addEventListener('click', () => exportLibrary('json'));
}
if (exportCsvBtn) {
exportCsvBtn.addEventListener('click', () => exportLibrary('csv'));
}
if (clearLibraryBtn) {
clearLibraryBtn.addEventListener('click', () => {
const confirmed = confirm('Clear your saved library? This cannot be undone.');
if (!confirmed) return;
saveLibrary([]);
renderLibrary();
renderActivity();
showNotice('Library cleared.');
if (musicGrid) applyFilters();
});
}
const PAYPAL_CLIENT_ID = (RYZE_RUNTIME_CONFIG.paypalClientId || 'YOUR_PAYPAL_CLIENT_ID');
const PAYPAL_SUBSCRIPTION_PLAN_IDS = RYZE_RUNTIME_CONFIG.paypalPlanIds || {
all: 'P-REPLACE-ALLACCESS'
};
const PAYPAL_SINGLE_PRICE = RYZE_RUNTIME_CONFIG.paypalSinglePrice || '1.29';
let paypalSubLoaded = false;
let paypalSingleLoaded = false;
function showPayPalMessage(target, message) {
if (target) target.innerHTML = `<span class="text-muted">${message}</span>`;
}
function loadPayPalSDK(type) {
return new Promise((resolve, reject) => {
if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'YOUR_PAYPAL_CLIENT_ID') {
reject('missing_client_id');
return;
}
if (type === 'subscription' && paypalSubLoaded) return resolve();
if (type === 'single' && paypalSingleLoaded) return resolve();
const script = document.createElement('script');
if (type === 'subscription') {
script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&components=buttons&currency=USD`;
script.setAttribute('data-namespace', 'paypalSub');
} else {
script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&intent=capture&components=buttons&currency=USD`;
script.setAttribute('data-namespace', 'paypalSingle');
}
script.onload = () => {
if (type === 'subscription') paypalSubLoaded = true;
if (type === 'single') paypalSingleLoaded = true;
resolve();
};
script.onerror = () => reject('load_failed');
document.body.appendChild(script);
});
}
const renderedPlans = new Set();
const renderedSingles = new Set();
async function renderPlanButton(planKey) {
const container = qs(`#paypal-plan-${planKey}`);
if (!container || renderedPlans.has(planKey)) return;
const planId = PAYPAL_SUBSCRIPTION_PLAN_IDS[planKey];
if (!planId || planId.includes('REPLACE')) {
showPayPalMessage(container, 'Add PayPal plan IDs to enable checkout.');
return;
}
try {
await loadPayPalSDK('subscription');
if (!window.paypalSub) {
showPayPalMessage(container, 'PayPal SDK failed to load.');
return;
}
window.paypalSub.Buttons({
createSubscription: function (data, actions) {
return actions.subscription.create({ plan_id: planId });
},
onApprove: function (data) {
const label = planKey === 'all' ? 'All-Access' : planKey.charAt(0).toUpperCase() + planKey.slice(1);
localStorage.setItem('membershipStatus', `Active — ${label}`);
localStorage.setItem('membershipRenewal', 'Renews next billing cycle');
localStorage.setItem('billingPlan', label);
localStorage.setItem('billingNext', 'Next payment: next billing cycle');
recordPayment(`Subscription started · ${label}`);
updateMembershipStatus();
updateBillingPanel();
addActivity('subscription', { title: `${label} plan` });
showNotice(`Subscription active! ID: ${data.subscriptionID}`);
}
}).render(container);
renderedPlans.add(planKey);
} catch (err) {
showPayPalMessage(container, 'Add your PayPal Client ID to enable checkout.');
}
}
async function renderSingleButton(item, container) {
if (!container || renderedSingles.has(item.id)) return;
try {
await loadPayPalSDK('single');
if (!window.paypalSingle) {
showPayPalMessage(container, 'PayPal SDK failed to load.');
return;
}
window.paypalSingle.Buttons({
createOrder: function (data, actions) {
return actions.order.create({
purchase_units: [{
description: item.title || 'Single track',
amount: { value: PAYPAL_SINGLE_PRICE }
}]
});
},
onApprove: function (data, actions) {
return actions.order.capture().then(() => {
addToLibrary(item);
incrementDownloads();
recordPayment(`Track purchase · ${item.title || 'Single'}`);
updateBillingPanel();
addActivity('purchased', item);
showNotice('Purchase complete. Track added to your library.');
});
}
}).render(container);
renderedSingles.add(item.id);
} catch (err) {
showPayPalMessage(container, 'Add your PayPal Client ID to enable checkout.');
}
}
qsa('.plan-cta').forEach((btn) => {
btn.addEventListener('click', (e) => {
const planKey = e.currentTarget.getAttribute('data-plan');
renderPlanButton(planKey);
});
});
const GIST_URL = 'https://gist.githubusercontent.com/ryanduncuft/39ade5f46c7b0a11618f5f016606ecc2/raw/rtk_data.json';
const musicGrid = qs('#musicGrid');
const noResults = qs('#noResults');
const searchInput = qs('#searchInput');
const searchClear = qs('#searchClear');
const filterChips = qsa('.filter-chip');
const resultsCount = qs('#resultsCount');
const catalogStats = qs('#catalogStats');
const savedOnlyToggle = qs('#savedOnlyToggle');
const sortSelect = qs('#sortSelect');
let musicData = [];
let currentFilter = 'all';
let showAll = false;
let savedOnly = false;
let sortBy = 'latest';
const ALLOWED_TYPES = new Set(['album', 'ep', 'single', 'collab']);
const libraryList = qs('#libraryList');
const libraryCount = qs('#libraryCount');
const storedSearch = (() => {
const settings = readSettings();
if (settings.libraryFilters) {
currentFilter = settings.libraryFilters.filter || 'all';
showAll = settings.libraryFilters.view === 'all';
savedOnly = settings.libraryFilters.savedOnly === '1';
sortBy = settings.libraryFilters.sort || 'latest';
return settings.libraryFilters.search || '';
}
const legacy = {
filter: localStorage.getItem('ryzeFilter'),
view: localStorage.getItem('ryzeView'),
savedOnly: localStorage.getItem('ryzeSavedOnly'),
sort: localStorage.getItem('ryzeSort'),
search: localStorage.getItem('ryzeSearch')
};
if (legacy.filter) currentFilter = legacy.filter;
if (legacy.view) showAll = legacy.view === 'all';
if (legacy.savedOnly) savedOnly = legacy.savedOnly === '1';
if (legacy.sort) sortBy = legacy.sort;
if (legacy.filter || legacy.view || legacy.savedOnly || legacy.sort || legacy.search) {
writeSettings({
libraryFilters: {
filter: currentFilter,
view: showAll ? 'all' : 'latest',
savedOnly: savedOnly ? '1' : '0',
sort: sortBy,
search: legacy.search || ''
}
});
['ryzeFilter', 'ryzeView', 'ryzeSavedOnly', 'ryzeSort', 'ryzeSearch'].forEach((key) => {
localStorage.removeItem(key);
});
}
return legacy.search || '';
})();
function getLibraryFiltersState(searchValue) {
const search = typeof searchValue === 'string'
? searchValue
: (searchInput ? searchInput.value.trim() : '');
return {
filter: currentFilter,
view: showAll ? 'all' : 'latest',
savedOnly: savedOnly ? '1' : '0',
sort: sortBy,
search
};
}
function persistLibraryFilters(searchValue) {
writeSettings({ libraryFilters: getLibraryFiltersState(searchValue) });
}
function getLibrary() {
return JSON.parse(localStorage.getItem('ryzeLibrary') || '[]');
}
function saveLibrary(items, persist = true) {
localStorage.setItem('ryzeLibrary', JSON.stringify(items));
if (persist) {
saveUserData({ library: items });
}
}
function getActivity() {
return JSON.parse(localStorage.getItem('ryzeActivity') || '[]');
}
function saveActivity(items, persist = true) {
localStorage.setItem('ryzeActivity', JSON.stringify(items));
if (persist) {
saveUserData({ activity: items });
}
}
function addActivity(type, item = {}) {
const list = getActivity().filter((entry) => entry.id !== item.id || entry.type !== type);
list.unshift({
id: item.id || `${type}-${Date.now()}`,
type,
title: item.title || item.name || 'RyzePlus update',
artist: item.artist || '',
date: new Date().toISOString()
});
saveActivity(list.slice(0, 6));
renderActivity();
}
function renderActivity() {
const activityList = qs('#activityList');
if (!activityList) return;
const list = getActivity();
if (list.length === 0) {
activityList.innerHTML = '<p class="text-muted">No activity yet. Start saving tracks to see updates here.</p>';
return;
}
activityList.innerHTML = '';
const activityFragment = document.createDocumentFragment();
const labels = {
saved: 'Saved',
removed: 'Removed',
listened: 'Listened',
purchased: 'Purchased',
downloaded: 'Downloaded',
subscription: 'Subscribed'
};
list.forEach((entry) => {
const row = document.createElement('div');
row.className = 'activity-item';
const title = document.createElement('strong');
title.textContent = entry.title || 'RyzePlus update';
const meta = document.createElement('div');
meta.className = 'text-muted';
const detail = entry.artist ? ` · ${entry.artist}` : '';
meta.textContent = `${labels[entry.type] || 'Updated'}${detail} · ${formatDate(entry.date)}`;
row.appendChild(title);
row.appendChild(meta);
activityFragment.appendChild(row);
});
activityList.appendChild(activityFragment);
}
function incrementDownloads() {
const count = getDownloadCount() + 1;
setDownloadCount(count);
}
function triggerDownload(url, filename) {
if (!url || !isSafeUrl(url)) {
showNotice('Download link unavailable for this release.');
return;
}
const link = document.createElement('a');
link.href = url;
if (filename) link.download = filename;
link.target = '_blank';
link.rel = 'noopener noreferrer';
document.body.appendChild(link);
link.click();
link.remove();
}
function addToLibrary(item) {
const library = getLibrary();
if (!library.find((i) => i.id === item.id)) {
library.push({ id: item.id, title: item.title, artist: item.artist });
saveLibrary(library);
renderLibrary();
addActivity('saved', item);
}
}
function removeFromLibrary(id) {
const library = getLibrary();
const removed = library.find((i) => i.id === id);
const next = library.filter((i) => i.id !== id);
saveLibrary(next);
renderLibrary();
if (removed) addActivity('removed', removed);
}
function renderLibrary() {
if (!libraryList || !libraryCount) return;
const library = getLibrary();
libraryCount.textContent = String(library.length);
if (library.length === 0) {
libraryList.innerHTML = '<p class="text-muted">Save tracks from the library to see them here.</p>';
return;
}
libraryList.innerHTML = '';
const libraryFragment = document.createDocumentFragment();
library.forEach((item) => {
const row = document.createElement('div');
row.className = 'library-item';
const info = document.createElement('div');
const title = document.createElement('strong');
title.textContent = item.title || 'Untitled';
const artist = document.createElement('div');
artist.className = 'text-muted';
artist.textContent = item.artist || 'Unknown artist';
info.appendChild(title);
info.appendChild(artist);
const removeBtn = document.createElement('button');
removeBtn.type = 'button';
removeBtn.className = 'btn btn-ghost btn-sm';
removeBtn.textContent = 'Remove';
if (item.id) removeBtn.dataset.remove = item.id;
row.appendChild(info);
row.appendChild(removeBtn);
libraryFragment.appendChild(row);
});
libraryList.appendChild(libraryFragment);
qsa('[data-remove]', libraryList).forEach((btn) => {
btn.addEventListener('click', () => removeFromLibrary(btn.getAttribute('data-remove')));
});
}
function renderCatalogStats() {
if (!catalogStats) return;
const counts = {
total: musicData.length,
single: musicData.filter((item) => (item.type || '').toLowerCase() === 'single').length,
album: musicData.filter((item) => (item.type || '').toLowerCase() === 'album').length,
ep: musicData.filter((item) => (item.type || '').toLowerCase() === 'ep').length,
collab: musicData.filter((item) => (item.type || '').toLowerCase() === 'collab').length
};
catalogStats.innerHTML = `
      <div class="stat-pill"><strong>${counts.total}</strong><span>Releases</span></div>
      <div class="stat-pill"><strong>${counts.single}</strong><span>Singles</span></div>
      <div class="stat-pill"><strong>${counts.album}</strong><span>Albums</span></div>
      <div class="stat-pill"><strong>${counts.ep}</strong><span>EPs</span></div>
      <div class="stat-pill"><strong>${counts.collab}</strong><span>Collabs</span></div>
    `;
}
function renderMusic(list) {
if (!musicGrid) return;
musicGrid.innerHTML = '';
if (!list || list.length === 0) {
if (noResults) noResults.classList.remove('d-none');
return;
}
if (noResults) noResults.classList.add('d-none');
const library = getLibrary();
const musicFragment = document.createDocumentFragment();
list.forEach((item) => {
const col = document.createElement('div');
col.className = 'col-sm-6 col-lg-4';
col.setAttribute('data-reveal', 'true');
const card = document.createElement('div');
card.className = 'music-card hover-lift';
const img = document.createElement('img');
img.className = 'music-cover';
img.alt = item.title || 'cover';
const imageUrl = safeUrl(item.image);
if (imageUrl) {
img.src = imageUrl;
} else {
img.removeAttribute('src');
}
img.loading = 'lazy';
img.decoding = 'async';
const bodyEl = document.createElement('div');
bodyEl.className = 'music-body';
const title = document.createElement('h5');
title.className = 'mb-1';
title.textContent = item.title || 'Untitled';
const meta = document.createElement('div');
meta.className = 'music-meta';
meta.textContent = `${item.artist || 'Unknown artist'} · ${item.type || 'release'}${item.releaseDate ? ' · ' + formatDate(item.releaseDate) : ''}`;
const actions = document.createElement('div');
actions.className = 'music-actions';
const listenBtn = document.createElement('a');
listenBtn.className = 'btn btn-outline-dark btn-sm';
listenBtn.textContent = 'Listen';
listenBtn.target = '_blank';
listenBtn.rel = 'noopener noreferrer';
const listenUrl = safeUrl(item.listenLink);
listenBtn.href = listenUrl || '#';
if (!listenUrl) {
listenBtn.setAttribute('aria-disabled', 'true');
listenBtn.classList.add('disabled');
}
const downloadBtn = document.createElement('button');
downloadBtn.type = 'button';
downloadBtn.className = 'btn btn-primary btn-sm';
const downloadUrl = safeUrl(item.downloadLink);
const hasDownload = Boolean(downloadUrl);
downloadBtn.textContent = hasDownload ? 'Download' : 'Download unavailable';
downloadBtn.disabled = !hasDownload;
downloadBtn.setAttribute('aria-disabled', String(!hasDownload));
const saveBtn = document.createElement('button');
saveBtn.type = 'button';
saveBtn.className = 'btn btn-ghost btn-sm';
const isSaved = library.find((i) => i.id === item.id);
saveBtn.textContent = isSaved ? 'Saved' : 'Save';
listenBtn.addEventListener('click', (event) => {
if (!listenUrl) {
event.preventDefault();
return;
}
addActivity('listened', item);
});
downloadBtn.addEventListener('click', () => {
if (!downloadUrl) {
showNotice('Download link unavailable for this release.');
return;
}
triggerDownload(downloadUrl, `${item.title || 'track'}.flac`);
incrementDownloads();
addActivity('downloaded', item);
});
saveBtn.addEventListener('click', () => {
const exists = getLibrary().find((i) => i.id === item.id);
if (exists) {
removeFromLibrary(item.id);
saveBtn.textContent = 'Save';
} else {
addToLibrary(item);
saveBtn.textContent = 'Saved';
}
if (musicGrid) applyFilters();
});
actions.appendChild(listenBtn);
actions.appendChild(downloadBtn);
actions.appendChild(saveBtn);
bodyEl.appendChild(title);
bodyEl.appendChild(meta);
bodyEl.appendChild(actions);
card.appendChild(img);
card.appendChild(bodyEl);
col.appendChild(card);
musicFragment.appendChild(col);
});
musicGrid.appendChild(musicFragment);
registerReveal(musicGrid);
}
function updateResultsCount(total, shown) {
if (!resultsCount) return;
if (showAll) {
resultsCount.textContent = `Showing ${total} releases`;
return;
}
resultsCount.textContent = `Showing ${Math.min(shown, total)} of ${total} releases`;
}
function applyFilters() {
const q = (searchInput && searchInput.value || '').toLowerCase().trim();
let filtered = musicData.slice();
if (currentFilter && currentFilter !== 'all') {
filtered = filtered.filter((i) => (i.type || '').toLowerCase() === currentFilter.toLowerCase());
}
if (savedOnly) {
const savedIds = new Set(getLibrary().map((item) => item.id));
filtered = filtered.filter((item) => savedIds.has(item.id));
}
if (q) {
filtered = filtered.filter((i) => ((i.title || '') + ' ' + (i.artist || '')).toLowerCase().includes(q));
}
if (sortBy === 'title') {
filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
} else if (sortBy === 'oldest') {
filtered.sort((a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0));
} else {
filtered.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
}
const toShow = showAll ? filtered : filtered.slice(0, LATEST_LIMIT);
renderMusic(toShow);
updateResultsCount(filtered.length, toShow.length);
}
async function loadMusic() {
if (!musicGrid) return;
try {
musicGrid.innerHTML = '<div class="col-12 text-center py-4">Loading music…</div>';
const forceFresh = sessionStorage.getItem('ryzeForceFresh') === '1';
if (forceFresh) sessionStorage.removeItem('ryzeForceFresh');
const url = forceFresh ? `${GIST_URL}?t=${Date.now()}` : GIST_URL;
const res = await fetch(url, forceFresh ? { cache: 'no-store' } : undefined);
if (!res.ok) throw new Error('Fetch failed: ' + res.status);
const raw = await res.json();
if (Array.isArray(raw)) {
musicData = raw.filter((item) => {
const t = (item.type || '').toLowerCase().trim();
if (t === 'album-track' || t === 'albumtrack') return false;
return ALLOWED_TYPES.has(t);
});
} else {
musicData = [];
}
renderCatalogStats();
applyFilters();
} catch (err) {
musicGrid.innerHTML = '<div class="col-12 text-center text-danger py-4">Unable to load music list.</div>';
console.error(err);
}
}
const viewOptions = qsa('.view-option');
const viewToggleBtn = qs('#viewToggleBtn');
if (viewToggleBtn) {
viewToggleBtn.textContent = showAll ? 'Showing: All releases' : `Showing: Latest ${LATEST_LIMIT}`;
}
viewOptions.forEach((opt) => {
const mode = opt.getAttribute('data-show');
const isActive = showAll ? mode === 'all' : mode === 'latest';
opt.classList.toggle('active', isActive);
});
viewOptions.forEach((opt) => {
opt.addEventListener('click', (e) => {
e.preventDefault();
const mode = opt.getAttribute('data-show');
showAll = (mode === 'all');
persistLibraryFilters(searchInput ? searchInput.value.trim() : '');
viewOptions.forEach((o) => o.classList.remove('active'));
opt.classList.add('active');
if (viewToggleBtn) {
viewToggleBtn.textContent = showAll ? 'Showing: All releases' : `Showing: Latest ${LATEST_LIMIT}`;
}
applyFilters();
});
});
if (searchInput) {
if (storedSearch) searchInput.value = storedSearch;
searchInput.addEventListener('input', () => {
persistLibraryFilters(searchInput.value.trim());
applyFilters();
});
}
if (searchClear) {
searchClear.addEventListener('click', () => {
if (searchInput) searchInput.value = '';
persistLibraryFilters('');
applyFilters();
});
}
filterChips.forEach((chip) => {
const chipFilter = chip.getAttribute('data-filter') || 'all';
if (chipFilter === currentFilter) {
filterChips.forEach((c) => c.classList.remove('active'));
chip.classList.add('active');
}
chip.addEventListener('click', () => {
currentFilter = chip.getAttribute('data-filter') || 'all';
persistLibraryFilters(searchInput ? searchInput.value.trim() : '');
filterChips.forEach((c) => c.classList.remove('active'));
chip.classList.add('active');
applyFilters();
});
});
if (savedOnlyToggle) {
savedOnlyToggle.checked = savedOnly;
savedOnlyToggle.addEventListener('change', () => {
savedOnly = savedOnlyToggle.checked;
persistLibraryFilters(searchInput ? searchInput.value.trim() : '');
applyFilters();
});
}
if (sortSelect) {
if (sortBy) sortSelect.value = sortBy;
sortSelect.addEventListener('change', () => {
sortBy = sortSelect.value;
persistLibraryFilters(searchInput ? searchInput.value.trim() : '');
applyFilters();
});
}
const profileCompletionBar = qs('#profileCompletionBar');
const profileCompletionText = qs('#profileCompletionText');
function updateProfileCompletion() {
if (!profileCompletionBar || !profileCompletionText) return;
if (!currentUser) {
profileCompletionBar.style.width = '0%';
profileCompletionText.textContent = 'Complete your profile to unlock perks.';
return;
}
let score = 0;
const total = 4;
if (currentUser.displayName) score += 1;
if (currentUser.emailVerified) score += 1;
if (profileNote && profileNote.value.trim()) score += 1;
const hasPrefs = [prefEmails, prefDrops, prefOffline, prefUpdates].some((pref) => pref && pref.checked);
if (hasPrefs) score += 1;
const percent = Math.round((score / total) * 100);
profileCompletionBar.style.width = `${percent}%`;
profileCompletionText.textContent = `${percent}% complete · ${score} of ${total} steps`;
}
function initializeDashboardStats() {
if (downloadCount) {
downloadCount.textContent = String(getDownloadCount());
}
}
updateMembershipStatus();
updateBillingPanel();
renderLibrary();
renderActivity();
initializeDashboardStats();
initReveal();
initOnboarding();
initFirebase();
loadMusic();
updateSecurityPanel();
updateProfileCompletion();
});














