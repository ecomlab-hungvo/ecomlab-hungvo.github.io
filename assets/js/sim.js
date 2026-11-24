/* Ecom Lab: profit simulation for Lesson 3.
   One model, used by Part 3.2 (calculator) and Part 3.3 (scenarios, what-ifs, rules).
   The learner's inputs are kept in this browser only (localStorage), so 3.3 can reuse what they typed in 3.2. */
(function () {
  var KEY = 'ecomlab-sim';
  var DEF = {
    price: 14.99, product: 3.50, freight: 0.50, duty: 0.35, prep: 0.25,
    referral: 15, fba: 3.30, storage: 0.10, ads: 10, returns: 3,
    order: 1000, oneoff: 1000, m1: 150, m2: 250, m3: 300, m4: 300
  };

  function copy(o) { var r = {}; for (var k in o) r[k] = o[k]; return r; }
  function load() {
    var v = copy(DEF);
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) for (var k in DEF) if (typeof s[k] === 'number' && isFinite(s[k])) v[k] = s[k]; } catch (e) { /* defaults */ }
    return v;
  }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* not saved */ } }
  function isDefault(v) { for (var k in DEF) if (Math.abs(v[k] - DEF[k]) > 1e-9) return false; return true; }

  function calc(v) {
    var P = v.price;
    var landed = v.product + v.freight + v.duty + v.prep;
    var refFee = P * v.referral / 100;
    var amazon = refFee + v.fba + v.storage;
    var adsC = P * v.ads / 100, retC = P * v.returns / 100;
    var selling = adsC + retC;
    var total = landed + amazon + selling;
    var unit = P - total;
    var cashIn = P - amazon - selling;
    var invest = v.order * landed + v.oneoff;
    var plan = [v.m1, v.m2, v.m3];
    var cum = [-invest], sold = 0, m = 0, payback = null, c = -invest, monthly = [];
    while (m < 36 && sold < v.order) {
      var s = m < 3 ? plan[m] : v.m4;
      if (!(s > 0)) break;
      s = Math.min(s, v.order - sold);
      sold += s; c += s * cashIn; cum.push(c); monthly.push(s); m++;
      if (payback === null && c >= 0) payback = m;
    }
    var firstProfit = v.order * unit - v.oneoff;
    var shareCost = (v.referral + v.ads + v.returns) / 100;
    return {
      landed: landed, refFee: refFee, amazon: amazon, adsC: adsC, retC: retC, selling: selling,
      total: total, unit: unit, margin: P ? unit / P : 0, cashIn: cashIn, invest: invest,
      cum: cum, monthly: monthly, payback: payback, firstProfit: firstProfit,
      roi: invest ? firstProfit / invest : 0,
      bePrice: shareCost < 1 ? (landed + v.fba + v.storage) / (1 - shareCost) : null,
      beUnits: unit > 0 ? Math.ceil(v.oneoff / unit) : null
    };
  }

  function money(n, d) { if (n === null || !isFinite(n)) return '–'; var s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d === 0 ? 0 : 2, maximumFractionDigits: d === 0 ? 0 : 2 }); return (n < 0 ? '−$' : '$') + s; }
  function pct(n) { return isFinite(n) ? (n * 100).toFixed(0) + '%' : '–'; }
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'vi'; }
  function both(en, vi) { return '<span data-l="en">' + en + '</span><span data-l="vi">' + vi + '</span>'; }
  function monthLabel(n) { return n === null ? both('Not within the first order', 'Chưa hoàn vốn trong lô đầu') : both('Month ' + n, 'Tháng ' + n); }

  /* ---------- waterfall (shared) ---------- */
  function waterfall(el, v, r) {
    var P = v.price || 1;
    var rows = [
      ['price', 'Price', 'Giá bán', P, 'is-price'],
      ['product', 'Product', 'Giá hàng', v.product, 'gp1'], ['freight', 'Freight', 'Cước', v.freight, 'gp1'],
      ['duty', 'Duty', 'Thuế', v.duty, 'gp1'], ['prep', 'Prep, inbound', 'Chuẩn bị, nhập kho', v.prep, 'gp1'],
      ['ref', 'Referral', 'Phí giới thiệu', r.refFee, 'gp2'], ['fba', 'FBA fee', 'Phí FBA', v.fba, 'gp2'],
      ['sto', 'Storage', 'Lưu kho', v.storage, 'gp2'],
      ['ads', 'Ads', 'Quảng cáo', r.adsC, 'gp3'], ['ret', 'Returns', 'Hoàn hàng', r.retC, 'gp3'],
      ['profit', 'Profit', 'Lợi nhuận', r.unit, r.unit >= 0 ? 'is-left' : 'is-loss']
    ];
    var top = 0, html = '';
    rows.forEach(function (row, i) {
      var h = Math.max(Math.abs(row[3]) / P * 100, 0.6), t;
      if (row[0] === 'price') t = 0;
      else if (row[0] === 'profit') t = r.unit >= 0 ? Math.min(top, 100 - h) : 100;
      else { t = top; top += row[3] / P * 100; }
      html += '<div class="wf-col" style="--i:' + i + ';--top:' + t.toFixed(2) + '%;--h:' + Math.min(h, 100).toFixed(2) + '%"><span class="wf-bar ' + row[4] + '"></span><b>' + (i === 0 || row[0] === 'profit' ? '' : '−') + money(row[3]) + '</b><small>' + both(row[1], row[2]) + '</small></div>';
    });
    el.innerHTML = html;
  }

  /* ---------- cumulative cash chart ---------- */
  function cashChart(el, r) {
    var vals = r.cum, n = vals.length, W = 420, H = 190, padL = 46, padR = 10, top = 16, bot = 26;
    var maxV = Math.max.apply(null, vals.concat([0])), minV = Math.min.apply(null, vals.concat([0]));
    var scale = (H - top - bot) / ((maxV - minV) || 1);
    var zero = top + maxV * scale;
    var step = (W - padL - padR) / Math.max(n, 1);
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cumulative cash by month">';
    s += '<line class="cc-zero" x1="' + padL + '" y1="' + zero + '" x2="' + (W - padR) + '" y2="' + zero + '"/>';
    s += '<text class="cc-ax" x="' + (padL - 6) + '" y="' + (zero + 4) + '">$0</text>';
    var pts = [];
    vals.forEach(function (val, i) {
      var x = padL + step * i + step * 0.15, w = step * 0.7, h = Math.abs(val) * scale, y = val >= 0 ? zero - h : zero;
      s += '<rect class="cc-b ' + (val >= 0 ? 'is-pos' : 'is-neg') + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h, 1).toFixed(1) + '"/>';
      pts.push((x + w / 2).toFixed(1) + ' ' + (zero - val * scale).toFixed(1));
      s += '<text class="cc-m" x="' + (x + w / 2).toFixed(1) + '" y="' + (H - 8) + '">M' + i + '</text>';
    });
    s += '<path class="cc-line" d="M' + pts.join('L') + '"/>';
    if (r.payback !== null) {
      var bx = padL + step * r.payback + step / 2;
      s += '<g class="cc-be"><circle cx="' + bx.toFixed(1) + '" cy="' + (zero - vals[r.payback] * scale).toFixed(1) + '" r="6"/></g>';
    }
    s += '</svg>';
    el.innerHTML = s;
  }

  /* ---------- Part 3.2: the calculator ---------- */
  function initCalc(root) {
    var v = load();
    var inputs = root.querySelectorAll('[data-k]');
    inputs.forEach(function (inp) { inp.value = v[inp.dataset.k]; });
    function render() {
      var r = calc(v);
      var set = function (k, html) { root.querySelectorAll('[data-out="' + k + '"]').forEach(function (e) { e.innerHTML = html; }); };
      set('landed', money(r.landed)); set('amazon', money(r.amazon)); set('selling', money(r.selling));
      set('total', money(r.total)); set('unit', money(r.unit)); set('margin', pct(r.margin));
      set('invest', money(r.invest, 0)); set('first', money(r.firstProfit, 0)); set('roi', pct(r.roi));
      set('payback', monthLabel(r.payback)); set('cashin', money(r.cashIn));
      root.classList.toggle('is-loss', r.unit < 0);
      var wf = root.querySelector('[data-wf]'); if (wf) waterfall(wf, v, r);
      var cc = root.querySelector('[data-cash]'); if (cc) cashChart(cc, r);
      var note = root.querySelector('[data-sim-note]'); if (note) note.hidden = isDefault(v);
    }
    root.addEventListener('input', function (e) {
      var k = e.target.dataset && e.target.dataset.k; if (!k) return;
      var n = parseFloat(e.target.value); if (!isFinite(n) || n < 0) return;
      v[k] = n; save(v); render();
    });
    var reset = root.querySelector('[data-sim-reset]');
    if (reset) reset.addEventListener('click', function () { v = copy(DEF); save(v); inputs.forEach(function (inp) { inp.value = v[inp.dataset.k]; }); render(); });
    var csv = root.querySelector('[data-sim-csv]');
    if (csv) csv.addEventListener('click', function () { download(v); });
    render();
  }

  /* CSV with live formulas: opens in Excel or Google Sheets (File > Import) */
  function download(v) {
    var rows = [
      ['Ecom LAB profit simulation', '', 'Blue column B = your inputs. Results use formulas.'],
      ['INPUTS', '', ''],
      ['Selling price ($)', v.price], ['Product cost from factory ($)', v.product], ['Freight to US per unit ($)', v.freight],
      ['Import duty per unit ($)', v.duty], ['Prep and inbound to Amazon per unit ($)', v.prep], ['Referral fee (% of price)', v.referral],
      ['FBA fulfilment fee per unit ($)', v.fba], ['Storage per unit ($)', v.storage], ['Advertising (% of price)', v.ads],
      ['Returns and damage (% of price)', v.returns], ['First order (units)', v.order], ['One-off costs ($)', v.oneoff],
      ['Sales month 1 (units)', v.m1], ['Sales month 2 (units)', v.m2], ['Sales month 3 (units)', v.m3], ['Sales month 4+ (units)', v.m4],
      ['RESULTS PER UNIT', '', ''],
      ['Landed cost', '=B4+B5+B6+B7'], ['Amazon fees', '=B3*B8/100+B9+B10'], ['Selling costs', '=B3*(B11+B12)/100'],
      ['Total cost', '=B20+B21+B22'], ['Profit per unit', '=B3-B23'], ['Margin', '=B24/B3'],
      ['INVESTMENT', '', ''],
      ['Cash needed up front', '=B13*B20+B14'], ['Profit on first order', '=B13*B24-B14'], ['ROI on first order', '=B28/B27']
    ];
    var text = rows.map(function (r) { return r.map(function (c) { c = String(c === undefined ? '' : c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\r\n');
    var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ecomlab-profit-simulation.csv';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- Part 3.3: scenarios, what-ifs, break-even, rules ---------- */
  function scale(v, f) { var o = copy(v); o.m1 = Math.round(v.m1 * f); o.m2 = Math.round(v.m2 * f); o.m3 = Math.round(v.m3 * f); o.m4 = Math.round(v.m4 * f); return o; }
  function initStress(root) {
    var v = load(), base = calc(v);
    var who = root.querySelector('[data-sim-who]'); if (who) who.hidden = isDefault(v);
    // scenarios
    var bad = scale(v, 0.7); bad.price = +(v.price * 0.95).toFixed(2); bad.ads = v.ads * 1.5;
    var good = scale(v, 1.2); good.ads = Math.max(v.ads - 2, 0);
    var sc = [['expected', base], ['bad', calc(bad)], ['good', calc(good)]];
    sc.forEach(function (p) {
      var r = p[1], q = function (k) { return root.querySelectorAll('[data-sc="' + p[0] + '-' + k + '"]'); };
      q('unit').forEach(function (e) { e.textContent = money(r.unit); });
      q('margin').forEach(function (e) { e.textContent = pct(r.margin); });
      q('roi').forEach(function (e) { e.textContent = pct(r.roi); });
      q('payback').forEach(function (e) { e.innerHTML = r.payback === null ? '–' : both('M' + r.payback, 'T' + r.payback); });
    });
    // what-ifs: change in ROI on the first order
    var tests = [
      ['ads', function () { var o = copy(v); o.ads = v.ads * 2; return o; }],
      ['price', function () { var o = copy(v); o.price = +(v.price * 0.9).toFixed(2); return o; }],
      ['freight', function () { var o = copy(v); o.freight = v.freight * 1.5; return o; }],
      ['sales', function () { return scale(v, 0.5); }],
      ['returns', function () { var o = copy(v); o.returns = v.returns * 2; return o; }]
    ];
    var res = tests.map(function (t) { var r = calc(t[1]()); return { k: t[0], r: r, d: r.roi - base.roi }; });
    var maxD = Math.max.apply(null, res.map(function (x) { return Math.abs(x.d); }).concat([0.01]));
    res.forEach(function (x) {
      var row = root.querySelector('[data-wi="' + x.k + '"]'); if (!row) return;
      row.style.setProperty('--w', (Math.abs(x.d) / maxD * 100).toFixed(1) + '%');
      var out = row.querySelector('[data-wi-out]');
      if (out) out.innerHTML = 'ROI ' + pct(x.r.roi) + (x.k === 'sales' ? ' · ' + both('payback', 'hoàn vốn') + ' ' + (x.r.payback === null ? '–' : both('M' + x.r.payback, 'T' + x.r.payback)) : '');
      row.classList.toggle('is-worst', Math.abs(x.d) === maxD);
    });
    // break-even
    var be = function (k, html) { root.querySelectorAll('[data-be="' + k + '"]').forEach(function (e) { e.innerHTML = html; }); };
    be('price', money(base.bePrice)); be('units', base.beUnits === null ? '–' : base.beUnits.toLocaleString('en-US'));
    be('base', money(v.price));
    // rules
    var rules = root.querySelector('[data-rules]');
    if (rules) {
      var badR = sc[1][1];
      var checkAll = function () {
        var ok = 0, n = 0;
        rules.querySelectorAll('[data-rule]').forEach(function (row) {
          var inp = row.querySelector('input'), t = parseFloat(inp.value), pass, now;
          if (row.dataset.rule === 'margin') { now = base.margin * 100; pass = now >= t; row.querySelector('[data-now]').textContent = now.toFixed(0) + '%'; }
          if (row.dataset.rule === 'roi') { now = base.roi * 100; pass = now >= t; row.querySelector('[data-now]').textContent = now.toFixed(0) + '%'; }
          if (row.dataset.rule === 'payback') { now = base.payback; pass = now !== null && now <= t; row.querySelector('[data-now]').innerHTML = now === null ? '–' : both(now + ' months', now + ' tháng'); }
          if (row.dataset.rule === 'bad') { now = badR.unit; pass = now >= t; row.querySelector('[data-now]').textContent = money(now); }
          row.classList.toggle('is-pass', !!pass); row.classList.toggle('is-fail', !pass);
          n++; if (pass) ok++;
        });
        var v2 = rules.querySelector('[data-verdict]');
        if (v2) { v2.className = 'rule-verdict ' + (ok === n ? 'is-go' : ok >= n - 1 ? 'is-rework' : 'is-stop'); v2.innerHTML = ok === n ? both('All rules pass: GO', 'Đạt mọi quy tắc: GO') : ok >= n - 1 ? both(ok + ' of ' + n + ' pass: REWORK', 'Đạt ' + ok + '/' + n + ': REWORK') : both(ok + ' of ' + n + ' pass: STOP', 'Đạt ' + ok + '/' + n + ': STOP'); }
      };
      rules.addEventListener('input', checkAll); checkAll();
    }
  }

  window.EcomSim = { DEF: DEF, load: load, calc: calc, money: money, pct: pct };
  document.querySelectorAll('[data-sim-calc]').forEach(initCalc);
  document.querySelectorAll('[data-sim-stress]').forEach(initStress);
  document.querySelectorAll('[data-sim-wf]').forEach(function (el) { var v = copy(DEF); waterfall(el, v, calc(v)); });
})();
