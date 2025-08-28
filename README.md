# IE2324CH1 Investment Game

A lightweight, GitHub Pages–friendly web app used in IE 2324 to teach portfolio choices and tradeoffs under constraints. Students assemble a tiny stock portfolio under a $100 budget; instructors monitor live submissions, simulate monthly events, and show a leaderboard.

---

## What the app does

### Student tools
- **Portfolio builder (`docs/data/invest-portfolio.html`)**  
  - Fields: **Name**, **Section** (001, 002, 003, D01), **Semester** (FALL, SPRING).  
  - **Budget = $100**; **whole shares only** via ± buttons (no typing).  
  - **Max 5 stocks**; live **Spent / Remaining** and per‑stock **Subtotal**.  
  - **Submit** stays disabled until: name present, semester + section picked, ≤ $100, 1–5 stocks chosen.  
  - POST payload to the Apps Script endpoint:  
    ```json
    { "semester": "FALL", "section": "001", "name": "Jane Doe",
      "uid": "<localStorage uuid>", "allocations": [ { "stockId": "AAPL", "shares": 2, "price": 25, "amount": 50 } ],
      "cash": 50.00 }
    ```

- **Stocks browser (`docs/data/stocks.html`)**  
  - Shows **10 TTU‑themed stocks** with name, sector, price, and description.  
  - **Historical chart** with labeled axes (x = Month, y = Price $).  
  - **Local QR generator**: choose Semester/Section, get a QR that deep‑links to the invest page.

- **Big QR screen (`docs/data/qr.html`)**  
  - Full‑screen QR for projection, with Semester/Section selectors.  
  - Uses **prebuilt local PNG** QRs, so it works offline.

### Instructor dashboard (`docs/data/dashboard-portfolio.html`)
- Filters by **Semester** and **Section**.  
- KPI tiles: **Submissions**, **Unique Students**, **Avg stocks/portfolio**, **Total $ allocated**.  
- **Recent submissions** table (last 10).  
- **Holdings by stock** bar chart.  
- **Portfolio mix by sector** table + **pie chart**.  
- **Top 10 leaderboard** (applies month‑by‑month event multipliers).  
- **Timeline events** panel with month tabs; **chips** toggle multipliers.  
- **Load Preset** buttons for FALL/SPRING event sets, plus **Random Events**.  
- **Admin actions**: **Export CSV** and **Reset data** (requires token).

---

## Data & files

- `docs/data/stocks.json` — 10 instruments with `id`, `name`, `price`, `sector`, `desc` + default symbol order.  
- `docs/data/historical.json` — 5‑month price series for `2024-Fall` and `2025-Spring`.  
- `docs/data/presets/fall.json`, `docs/data/presets/spring.json` — month‑level event definitions.  
- `docs/data/qr/*.png` — local, pre‑generated QR images for `FALL|SPRING × 001|002|003|D01`.  
- `docs/ttu-dark.css` — polished dark theme, accessible contrast.  

> Deployment target: GitHub Pages serving from the **`/docs`** folder. Open `docs/data/index.html` (same as `home.html`).

---

## Backend (Google Apps Script)

File: `backend/Code.gs`

### Deploy
1. Paste `Code.gs` into an Apps Script project bound to your Sheet.  
2. Set **Script property** `ADMIN_TOKEN` to a secret value (e.g., `abc123`).  
3. Deploy **Web app**: *Execute as* **Me**, *Who has access* **Anyone with link**.  
4. Copy the deployment URL and update `SCRIPT_URL` in the frontend if needed.

### API

- **POST** — record a submission  
  Body (x‑www‑form‑urlencoded): `semester, section, name, uid, allocations, cash`  
  Writes: `Timestamp, Semester, Section, Name, UID, AllocationsJSON, Cash`

- **GET**  
  - `?mode=tally&semester=FALL&section=001` → `{ ok, count, totals{stockId: dollars} }`  
  - `?mode=submissions&semester=FALL&section=001` → `{ ok, recent[ {ts, name, uid, picks, cash} ] }`  
  - `?mode=leaderboard&semester=FALL&section=001&prices=<json>&timeline=<json>` → `{ ok, finalPrices, top10[] }`  
  - `?mode=export_csv&semester=FALL&section=001` → **CSV** download of matching submissions  
  - `?mode=reset&token=YOUR_TOKEN` → clears the “Submissions” sheet (keeps header)

> Security note: the reset endpoint requires the **ADMIN_TOKEN** script property. CSV export is read‑only.

---

## QR generation (offline)

To avoid external services, the app ships with **local PNG QRs** covering all Semester/Section pairs.  
- Files live in `docs/data/qr/` and encode links like `invest-portfolio.html?semester=FALL&section=001`.  
- The Stocks and Big‑QR pages simply switch the `<img>` source to the matching file, so it works offline.

If you later add sections, regenerate images (or ask me to extend the generator).

---

## Extending / tips

- Add more stocks by editing `docs/data/stocks.json`.  
- Update semester timelines via `docs/data/presets/*.json`.  
- For a clean slate, use Dashboard → **Reset data** (token required).  
- Prefer lightweight assets and CDN Chart.js for fast loads on student phones.

---

## License & attribution

This teaching tool is intended for course use. Replace names and prices with your own semester data as needed.
