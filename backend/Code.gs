/**
 * IE2324CH1 Investment Game Backend
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone (or Anyone with link)
 *
 * Sheets:
 *   - "Submissions" columns: Timestamp, Semester, Section, Name, UID, AllocationsJSON, Cash
 */

function doPost(e) {
  try {
    var p = e.parameter || {};
    var semester = (p.semester || "").toUpperCase();
    var section = (p.section || "").toUpperCase();
    var name = p.name || "";
    var uid = p.uid || "";
    var allocations = p.allocations || "[]";
    var cash = Number(p.cash || 0);
    var sh = getSheet_("Submissions");
    sh.appendRow([new Date(), semester, section, name, uid, allocations, cash]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var mode = (e.parameter.mode || "").toLowerCase();
  if (!mode) return ContentService.createTextOutput("OK");
  if (mode === "tally") return getTally_(e);
  if (mode === "submissions") return getSubmissions_(e);
  if (mode === "leaderboard") return getLeaderboard_(e);
  return ContentService.createTextOutput(JSON.stringify({ ok:false, error:"Unknown mode" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Helpers ----
function getSheet_(name) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(["Timestamp","Semester","Section","Name","UID","AllocationsJSON","Cash"]);
  }
  return sh;
}

function readRows_(semester, section) {
  var sh = getSheet_("Submissions");
  var vals = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var r = vals[i];
    if (semester && r[1] !== semester) continue;
    if (section && r[2] !== section) continue;
    out.push({
      ts: r[0],
      semester: r[1],
      section: r[2],
      name: r[3],
      uid: r[4],
      allocations: JSON.parse(r[5] || "[]"),
      cash: Number(r[6] || 0)
    });
  }
  return out;
}

// mode=tally => invested $ by stock + count
function getTally_(e) {
  var semester = (e.parameter.semester || "").toUpperCase();
  var section = (e.parameter.section || "").toUpperCase();
  var rows = readRows_(semester, section);
  var totals = {}; // stockId -> $
  rows.forEach(function(row){
    row.allocations.forEach(function(a){
      var amt = Number(a.amount || (a.shares * a.price));
      totals[a.stockId] = (totals[a.stockId] || 0) + amt;
    });
  });
  var res = { ok:true, count: rows.length, totals: totals };
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

// mode=submissions => last 10 recent
function getSubmissions_(e) {
  var semester = (e.parameter.semester || "").toUpperCase();
  var section = (e.parameter.section || "").toUpperCase();
  var rows = readRows_(semester, section);
  rows.sort(function(a,b){ return b.ts - a.ts; });
  var recent = rows.slice(0, 10).map(function(r){
    return {
      ts: r.ts,
      name: r.name,
      uid: r.uid,
      picks: r.allocations.length,
      cash: r.cash
    };
  });
  return ContentService.createTextOutput(JSON.stringify({ ok:true, recent: recent }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * mode=leaderboard
 * params:
 *   semester, section
 *   prices = JSON of { stockId: basePrice }
 *   timeline = JSON of [ { month:"Aug", events:[{stockId, multiplier}, ...] }, ... ]
 * Applies multipliers sequentially to base prices to compute final prices.
 */
function getLeaderboard_(e) {
  try {
    var semester = (e.parameter.semester || "").toUpperCase();
    var section = (e.parameter.section || "").toUpperCase();
    var prices = JSON.parse(e.parameter.prices || "{}");
    var timeline = JSON.parse(e.parameter.timeline || "[]");
    var finalPrices = Object.assign({}, prices);
    // apply month-by-month multipliers
    timeline.forEach(function(m){
      (m.events || []).forEach(function(ev){
        var sid = ev.stockId;
        var mul = Number(ev.multiplier || 1);
        if (!finalPrices.hasOwnProperty(sid)) return;
        finalPrices[sid] = finalPrices[sid] * mul;
      });
    });
    var rows = readRows_(semester, section);
    var board = rows.map(function(r){
      var value = Number(r.cash || 0);
      r.allocations.forEach(function(a){
        var p = finalPrices[a.stockId] || Number(a.price || 0);
        value += Number(a.shares || 0) * p;
      });
      return { name: r.name, uid: r.uid, value: value, picks: r.allocations.length, ts: r.ts };
    });
    board.sort(function(a,b){ return b.value - a.value; });
    var top10 = board.slice(0,10);
    return ContentService.createTextOutput(JSON.stringify({ ok:true, finalPrices: finalPrices, top10: top10 }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// mode=export_csv => download CSV of submissions
function exportCsv_(semester, section) {
  var rows = readRows_(semester, section);
  var header = ["Timestamp","Semester","Section","Name","UID","AllocationsJSON","Cash"];
  var csv = [header.join(",")];
  rows.forEach(function(r){
    var line = [
      new Date(r.ts).toISOString(),
      r.semester, r.section, '"' + r.name.replace(/"/g,'""') + '"', r.uid,
      '"' + JSON.stringify(r.allocations).replace(/"/g,'""') + '"',
      r.cash
    ].join(",");
    csv.push(line);
  });
  return ContentService.createTextOutput(csv.join("\n"))
    .setMimeType(ContentService.MimeType.CSV);
}

// mode=reset => clear submissions (keep header). Requires ?token=YOUR_TOKEN
function reset_(token) {
  var ADMIN_TOKEN = PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN') || 'CHANGE_ME';
  if (token !== ADMIN_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error:"Invalid token" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var sh = getSheet_("Submissions");
  var last = sh.getLastRow();
  if (last > 1) sh.deleteRows(2, last-1);
  return ContentService.createTextOutput(JSON.stringify({ ok:true }))
    .setMimeType(ContentService.MimeType.JSON);
}
