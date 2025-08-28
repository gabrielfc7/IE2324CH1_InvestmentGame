/**
 * Google Apps Script backend for IE2324CH1 Investment Game
 * Deploy as Web App (Execute as: Me; Access: Anyone with the link)
 * Connects to Submissions sheet.
 */
function doPost(e) {
  try {
    var p = e.parameter || {};
    var sh = getSheet_("Submissions");
    var row = [new Date(), p.section || "", p.user || ""];
    var tickers = Object.keys(p).filter(k => k !== "section" && k !== "user");
    tickers.sort().forEach(t => row.push(t, Number(p[t] || 0)));
    sh.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(){return HtmlService.createHtmlOutput("OK");}
function getSheet_(name){var ss=SpreadsheetApp.getActive();var sh=ss.getSheetByName(name);if(!sh){sh=ss.insertSheet(name);}return sh;}
