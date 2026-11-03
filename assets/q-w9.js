/* Week 9 question bank — Streamlit Fundamentals
   Format:
   { id, week, type: "mcq", topic, q (HTML), code?, lang?, choices: [HTML...], answer: index, explain (HTML) }
   { id, week, type: "written", topic, q (HTML), code?, answer (HTML), keywords: [ "word" | ["synonym", ...] ] } */
window.QB = window.QB || [];
window.QB.push(
  {
    id: "w9-m1", week: "w9", type: "mcq", topic: "Architecture",
    q: "หลังจากรัน <code>streamlit run main.py</code> โค้ด Python ใน <code>main.py</code> ถูกประมวลผลที่ใด?",
    choices: ["ใน browser ของผู้ใช้ผ่าน JavaScript", "บน Streamlit server process", "บน GitHub", "ทั้ง browser และ server พร้อมกันเสมอ"],
    answer: 1,
    explain: "Python runs on the server — not in the browser. browser ได้รับแค่ UI และส่ง interaction กลับไปให้ server",
  },
  {
    id: "w9-m2", week: "w9", type: "mcq", topic: "Rerun",
    q: "เมื่อผู้ใช้เปลี่ยนค่า <code>st.slider</code> ที่<b>ไม่ได้</b>อยู่ใน form โดยปกติจะเกิดอะไรขึ้น?",
    choices: ["อัปเดตเฉพาะบรรทัดที่สร้าง slider", "script rerun จากบนลงล่างทั้งไฟล์", "ไม่มีอะไรเกิดขึ้นจนกว่าจะ refresh หน้า", "server restart ใหม่ทั้งหมด"],
    answer: 1,
    explain: "widget นอก form เมื่อเปลี่ยนค่าจะ trigger rerun ของ script ตั้งแต่บรรทัดแรกจนบรรทัดสุดท้าย (ไม่ใช่ restart server)",
  },
  {
    id: "w9-m3", week: "w9", type: "mcq", topic: "Rerun",
    q: "ผู้ใช้กด Add 3 ครั้ง (พิมพ์ a, b, c ตามลำดับ) หน้าจอจะแสดงอะไร?",
    code: `import streamlit as st
history = []
with st.form("message_form", clear_on_submit=True):
    message = st.text_input("Enter a message:")
    submitted = st.form_submit_button("Add")
if submitted:
    history.append(message)
st.write("History:", history)`,
    choices: ["History: ['a', 'b', 'c']", "History: ['c']", "History: []", "เกิด error เพราะ history ไม่ได้ประกาศเป็น global"],
    answer: 1,
    explain: "ทุก rerun บรรทัด <code>history = []</code> ถูกรันใหม่ list จึงเริ่มว่างทุกครั้ง ในรอบที่กด Add ครั้งที่ 3 จะ append แค่ 'c' จึงเห็น ['c'] นี่คือ Consequence 2 ที่นำไปสู่ Session State (W11)",
  },
  {
    id: "w9-m4", week: "w9", type: "mcq", topic: "Data display",
    q: "ข้อใด<b>ถูกต้อง</b>เกี่ยวกับ <code>st.data_editor(df)</code>?",
    choices: ["แสดงตาราง static ที่แก้ไขไม่ได้", "ค่าที่แก้จะถูกบันทึกลงไฟล์ CSV ต้นฉบับอัตโนมัติ", "คืนค่า DataFrame ที่ผู้ใช้แก้ไขแล้ว แต่ไม่บันทึกลง CSV เอง", "ใช้แสดง KPI พร้อมลูกศร delta"],
    answer: 2,
    explain: "data_editor ใช้ collect changes และ return edited data แต่ <b>Edits are not automatically saved to CSV</b> ตาราง static คือ st.table ส่วน KPI คือ st.metric",
  },
  {
    id: "w9-m5", week: "w9", type: "mcq", topic: "Data display",
    q: "ต้องการแสดงตารางขนาดใหญ่ที่ผู้ใช้<b>เลื่อน เรียงลำดับ และค้นหา</b>ได้ ควรใช้คำสั่งใด?",
    choices: ["<code>st.table(df)</code>", "<code>st.dataframe(df)</code>", "<code>st.metric(df)</code>", "<code>st.code(df)</code>"],
    answer: 1,
    explain: "st.dataframe = interactive table ส่วน st.table = static เหมาะกับตารางเล็ก/สรุป",
  },
  {
    id: "w9-m6", week: "w9", type: "mcq", topic: "Widgets",
    q: "<code>st.multiselect(...)</code> คืนค่าเป็นชนิดใด?",
    choices: ["str", "bool", "list ของตัวเลือกที่ถูกเลือก", "int (index ของตัวเลือก)"],
    answer: 2,
    explain: "multiselect เลือกได้หลายค่า จึงคืน list (อาจเป็น [] ถ้าไม่ได้เลือก) — ใน Lab ใช้ <code>if selected_columns:</code> เพื่อเช็กว่า list ไม่ว่าง",
  },
  {
    id: "w9-m7", week: "w9", type: "mcq", topic: "Widgets",
    q: "ข้อใดอธิบายค่าที่ <code>st.button(\"Run\")</code> คืนมาได้ถูกต้อง?",
    choices: ["True ตลอดไปหลังจากถูกกดครั้งแรก", "True เฉพาะใน run ที่เกิดจากการกดปุ่ม รอบอื่นเป็น False", "คืนจำนวนครั้งที่ถูกกด", "คืน None เสมอ"],
    answer: 1,
    explain: "ปุ่มเป็น event ชั่วคราว: True เฉพาะ rerun ที่เกิดจากการคลิก (W11 จะเน้นว่าห้ามพยายามบังคับให้ปุ่มค้าง True ให้เก็บ 'ผลลัพธ์' ไว้ใน session_state แทน)",
  },
  {
    id: "w9-m8", week: "w9", type: "mcq", topic: "Forms",
    q: "ประโยชน์หลักของการใส่ widget ไว้ใน <code>st.form</code> คืออะไร?",
    choices: ["ทำให้แอปโหลดเร็วขึ้นเพราะ cache อัตโนมัติ", "รวบรวมค่าหลาย input แล้วส่งพร้อมกันเมื่อกด submit แทนที่จะ rerun ทุกครั้งที่เปลี่ยนค่า", "ทำให้ค่าจำได้ข้าม session", "เข้ารหัสข้อมูลก่อนส่งไป server"],
    answer: 1,
    explain: "Forms delay processing until the user submits — inside a form, values are collected and sent together on submit",
  },
  {
    id: "w9-m9", week: "w9", type: "mcq", topic: "Server ownership",
    q: "หลัง deploy แอปขึ้น cloud แล้ว โค้ด <code>open(\"C:/Users/student/report.pdf\")</code> จะเป็นอย่างไร?",
    choices: ["เปิดไฟล์จากเครื่องผู้ใช้ที่เข้าเว็บได้ตามปกติ", "ไม่พบไฟล์ เพราะ path อ้างถึง file system ของ server ซึ่งไม่มีไฟล์นี้", "browser จะถามสิทธิ์ก่อนอ่านไฟล์", "Streamlit จะ upload ไฟล์ให้อัตโนมัติ"],
    answer: 1,
    explain: "Paths belong to the server ถ้าต้องการไฟล์ของผู้ใช้ ต้องรับไฟล์มาอย่างชัดเจน เช่น st.file_uploader",
  },
  {
    id: "w9-m10", week: "w9", type: "mcq", topic: "Layout",
    q: "จังหวะของ dashboard ที่ดีตามสไลด์ Week 9 คือข้อใด?",
    choices: ["metrics → controls → details → views", "controls → key metrics → main views → optional details", "details → views → metrics → controls", "main views → controls → metrics → details"],
    answer: 1,
    explain: "A useful dashboard rhythm: controls (sidebar) → key metrics (columns) → main views (tabs) → optional details (expander)",
  },
  {
    id: "w9-m11", week: "w9", type: "mcq", topic: "Code reading",
    q: "บรรทัดสุดท้ายของโค้ดนี้ทำงานอย่างไร?",
    code: `chart_functions = {
    "Line": st.line_chart,
    "Area": st.area_chart,
    "Bar": st.bar_chart,
}
chart_functions[chart_type](df, x="year", y=selected_columns)`,
    choices: ["เรียกทั้ง 3 กราฟพร้อมกัน", "ดึงฟังก์ชันวาดกราฟตามค่า chart_type แล้วเรียกฟังก์ชันนั้นด้วย DataFrame", "error เพราะเก็บฟังก์ชันไว้ใน dict ไม่ได้", "สร้างแท็บ 3 แท็บ"],
    answer: 1,
    explain: "ค่าใน dict เป็นตัวฟังก์ชัน (ยังไม่เรียก) <code>chart_functions[\"Bar\"]</code> ได้ st.bar_chart แล้วใส่ <code>(...)</code> เพื่อเรียก — แทนการเขียน if/elif",
  },
  {
    id: "w9-m12", week: "w9", type: "mcq", topic: "Sessions",
    q: "เปิดแอป Streamlit เดียวกันใน 2 แท็บของ browser ข้อใดถูกต้อง?",
    choices: ["ทั้งสองแท็บใช้ session เดียวกันและค่า widget เหมือนกันเสมอ", "มี 2 connections และ 2 sessions; server app ใช้ร่วมกันแต่ค่า widget แยกกัน", "แท็บที่สองจะเปิดไม่ได้", "ต้องรัน streamlit run ใหม่สำหรับแต่ละแท็บ"],
    answer: 1,
    explain: "One browser tab creates one session context — server application shared, but each tab can have different widget values and interaction history",
  },

  /* ---------- written ---------- */
  {
    id: "w9-w1", week: "w9", type: "written", topic: "Architecture",
    q: "อธิบายสถาปัตยกรรม Client–Server ของ Streamlit ว่าฝั่ง browser และฝั่ง server ทำหน้าที่อะไร สื่อสารกันอย่างไร และทำไมเรื่องนี้จึงสำคัญ (ยกตัวอย่างอย่างน้อย 2 ด้าน)",
    answer: `<p><b>Server</b> (Python backend) รัน main.py: โหลดข้อมูล เรียกฟังก์ชัน คำนวณ รัน model เข้าถึง storage และเรียก API</p>
<p><b>Browser (client)</b> แสดง widget/output รับ action ของผู้ใช้ และแสดงผลที่อัปเดต</p>
<p>สองฝั่งสื่อสารผ่าน <b>WebSocket แบบ persistent two-way</b>: browser ส่งค่า widget ไป → server rerun → ส่ง element ใหม่กลับมา</p>
<p>สำคัญเพราะ: (1) <b>Security</b> secret API key ต้องอยู่บน server (2) <b>Performance</b> model ใช้ memory/compute ของ server (3) <b>Files</b> path อ้างถึง file system ของ server (4) Debugging</p>`,
    keywords: [["server", "เซิร์ฟเวอร์"], ["browser", "client"], "websocket", ["security", "api key", "secret"], ["path", "file"], ["memory", "performance", "compute"]],
  },
  {
    id: "w9-w2", week: "w9", type: "written", topic: "Rerun",
    q: "Rerun model ของ Streamlit คืออะไร? และ rerun ก่อให้เกิดปัญหา 2 ประการอะไรบ้าง พร้อมบอกว่าแต่ละปัญหาแก้ด้วยอะไร (สัปดาห์ใด)",
    answer: `<p>เมื่อผู้ใช้เปลี่ยนค่า widget (ที่อยู่นอก form) browser ส่งค่าใหม่ไป server แล้ว <b>script ถูกรันใหม่จากบนลงล่างทั้งไฟล์</b> จากนั้นแสดง output ใหม่</p>
<p><b>ปัญหา 1 – Repeated expensive work:</b> งานหนัก เช่น อ่านไฟล์ใหญ่ query database เรียก API โหลด model สร้าง embeddings ถูกทำซ้ำทุก rerun → แก้ด้วย <b>Caching (Week 10)</b></p>
<p><b>ปัญหา 2 – Information must survive:</b> ตัวแปรธรรมดาถูกสร้างใหม่ทุก rerun ทำให้จำ chat history/progress ไม่ได้ → แก้ด้วย <b>Session State (Week 11)</b></p>`,
    keywords: [["top to bottom", "บนลงล่าง", "ทั้งไฟล์"], ["widget"], ["cache", "caching"], ["session state", "session_state"], ["ตัวแปร", "variable"]],
  },
  {
    id: "w9-w3", week: "w9", type: "written", topic: "Code reading",
    q: "อธิบายการทำงานของโค้ดต่อไปนี้ทีละส่วน และบอกว่าทำไม <code>if submit_btn:</code> จึงอยู่นอก <code>with</code> block",
    code: `with st.form("order_form"):
    task_type = st.selectbox("Task type", ["Summarization", "Translation"])
    temperature = st.slider("Temperature", min_value=0.0, max_value=1.0)
    prompt = st.text_area("Prompt")
    submit_btn = st.form_submit_button("Submit")

if submit_btn:
    st.success("Your order has been submitted.")
    st.write("Task:", task_type, "Prompt:", prompt)`,
    answer: `<p>สร้าง form ชื่อ order_form ซึ่งมี selectbox, slider และ text_area อยู่ข้างใน การเปลี่ยนค่าใน form <b>จะยังไม่ rerun</b> ค่าทั้งหมดถูกส่งพร้อมกันเมื่อกด <code>form_submit_button</code> (ทุก form ต้องมีปุ่มนี้)</p>
<p><code>submit_btn</code> เป็น True เฉพาะรอบที่กด Submit จึงใช้ <code>if submit_btn:</code> แสดงข้อความสำเร็จและสรุปค่า</p>
<p>ส่วน if อยู่นอก form เพราะเป็นการ<b>ประมวลผลหลัง submit</b> ซึ่งเป็น output ไม่ใช่ input ของ form (ใน form ใส่ได้เฉพาะ input widget + submit button)</p>`,
    keywords: ["form", ["submit", "form_submit_button"], ["rerun", "รันใหม่"], ["พร้อมกัน", "together", "batch"], ["true"]],
  },
  {
    id: "w9-w4", week: "w9", type: "written", topic: "Data display",
    q: "เปรียบเทียบ <code>st.dataframe</code>, <code>st.table</code>, <code>st.data_editor</code> และ <code>st.metric</code> ว่าแต่ละตัวใช้ทำอะไร",
    answer: `<ul><li><b>st.dataframe</b>: แสดงตาราง interactive (เลื่อน เรียง ค้นหา ปรับขนาด) เหมาะกับข้อมูลเยอะ</li>
<li><b>st.table</b>: ตาราง static แสดงทุกแถว เหมาะกับตารางเล็ก/สรุป</li>
<li><b>st.data_editor</b>: ให้ผู้ใช้แก้ข้อมูล และคืน DataFrame ที่แก้แล้ว (ไม่บันทึกลง CSV อัตโนมัติ)</li>
<li><b>st.metric</b>: แสดง KPI/ตัวเลขสำคัญพร้อม delta (delta_color normal/inverse)</li></ul>
<p>สรุป: dataframe/table = <b>present data</b> ส่วน data_editor/metric = <b>collect changes / KPIs</b></p>`,
    keywords: ["interactive", "static", ["แก้", "edit"], ["csv", "บันทึก", "save"], ["kpi", "delta"]],
  },
  {
    id: "w9-w5", week: "w9", type: "written", topic: "Code reading",
    q: "อธิบายว่าโค้ด 3 บรรทัดนี้ทำอะไร และทำไมจึงดีกว่าการเขียน <code>pd.read_csv(\"data/sample.csv\")</code>",
    code: `APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"
df = pd.read_csv(DATA_DIR / "sample.csv", dtype="int")`,
    answer: `<p><code>Path(__file__).resolve().parent</code> หาโฟลเดอร์ที่มีไฟล์ main.py แบบ absolute path จากนั้นต่อ path ไปยังโฟลเดอร์ data และอ่าน sample.csv เป็น DataFrame (<code>dtype="int"</code> บังคับให้ทุกคอลัมน์เป็นจำนวนเต็ม)</p>
<p>ดีกว่าเพราะ<b>ไม่ขึ้นกับ working directory ของ terminal</b> (relative path "data/..." จะผิดถ้ารันจากโฟลเดอร์อื่น) และยังทำงานได้หลัง deploy เพราะ path ผูกกับตำแหน่งของ main.py บน server</p>`,
    keywords: [["__file__", "main.py"], ["parent", "โฟลเดอร์"], ["working directory", "terminal"], ["server", "deploy"], "dataframe"],
  },
  {
    id: "w9-w6", week: "w9", type: "written", topic: "Layout",
    q: "อธิบายหน้าที่ของ Sidebar, Columns, Tabs, Expander และ Container พร้อมบอกจังหวะ (rhythm) ของ dashboard ที่ดี",
    answer: `<ul><li><b>Sidebar</b>: global controls</li><li><b>Columns</b>: วางของเคียงกัน เช่น key metrics</li><li><b>Tabs</b>: สลับมุมมอง เช่น Chart / Table / Map</li><li><b>Expander</b>: รายละเอียดเสริมที่ซ่อน/เปิดได้</li><li><b>Container</b>: จัดกลุ่ม element (มีกรอบได้)</li></ul>
<p>Rhythm: <b>controls → key metrics → main views → optional details</b> — จัดสิ่งที่เกี่ยวข้องไว้ด้วยกัน ไม่ให้ controls กับ outputs กระจัดกระจาย</p>`,
    keywords: ["sidebar", "columns", "tabs", "expander", "container", ["metrics", "metric"]],
  },
  {
    id: "w9-w7", week: "w9", type: "written", topic: "Local vs deployed",
    q: "Local development กับ Deployment ต่างกันอย่างไรในมุมของสถาปัตยกรรม client–server และมีผลอะไรต่อการเขียนโค้ด",
    answer: `<p><b>Local</b>: server และ browser อยู่เครื่องเดียวกัน (one machine, still two roles) ทำให้เส้นแบ่ง client–server ถูกซ่อนไว้</p>
<p><b>Deployed</b>: server อยู่บน cloud/host ผู้ใช้อยู่อีกเครื่อง เชื่อมผ่าน network</p>
<p>ผล: path ต้องอ้างถึงไฟล์บน server (ต้อง upload data ไปด้วย/ใช้ path ที่ผูกกับ main.py), ไฟล์ของผู้ใช้ต้องรับผ่าน file uploader, secret อยู่บน server, model ใช้ resource ของ server, dependencies ต้องติดตั้งบน server</p>`,
    keywords: [["เครื่องเดียว", "same machine", "single computer"], ["network", "เครือข่าย"], ["path", "file"], ["upload", "file_uploader"], ["server"]],
  }
);
