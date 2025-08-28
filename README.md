# IE2324CH1 Investment Game — Rebuilt UI

All pages rebuilt with a polished dark theme and stricter requirements:

- One clean navigation across the site (no duplicates).
- **Portfolio**: whole shares only via +/- buttons, typing disabled, estimated cost shown, posts to your Apps Script endpoint through a **hidden iframe** to prevent CORS/network errors.
- **Stocks**: Chart.js line chart with **axis labels** and legend. QR code section points to the Apps Script URL.
- **Dashboard**: Stub for future aggregation from the spreadsheet.
- **Home/Index**: Landing cards and quick-start guidance.

Apps Script URL used:
https://script.google.com/macros/s/AKfycbxZbR2iFcuCP76p1fDt0ew3wMqhGRF1c_0_Q64soIUY_c4qazR3FIegSzwsfLW73bdk/exec

## Structure
- `backend/Code.gs` — sample handler for Google Apps Script
- `docs/ttu-dark.css` — site theme
- `docs/data/` — pages and JSON data
