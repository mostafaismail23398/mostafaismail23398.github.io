# Portfolio + Content Dashboard (Netlify + Decap CMS)

A conventional portfolio site whose content (name, bio, skills, projects,
experience, contact info) lives in `content/data.json`. You edit that content
through a real dashboard at `/admin` — no code editing needed after setup.

## How it works

- `index.html` + `css/style.css` + `js/main.js` — the public site. It fetches
  `content/data.json` and renders everything from it.
- `content/data.json` — all your editable content in one file.
- `admin/` — the dashboard (Decap CMS). It edits `content/data.json` and
  commits the change straight to your GitHub repo. Netlify then
  auto-rebuilds and redeploys your site — usually within ~30 seconds.

## 1. Push this to GitHub

```bash
cd portfolio-site
git init
git add .
git commit -m "Initial portfolio + CMS"
git branch -M main
git remote add origin https://github.com/mostafaismail23398/portfolio-site.git
git push -u origin main
```

## 2. Connect the repo to Netlify

1. Go to https://app.netlify.com → **Add new site** → **Import an existing project**.
2. Pick GitHub, authorize, and select your `portfolio-site` repo.
3. Build settings: leave **Build command** empty and **Publish directory** as
   `/` (this is a static site, no build step needed).
4. Click **Deploy site**. You'll get a URL like `random-name-123.netlify.app`
   (you can rename it later in Site settings → Domain management).

## 3. Turn on the dashboard (Netlify Identity + Git Gateway)

This is what makes `/admin` actually work and lets you log in.

1. In your Netlify site dashboard: **Site configuration → Identity → Enable Identity**.
2. Under Identity settings, set **Registration** to **Invite only** (so
   strangers can't sign up to your dashboard).
3. Still under Identity: **Services → Git Gateway → Enable Git Gateway**.
   This is what lets the dashboard commit changes to GitHub on your behalf,
   without you creating a GitHub personal access token yourself.
4. Go to the **Identity** tab (top-level, next to Deploys) → **Invite users**
   → enter your own email.
5. Check your email, click the invite link — it'll ask you to set a password
   on your site's domain.

## 4. Use the dashboard

Visit `https://your-site.netlify.app/admin/`, log in with the account you
just created, and you'll see editable sections: Hero, About, Skills,
Projects, Experience, Contact. Edit anything, hit **Publish**, and the live
site updates automatically after Netlify rebuilds (~30 seconds).

## 5. Local preview (optional, before pushing)

Since the page loads `content/data.json` via `fetch()`, opening `index.html`
directly as a file won't work (browsers block `fetch` on `file://` URLs).
Run a tiny local server instead:

```bash
cd portfolio-site
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

- Update the placeholder email/GitHub/Upwork links in `content/data.json`
  once via the dashboard after your first deploy — everything else already
  reflects your real projects and skills.
- If you'd rather keep GitHub Pages instead of Netlify, you can still host
  the *public site* there, but the `/admin` dashboard specifically requires
  Netlify Identity + Git Gateway (or a self-hosted OAuth provider) to
  authenticate — that's the trade-off of a free, code-free dashboard.
# portfolio-site
# Mostafa-ismail.github.io
