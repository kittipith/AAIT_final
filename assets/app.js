/* =========================================================
   AAIT Exam Guide — shared behaviour
   - theme, top navigation, TOC + scrollspy, reading progress
   - code blocks: Python/SQL/TOML highlighter + clickable line notes
   - quiz renderer (per week) and mock exam
   ========================================================= */
(function () {
  "use strict";

  const WEEKS = {
    w9:  { label: "Week 9",  short: "W9",  title: "Streamlit Fundamentals", page: "week09.html" },
    w10: { label: "Week 10", short: "W10", title: "Caching & Model Integration", page: "week10.html" },
    w11: { label: "Week 11", short: "W11", title: "Session State & Callbacks", page: "week11.html" },
    w12: { label: "Week 12", short: "W12", title: "Database (Supabase) · Lab 12", page: "lab12.html" },
    w13: { label: "Week 13", short: "W13", title: "Deployment · Lab 13", page: "lab13.html" },
  };
  const NAV = [
    { id: "home", href: "index.html", text: "หน้าแรก" },
    { id: "w9", href: "week09.html", text: "W9 Fundamentals" },
    { id: "w10", href: "week10.html", text: "W10 Caching" },
    { id: "w11", href: "week11.html", text: "W11 Session State" },
    { id: "w12", href: "lab12.html", text: "W12 Database" },
    { id: "w13", href: "lab13.html", text: "W13 Deploy" },
    { id: "cheat", href: "cheatsheet.html", text: "สรุปย่อ" },
    { id: "exam", href: "exam.html", text: "ข้อสอบจำลอง" },
  ];

  /* ---------- storage (never trusted to exist) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("aait-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("aait-" + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem("aait-" + k); } catch (e) { /* ignore */ } },
  };

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const inlineMd = (s) => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const page = document.body.dataset.page || "home";

  /* ---------- theme ---------- */
  const savedTheme = store.get("theme", null);
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  function currentTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  /* ---------- top bar ---------- */
  function buildTopbar() {
    const bar = document.createElement("header");
    bar.className = "topbar";
    const links = NAV.map((n) => {
      const dot = WEEKS[n.id] ? `<span class="dot" style="background:var(--${n.id})"></span>` : "";
      return `<a href="${n.href}" class="${n.id === page ? "active" : ""}">${dot}${n.text}</a>`;
    }).join("");
    bar.innerHTML = `
      <button class="icon-btn" id="tocToggle" aria-label="สารบัญ">☰</button>
      <a class="brand" href="index.html"><span class="logo">AI</span><span class="txt">AAIT สรุปสอบ</span></a>
      <nav class="weeknav" aria-label="สัปดาห์">${links}</nav>
      <button class="icon-btn" id="themeBtn" aria-label="สลับธีม" title="สลับโหมดมืด/สว่าง"></button>`;
    document.body.prepend(bar);
    const tb = $("#themeBtn");
    const paint = () => { tb.textContent = currentTheme() === "dark" ? "☀" : "☾"; };
    paint();
    tb.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store.set("theme", next);
      paint();
    });
    $("#tocToggle").addEventListener("click", () => document.body.classList.toggle("toc-open"));
    const active = $(".weeknav a.active");
    if (active) active.scrollIntoView({ block: "nearest", inline: "center" });
  }

  /* ---------- ids, TOC, progress ---------- */
  function slug(s, i) {
    const base = s.toLowerCase().replace(/[^\w฀-๿]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
    return (base || "sec") + "-" + i;
  }
  function trackedHeadings() {
    return $$("main h2").filter((h) => !h.classList.contains("no-track"));
  }
  function buildToc() {
    const toc = $(".toc");
    const heads = $$("main h2, main h3");
    heads.forEach((h, i) => { if (!h.id) h.id = slug(h.textContent, i); });
    if (!toc) return;
    const done = new Set(store.get("done-" + page, []));
    const tracked = trackedHeadings();
    let html = `<div class="toc-title">ในหน้านี้</div>`;
    if (tracked.length) html += `<div class="progress" style="--c:var(--wk)"><div class="toc-bar"><i id="tocBar"></i></div><div class="small muted" id="tocPct"></div></div>`;
    heads.forEach((h) => {
      const lvl = h.tagName === "H3" ? "lvl3" : "";
      const c = h.cloneNode(true);
      c.querySelectorAll(".chip").forEach((x) => x.remove());
      const label = (h.dataset.toc || c.textContent).replace(/\s+/g, " ").trim();
      const mark = done.has(h.id) ? `<span class="done">✓</span>` : "";
      html += `<a href="#${h.id}" class="${lvl}" data-id="${h.id}">${esc(label)}${mark}</a>`;
    });
    toc.innerHTML = html;
    toc.addEventListener("click", (e) => { if (e.target.closest("a")) document.body.classList.remove("toc-open"); });
    updateProgress();
    // scrollspy
    const links = new Map($$("a[data-id]", toc).map((a) => [a.dataset.id, a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          const a = links.get(en.target.id);
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    heads.forEach((h) => obs.observe(h));
  }
  function updateProgress() {
    const tracked = trackedHeadings();
    if (!tracked.length) return;
    const done = store.get("done-" + page, []).filter((id) => tracked.some((h) => h.id === id));
    const pct = Math.round((done.length / tracked.length) * 100);
    store.set("progress-" + page, pct);
    const bar = $("#tocBar"), lbl = $("#tocPct");
    if (bar) bar.style.width = pct + "%";
    if (lbl) lbl.textContent = `อ่านแล้ว ${done.length}/${tracked.length} หัวข้อ (${pct}%)`;
  }
  function addDoneButtons() {
    const tracked = trackedHeadings();
    if (!tracked.length) return;
    const done = new Set(store.get("done-" + page, []));
    tracked.forEach((h, idx) => {
      const btn = document.createElement("button");
      btn.className = "done-btn" + (done.has(h.id) ? " on" : "");
      const paint = () => { btn.innerHTML = done.has(h.id) ? "✓ อ่านหัวข้อนี้แล้ว" : "○ กดเมื่ออ่านหัวข้อนี้จบ"; };
      paint();
      btn.addEventListener("click", () => {
        if (done.has(h.id)) done.delete(h.id); else done.add(h.id);
        store.set("done-" + page, Array.from(done));
        btn.classList.toggle("on", done.has(h.id));
        paint();
        const a = $(`.toc a[data-id="${h.id}"]`);
        if (a) { const m = a.querySelector(".done"); if (done.has(h.id) && !m) a.insertAdjacentHTML("beforeend", `<span class="done">✓</span>`); if (!done.has(h.id) && m) m.remove(); }
        updateProgress();
      });
      // place the button right before the next h2 (or at the end of main)
      const next = tracked[idx + 1] || null;
      let anchor = h.nextElementSibling;
      let last = h;
      while (anchor && anchor !== next && anchor.tagName !== "H2") { last = anchor; anchor = anchor.nextElementSibling; }
      last.after(btn);
    });
  }

  /* ---------- syntax highlighting ---------- */
  const PY_KW = new Set("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" "));
  const PY_BI = new Set("print len range list dict set tuple str int float bool open sorted enumerate zip min max sum round type isinstance getattr super map filter any all abs".split(" "));
  const SQL_KW = new Set("select from where and or not null grant on table to create if exists like including all alter disable enable row level security insert update delete into values order by desc asc limit as public primary key text timestamp varchar integer policy using".split(" "));

  function tokenizePython(src) {
    const re = /([rRbBfFuU]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''))|([rRbBfFuU]{0,2}(?:"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(#[^\n]*)|(@[A-Za-z_][\w.]*)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)|(\s+|.)/g;
    const out = [];
    let m;
    while ((m = re.exec(src))) {
      if (m[1] || m[2]) out.push(["str", m[0]]);
      else if (m[3]) out.push(["com", m[0]]);
      else if (m[4]) out.push(["dec", m[0]]);
      else if (m[5]) out.push(["num", m[0]]);
      else if (m[6]) {
        const w = m[6];
        const rest = src.slice(re.lastIndex);
        if (PY_KW.has(w)) out.push(["kw", w]);
        else if (w === "st" || w === "self") out.push(["st", w]);
        else if (PY_BI.has(w) && /^\s*\(/.test(rest)) out.push(["bi", w]);
        else if (/^\s*\(/.test(rest)) out.push(["fn", w]);
        else out.push(["", w]);
      } else out.push(["", m[0]]);
    }
    return out;
  }
  function tokenizeSimple(src, lang) {
    const out = [];
    let re;
    if (lang === "sql") re = /('(?:[^'])*')|(--[^\n]*)|(\b\d+\b)|([A-Za-z_]\w*)|(\s+|.)/g;
    else if (lang === "toml" || lang === "bash" || lang === "text" || lang === "ini") re = /("(?:\\.|[^"\\\n])*"|'[^'\n]*')|(#[^\n]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w.-]*)|(\s+|.)/g;
    else return [["", src]];
    let m;
    while ((m = re.exec(src))) {
      if (m[1]) out.push(["str", m[0]]);
      else if (m[2]) out.push(["com", m[0]]);
      else if (m[3]) out.push(["num", m[0]]);
      else if (m[4]) {
        const w = m[4];
        if (lang === "sql" && SQL_KW.has(w.toLowerCase())) out.push(["kw", w]);
        else if (lang === "toml" && /^\s*=/.test(src.slice(re.lastIndex))) out.push(["fn", w]);
        else if (lang === "bash" && /^(pip|python|streamlit|conda|git|cd)$/.test(w)) out.push(["kw", w]);
        else out.push(["", w]);
      } else out.push(["", m[0]]);
    }
    return out;
  }
  /** returns array of HTML strings, one per line */
  function highlightLines(src, lang) {
    const toks = lang === "python" || !lang ? tokenizePython(src) : tokenizeSimple(src, lang);
    const lines = [""];
    toks.forEach(([cls, text]) => {
      const parts = text.split("\n");
      parts.forEach((p, i) => {
        if (i > 0) lines.push("");
        if (p) lines[lines.length - 1] += cls ? `<span class="tk-${cls}">${esc(p)}</span>` : esc(p);
      });
    });
    return lines;
  }
  function dedent(text) {
    let lines = text.replace(/\t/g, "    ").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    return lines.map((l) => l.slice(isFinite(ind) ? ind : 0)).join("\n");
  }
  function parseRange(s) {
    const set = new Set();
    (s || "").split(",").map((x) => x.trim()).filter(Boolean).forEach((part) => {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= (b || a); i++) set.add(i);
    });
    return set;
  }

  /**
   * Render a code block.
   * Notes: a line ending with  ##! some text  gets a clickable note.
   * opts: { title, lang, hl: "3,5-7", openAll, compact }
   * returns { el, lines: [lineElements], setHighlight(nums, cls) }
   */
  function renderCode(raw, opts) {
    opts = opts || {};
    const lang = (opts.lang || "python").toLowerCase();
    const notes = {};
    const clean = dedent(raw).split("\n").map((line, i) => {
      const k = line.indexOf("##!");
      if (k >= 0) { notes[i + 1] = line.slice(k + 3).trim(); return line.slice(0, k).replace(/\s+$/, ""); }
      return line;
    }).join("\n");
    const html = highlightLines(clean, lang);
    const hasNotes = Object.keys(notes).length > 0;
    const wrap = document.createElement("div");
    wrap.className = "code-block";
    const head = document.createElement("div");
    head.className = "code-head";
    head.innerHTML = `${opts.title ? `<span class="fname">${esc(opts.title)}</span>` : ""}<span class="lang">${esc(lang)}</span><span class="sp"></span>` +
      (hasNotes ? `<button type="button" data-act="all">อธิบายทุกบรรทัด</button>` : "") +
      `<button type="button" data-act="copy">คัดลอก</button>`;
    wrap.appendChild(head);
    if (hasNotes) {
      const hint = document.createElement("div");
      hint.className = "code-hint";
      hint.textContent = "คลิกบรรทัดที่มีจุด ● เพื่อดูคำอธิบายของบรรทัดนั้น";
      wrap.appendChild(hint);
    }
    const body = document.createElement("div");
    body.className = "code-body";
    const hl = parseRange(opts.hl);
    const lineEls = [];
    html.forEach((h, i) => {
      const n = i + 1;
      const row = document.createElement("div");
      row.className = "cl" + (notes[n] ? " has-note" : "") + (hl.has(n) ? " hl" : "");
      row.innerHTML = `<span class="ln">${n}</span><span class="tx">${h || " "}</span>`;
      body.appendChild(row);
      lineEls.push(row);
      if (notes[n]) {
        const note = document.createElement("div");
        note.className = "note";
        note.hidden = true;
        note.innerHTML = inlineMd(notes[n]);
        body.appendChild(note);
        row._note = note;
        row.addEventListener("click", () => { note.hidden = !note.hidden; row.classList.toggle("open", !note.hidden); });
      }
    });
    wrap.appendChild(body);
    head.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.act === "copy") {
        const done = () => { b.textContent = "คัดลอกแล้ว ✓"; setTimeout(() => (b.textContent = "คัดลอก"), 1400); };
        try { navigator.clipboard.writeText(clean).then(done, done); } catch (err) { done(); }
      } else if (b.dataset.act === "all") {
        const rows = lineEls.filter((r) => r._note);
        const open = rows.some((r) => r._note.hidden);
        rows.forEach((r) => { r._note.hidden = !open; r.classList.toggle("open", open); });
        b.textContent = open ? "ซ่อนคำอธิบาย" : "อธิบายทุกบรรทัด";
      }
    });
    if (opts.openAll) lineEls.forEach((r) => { if (r._note) { r._note.hidden = false; r.classList.add("open"); } });
    return {
      el: wrap,
      lines: lineEls,
      source: clean,
      setHighlight(nums, cls) {
        cls = cls || "hl-run";
        lineEls.forEach((r) => r.classList.remove("hl-run", "hl-bad"));
        (nums || []).forEach((n) => { if (lineEls[n - 1]) lineEls[n - 1].classList.add(cls); });
        const first = (nums || [])[0];
        if (first && lineEls[first - 1]) {
          const box = body.getBoundingClientRect(), r = lineEls[first - 1].getBoundingClientRect();
          if (r.top < box.top || r.bottom > box.bottom) lineEls[first - 1].scrollIntoView({ block: "nearest" });
        }
      },
    };
  }
  function renderAllCode(root) {
    $$('script[type="text/plain"].code', root).forEach((s) => {
      const r = renderCode(s.textContent, { title: s.dataset.title, lang: s.dataset.lang, hl: s.dataset.hl, openAll: s.hasAttribute("data-open") });
      if (s.id) r.el.id = s.id + "-block";
      s.replaceWith(r.el);
    });
  }

  /* ---------- quiz ---------- */
  const QB = (window.QB = window.QB || []);
  const LETTERS = ["ก", "ข", "ค", "ง", "จ"];

  function weekChip(w) { const W = WEEKS[w]; return W ? `<span class="chip ${w}">${W.label}</span>` : ""; }
  function kwHits(text, keywords) {
    const t = (text || "").toLowerCase();
    return (keywords || []).map((k) => {
      const alts = Array.isArray(k) ? k : [k];
      return { label: alts[0], hit: alts.some((a) => t.includes(String(a).toLowerCase())) };
    });
  }
  function kwHtml(text, keywords) {
    return `<div class="kw-list">${kwHits(text, keywords).map((k) => `<span class="kw ${k.hit ? "hit" : ""}">${esc(k.label)}</span>`).join("")}</div>`;
  }
  function qBody(q) {
    const div = document.createElement("div");
    div.className = "qtext";
    div.innerHTML = q.q;
    if (q.code) div.appendChild(renderCode(q.code, { lang: q.lang, title: q.codeTitle }).el);
    if (q.after) div.insertAdjacentHTML("beforeend", q.after);
    return div;
  }

  /** practice mode: instant feedback, remembered per question */
  function renderPractice(mount) {
    const week = mount.dataset.week;
    const type = mount.dataset.type; // optional filter
    const qs = QB.filter((q) => (!week || q.week === week) && (!type || q.type === type));
    const mcq = qs.filter((q) => q.type === "mcq"), wr = qs.filter((q) => q.type === "written");
    mount.classList.add("quiz-wrap");
    mount.innerHTML = "";
    const bar = document.createElement("div");
    bar.className = "quiz-bar";
    bar.innerHTML = `<div><b>${mcq.length}</b> ข้อกา · <b>${wr.length}</b> ข้อเขียน <span class="muted small" data-score></span></div><button class="btn sm" type="button">ล้างคำตอบในหน้านี้</button>`;
    mount.appendChild(bar);
    const scoreEl = $("[data-score]", bar);
    const refresh = () => {
      const answered = mcq.filter((q) => store.get("q-" + q.id, null) !== null);
      const right = answered.filter((q) => store.get("q-" + q.id, null) === q.answer).length;
      scoreEl.textContent = answered.length ? `· ข้อกาถูก ${right}/${answered.length}` : "";
    };
    $("button", bar).addEventListener("click", () => {
      qs.forEach((q) => { store.del("q-" + q.id); store.del("w-" + q.id); store.del("s-" + q.id); });
      renderPractice(mount);
    });
    if (mcq.length) mount.insertAdjacentHTML("beforeend", `<h3>ข้อกา (เลือกคำตอบเดียว)</h3>`);
    // stable per-question shuffle so the correct letter isn't predictable (stored answers are choice indices, so order is free)
    const seedOf = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
    mcq.forEach((q, i) => mount.appendChild(mcqCard(q, i + 1, { instant: true, onAnswer: refresh, order: shuffle(q.choices.map((_, k) => k), rng(seedOf(q.id))) })));
    if (wr.length) mount.insertAdjacentHTML("beforeend", `<h3>ข้อเขียน (ลองตอบเองก่อน แล้วค่อยกดดูเฉลย)</h3>`);
    wr.forEach((q, i) => mount.appendChild(writtenCard(q, i + 1, { instant: true })));
    refresh();
  }

  function mcqCard(q, n, o) {
    const card = document.createElement("div");
    card.className = "qcard";
    card.innerHTML = `<div class="qhead"><span class="qn">ข้อ ${n}.</span>${o.showWeek ? weekChip(q.week) : ""}${q.topic ? `<span class="chip">${esc(q.topic)}</span>` : ""}</div>`;
    card.appendChild(qBody(q));
    const order = o.order || q.choices.map((_, i) => i);
    const box = document.createElement("div");
    box.className = "choices";
    const btns = order.map((ci, pos) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.dataset.ci = ci;
      b.innerHTML = `<span class="letter">${LETTERS[pos]}</span><span>${q.choices[ci]}</span>`;
      box.appendChild(b);
      return b;
    });
    card.appendChild(box);
    const exp = document.createElement("div");
    card.appendChild(exp);
    const reveal = (picked) => {
      btns.forEach((b) => {
        const ci = +b.dataset.ci;
        b.disabled = true;
        b.classList.remove("selected");
        if (ci === q.answer) b.classList.add("correct");
        else if (ci === picked) b.classList.add("picked-wrong");
      });
      const ok = picked === q.answer;
      const correctPos = order.indexOf(q.answer);
      exp.className = "explain";
      exp.innerHTML = `<div class="verdict ${picked === null || picked === undefined ? "no" : ok ? "ok" : "no"}">${picked === null || picked === undefined ? "ยังไม่ได้ตอบ" : ok ? "ถูกต้อง ✓" : "ยังไม่ถูก ✗"} — คำตอบคือข้อ ${LETTERS[correctPos]}</div>${q.explain || ""}`;
    };
    card._reveal = reveal;
    card._picked = null;
    if (o.instant) {
      const prev = store.get("q-" + q.id, null);
      if (typeof prev === "number") reveal(prev);
      btns.forEach((b) => b.addEventListener("click", () => {
        const ci = +b.dataset.ci;
        store.set("q-" + q.id, ci);
        reveal(ci);
        if (o.onAnswer) o.onAnswer();
      }));
    } else {
      btns.forEach((b) => b.addEventListener("click", () => {
        btns.forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        card._picked = +b.dataset.ci;
        if (o.onAnswer) o.onAnswer();
      }));
    }
    return card;
  }

  function writtenCard(q, n, o) {
    const card = document.createElement("div");
    card.className = "qcard";
    card.innerHTML = `<div class="qhead"><span class="qn">ข้อ ${n}.</span>${o.showWeek ? weekChip(q.week) : ""}${q.topic ? `<span class="chip">${esc(q.topic)}</span>` : ""}<span class="chip">ข้อเขียน</span></div>`;
    card.appendChild(qBody(q));
    const ta = document.createElement("textarea");
    ta.placeholder = "เขียนคำตอบของคุณที่นี่ (ไม่บังคับ แต่ช่วยให้เช็กคำสำคัญได้)";
    if (o.instant) ta.value = store.get("w-" + q.id, "");
    ta.addEventListener("input", () => { if (o.instant) store.set("w-" + q.id, ta.value); });
    card.appendChild(ta);
    const ctrl = document.createElement("div");
    ctrl.className = "row";
    ctrl.style.marginTop = "8px";
    card.appendChild(ctrl);
    const ans = document.createElement("div");
    card.appendChild(ans);
    const reveal = () => {
      ans.className = "model-answer";
      ans.innerHTML = `<div class="label" style="color:var(--ok)">แนวคำตอบ</div>${q.answer}` +
        (q.keywords && q.keywords.length ? `<div class="label" style="margin-top:10px">คำสำคัญที่ควรมีในคำตอบ (สีเขียว = คุณเขียนถึงแล้ว)</div>${kwHtml(ta.value, q.keywords)}` : "");
      ans.hidden = false;
      const s = document.createElement("div");
      s.className = "self-score";
      const prev = o.instant ? store.get("s-" + q.id, null) : null;
      s.innerHTML = `<span>ประเมินตัวเอง:</span><button type="button" class="btn sm" data-v="1">ตอบได้ครบ</button><button type="button" class="btn sm" data-v="0.5">ได้บางส่วน</button><button type="button" class="btn sm" data-v="0">ยังตอบไม่ได้</button>`;
      const paint = (v) => $$("button", s).forEach((b) => b.classList.toggle("primary", Number(b.dataset.v) === v));
      if (prev !== null) paint(prev);
      s.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        const v = Number(b.dataset.v);
        card._self = v; paint(v);
        if (o.instant) store.set("s-" + q.id, v);
        if (o.onSelf) o.onSelf();
      });
      ans.appendChild(s);
    };
    card._reveal = reveal;
    card._text = () => ta.value;
    if (o.instant) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn";
      b.textContent = "ดูแนวคำตอบ";
      b.addEventListener("click", () => {
        if (ans.hidden === false && ans.innerHTML) { ans.hidden = true; b.textContent = "ดูแนวคำตอบ"; return; }
        reveal(); b.textContent = "ซ่อนแนวคำตอบ";
      });
      ctrl.appendChild(b);
    }
    return card;
  }

  /* ---------- mock exam ---------- */
  function shuffle(a, rnd) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e6) / 1e6; }; }
  /** pick n questions spreading evenly across selected weeks */
  function balancedPick(pool, weeks, n, rnd) {
    const by = {};
    weeks.forEach((w) => (by[w] = shuffle(pool.filter((q) => q.week === w), rnd)));
    const out = [];
    let guard = 0;
    while (out.length < n && guard++ < 500) {
      let added = false;
      for (const w of shuffle(weeks, rnd)) {
        if (out.length >= n) break;
        if (by[w].length) { out.push(by[w].shift()); added = true; }
      }
      if (!added) break;
    }
    const order = Object.keys(WEEKS);
    return out.sort((a, b) => order.indexOf(a.week) - order.indexOf(b.week));
  }

  function renderExam(mount) {
    const setup = document.createElement("div");
    setup.className = "card";
    const weekBoxes = Object.keys(WEEKS).map((w) => `<label class="chip ${w}" style="cursor:pointer"><input type="checkbox" value="${w}" checked> ${WEEKS[w].label}</label>`).join(" ");
    const totalM = QB.filter((q) => q.type === "mcq").length, totalW = QB.filter((q) => q.type === "written").length;
    setup.innerHTML = `
      <h3>ตั้งค่าข้อสอบ</h3>
      <p class="muted small">คลังข้อสอบมีข้อกา ${totalM} ข้อ และข้อเขียน ${totalW} ข้อ จาก 5 สัปดาห์ ระบบจะสุ่มให้แต่ละสัปดาห์มีจำนวนข้อใกล้เคียงกัน</p>
      <div class="row" style="margin-bottom:10px">${weekBoxes}</div>
      <div class="row" style="margin-bottom:10px">
        <label>ข้อกา <input type="number" id="exM" min="0" max="${totalM}" value="${Math.min(15, totalM)}" style="width:80px"></label>
        <label>ข้อเขียน <input type="number" id="exW" min="0" max="${totalW}" value="${Math.min(15, totalW)}" style="width:80px"></label>
        <label><input type="checkbox" id="exTimer"> จับเวลา</label>
        <label>นาที <input type="number" id="exMin" min="5" max="240" value="90" style="width:80px"></label>
      </div>
      <div class="row"><button class="btn primary" id="exStart" type="button">เริ่มทำข้อสอบชุดใหม่</button><span class="muted small">ทุกครั้งที่กดจะได้ชุดใหม่ (สุ่มทั้งข้อและลำดับตัวเลือก)</span></div>`;
    mount.appendChild(setup);
    const area = document.createElement("div");
    mount.appendChild(area);
    let timer = null;

    $("#exStart", setup).addEventListener("click", () => {
      const weeks = $$('input[type="checkbox"][value]', setup).filter((c) => c.checked).map((c) => c.value);
      if (!weeks.length) { alert("เลือกอย่างน้อย 1 สัปดาห์"); return; }
      const nM = Math.max(0, +$("#exM", setup).value || 0), nW = Math.max(0, +$("#exW", setup).value || 0);
      const rnd = rng(Date.now() % 2147483647);
      const mcq = balancedPick(QB.filter((q) => q.type === "mcq"), weeks, nM, rnd);
      const wr = balancedPick(QB.filter((q) => q.type === "written"), weeks, nW, rnd);
      area.innerHTML = "";
      clearInterval(timer);
      const sb = document.createElement("div");
      sb.className = "scoreboard";
      sb.innerHTML = `<span>ตอบข้อกาแล้ว <b data-a>0</b>/${mcq.length}</span><span data-t></span><span style="flex:1"></span><button class="btn primary" type="button" data-submit>ส่งคำตอบ & ดูเฉลย</button>`;
      area.appendChild(sb);
      const cards = [];
      const upd = () => { $("[data-a]", sb).textContent = cards.filter((c) => c._kind === "m" && c._picked !== null).length; };
      if (mcq.length) area.insertAdjacentHTML("beforeend", `<h2 class="no-track">ตอนที่ 1 · ข้อกา ${mcq.length} ข้อ</h2>`);
      mcq.forEach((q, i) => { const c = mcqCard(q, i + 1, { showWeek: true, order: shuffle(q.choices.map((_, k) => k), rnd), onAnswer: upd }); c._kind = "m"; c._q = q; cards.push(c); area.appendChild(c); });
      if (wr.length) area.insertAdjacentHTML("beforeend", `<h2 class="no-track">ตอนที่ 2 · ข้อเขียน ${wr.length} ข้อ</h2>`);
      const summary = document.createElement("div");
      wr.forEach((q, i) => { const c = writtenCard(q, i + 1, { showWeek: true, onSelf: () => paintSummary() }); c._kind = "w"; c._q = q; c._self = null; cards.push(c); area.appendChild(c); });
      area.appendChild(summary);
      if ($("#exTimer", setup).checked) {
        let left = Math.max(5, +$("#exMin", setup).value || 90) * 60;
        const t = $("[data-t]", sb);
        const tick = () => { const m = Math.floor(left / 60), s = left % 60; t.innerHTML = `⏱ เหลือ <b>${m}:${String(s).padStart(2, "0")}</b>`; if (left-- <= 0) { clearInterval(timer); submit(); } };
        tick(); timer = setInterval(tick, 1000);
      }
      let submitted = false;
      function paintSummary() {
        if (!submitted) return;
        const per = {};
        Object.keys(WEEKS).forEach((w) => (per[w] = { m: 0, mt: 0, w: 0, wt: 0 }));
        cards.forEach((c) => {
          const p = per[c._q.week];
          if (c._kind === "m") { p.mt++; if (c._picked === c._q.answer) p.m++; }
          else { p.wt++; p.w += c._self || 0; }
        });
        const mRight = cards.filter((c) => c._kind === "m" && c._picked === c._q.answer).length;
        const wSelf = cards.filter((c) => c._kind === "w").reduce((s, c) => s + (c._self || 0), 0);
        const rows = Object.keys(WEEKS).filter((w) => per[w].mt + per[w].wt > 0).map((w) => {
          const p = per[w];
          const pct = (p.m + p.w) / Math.max(1, p.mt + p.wt);
          const advice = pct >= 0.8 ? `<span style="color:var(--ok)">ดีมาก</span>` : `<a href="${WEEKS[w].page}">ทบทวน ${WEEKS[w].label} →</a>`;
          return `<tr><td>${weekChip(w)} ${esc(WEEKS[w].title)}</td><td>${p.m}/${p.mt}</td><td>${p.w}/${p.wt}</td><td>${advice}</td></tr>`;
        }).join("");
        summary.innerHTML = `<h2 class="no-track">สรุปผล</h2>
          <div class="grid c2"><div class="card"><span class="label">ข้อกา</span><div style="font-size:30px;font-weight:700">${mRight} / ${mcq.length}</div></div>
          <div class="card"><span class="label">ข้อเขียน (ประเมินตัวเอง)</span><div style="font-size:30px;font-weight:700">${wSelf} / ${wr.length}</div><div class="muted small">กดปุ่ม "ตอบได้ครบ / ได้บางส่วน / ยังตอบไม่ได้" ใต้แต่ละข้อเพื่อนับคะแนน</div></div></div>
          <div class="table-wrap"><table><thead><tr><th>สัปดาห์</th><th>ข้อกา</th><th>ข้อเขียน</th><th>คำแนะนำ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      function submit() {
        if (submitted) return;
        submitted = true;
        clearInterval(timer);
        cards.forEach((c) => (c._kind === "m" ? c._reveal(c._picked) : c._reveal()));
        $("[data-submit]", sb).disabled = true;
        $("[data-submit]", sb).textContent = "ส่งแล้ว";
        paintSummary();
        summary.scrollIntoView({ behavior: "smooth" });
      }
      $("[data-submit]", sb).addEventListener("click", () => {
        const left = cards.filter((c) => c._kind === "m" && c._picked === null).length;
        if (left && !confirm(`ยังไม่ได้ตอบข้อกา ${left} ข้อ ต้องการส่งเลยไหม?`)) return;
        submit();
      });
      area.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------- home progress ---------- */
  function paintHomeProgress() {
    $$("[data-progress]").forEach((card) => {
      const pct = store.get("progress-" + card.dataset.progress, 0);
      const bar = $(".bar > i", card), lbl = $(".pct", card);
      if (bar) bar.style.width = pct + "%";
      if (lbl) lbl.textContent = `อ่านแล้ว ${pct}%`;
    });
  }

  /* ---------- pager ---------- */
  function buildPager() {
    const el = $(".pager[data-auto]");
    if (!el) return;
    const order = ["home", "w9", "w10", "w11", "w12", "w13", "cheat", "exam"];
    const i = order.indexOf(page);
    const find = (id) => NAV.find((n) => n.id === id);
    const prev = find(order[i - 1]), next = find(order[i + 1]);
    el.innerHTML = (prev ? `<a href="${prev.href}"><small>← ก่อนหน้า</small>${prev.text}</a>` : "<span></span>") +
      (next ? `<a class="next" href="${next.href}"><small>ถัดไป →</small>${next.text}</a>` : "<span></span>");
  }

  /* ---------- classify game ----------
     AAIT.sortGame(mountEl, { options: ["Server","Browser"], items: [{ text: "html", answer: 0, why: "html" }] })
     item.text / item.why may contain HTML (authored content). */
  function sortGame(mount, cfg) {
    mount.innerHTML = "";
    const score = document.createElement("div");
    score.className = "muted small";
    score.style.marginBottom = "6px";
    mount.appendChild(score);
    let right = 0, answered = 0;
    const paint = () => { score.textContent = answered ? `ตอบแล้ว ${answered}/${cfg.items.length} · ถูก ${right}` : `เลือกคำตอบให้ครบ ${cfg.items.length} ข้อ`; };
    cfg.items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "sort-item";
      row.innerHTML = `<div class="what">${it.text}</div><div class="row">${cfg.options.map((o, i) => `<button type="button" class="btn sm" data-i="${i}">${o}</button>`).join("")}</div><div class="why">${it.why || ""}</div>`;
      row.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-i]");
        if (!b || row.dataset.done) return;
        row.dataset.done = "1";
        const ok = Number(b.dataset.i) === it.answer;
        answered++; if (ok) right++;
        row.classList.add(ok ? "right" : "wrong");
        $$("button", row).forEach((x) => { x.disabled = true; if (Number(x.dataset.i) === it.answer) x.classList.add("primary"); });
        const why = $(".why", row);
        why.innerHTML = `<b>${ok ? "ถูก ✓" : "ยังไม่ถูก ✗ คำตอบคือ " + cfg.options[it.answer]}</b> — ${it.why || ""}`;
        paint();
      });
      mount.appendChild(row);
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn sm";
    reset.style.marginTop = "8px";
    reset.textContent = "เริ่มใหม่";
    reset.addEventListener("click", () => sortGame(mount, cfg));
    mount.appendChild(reset);
    paint();
  }

  /* ---------- public API ---------- */
  window.AAIT = { WEEKS, store, esc, inlineMd, renderCode, highlightLines, renderPractice, renderExam, sortGame, $, $$ };

  document.addEventListener("DOMContentLoaded", () => {
    buildTopbar();
    renderAllCode(document);
    $$(".quiz-mount").forEach(renderPractice);
    const ex = $("#exam-mount");
    if (ex) renderExam(ex);
    buildToc();
    addDoneButtons();
    paintHomeProgress();
    buildPager();
    document.dispatchEvent(new CustomEvent("aait:ready"));
  });
})();
