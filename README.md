
# Enrollment Hub (Static)

This repo contains your Enrollment Hub frontend:
- **dashboard/** — Home Dashboard (v11)
- **admin-portal/** — Admin Portal (v7, password: `music1234`, session-only gate)
- **studio-central/** — Placeholder; replace with your Studio Central files when ready
- **index.html** — Redirects to the dashboard
- **404.html** — Fallback for GitHub Pages
- **.nojekyll** — Ensures static assets serve without Jekyll processing

## Quick Start (Local)
Just open `dashboard/index.html` in your browser. All data persists using `localStorage` in your browser.

## Deploy to GitHub Pages
1. Create a new GitHub repo (e.g., `enrollment-hub`).
2. Upload **all** files from this folder to the repo root (or push with git).
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, set:
   - **Source**: *Deploy from a branch*
   - **Branch**: *main* (or *master*), **/ (root)**
5. Click **Save**. After 1–2 minutes, your site will be live at the URL GitHub shows.
6. Visit `https://<your-username>.github.io/<repo-name>/` to view. It will redirect to `/dashboard/`.

### Updating
- Edit content in the **Admin Portal**. Changes are saved in the browser’s `localStorage` only. To reset, clear site data in your browser dev tools.
- If you need real logins or shared storage across computers, we can connect to a backend later and swap the `DataService` with API calls.

## Folder Structure
```
/
├── admin-portal/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── dashboard/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── studio-central/
│   └── index.html  (placeholder)
├── index.html       (redirects to dashboard/)
├── 404.html
└── .nojekyll
```

## Notes
- **Admin password** is a simple client-side check (`music1234`). It prevents casual access on GitHub Pages but isn't secure against determined users. For real auth, we can add Netlify/Cloudflare/Auth0 later.
- The **Dashboard → Admin Portal** link opens in a new tab.
- If you move folders, update relative links in nav bars accordingly.
