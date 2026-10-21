# Semi-automate WA broadcast (Google Sheets)

Generate personalized invitation messages from a guest list in **column A** (from row 2).

## Setup (one time)

1. Create a Google Sheet.
2. **Row 1 headers** (suggested):
   - `A1`: `Nama`
   - `B1`: `Pesan WA`
   - `C1`: `Buka WA` (optional)
3. Put guest names in **A2, A3, …** (one name per row).
4. **Extensions → Apps Script** — delete any sample code and paste the contents of [`Code.gs`](./Code.gs).
5. In Apps Script: **Project Settings** (gear) → enable **Show "appsscript.json" manifest file in editor"** → open `appsscript.json` and set `"runtimeVersion": "V8"` (or paste from [`appsscript.json`](./appsscript.json) here).
6. Save the project (e.g. name it `WA Broadcast`).
7. Reload the spreadsheet. Approve permissions when prompted the first time you run the script.
8. Menu **Undangan WA → Generate pesan** (or run `generateMessages` once).

> **Emoji / 🙏 broken in WA link?** The old Apps Script engine (Rhino) mangles emoji when building `?text=`. You must use **V8** (step 5), then run **Generate pesan** again.

Column **B** fills with the full message; each link uses  
`https://momentpages.github.io/vera-edityo/?to=` + URL-encoded name from column A.

## Daily use

1. Add or edit names in column A.
2. **Undangan WA → Generate pesan**.
3. Copy **B2** (or use **C2** “Buka WA” on phone) → paste/send in WhatsApp.

## Optional: open WhatsApp with text prefilled

Column C builds `https://api.whatsapp.com/send/?text=…` (mobile-friendly). Tap the link, pick the contact, send.

## Change site URL or template

Edit constants at the top of `Code.gs` (`SITE_URL`, `messageForName`).

## Local preview (no Google)

```bash
python3 tools/wa-broadcast/preview.py "Vera Isnaini"
```
