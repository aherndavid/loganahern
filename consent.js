/* ============================================================
   Cookie consent + Google Analytics
   Analytics only loads AFTER the visitor clicks "Accept".
   SETUP: replace the ID below with your GA4 Measurement ID
   (Google Analytics > Admin > Data streams > your site).
   ============================================================ */
(function () {
    const GA_ID = 'G-XXXXXXXXXX';
    const KEY = 'logan-cookie-consent'; // stores "granted" or "denied"

    function getChoice() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function saveChoice(value) {
        try { localStorage.setItem(KEY, value); } catch (e) {}
    }

    function loadAnalytics() {
        if (window.__gaLoaded || GA_ID.includes('XXXX')) return;
        window.__gaLoaded = true;
        window['ga-disable-' + GA_ID] = false;
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_ID, {
            allow_google_signals: false,          // no cross-device / ads tracking
            allow_ad_personalization_signals: false
        });
    }

    function removeAnalytics() {
        window['ga-disable-' + GA_ID] = true;
        // Delete any _ga cookies on this domain and its parent domain
        const host = location.hostname;
        const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
        document.cookie.split(';').forEach(c => {
            const name = c.split('=')[0].trim();
            if (name.startsWith('_ga')) {
                domains.forEach(d => {
                    document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
                });
            }
        });
    }

    /* ---------- Banner ---------- */
    const css = `
    #cookie-banner{position:fixed;left:1rem;right:1rem;bottom:calc(1rem + env(safe-area-inset-bottom,0px));z-index:60;
      max-width:34rem;margin-left:auto;background:rgba(18,18,18,.96);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,.1);border-radius:.5rem;padding:1.5rem;color:#f4f4f5;
      box-shadow:0 20px 40px -10px rgba(0,0,0,.8);font-family:"Orbitron",sans-serif;
      transform:translateY(12px);opacity:0;transition:opacity .4s ease,transform .4s ease}
    #cookie-banner.show{transform:none;opacity:1}
    #cookie-banner h2{font-size:.75rem;letter-spacing:.25em;text-transform:uppercase;margin:0 0 .75rem;font-weight:400}
    #cookie-banner p{font-size:.8rem;line-height:1.6;color:#a1a1aa;margin:0 0 1.25rem}
    #cookie-banner a{color:#f4f4f5;text-decoration:underline;text-decoration-color:rgba(255,255,255,.3)}
    #cookie-banner a:hover{color:#c77dff;text-decoration-color:#9d4edd}
    #cookie-banner .cb-actions{display:flex;gap:.75rem;flex-wrap:wrap}
    #cookie-banner button{flex:1 1 8rem;padding:.8rem 1rem;border-radius:9999px;font:inherit;font-size:.7rem;
      letter-spacing:.2em;text-transform:uppercase;cursor:pointer;background:transparent;color:#f4f4f5;
      border:1px solid rgba(255,255,255,.25);transition:border-color .3s,color .3s,background-color .3s}
    #cookie-banner button:hover{border-color:#9d4edd;color:#c77dff}
    #cookie-banner button:focus-visible{outline:2px solid #c77dff;outline-offset:3px}
    @media (prefers-reduced-motion:reduce){#cookie-banner{transition:none}}`;

    function showBanner() {
        if (document.getElementById('cookie-banner')) return;
        if (!document.getElementById('cookie-banner-css')) {
            const style = document.createElement('style');
            style.id = 'cookie-banner-css';
            style.textContent = css;
            document.head.appendChild(style);
        }
        const el = document.createElement('div');
        el.id = 'cookie-banner';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-labelledby', 'cookie-banner-title');
        el.innerHTML = `
            <h2 id="cookie-banner-title">Cookies</h2>
            <p>Can we use analytics cookies to see how people find and use this site? They help improve it and are never used for advertising. <a href="cookies.html">Cookie policy</a></p>
            <div class="cb-actions">
                <button type="button" data-choice="denied">Reject</button>
                <button type="button" data-choice="granted">Accept</button>
            </div>`;
        el.addEventListener('click', e => {
            const choice = e.target.getAttribute && e.target.getAttribute('data-choice');
            if (!choice) return;
            saveChoice(choice);
            if (choice === 'granted') loadAnalytics(); else removeAnalytics();
            el.classList.remove('show');
            setTimeout(() => el.remove(), 400);
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    }

    // Footer "Cookie settings" link calls this so visitors can change their mind
    window.openCookieSettings = function () {
        showBanner();
        const btn = document.querySelector('#cookie-banner button');
        if (btn) btn.focus();
    };

    function init() {
        const choice = getChoice();
        if (choice === 'granted') loadAnalytics();
        else if (choice !== 'denied') showBanner();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
