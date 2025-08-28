# IE2324CH1 Investment Game

This is the full project tree for the practical activity.

## Structure

- `backend/Code.gs` – Apps Script backend (deploy as Web App, access: Anyone with the link)
- `docs/data/*.html` – site pages
- `docs/data/stocks.json` – sample time series for Chart.js
- `docs/data/presets/*.json` – course presets
- `docs/ttu-dark.css` – site-wide dark theme

`docs/data/index.html` redirects to `home.html`.

### Notes
- Portfolio page enforces whole-share changes via ± buttons. Inputs are hidden, no typing allowed.
- If you want a real QR image, replace `docs/data/qr.png` with your own. The image is displayed on the Stocks page.
