/**
 * Google Apps Script backend for IE2324CH1 Investment Game
 * Deploy as Web App, "Execute as: Me", "Who has access: Anyone with the link".
 */

function doPost(e) {
  try {
    var payload = e.parameter || {};
    var ts = new Date();
    var sheet = getSheet_("Submissions");
    sheet.appendRow([ts, payload.stockA || 0, payload.stockB || 0, payload.section || "", payload.user || ""]);
    return ContentService.createTextOutput(JSON.stringify({status:"ok"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error", message: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Investment Game backend is running.");
}

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(["Timestamp","StockA","StockB","Section","User"]);
  }
  return sh;
}
