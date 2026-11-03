/* Week 11 question bank — Session State & Stateful Interaction (format: see q-w9.js) */
window.QB = window.QB || [];
window.QB.push(
  {
    id: "w11-m1", week: "w11", type: "mcq", topic: "Rerun reset",
    q: "ผู้ใช้กดปุ่ม Add 1 ทั้งหมด 4 ครั้ง หน้าจอจะแสดงค่า Count เท่าใด?",
    code: `import streamlit as st
count = 0
if st.button("Add 1", key="btn_1"):
    count += 1
st.write("Count:", count)`,
    choices: ["0", "1", "4", "5"],
    answer: 1,
    explain: "ทุก rerun บรรทัด <code>count = 0</code> ถูกรันใหม่ ในรอบที่กดปุ่ม count จึงเป็น 0+1 = <b>1 เสมอ</b> (Every click starts from 0 again)",
  },
  {
    id: "w11-m2", week: "w11", type: "mcq", topic: "Counter",
    q: "เปิดแอปครั้งแรก แล้วกด Add 1 สามครั้ง จะแสดงค่าใด?",
    code: `import streamlit as st
if "count" not in st.session_state:
    st.session_state.count = 0
if st.button("Add 1"):
    st.session_state.count += 1
st.write("Count =", st.session_state.count)`,
    choices: ["Count = 1", "Count = 3", "Count = 0", "Count = 4"],
    answer: 1,
    explain: "key ถูก initialize ครั้งเดียว (รอบแรก) หลังจากนั้นเงื่อนไข <code>not in</code> เป็น False จึงไม่ reset ค่าเพิ่มสะสม 1, 2, 3",
  },
  {
    id: "w11-m3", week: "w11", type: "mcq", topic: "Init pattern",
    q: "ถ้าเขียน <code>st.session_state.count = 0</code> ไว้บนสุดของไฟล์ <b>โดยไม่มี</b> <code>if \"count\" not in st.session_state</code> จะเกิดอะไรขึ้น?",
    choices: ["ทำงานเหมือนเดิมทุกประการ", "count ถูกเขียนทับเป็น 0 ทุก rerun จึงจำค่าไม่ได้", "เกิด KeyError", "count ถูกแชร์ให้ผู้ใช้ทุกคน"],
    answer: 1,
    explain: "การเช็ก <code>if key not in st.session_state</code> ป้องกันไม่ให้ initialize ซ้ำทุก rerun — ถ้าไม่มีจะเขียนทับเป็น 0 ทุกครั้ง (Lab 11: “History หายทุก rerun เพราะ initialize [] ทุกครั้ง”)",
  },
  {
    id: "w11-m4", week: "w11", type: "mcq", topic: "Session vs Cache",
    q: "ข้อใดเปรียบเทียบ Session State กับ Cache ได้<b>ถูกต้อง</b>?",
    choices: [
      "Session State ใช้ร่วมกันทุกผู้ใช้ ส่วน Cache แยกต่อแท็บ",
      "Session State มี scope 1 browser session ใช้จำค่าที่เปลี่ยนของผู้ใช้; Cache ใช้ร่วมทุก session เพื่อ reuse งานหนักที่คงที่",
      "ทั้งสองอย่างเก็บข้อมูลถาวรแม้ปิด server",
      "Session State ใช้เพื่อเร่งความเร็วการโหลด model",
    ],
    answer: 1,
    explain: "Session State = “my current workflow” (scope: one session, หายเมื่อ session จบ) · Cache = “expensive work we can reuse” (shared across sessions, อยู่จน clear/expire)",
  },
  {
    id: "w11-m5", week: "w11", type: "mcq", topic: "Sessions",
    q: "ผู้ใช้คนเดียวกันเปิดแอปเดียวกันใน 2 แท็บ แล้วกด counter ในแท็บแรก 5 ครั้ง แท็บที่สองจะเห็น count เท่าใด (ยังไม่ได้กดในแท็บที่สอง)?",
    choices: ["5 เพราะเป็นผู้ใช้คนเดียวกัน", "0 (หรือค่าเริ่มต้น) เพราะแต่ละแท็บเป็นคนละ session", "10", "แท็บที่สองจะ error"],
    answer: 1,
    explain: "One browser tab = one session — server app ใช้ร่วมกันแต่ session memory ไม่ใช้ร่วม แท็บที่สองจึงมี state ของตัวเอง",
  },
  {
    id: "w11-m6", week: "w11", type: "mcq", topic: "Widget initial value",
    q: "บรรทัดใดทำให้เกิด <code>StreamlitAPIException</code>?",
    code: `st.slider(
    "Temperature in Celsius",
    min_value=-100.0,
    max_value=100.0,
    key="celsius"
)
st.session_state.celsius = 50.0
st.write(st.session_state.celsius)`,
    choices: ["บรรทัด 1 (สร้าง slider)", "บรรทัด 5 (key=\"celsius\")", "บรรทัด 7 (กำหนด st.session_state.celsius)", "บรรทัด 8 (st.write)"],
    answer: 2,
    explain: "st.session_state.celsius cannot be modified after the widget with key celsius is instantiated — ต้องตั้งค่า state <b>ก่อน</b>สร้าง widget",
  },
  {
    id: "w11-m7", week: "w11", type: "mcq", topic: "Callbacks",
    q: "โค้ดนี้เมื่อเปิดแอปครั้งแรก (ยังไม่กดอะไร) แล้วกดปุ่ม “Click ME!” 1 ครั้ง จะแสดง Count เท่าใด?",
    code: `if "count" not in st.session_state:
    st.session_state.count = 0
def increment_counter():
    st.session_state.count += 1
st.button("Increment", on_click=increment_counter())
st.button("Click ME!")
st.write("Count =", st.session_state.count)`,
    choices: ["Count = 0", "Count = 1", "Count = 2", "Count = 3"],
    answer: 2,
    explain: "<code>on_click=increment_counter()</code> <b>เรียกฟังก์ชันทันทีทุก rerun</b>: โหลดครั้งแรก count = 1 · กด Click ME! → rerun → count = 2 ที่ถูกต้องคือส่งตัวฟังก์ชัน <code>on_click=increment_counter</code>",
  },
  {
    id: "w11-m8", week: "w11", type: "mcq", topic: "Callbacks",
    q: "เมื่อผู้ใช้คลิกปุ่มที่มี <code>on_click=callback</code> ลำดับการทำงานที่ถูกต้องคือ?",
    choices: [
      "script rerun → callback รัน → state อัปเดต",
      "callback รัน → state อัปเดต → script rerun จากบนลงล่าง",
      "callback รันหลัง script rerun เสร็จ ในรอบถัดไป",
      "callback และ script รันพร้อมกันคนละ thread",
    ],
    answer: 1,
    explain: "A callback runs before the script reruns — ค่าที่แสดงในรอบ rerun นั้นจึงสะท้อนการอัปเดตแล้ว",
  },
  {
    id: "w11-m9", week: "w11", type: "mcq", topic: "Forms",
    q: "ภายใน <code>st.form</code> ถ้าต้องการใช้ callback ควรใส่ไว้ที่ใด?",
    choices: ["on_change ของ text_input ใน form", "on_click ของ st.form_submit_button", "ใส่ที่ st.form(..., on_change=...)", "ใช้ callback ใน form ไม่ได้เลย"],
    answer: 1,
    explain: "Inside a form, callbacks belong on the submit button — การกด submit คือ event ที่ commit การอัปเดต state",
  },
  {
    id: "w11-m10", week: "w11", type: "mcq", topic: "Button ephemeral",
    q: "ต้องการให้แอป “จำว่าผู้ใช้กด Submit แล้ว” ข้าม rerun วิธีใดถูกต้อง?",
    choices: [
      "ตั้ง <code>st.session_state.my_button = True</code> แล้วสร้าง <code>st.button(\"Submit\", key=\"my_button\")</code>",
      "เก็บ outcome แยก: init <code>submitted = False</code> แล้ว <code>if st.button(\"Submit\"): st.session_state.submitted = True</code>",
      "ใช้ตัวแปร global <code>submitted = True</code>",
      "ใช้ <code>@st.cache_data</code> กับปุ่ม",
    ],
    answer: 1,
    explain: "Button state is ephemeral (True แค่ 1 run) และตั้งค่าปุ่มผ่าน session state ไม่ได้ → store the outcome of the button action instead",
  },
  {
    id: "w11-m11", week: "w11", type: "mcq", topic: "Widget keys",
    q: "หลังรัน <code>st.text_input(\"Your name\", key=\"name\")</code> และผู้ใช้พิมพ์ “Ada” ข้อใดถูกต้อง?",
    choices: ["ต้องเขียน st.session_state.name = ... เองทุกครั้ง", "<code>st.session_state[\"name\"]</code> มีค่า \"Ada\" อัตโนมัติ", "key ใช้แค่ตั้งชื่อ CSS", "ค่า \"Ada\" ถูกแชร์ให้ทุก session"],
    answer: 1,
    explain: "A keyed widget automatically writes into Session State — return value กับค่าใน state คือค่าเดียวกันของ session นี้",
  },
  {
    id: "w11-m12", week: "w11", type: "mcq", topic: "Lab 11",
    q: "ใน Lab 11 เมื่อผู้ใช้เปลี่ยนค่า C หลัง train แล้ว <code>invalidate_trained_model()</code> จะล้างอะไร?",
    choices: [
      "ทุก key ใน session state",
      "trained_model, training_summary, validation_results, training_error (current results) แต่คง history, best, counter",
      "เฉพาะ experiment_history",
      "best_experiment และ experiment_counter",
    ],
    answer: 1,
    explain: "ผลปัจจุบันไม่ตรงกับ setting ใหม่จึงต้องล้าง แต่ผลในอดีต (History, Best, Counter) ยังเก็บไว้",
  },
  {
    id: "w11-m13", week: "w11", type: "mcq", topic: "Lab 11",
    q: "ในโหมด “7 days” ถ้า start_date = 2026-06-01 โค้ด <code>start_date + timedelta(days=selected_days - 1)</code> ได้ end_date เท่าใด และทำไมต้อง −1?",
    choices: ["2026-06-08 เพราะต้องรวมวันถัดไป", "2026-06-07 เพราะนับรวมทั้งวันเริ่มและวันจบ (1–7 มิ.ย. = 7 วัน)", "2026-06-06 เพราะ timedelta นับจาก 0", "2026-06-07 เพราะ Python index เริ่มที่ 0"],
    answer: 1,
    explain: "ช่วงวันที่นับรวมหัวท้าย (inclusive) จึงบวก 6 วัน ถ้าบวก 7 จะได้ 8 วัน (common mistake “7 days กลายเป็น 8 วัน”)",
  },
  {
    id: "w11-m14", week: "w11", type: "mcq", topic: "Lab 11",
    q: "ทำไม <code>filter_tickets_by_date</code> ใช้ <code>created_at &lt; end_exclusive</code> (end_date + 1 วัน) แทน <code>created_at &lt;= pd.Timestamp(end_date)</code>?",
    choices: [
      "เพื่อให้เร็วขึ้น",
      "เพราะ Timestamp(end_date) คือ 00:00 ของวันสุดท้าย ถ้าใช้ <= จะตัด ticket ที่เกิดหลังเที่ยงคืนของวันนั้นออก",
      "เพราะ pandas ไม่รองรับ <=",
      "เพื่อไม่ให้รวมวันเริ่มต้น",
    ],
    answer: 1,
    explain: "widget คืนวันที่ไม่มีเวลา แต่ created_at มีเวลา → ใช้ “ก่อน 00:00 ของวันถัดไป” เพื่อรวมทุกเวลาของวันสุดท้าย",
  },
  {
    id: "w11-m15", week: "w11", type: "mcq", topic: "Delete",
    q: "โค้ดใดล้างทุก key ใน session state ได้อย่างปลอดภัย?",
    choices: [
      "<code>for key in st.session_state.keys(): del st.session_state[key]</code>",
      "<code>for key in list(st.session_state.keys()): del st.session_state[key]</code>",
      "<code>st.session_state = {}</code>",
      "<code>st.cache_data.clear()</code>",
    ],
    answer: 1,
    explain: "copy keys เป็น list ก่อน เพื่อไม่ลบ key ระหว่างวน iterator ของ dict เดิม (สไลด์ใช้ pattern นี้ใน Read/Update/Delete และ manual reset) — cache_data.clear() เป็นเรื่อง cache ไม่ใช่ state",
  },

  /* ---------- written ---------- */
  {
    id: "w11-w1", week: "w11", type: "written", topic: "Session State",
    q: "Session State คืออะไร แก้ปัญหาอะไรของ Streamlit และควรใช้กับข้อมูลประเภทใด (ยกตัวอย่าง 3 ประเภทตามสไลด์)",
    answer: `<p><code>st.session_state</code> คือหน่วยความจำแบบ key–value (คล้าย dict) ที่ผูกกับ <b>1 browser session</b> ทำให้ค่า<b>อยู่รอดข้าม rerun</b></p>
<p>แก้ปัญหาที่ Streamlit rerun ทั้งไฟล์ทำให้ตัวแปรธรรมดาถูก reset ทุกครั้ง</p>
<p>ใช้กับข้อมูลที่เป็นส่วนหนึ่งของ workflow ของผู้ใช้: (1) chat/message history (2) multi-step progress (3) temporary user choices เช่น filter, draft — ไม่ได้มีไว้เร่งความเร็ว และไม่ใช่ที่เก็บถาวร</p>`,
    keywords: [["rerun", "รันใหม่"], ["session", "แท็บ", "tab"], ["key", "dict", "dictionary"], ["history", "ประวัติ"], ["progress", "step", "ขั้นตอน"], ["choice", "filter", "ตัวเลือก"]],
  },
  {
    id: "w11-w2", week: "w11", type: "written", topic: "Session vs Cache",
    q: "เปรียบเทียบ Session State กับ Cache ใน 3 มิติ (Scope, Purpose, Lifetime) และอธิบายว่าในแอปแชทที่ใช้ ML model ควรใช้อะไรเก็บ model และอะไรเก็บข้อความ",
    answer: `<table><tr><th></th><th>Session State</th><th>Cache</th></tr>
<tr><td>Scope</td><td>1 browser session</td><td>ใช้ร่วมทุก session</td></tr>
<tr><td>Purpose</td><td>จำค่าเฉพาะผู้ใช้ที่เปลี่ยนไป</td><td>reuse งานหนักที่คงที่</td></tr>
<tr><td>Lifetime</td><td>หายเมื่อ session จบ/reset</td><td>อยู่จน clear/expire/invalidated</td></tr></table>
<p>แอปแชท: model ใช้ <code>@st.cache_resource</code> (โหลดครั้งเดียว ใช้ร่วม) ส่วนข้อความใช้ <code>st.session_state.messages</code> (แยกต่อผู้ใช้) — “messages are per session; model is shared”</p>`,
    keywords: [["scope", "ขอบเขต"], ["lifetime", "อายุ"], ["shared", "ร่วม"], ["cache_resource"], ["messages", "ข้อความ"], ["session"]],
  },
  {
    id: "w11-w3", week: "w11", type: "written", topic: "Callbacks",
    q: "อธิบายความแตกต่างระหว่าง <code>on_click=increment_counter</code> กับ <code>on_click=increment_counter()</code> พร้อมผลลัพธ์ที่เกิดขึ้นในแต่ละกรณี",
    code: `def increment_counter():
    st.session_state.count += 1
st.button("Increment", on_click=increment_counter)`,
    answer: `<p><b>ไม่มีวงเล็บ</b>: ส่ง<b>ตัวฟังก์ชัน</b>ให้ Streamlit เก็บไว้ เรียกเฉพาะเมื่อปุ่มถูกคลิก และเรียก<b>ก่อน</b> script rerun → count เพิ่ม 1 ต่อการกด Increment เท่านั้น</p>
<p><b>มีวงเล็บ</b>: Python <b>เรียกฟังก์ชันทันที</b>ตอน script รันถึงบรรทัดนั้น ในทุก rerun (รวมโหลดครั้งแรกและเมื่อกดปุ่มอื่น) แล้วส่ง None ให้ on_click → count เพิ่มทุก rerun ผิดจากที่ตั้งใจ</p>`,
    keywords: [["pass", "ส่งฟังก์ชัน", "ตัวฟังก์ชัน"], ["ทันที", "immediately"], ["ทุก rerun", "every rerun"], ["ก่อน", "before"], ["none"]],
  },
  {
    id: "w11-w4", week: "w11", type: "written", topic: "Common errors",
    q: "อธิบาย Common Errors ของ Session State ทั้ง 3 ข้อตามสไลด์ พร้อมวิธีแก้แต่ละข้อ",
    answer: `<ol><li><b>อ่าน key ก่อนมีอยู่</b> → exception (KeyError) รอบแรก · แก้: initialize default ด้วย <code>if "name" not in st.session_state</code> ก่อนอ่าน</li>
<li><b>เปลี่ยนค่า widget หลังสร้าง widget</b> → StreamlitAPIException · แก้: ตั้งค่าใน state ก่อนเรียก widget command (หรือใน callback)</li>
<li><b>ตั้ง default สองที่</b> (state = 7 และ value=5) → warning รอบแรก · แก้: เลือก source of truth เดียว แนะนำ init state แล้วใช้ key</li></ol>
<p>เพิ่มเติม: ห้ามตั้งค่า button ผ่าน session state ให้เก็บ outcome แทน</p>`,
    keywords: [["keyerror", "exception", "ก่อน initialize"], ["streamlitapiexception", "instantiated"], ["warning", "default"], ["source of truth", "แหล่งเดียว"], ["initialize", "init"]],
  },
  {
    id: "w11-w5", week: "w11", type: "written", topic: "Code reading",
    q: "อธิบายการทำงานของโค้ดนี้ทีละบรรทัด และบอกว่าทำไมต้องใช้ <code>list(...)</code> และ <code>st.rerun()</code>",
    code: `if st.button("Clear this session"):
    for key in list(st.session_state.keys()):
        del st.session_state[key]
    st.rerun()`,
    answer: `<p>เมื่อกดปุ่ม (True เฉพาะรอบนั้น) จะวนลบทุก key ใน session state ของ session นี้ แล้วสั่ง <code>st.rerun()</code> ให้สคริปต์รันใหม่ทันที</p>
<p><code>list(...)</code>: copy รายการ key ไว้ก่อน เพราะลบ key ระหว่างวน iterator ของ dict เดิมจะ error</p>
<p><code>st.rerun()</code>: ให้หน้าจอวาดใหม่จาก state ที่ว่างแล้ว ส่วน initialization (if not in) จะสร้างค่าเริ่มต้นใหม่ — เป็นการ manual reset ของ session (state เป็นหน่วยความจำชั่วคราว ไม่ใช่ storage ถาวร)</p>`,
    keywords: [["ลบ", "delete", "del"], ["list"], ["rerun"], ["reset"], ["session"]],
  },
  {
    id: "w11-w6", week: "w11", type: "written", topic: "Lab 11",
    q: "อธิบายการทำงานของ callback <code>update_end_date()</code> ใน Lab 11 ในแต่ละโหมด (7/28 days, Custom, ALL) และทำไมต้องเรียก <code>invalidate_trained_model()</code> นอกเงื่อนไข",
    code: `def update_end_date() -> None:
    selected_days = PRESET_DAYS.get(st.session_state.range_mode)
    if st.session_state.range_mode == "ALL":
        st.session_state.range_mode = "Custom"
    elif selected_days is not None:
        proposed_end = (st.session_state.start_date
                        + timedelta(days=selected_days - 1))
        st.session_state.end_date = min(proposed_end, DATA_MAX_DATE)
    invalidate_trained_model()`,
    answer: `<p>เป็น callback (on_change) ของ Start date — ทำงานก่อน rerun</p>
<ul><li><b>7/28 days</b>: PRESET_DAYS.get คืน 7 หรือ 28 → end = start + (days−1) (นับรวมหัวท้าย) และใช้ <code>min</code> ไม่ให้เกินวันสุดท้ายของ dataset</li>
<li><b>Custom</b>: get คืน None → ไม่แก้ end date ผู้ใช้กำหนดเอง</li>
<li><b>ALL</b>: เปลี่ยนเป็น Custom เพราะผู้ใช้แก้วันเองแล้ว ช่วงอาจไม่ครอบคลุมทั้งหมด</li></ul>
<p><code>invalidate_trained_model()</code> อยู่นอก if เพื่อล้าง current results <b>ทุกครั้ง</b>ที่ช่วงข้อมูลเปลี่ยน เพราะ model เดิมไม่ตรงกับข้อมูลที่เลือกแล้ว (แต่ history/best ยังอยู่)</p>`,
    keywords: [["callback", "on_change"], ["none"], ["- 1", "-1", "รวมหัวท้าย", "inclusive"], ["min", "data_max_date"], ["custom"], ["invalidate", "ล้าง"]],
  },
  {
    id: "w11-w7", week: "w11", type: "written", topic: "Lab 11",
    q: "ใน Lab 11 ทำไมต้องเก็บ <code>best_experiment</code> แยกจาก current results และ <code>experiment_history</code> และ history ถูกอัปเดตแบบใดเมื่อ train configuration เดิมซ้ำ",
    answer: `<p>best ต้องแสดงได้แม้ (1) เปลี่ยน settings จน current results ถูก invalidate หรือ (2) กด Clear history จน history ว่าง — ถ้าผูกกับ list ที่ถูก clear จะหายไปด้วย จึงเก็บเป็น key แยก</p>
<p>best เลือกจาก macro F1 สูงสุด ถ้าเท่ากันใช้ accuracy ตัดสิน</p>
<p>history เก็บ <b>1 แถวต่อ 1 configuration</b> (start, end, n-gram, C): ถ้าพบ config เดิมจะ<b>แทนที่</b>แถวเดิม ถ้าไม่พบจึง append (ใช้ <code>summary.copy()</code>)</p>`,
    keywords: [["clear", "ล้าง"], ["แยก", "separate", "key"], ["f1"], ["accuracy", "tie"], ["แทนที่", "replace"], ["configuration", "config"]],
  },
  {
    id: "w11-w8", week: "w11", type: "written", topic: "Should this be state?",
    q: "ใช้ “2 คำถาม” จากสไลด์ ตัดสินว่าข้อมูลต่อไปนี้ควรเก็บที่ใด: (ก) ML model ที่ทุกคนใช้ (ข) step ปัจจุบันของ workflow (ค) ticket ที่ต้องดูได้ในอีกหนึ่งเดือน (ง) ตารางที่ผู้ใช้แก้ไขแต่ยังไม่ได้ save",
    answer: `<p>2 คำถาม: <b>ใครควรเห็น?</b> (1 session → Session State, ทุกคน → Cache/storage) และ <b>ควรอยู่นานแค่ไหน?</b> (จนปิดแท็บ → Session State, ข้ามการเข้าใช้ → file/database)</p>
<ul><li>(ก) Cache (<code>st.cache_resource</code>) — ทุกคนใช้ร่วม</li><li>(ข) Session State — เฉพาะผู้ใช้ อยู่ชั่วคราว</li><li>(ค) Database/ไฟล์ — ต้องถาวร</li><li>(ง) MAYBE Session State ก่อน save ลงไฟล์/database</li></ul>`,
    keywords: [["ใคร", "who"], ["นาน", "how long", "lifetime"], ["cache"], ["database", "ฐานข้อมูล", "file", "ไฟล์"], ["session state", "session_state"]],
  }
);
