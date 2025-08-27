/**
 * IE2324 Portfolio Backend (semester + section)
 * Sheet columns: timestamp | semester | section | uid | allocations_json | cash
 */
function doPost(e){
  try{
    var b = JSON.parse(e.postData.contents);
    var semester = String(b.semester||'').toUpperCase();
    var section = String(b.section||'').toUpperCase();
    var uid = b.uid;
    var allocations = b.allocations||[];
    var cash = Number(b.cash||0);
    if(!semester) throw new Error('Missing semester');
    if(!section) throw new Error('Missing section');
    if(!uid) throw new Error('Missing uid');
    var sheet = SpreadsheetApp.getActive().getActiveSheet();
    sheet.appendRow([new Date(), semester, section, uid, JSON.stringify(allocations), cash]);
    return ContentService.createTextOutput(JSON.stringify({ ok:true })).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error:String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(e){
  var mode = String(e.parameter.mode||'tally').toLowerCase();
  var section = String(e.parameter.section||'').toUpperCase();
  var semester = String(e.parameter.semester||'').toUpperCase();
  var data = readRows(semester, section);
  if(mode === 'submissions'){
    return json({ ok:true, items: data });
  }
  if(mode === 'leaderboard'){
    var timeline = e.parameter.timeline ? JSON.parse(e.parameter.timeline) : [];
    var prices = e.parameter.prices ? JSON.parse(e.parameter.prices) : {};
    var out = computeLeaderboard(data, prices, timeline, 10);
    return json({ ok:true, months: out.months, finalPrices: out.finalPrices, leaders: out.leaders });
  }
  // default tally
  var tally = {};
  data.forEach(function(r){
    r.allocations.forEach(function(a){
      if(!tally[a.stockId]) tally[a.stockId] = { invested:0, holders:0 };
      tally[a.stockId].invested += a.shares * (a.price||0);
    });
  });
  Object.keys(tally).forEach(function(id){
    tally[id].holders = data.filter(function(r){ return r.allocations.some(function(a){ return a.stockId===id; }); }).length;
  });
  return json({ ok:true, tally:tally, total:data.length });
}
function readRows(semester, section){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var values = sheet.getDataRange().getValues();
  var header = values.shift();
  var idx = {
    ts: header.indexOf('timestamp'),
    sem: header.indexOf('semester'),
    section: header.indexOf('section'),
    uid: header.indexOf('uid'),
    al: header.indexOf('allocations_json'),
    cash: header.indexOf('cash')
  };
  return values.filter(function(r){
    var okSem = semester ? String(r[idx.sem]).toUpperCase()===semester : true;
    var okSec = section ? String(r[idx.section]).toUpperCase()===section : true;
    return okSem && okSec;
  }).map(function(r){
    return {
      timestamp: r[idx.ts],
      semester: r[idx.sem],
      section: r[idx.section],
      uid: r[idx.uid],
      allocations: JSON.parse(r[idx.al]||'[]'),
      cash: Number(r[idx.cash]||0)
    };
  });
}
function computeLeaderboard(rows, prices, timeline, topN){
  var factorsPerMonth = timeline.map(function(t){ return t.factors||{}; });
  var finalPrices = {};
  Object.keys(prices).forEach(function(id){
    var p = prices[id];
    factorsPerMonth.forEach(function(f){ p *= (f[id] || 1); });
    finalPrices[id] = p;
  });
  var users = {};
  rows.forEach(function(r){
    var value = r.cash || 0;
    r.allocations.forEach(function(a){
      var base = prices[a.stockId] || a.price || 0;
      var p = base;
      factorsPerMonth.forEach(function(f){ p *= (f[a.stockId] || 1); });
      value += a.shares * p;
    });
    if(!users[r.uid]) users[r.uid] = { uid:r.uid, semester:r.semester, section:r.section, value:0 };
    users[r.uid].value = Math.max(users[r.uid].value, value);
  });
  var list = Object.keys(users).map(function(k){ return users[k]; }).sort(function(a,b){ return b.value-a.value; }).slice(0, topN||10);
  return { months: timeline.map(function(t){ return t.month; }), finalPrices: finalPrices, leaders: list };
}
function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
