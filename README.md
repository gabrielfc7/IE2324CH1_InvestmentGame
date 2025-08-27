# IE2324 Class Investment Game (Dark, Multi‑Semester)
Interactive activity for Engineering Economics (Module 1). Students build $100 portfolios (up to 5 picks out of 10 stocks). You simulate Fall or Spring month‑by‑month events and project live results.

## Quick Start (10–15 min)
1. **Create a Google Sheet** with this exact header in Row 1:
```
timestamp | semester | section | uid | allocations_json | cash
```
2. **Apps Script backend**
   - In the Sheet: Extensions, Apps Script.
   - Paste the code from `backend/Code.gs`.
   - Deploy, New deployment, Web app.
   - Execute as **Me**, Who has access **Anyone**, Deploy.
   - Copy the **Web app URL**.
3. **Configure the site**
   - In `/site/invest-portfolio.html` and `/site/dashboard-portfolio.html`, set `const SCRIPT_URL = "<your web app URL>"`.
4. **Publish on GitHub Pages**
   - Push the whole repo.
   - In GitHub, Settings, Pages, Source = your default branch, Folder = `/site`.
   - Open `https://<your-username>.github.io/<repo>/site/home.html`.

## Classroom Flow
1. Project **home.html**.
2. Let students scan **stocks.html** for 2 minutes to read prices and historical minis.
3. Share QR to **invest-portfolio.html?section=001&semester=FALL** (adjust for section). Give 3 minutes to submit.
4. Open **dashboard-portfolio.html**, select Semester and Section, click **Load Preset** (Fall or Spring), then **Apply Timeline**.
5. Show **Holdings**, **Price Paths**, and the **Top 10** leaderboard. Discuss how events flip winners.

## Files
- `site/home.html` – hub page (dark, with back buttons).
- `site/stocks.html` – prices, descriptions, historical sparklines.
- `site/invest-portfolio.html` – students submit portfolios (Section + Semester).
- `site/dashboard-portfolio.html` – instructor dashboard (presets, timeline, charts, Top 10).
- `site/ttu-dark.css` – dark theme.
- `site/stocks.json` – base stock list and prices.
- `site/data/presets/fall.json`, `site/data/presets/spring.json` – event multipliers by month.
- `site/data/historical.json` – past price series for sparklines.
- `backend/Code.gs` – Google Apps Script backend.

## Tips
- **Sections & Semester**: Dashboard filters by both; you can run multiple sections in the same semester.
- **Top 10 only**: The leaderboard returns just the first 10.
- **Randomize** for a quick demo, or **Load Preset** for TTU‑flavored defaults.
- **Privacy**: No PII is collected. `uid` is a random localStorage token.
- **Resetting**: To clear data, wipe rows from the Sheet (keep the header intact).

## Troubleshooting
- **Submissions not showing**: Ensure the Web App access is set to **Anyone** and `SCRIPT_URL` matches the latest deployment.
- **Charts empty**: Verify `stocks.json` is reachable from GitHub Pages. Open dev tools, Network.

## License
MIT – use and adapt for your classes.
