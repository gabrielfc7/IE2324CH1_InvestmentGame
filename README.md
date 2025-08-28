# IE2324CH1 Investment Game — Full Spec v3

Implements student and instructor flows per your spec.

- **Invest**: Name, Section, Semester; $100 cap; whole shares via +/-; max 5 stocks; live spent/remaining; disabled submit until valid; POST payload fields: semester, section, name, uid, allocations (JSON), cash.
- **Stocks**: 10 stock cards, historical chart with axes, QR generator to deep-link into invest page.
- **QR Screen**: Big QR with live Semester/Section.
- **Dashboard**: Semester/Section filters, KPI tiles, recent submissions, holdings bar chart, sector table + pie, Top 10 Leaderboard, timeline event chips with presets and random events.
- **Backend (Code.gs)**: POST stores row; GET supports `mode=tally`, `mode=submissions`, `mode=leaderboard` (applies multipliers).

Deployment: GitHub Pages serving `/docs` directory.

Apps Script URL used:
https://script.google.com/macros/s/AKfycbxZbR2iFcuCP76p1fDt0ew3wMqhGRF1c_0_Q64soIUY_c4qazR3FIegSzwsfLW73bdk/exec
