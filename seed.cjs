const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const generateErlang = (count, intervalMinutes, startHour) => {
  let res = [];
  let h = startHour, m = 0;
  for(let i=0; i<count; i++) {
    let t = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
    let base = 20 + Math.sin(i * 0.3) * 15;
    let spike = (i > count/2 - 3 && i < count/2 + 3) ? 35 : 0;
    let off = Math.round(base + spike);
    let cap = (i > count/2 - 2 && i < count/2 + 1) ? 52 : 60;
    let gos = off > cap ? parseFloat(((off - cap)/2).toFixed(1)) : parseFloat((Math.random()*0.5).toFixed(1));
    res.push('{ time: "' + t + '", offered: ' + off + ', capacity: ' + cap + ', gos: ' + gos + ' }');
    m += intervalMinutes;
    if(m >= 60) { h++; m -= 60; }
    if(h >= 24) h -= 24;
  }
  return '[\n  ' + res.join(',\n  ') + '\n]';
};

const generateMW = (count, startHour) => {
  let res = [];
  let h = startHour;
  for(let i=0; i<count; i++) {
    let t = String(h).padStart(2,'0') + ':00';
    let rsl = -45 - Math.round(Math.random()*5);
    let tp = 150 - Math.round(Math.random()*10);
    if (i > count - 8 && i < count - 2) {
      rsl = -85 - Math.round(Math.random()*5);
      tp = Math.round(Math.random()*5);
    }
    res.push('{ time: "' + t + '", rsl: ' + rsl + ', throughput: ' + tp + ' }');
    h++;
    if(h >= 24) h -= 24;
  }
  return '[\n  ' + res.join(',\n  ') + '\n]';
};

const generateSig = (count, startHour) => {
  let res = [];
  let h = startHour;
  for(let i=0; i<count; i++) {
    let t = String(h).padStart(2,'0') + ':00';
    let req = 800 + Math.round(Math.random()*400);
    let succ = req - Math.round(Math.random()*20);
    if (i > count - 6 && i < count - 2) {
      req = 4000 + Math.round(Math.random()*1500);
      succ = Math.round(Math.random()*150);
    }
    res.push('{ time: "' + t + '", attachReq: ' + req + ', success: ' + succ + ' }');
    h++;
    if(h >= 24) h -= 24;
  }
  return '[\n  ' + res.join(',\n  ') + '\n]';
};

let e1h = generateErlang(12, 5, 14);
let e6h = generateErlang(24, 15, 12);
let e24h = generateErlang(48, 30, 0);
let mw = generateMW(24, 0);
let sig = generateSig(24, 0);

const regex = /const erlangData1h = \[\s*[\s\S]*?\s*\];\s*const erlangData6h = \[\s*[\s\S]*?\s*\];\s*const erlangData24h = \[\s*[\s\S]*?\s*\];\s*const mwData = \[\s*[\s\S]*?\s*\];\s*const signalingData = \[\s*[\s\S]*?\s*\];/;
const replacement = 'const erlangData1h = ' + e1h + ';\n  const erlangData6h = ' + e6h + ';\n  const erlangData24h = ' + e24h + ';\n  const mwData = ' + mw + ';\n  const signalingData = ' + sig + ';';
content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
