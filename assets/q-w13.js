/* Week 13 question bank — Deploy Streamlit app (Lab 13)
   Format: see q-w9.js */
window.QB = window.QB || [];
window.QB.push(
  {
    id: "w13-m1", week: "w13", type: "mcq", topic: "Pipeline",
    q: "ลำดับของ deployment workflow ใน Lab 13 คือข้อใด?",
    choices: [
      "Local Application → Streamlit Community Cloud → GitHub Repository → Public URL → Users",
      "Local Application → GitHub Repository → Streamlit Community Cloud → Public URL → Users",
      "GitHub Repository → Local Application → Public URL → Streamlit Community Cloud → Users",
      "Local Application → Supabase → Public URL → GitHub Repository → Users",
    ],
    answer: 1,
    explain: "Community Cloud ใช้ source code จาก GitHub repository ในการสร้างและ deploy แอป จึงต้องขึ้น GitHub ก่อน แล้วได้ Public URL ให้ users เข้าใช้",
  },
  {
    id: "w13-m2", week: "w13", type: "mcq", topic: "requirements.txt",
    q: "main.py import โมดูลต่อไปนี้ ข้อใดคือรายการที่<b>ต้องใส่</b>ใน requirements.txt?",
    code: `from datetime import datetime
from pathlib import Path
import json
import re
import pandas as pd
import streamlit as st`,
    choices: ["datetime, pathlib, json, re, pandas, streamlit", "pandas, streamlit", "datetime, pathlib, json, re", "ไม่ต้องใส่อะไรเลย Community Cloud ติดตั้งให้ครบ"],
    answer: 1,
    explain: "datetime, pathlib, json และ re เป็น <b>Python Standard Library</b> ที่มากับ Python อยู่แล้ว ใส่เฉพาะ external libraries ที่ต้อง pip install คือ pandas และ streamlit",
  },
  {
    id: "w13-m3", week: "w13", type: "mcq", topic: "requirements.txt",
    q: "บรรทัด <code>streamlit&lt;=1.50.0</code> ใน requirements.txt หมายความว่าอย่างไร?",
    choices: ["ต้องเป็นเวอร์ชัน 1.50.0 เท่านั้น", "ติดตั้งเวอร์ชันตั้งแต่ 1.50.0 ขึ้นไป", "ติดตั้งเวอร์ชันไม่เกิน 1.50.0 (1.50.0 หรือต่ำกว่า)", "ติดตั้งเวอร์ชันล่าสุดเสมอ"],
    answer: 2,
    explain: "<code>&lt;=</code> = ไม่เกินค่าที่กำหนด ส่วน <code>==</code> = ตรงตัว และ <code>&gt;=</code> = อย่างน้อย การ pin ช่วยลดโอกาสที่แอปบน cloud ทำงานต่างจาก local เพราะ library ถูกอัปเดตเป็นเวอร์ชันใหม่",
  },
  {
    id: "w13-m4", week: "w13", type: "mcq", topic: "Secrets",
    q: "วิธีที่ถูกต้องในการให้แอป Helpdesk บน Community Cloud ได้ค่า <code>supabase_url</code> และ <code>supabase_key</code> คือข้อใด?",
    choices: [
      "commit ไฟล์ .streamlit/secrets.toml ขึ้น GitHub พร้อมโค้ด",
      "เขียน URL และ key ลงใน main.py โดยตรง",
      "วางเนื้อหาของ secrets.toml ในช่อง Advanced settings → Secrets ของ Community Cloud",
      "ส่ง key ให้ผู้ใช้กรอกในหน้าเว็บทุกครั้ง",
    ],
    answer: 2,
    explain: "ห้าม commit secrets.toml หรือ hard-code key ในโค้ด บน cloud ให้วางค่าใน Advanced settings → Secrets โดยโค้ด <code>st.secrets[\"supabase_url\"]</code> ใช้ได้เหมือนเดิม",
  },
  {
    id: "w13-m5", week: "w13", type: "mcq", topic: "Secrets",
    q: "จากโค้ดใน Lab 12 ข้อใดถูกต้องเมื่อนำแอปไป deploy บน Streamlit Community Cloud?",
    code: `url: str = st.secrets["supabase_url"]
key: str = st.secrets["supabase_key"]
return create_client(url, key)`,
    choices: [
      "ต้องแก้โค้ดเป็น os.environ ก่อน deploy",
      "ใช้โค้ดเดิมได้ เปลี่ยนแค่ตำแหน่งเก็บ configuration จาก local secrets.toml เป็น Cloud Secrets",
      "ต้องเปลี่ยนชื่อ key เป็นตัวพิมพ์ใหญ่",
      "st.secrets ใช้ได้เฉพาะบน local",
    ],
    answer: 1,
    explain: "แนวคิดสำคัญของ Section 6: Application ยังใช้ source code เดิม เปลี่ยนเฉพาะที่เก็บ configuration (local .streamlit/secrets.toml → Cloud Secrets)",
  },
  {
    id: "w13-m6", week: "w13", type: "mcq", topic: "Troubleshooting",
    q: "deploy Helpdesk แล้วเจอ <code>ModuleNotFoundError: No module named 'supabase'</code> สาเหตุที่เป็นไปได้มากที่สุดคือ?",
    choices: ["ไม่ได้ใส่ Secrets", "ไม่ได้ระบุ supabase ใน requirements.txt", "ไม่ได้ GRANT SELECT ให้ anon", "Python version สูงเกินไป"],
    answer: 1,
    explain: "ModuleNotFoundError = cloud environment ไม่มี package นั้น ถ้าไม่ได้ใส่ Secrets จะเป็น KeyError และถ้าไม่ได้ GRANT จะเป็น permission denied",
  },
  {
    id: "w13-m7", week: "w13", type: "mcq", topic: "Project files",
    q: "Part 1 (IT Fortune Cookie) deploy สำเร็จแต่หน้าแอปขึ้น “Cannot read data/students.csv …” ควรแก้อย่างไร?",
    choices: ["เพิ่ม pandas ใน requirements.txt", "upload โฟลเดอร์ data/ (ไฟล์ CSV) ขึ้น GitHub repository", "ใส่ path C:/Users/... ให้ถูก", "เปลี่ยน Python version เป็น 3.12"],
    answer: 1,
    explain: "แอปอ่านข้อมูลจาก data/ บน server (W9: paths belong to the server) ไฟล์ CSV จึงต้อง upload พร้อม source code",
  },
  {
    id: "w13-m8", week: "w13", type: "mcq", topic: "Checkpoint",
    q: "ข้อใด<b>ถูกต้อง</b>ตาม Checkpoint 2 ของ Lab 13?",
    choices: [
      "ถ้าเปิด Public URL แล้วเห็นหน้าเว็บ ถือว่า deploy สมบูรณ์",
      "แอปเปิดหน้าได้ไม่ได้แปลว่า deploy สมบูรณ์ ถ้ายังเชื่อม database หรือทำ workflow หลักไม่ได้",
      "ต้องส่ง source code และ GitHub repository ด้วย",
      "deploy สมบูรณ์เมื่อ build log ไม่มี warning",
    ],
    answer: 1,
    explain: "สไลด์เน้นว่าการเปิดหน้าเว็บได้สำเร็จ ไม่ได้หมายความว่า Deployment สมบูรณ์ หากแอปเชื่อมต่อ Database หรือทำงานส่วนสำคัญไม่ได้",
  },
  {
    id: "w13-m9", week: "w13", type: "mcq", topic: "Deploy settings",
    q: "ในหน้า Deploy an app ช่อง <b>Main file path / Entry point</b> ควรตั้งเป็นอะไร และมีหน้าที่อะไร?",
    choices: [
      "requirements.txt เพื่อบอก library",
      "main.py ซึ่งเป็นไฟล์ที่ cloud จะสั่ง streamlit run",
      ".streamlit/secrets.toml เพื่ออ่าน key",
      "README.md เพื่อแสดงคำอธิบาย",
    ],
    answer: 1,
    explain: "Entry point คือไฟล์หลักที่รันแอป ใน Lab ใช้ main.py คู่กับ Repository, Branch (main), App URL และ Advanced settings (Python version, Secrets)",
  },
  {
    id: "w13-m10", week: "w13", type: "mcq", topic: "Code reading",
    q: "ทำไม <code>read_csv_file</code> จึงรับ <code>modified_ns</code> ทั้งที่ในฟังก์ชันไม่ได้ใช้ค่านี้เลย?",
    code: `@st.cache_data(show_spinner=False)
def read_csv_file(path_string, modified_ns):
    return pd.read_csv(path_string, dtype=str, keep_default_na=False, encoding="utf-8-sig")

table = read_csv_file(str(path), path.stat().st_mtime_ns).copy()`,
    choices: [
      "เป็นโค้ดเกินที่ลบทิ้งได้",
      "ให้เวลาแก้ไขไฟล์เป็นส่วนหนึ่งของ cache key: ไฟล์เปลี่ยน → mtime เปลี่ยน → cache miss → อ่านไฟล์ใหม่",
      "เพื่อให้ cache หมดอายุทุก 1 นาโนวินาที",
      "เพื่อบอก pandas ให้อ่านเร็วขึ้น",
    ],
    answer: 1,
    explain: "เทคนิค “Version the input” จาก Week 10: ถ้าแหล่งข้อมูลจริงเปลี่ยน ให้การเปลี่ยนนั้นปรากฏใน arguments ของฟังก์ชันที่ cache ไว้",
  },
  {
    id: "w13-m11", week: "w13", type: "mcq", topic: "Code reading",
    q: "จากโค้ด Lab 13 ตัวนับ consultations ถูกเก็บแยกตามอะไร และจะหายเมื่อใด?",
    code: `def initialize_state():
    st.session_state.setdefault("consultations", {})

key = (student_id, day)
count = st.session_state.consultations.get(key, 0)`,
    choices: [
      "แยกต่อนักศึกษาและต่อวัน อยู่ใน session ของ browser จะหายเมื่อเปิด browser ใหม่หรือ reconnect",
      "เก็บถาวรใน database ของ Supabase",
      "ใช้ร่วมกันทุกผู้ใช้เพราะอยู่ใน cache",
      "เก็บใน requirements.txt",
    ],
    answer: 0,
    explain: "key เป็น tuple (student_id, day) อยู่ใน st.session_state ซึ่งเป็นของ browser session หนึ่ง ๆ (W11) ไม่ใช่ permanent storage และไม่ใช่ cache",
  },

  /* ---------- written ---------- */
  {
    id: "w13-w1", week: "w13", type: "written", topic: "Pipeline",
    q: "อธิบายขั้นตอนการ deploy Streamlit app ขึ้น Streamlit Community Cloud ตั้งแต่บนเครื่อง Local จนผู้ใช้เข้าใช้ได้ พร้อมบอกสิ่งที่ต้องเตรียมในแต่ละขั้น",
    answer: `<ol><li><b>Local</b>: แอปรันได้ เตรียม requirements.txt (external libs + version) ทดสอบด้วย <code>pip install -r requirements.txt</code> และ <code>streamlit run main.py</code></li>
<li><b>GitHub</b>: สร้าง repository แล้ว upload main.py, requirements.txt, data/ (และ training.py สำหรับ Helpdesk) <b>ไม่ upload secrets.toml</b></li>
<li><b>Community Cloud</b>: Create app → Deploy a public app from GitHub → เลือก Repository, Branch (main), Entry point (main.py), App URL และ Advanced settings (Python version, Secrets) → Deploy</li>
<li><b>Public URL</b>: ทดสอบว่า workflow หลักทำงานเหมือน local</li>
<li><b>Users</b>: แชร์ URL ให้ผู้ใช้</li></ol>`,
    keywords: ["github", ["requirements.txt", "requirements"], ["community cloud", "streamlit cloud", "share.streamlit"], ["public url", "url"], ["entry point", "main.py"], ["secrets", "secret"]],
  },
  {
    id: "w13-w2", week: "w13", type: "written", topic: "requirements.txt",
    q: "requirements.txt มีไว้ทำอะไร? library แบบใดควรใส่และไม่ควรใส่ และทำไมจึงควรกำหนดเวอร์ชัน (เช่น <code>pandas&lt;=2.2.3</code>)",
    answer: `<p>requirements.txt ระบุ <b>Python libraries ที่แอปต้องใช้</b> เพื่อให้ cloud environment (ซึ่งเริ่มจากว่าง) <b>ติดตั้ง dependencies ก่อนรันแอป</b></p>
<p>ใส่เฉพาะ <b>external libraries</b> ที่ต้อง pip install เช่น streamlit, pandas, scikit-learn, supabase ไม่ต้องใส่ <b>standard library</b> เช่น datetime, json, re, pathlib, time เพราะมากับ Python อยู่แล้ว (เช็กเวอร์ชันบนเครื่องด้วย <code>pip show</code>)</p>
<p>กำหนดเวอร์ชันเพื่อ <b>ลดโอกาสที่แอปบน cloud ทำงานต่างจาก local</b> เมื่อ library ออกเวอร์ชันใหม่ที่เปลี่ยนพฤติกรรม/API (<code>&lt;=</code> ไม่เกิน, <code>==</code> ตรงตัว, <code>&gt;=</code> อย่างน้อย)</p>`,
    keywords: [["dependencies", "library", "ไลบรารี"], ["standard library", "มากับ python"], ["external", "pip install"], ["version", "เวอร์ชัน"], ["local", "ต่างจาก"], ["pip show"]],
  },
  {
    id: "w13-w3", week: "w13", type: "written", topic: "Secrets",
    q: "ทำไมจึงห้าม commit <code>.streamlit/secrets.toml</code> ขึ้น GitHub? แล้วแอป Helpdesk บน cloud จะได้ค่า URL/key จากที่ใด โค้ดต้องแก้หรือไม่",
    answer: `<p>secrets.toml มี <b>Supabase URL และ key</b> ถ้าขึ้น GitHub (โดยเฉพาะ public repo) ใครก็อ่านได้และนำไปเข้าถึง/แก้ database ของเราได้ จึงเป็นความเสี่ยงด้าน security</p>
<p>บน Community Cloud ให้เปิด <b>Advanced settings → Secrets</b> แล้ววางเนื้อหาเดียวกับ secrets.toml (TOML) → Save → Deploy</p>
<p><b>โค้ดไม่ต้องแก้</b>: <code>st.secrets["supabase_url"]</code> อ่านจาก local file ตอนพัฒนาและอ่านจาก Cloud Secrets ตอน deploy เปลี่ยนแค่ตำแหน่งเก็บ configuration</p>`,
    keywords: [["security", "ความปลอดภัย", "หลุด", "อ่านได้"], ["key", "url"], ["advanced settings"], ["secrets"], ["st.secrets"], ["ไม่ต้องแก้", "โค้ดเดิม", "same code", "source code เดิม"]],
  },
  {
    id: "w13-w4", week: "w13", type: "written", topic: "Troubleshooting",
    q: "หลัง deploy Helpdesk app พบปัญหาต่อไปนี้ จงบอกสาเหตุและวิธีแก้ของแต่ละข้อ: (ก) <code>ModuleNotFoundError: No module named 'sklearn'</code> (ข) <code>KeyError</code> ที่ <code>st.secrets[\"supabase_url\"]</code> (ค) <code>permission denied for table helpdesk_tickets</code>",
    answer: `<p>(ก) cloud ไม่ได้ติดตั้ง scikit-learn → เพิ่ม <code>scikit-learn</code> ใน requirements.txt (ชื่อ package ต่างจากชื่อที่ import)</p>
<p>(ข) ยังไม่ได้วาง Secrets ใน Advanced settings หรือชื่อ key ไม่ตรง → วางค่าจาก secrets.toml ให้มี <code>supabase_url</code> และ <code>supabase_key</code></p>
<p>(ค) role <code>anon</code> ไม่มีสิทธิ์อ่านตาราง → รัน <code>GRANT SELECT ON TABLE public.helpdesk_tickets, public.helpdesk_validation TO anon;</code> ใน SQL Editor (Lab 12)</p>
<p>และย้ำว่าเปิดหน้าเว็บได้ไม่ได้แปลว่า deploy สมบูรณ์ ต้องทดสอบ workflow หลัก</p>`,
    keywords: [["scikit-learn", "requirements"], ["secrets", "advanced settings"], ["grant"], ["anon"], ["select"]],
  },
  {
    id: "w13-w5", week: "w13", type: "written", topic: "Code reading",
    q: "อธิบายการทำงานของ <code>load_table</code> และส่วน <code>try/except</code> ใน <code>main()</code> ว่าช่วยอะไรเมื่อแอปถูก deploy แต่ลืม upload โฟลเดอร์ data/",
    code: `def load_table(filename, required_columns, unique_column=None):
    path = DATA_DIR / filename
    try:
        table = read_csv_file(str(path), path.stat().st_mtime_ns).copy()
    except (OSError, UnicodeError, pd.errors.ParserError, pd.errors.EmptyDataError) as exc:
        raise ValueError(f"Cannot read data/{filename}. ...") from exc
    ...

def main():
    try:
        students, teachers, subjects, pools = load_assets()
    except ValueError as exc:
        st.title("🥠 The Oracle has misplaced a scroll")
        st.error(str(exc))
        st.stop()`,
    answer: `<p><code>load_table</code> สร้าง path จาก DATA_DIR (ผูกกับโฟลเดอร์ของ main.py) แล้วอ่าน CSV ผ่านฟังก์ชันที่ cache ไว้ โดยส่ง mtime เป็น cache key ถ้าอ่านไม่ได้ (ไม่มีไฟล์ → <code>OSError</code>/FileNotFoundError, encoding ผิด, CSV เสีย, ไฟล์ว่าง) จะแปลงเป็น <code>ValueError</code> พร้อมข้อความที่บอกวิธีแก้ จากนั้นยัง validate คอลัมน์ ค่าว่าง และค่าซ้ำ</p>
<p>ใน <code>main()</code> จับ ValueError แล้วแสดง <code>st.title</code> + <code>st.error</code> บอกสาเหตุบนหน้าเว็บแทน traceback และเรียก <code>st.stop()</code> หยุด script run นี้ไม่ให้ทำส่วนที่เหลือ</p>
<p>เมื่อลืม upload data/ ผู้ใช้/ผู้พัฒนาจะเห็นทันทีว่า “Cannot read data/students.csv …” จึงรู้ว่าต้อง upload โฟลเดอร์ data/ ขึ้น GitHub</p>`,
    keywords: [["valueerror", "error"], ["st.error"], ["st.stop", "หยุด"], ["data/", "upload"], ["path", "data_dir", "__file__"], ["validate", "ตรวจ"]],
  },
  {
    id: "w13-w6", week: "w13", type: "written", topic: "Code reading",
    q: "จากโค้ดต่อไปนี้ อธิบายว่าทำไมต้องเรียก <code>st.rerun()</code> หลัง submit และข้อมูล consultations จะยังอยู่หรือไม่เมื่อผู้ใช้เปิด browser ใหม่",
    code: `key = (student_id, day)
count = st.session_state.consultations.get(key, 0)
fortune = st.session_state.daily_fortunes.get(key)
submitted, answers = questionnaire(...)
if submitted:
    consult_oracle(key, student_name, answers, teachers, subjects, pools)
    st.rerun()`,
    answer: `<p><code>count</code> และ <code>fortune</code> ถูกอ่านจาก session_state <b>ก่อน</b> เรียก consult_oracle ซึ่งเป็นตัวอัปเดต state ดังนั้นในรอบนี้ตัวแปรยังเป็นค่าเก่า การเรียก <code>st.rerun()</code> ทำให้ script รันใหม่จากบนลงล่างทันที และวาดหน้าด้วยค่าล่าสุด (จำนวนครั้งและคำทำนายใหม่)</p>
<p>ค่าเก็บใน <code>st.session_state</code> ด้วย key <code>(student_id, day)</code> จึงแยกต่อนักศึกษาต่อวัน แต่ <b>ผูกกับ browser session</b> ถ้าเปิด browser ใหม่หรือ reconnect จะเริ่มนับใหม่ เพราะ Session State เป็น temporary memory ไม่ใช่ permanent storage (ถ้าต้องการถาวรต้องใช้ database)</p>`,
    keywords: [["rerun", "รันใหม่"], ["session_state", "session state"], ["ค่าเก่า", "ค่าล่าสุด", "อัปเดต"], ["browser", "session"], ["ถาวร", "permanent", "database"]],
  }
);
