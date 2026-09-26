# OpenStudio — openstudio.opendev-labs.com

This is the **standalone Vercel deployment** for the OpenStudio AI Builder app,
served at `https://openstudio.opendev-labs.com`.

It re-uses shared code from the parent `opendev-labs.com` monorepo
(path-aliased via `vite.config.ts`).

---

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. Push the monorepo to GitHub
Make sure `openstudio/` is committed and pushed to GitHub.

### 2. Create a new Vercel project
- Go to [vercel.com/new](https://vercel.com/new)
- Import the **same GitHub repo** (`opendev-labs.com`)
- Set the **Root Directory** to: `openstudio`

### 3. Configure build settings in Vercel UI
| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `openstudio` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install --legacy-peer-deps` |

### 4. Add the subdomain in Vercel
- Go to your project → **Settings → Domains**
- Add: `openstudio.opendev-labs.com`
- Vercel will give you a DNS record to add

### 5. Add DNS record in your domain registrar
Add a **CNAME** record:
| Type | Name | Value |
|---|---|---|
| CNAME | `openstudio` | `cname.vercel-dns.com` |

That's it! After DNS propagates (~5–60 min), the app will be live at `openstudio.opendev-labs.com`.

---

## 🛠 Local Dev

```bash
cd openstudio
npm install --legacy-peer-deps
npm run dev
# Runs on http://localhost:5174
```

---

## 📁 Project Structure

```
openstudio/
├── index.html          # Entry HTML (for openstudio.opendev-labs.com)
├── vercel.json         # Vercel config for this sub-project
├── vite.config.ts      # Path aliases into ../src (parent monorepo)
├── tailwind.config.js  # Scans parent src for class usage
├── tsconfig.json       # TS paths aliases
├── package.json        # Only deps needed by studio feature
└── src/
    ├── main.tsx        # React root entry
    ├── App.tsx         # BrowserRouter + StudioApp (mounted at /)
    └── index.css       # Global CSS + Tailwind + CSS variables
```

Shared code is resolved from the parent `../src/` via Vite aliases — **no duplication**.
