/* PWA install prompt and service-worker registration */
(() => {
  let installPrompt = null;
  const addInstallButton = () => {
    if (document.getElementById('wcInstallAppBtn')) return;
    const header = document.querySelector('header > div');
    if (!header) return;
    const button = document.createElement('button');
    button.id = 'wcInstallAppBtn';
    button.type = 'button';
    button.hidden = true;
    button.textContent = 'অ্যাপ ইনস্টল';
    button.setAttribute('aria-label', 'WorkCulvert অ্যাপ ইনস্টল করুন');
    button.style.cssText = 'border:1px solid #78d6b0;background:#e0f8ed;color:#075b45;border-radius:10px;padding:8px 12px;font-weight:800;font-size:12px;cursor:pointer;margin-left:8px';
    const nav = header.querySelector('div:last-child') || header;
    nav.appendChild(button);
    button.addEventListener('click', async () => {
      if (installPrompt) {
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
        button.hidden = true;
      } else {
        alert('ব্রাউজারের মেনু থেকে “Install app” বা “Add to Home Screen” নির্বাচন করুন।');
      }
    });
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); installPrompt = event; button.hidden = false;
    });
    window.addEventListener('appinstalled', () => { installPrompt = null; button.hidden = true; });
  };
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.warn('PWA service worker registration failed:', err)));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addInstallButton); else addInstallButton();
})();
