/* Week 12 question bank — Lab 12: Connecting Streamlit to a Database (Supabase) */
window.QB = window.QB || [];
window.QB.push(
  {
    id: "w12-m1", week: "w12", type: "mcq", topic: "Supabase",
    q: "ข้อใดอธิบาย <b>Supabase</b> ได้ถูกต้องที่สุด?",
    choices: ["NoSQL document database แบบปิด (closed-source) ของ Google", "Backend-as-a-Service (BaaS) แบบ open-source ที่สร้างบน PostgreSQL", "Python library สำหรับวาดกราฟใน Streamlit", "บริการ deploy Streamlit app ขึ้น cloud"],
    answer: 1,
    explain: "Supabase คือแพลตฟอร์ม <b>BaaS แบบ open-source</b> บนฐาน <b>PostgreSQL</b> ช่วยให้สร้าง backend ได้เร็วโดยไม่ต้องเขียนโครงสร้างพื้นฐานเองทั้งหมด ส่วนบริการ deploy คือ Streamlit Community Cloud (W13)",
  },
  {
    id: "w12-m2", week: "w12", type: "mcq", topic: "Supabase",
    q: "ฟีเจอร์ใดของ Supabase ทำให้เก็บและค้นหาข้อมูล <b>Vector</b> สำหรับงาน AI เช่น RAG ได้?",
    choices: ["Row-Level Security", "Edge Functions", "pgvector extension", "Realtime"],
    answer: 2,
    explain: "pgvector เป็นส่วนขยายของ PostgreSQL สำหรับเก็บ/ค้นหา vector (embeddings) ใช้กับ RAG (Retrieval-Augmented Generation) ส่วน RLS = คุมสิทธิ์ระดับแถว, Edge Functions = serverless code, Realtime = sync ผ่าน WebSockets",
  },
  {
    id: "w12-m3", week: "w12", type: "mcq", topic: "Keys",
    q: "ใน Lab 12 ควรใส่ key ใดลงใน <code>.streamlit/secrets.toml</code> เป็น <code>supabase_key</code>?",
    choices: ["Secret key (sb_secret_…) เพราะมีสิทธิ์สูงสุด", "Service Role key เพื่อให้ข้าม RLS ได้", "Publishable key (sb_publishable_…)", "Database password ที่ตั้งตอนสร้าง project"],
    answer: 2,
    explain: "Lab ให้ใช้ <b>Publishable key</b> เท่านั้น ห้ามใช้ Secret key / Service Role key เพราะมีสิทธิ์ระดับสูงและ<b>ข้าม RLS ได้</b> ถ้าหลุดจะอันตรายมาก",
  },
  {
    id: "w12-m4", week: "w12", type: "mcq", topic: "GRANT",
    q: "คำสั่ง SQL นี้มีไว้เพื่ออะไร?",
    code: `GRANT SELECT ON TABLE
    public.helpdesk_tickets,
    public.helpdesk_validation
TO anon;`,
    lang: "sql",
    choices: ["ลบข้อมูลทั้งหมดในสองตาราง", "ให้ role anon (ผู้ใช้ที่ไม่ได้ login ซึ่งแอปใช้ผ่าน publishable key) อ่านข้อมูล (SELECT) สองตารางได้", "สร้างตารางใหม่สองตาราง", "เปิด Row-Level Security"],
    answer: 1,
    explain: "<code>anon</code> = Anonymous role ที่ request จาก publishable key ใช้ ถ้าไม่ GRANT SELECT จะเจอ <code>permission denied</code> (อยู่ในตาราง common mistakes)",
  },
  {
    id: "w12-m5", week: "w12", type: "mcq", topic: "Code reading",
    q: "Query นี้คืนข้อมูลอะไร?",
    code: `response = (
    supabase
    .table("helpdesk_tickets")
    .select("ticket_id, created_at, category")
    .order("created_at", desc=True)
    .limit(10)
    .execute()
)`,
    choices: ["10 tickets ที่เก่าที่สุด ทุกคอลัมน์", "10 tickets ที่ใหม่ที่สุด เฉพาะ 3 คอลัมน์", "tickets ทั้งหมด เรียงจากใหม่ไปเก่า", "นับจำนวน tickets ทั้งหมด"],
    answer: 1,
    explain: "<code>.select(...)</code> เลือก 3 คอลัมน์, <code>.order(..., desc=True)</code> ใหม่→เก่า, <code>.limit(10)</code> เอา 10 แถว, <code>.execute()</code> ส่ง request — งานทั้งหมดทำที่ database",
  },
  {
    id: "w12-m6", week: "w12", type: "mcq", topic: "Date range",
    q: "ทำไม <code>run_query()</code> จึงกรองวันที่ด้วย <code>.lt(\"created_at\", end_date + 1 วัน)</code> แทน <code>.lte(\"created_at\", end_date)</code>?",
    choices: ["เพราะ Supabase ไม่มีคำสั่ง lte", "เพราะ end_date จาก widget ไม่มีเวลา ถ้าใช้ <= จะตัดที่ 00:00 ทำให้ tickets ที่เกิดระหว่างวันของ End date หายไป", "เพื่อให้ query เร็วขึ้น", "เพื่อดึงข้อมูลของวันถัดไปมาด้วย"],
    answer: 1,
    explain: "End date ถูกตีความเป็น <code>YYYY-MM-DD 00:00:00</code> ticket 09:00 ของวันนั้นจะถูกตัดทิ้ง จึงใช้ <code>&lt; end_date + 1 day</code> (end_exclusive) เพื่อรวมทุกเวลาในวันสุดท้าย แต่ไม่รวมวันถัดไป",
  },
  {
    id: "w12-m7", week: "w12", type: "mcq", topic: "Caching",
    q: "การเลือก decorator ใน Lab 12 ข้อใดถูกต้อง?",
    choices: ["init_connection → cache_data; run_query → cache_resource", "init_connection → cache_resource; run_query → cache_data(ttl=600)", "ทั้งสองใช้ cache_resource", "ไม่ควร cache อะไรเลยเมื่อใช้ database"],
    answer: 1,
    explain: "Supabase client เป็น <b>resource</b> ที่ใช้ร่วมกันได้ (สร้างครั้งเดียว reuse) ส่วนผล query เป็น <b>data</b> ที่อาจเปลี่ยนเมื่อ database เปลี่ยน จึงใช้ cache_data พร้อม <code>ttl=600</code> (10 นาที) ให้หมดอายุเอง",
  },
  {
    id: "w12-m8", week: "w12", type: "mcq", topic: "Refresh",
    q: "เมื่อกดปุ่ม Refresh database data โค้ดนี้ทำอะไร?",
    code: `if st.button("Refresh database data"):
    load_date_bounds.clear()
    run_query.clear()
    st.rerun()`,
    choices: ["สร้าง Supabase client ใหม่และลบข้อมูลใน database", "ล้างเฉพาะ cache ของผล query สองฟังก์ชัน แล้วสั่ง rerun เพื่อ query ข้อมูลใหม่ โดยยัง reuse client เดิม", "ล้าง cache ทุกชนิดรวมถึง connection", "บันทึกข้อมูลลง database"],
    answer: 1,
    explain: "<code>func.clear()</code> ล้าง cache ของฟังก์ชันนั้น, <code>st.rerun()</code> รัน script ใหม่ทันที ทำให้ cache MISS แล้ว query สดจาก Supabase — <b>ไม่ clear init_connection</b> เพราะการ refresh ข้อมูลไม่จำเป็นต้องสร้าง connection ใหม่",
  },
  {
    id: "w12-m9", week: "w12", type: "mcq", topic: "Database filtering",
    q: "ทำไม Lab 12 จึงย้ำให้ <b>filter/sort/limit ที่ database</b> แทนการโหลดทั้งตารางแล้วกรองด้วย Pandas?",
    choices: ["เพราะ Pandas กรองข้อมูลวันที่ไม่ได้", "เพื่อส่งกลับเฉพาะแถวที่ต้องการ ลดข้อมูลที่ส่งผ่าน network/memory และไม่ชน row limit ของ Data API", "เพราะ Supabase ไม่อนุญาตให้ select *", "เพื่อให้ไม่ต้องใช้ cache"],
    answer: 1,
    explain: "Flow ที่ต้องการคือ UI → build query → Data API → <b>return only matching rows</b> → DataFrame ถ้าโหลดทั้งตารางจะเปลือง และ Data API จำกัดจำนวนแถวต่อ request อาจได้ข้อมูลไม่ครบด้วย",
  },
  {
    id: "w12-m10", week: "w12", type: "mcq", topic: "Pagination",
    q: "ตาราง 2,080 แถว ใช้ loop pagination ที่ <code>page_size = 1000</code> จะเรียก <code>.range()</code> ด้วยช่วงใดบ้าง?",
    code: `while True:
    response = (supabase.table(TABLE_NAME)
        .select("ticket_id, created_at, text, category")
        .order("ticket_id")
        .range(start, start + page_size - 1)
        .execute())
    batch = response.data
    records.extend(batch)
    if len(batch) < page_size:
        break
    start += page_size`,
    choices: ["(0, 1000) และ (1000, 2000)", "(0, 999), (1000, 1999), (2000, 2999) แล้วหยุดเพราะได้ 80 แถว < 1000", "(0, 2079) ครั้งเดียว", "loop ไม่รู้จบ"],
    answer: 1,
    explain: "<code>.range(start, end)</code> รวมทั้งสองปลาย จึงใช้ <code>start + page_size - 1</code> รอบที่ 3 ได้ 80 แถว (&lt; 1000) แสดงว่าเป็นหน้าสุดท้าย → break, ใช้ <code>.order(\"ticket_id\")</code> เพื่อให้ลำดับคงที่ระหว่างหน้า",
  },
  {
    id: "w12-m11", week: "w12", type: "mcq", topic: "upsert",
    q: "บันทึก processed data ด้วย <code>.upsert(batch, on_conflict=\"ticket_id\")</code> สองครั้งติดกัน จำนวนแถวในตารางจะเป็นอย่างไร?",
    choices: ["เพิ่มเป็นสองเท่า เพราะ insert ซ้ำ", "เท่าเดิม: ticket_id ที่มีแล้วถูก UPDATE ส่วนที่ยังไม่มีถูก INSERT", "ตารางถูกลบแล้วสร้างใหม่", "error ทุกครั้งเพราะ key ซ้ำ"],
    answer: 1,
    explain: "upsert = update + insert: ticket_id ยังไม่มี → INSERT, มีแล้ว → UPDATE (ต้องมี Primary Key/unique ที่ ticket_id ซึ่งได้จาก <code>LIKE ... INCLUDING ALL</code>)",
  },
  {
    id: "w12-m12", week: "w12", type: "mcq", topic: "RLS",
    q: "ทำไม Lab จึง <b>uncheck Enable Row Level Security (RLS)</b> ตอนสร้างตาราง?",
    choices: ["เพราะ RLS ทำให้ PostgreSQL ช้าลงมาก", "เพราะ Lab ยังไม่มีระบบ Authentication และเป็นข้อมูลจำลอง จึงปิดเพื่อให้ทดลอง query ได้ง่าย — ระบบจริงควรเปิด RLS และกำหนด Policy", "เพราะ RLS ใช้กับ CSV ไม่ได้", "เพราะ publishable key ข้าม RLS ได้อยู่แล้ว"],
    answer: 1,
    explain: "RLS คุมสิทธิ์ระดับแถว (row) ด้วย Policy สำหรับ SELECT/INSERT/UPDATE/DELETE เช่น ให้ผู้ใช้เห็นเฉพาะข้อมูลของตัวเอง Lab ไม่มี auth จึงปิดชั่วคราว (Production note: เปิด RLS + Policies) ส่วนที่ข้าม RLS ได้คือ secret/service-role key ไม่ใช่ publishable key",
  },

  /* ---------- written ---------- */
  {
    id: "w12-w1", week: "w12", type: "written", topic: "Supabase",
    q: "Supabase คืออะไร? จงบอกข้อดีอย่างน้อย 4 ข้อ และฟีเจอร์หลักอย่างน้อย 3 อย่าง",
    answer: `<p>Supabase คือ <b>Backend-as-a-Service (BaaS) แบบ open-source</b> ที่สร้างบน <b>PostgreSQL</b> ช่วยให้สร้าง backend ได้เร็วโดยไม่ต้องเขียนโครงสร้างพื้นฐานเอง</p>
<p><b>ข้อดี</b>: (1) Relational database/SQL รองรับความสัมพันธ์ซับซ้อน (2) สร้าง <b>REST และ GraphQL API อัตโนมัติ</b>จาก schema (3) ไม่มี <b>vendor lock-in</b> self-host ได้ (4) <b>Row-Level Security</b> คุมสิทธิ์ระดับแถว (5) <b>pgvector</b> รองรับ vector/RAG</p>
<p><b>ฟีเจอร์</b>: Database, Authentication (email/password, OAuth เช่น Google/GitHub), Storage, Realtime (WebSockets), Edge Functions (serverless)</p>`,
    keywords: [["baas", "backend-as-a-service"], ["postgresql", "postgres"], ["open-source", "open source", "โอเพนซอร์ส"], ["api", "rest", "graphql"], ["rls", "row-level", "row level"], "pgvector", ["auth", "authentication"]],
  },
  {
    id: "w12-w2", week: "w12", type: "written", topic: "Connection",
    q: "อธิบายโค้ดต่อไปนี้ทีละบรรทัด และบอกเหตุผลที่ใช้ <code>st.cache_resource</code> และ <code>st.secrets</code>",
    code: `@st.cache_resource(
    show_spinner="Connecting to Supabase...",
    show_time=True,
)
def init_connection() -> Client:
    url: str = st.secrets["supabase_url"]
    key: str = st.secrets["supabase_key"]
    return create_client(url, key)

supabase = init_connection()`,
    answer: `<p>decorator <code>@st.cache_resource</code> ทำให้สร้าง client <b>ครั้งเดียว</b> แล้ว reuse ข้าม rerun และ session (แสดง spinner “Connecting to Supabase...” และเวลาที่ใช้ตอน cache miss)</p>
<p>ฟังก์ชันอ่าน URL และ key จาก <code>st.secrets</code> (ไฟล์ <code>.streamlit/secrets.toml</code>) แล้วสร้าง Supabase client ด้วย <code>create_client(url, key)</code> บรรทัดสุดท้ายเก็บ client ไว้ในตัวแปร supabase เพื่อใช้ query</p>
<p><b>ทำไม cache_resource</b>: client เป็น shared resource (connection) ถ้าไม่ cache จะสร้างใหม่ทุก rerun โดยไม่จำเป็น <b>ทำไม secrets</b>: แยก configuration ลับ (URL/key) ออกจาก source code ไม่ hard-code และไม่ commit ขึ้น GitHub</p>`,
    keywords: [["cache_resource", "resource"], ["rerun"], ["secrets", "secrets.toml"], "create_client", ["ครั้งเดียว", "reuse", "นำกลับมาใช้"], ["source code", "github", "hard-code"]],
  },
  {
    id: "w12-w3", week: "w12", type: "written", topic: "Code reading",
    q: "อธิบายการทำงานของ <code>run_query()</code> รวมถึงเหตุผลของ <code>ttl=600</code>, <code>end_exclusive</code>, เงื่อนไข <code>category != \"All\"</code> และ <code>count=\"exact\"</code>",
    code: `@st.cache_data(ttl=600, show_spinner="Querying helpdesk tickets...", show_time=True)
def run_query(start_date, end_date, category):
    end_exclusive = end_date + timedelta(days=1)
    query = (
        supabase.table(TABLE_NAME)
        .select("*", count="exact")
        .gte("created_at", start_date.isoformat())
        .lt("created_at", end_exclusive.isoformat())
    )
    if category != "All":
        query = query.eq("category", category)
    response = query.execute()
    return response.data, response.count`,
    answer: `<p>ฟังก์ชันรับค่า start/end date และ category จาก widget แล้วสร้าง query ไปที่ Supabase</p>
<ul><li><b>cache_data(ttl=600)</b>: ผล query เป็น data — args เดิม = cache hit ไม่ต้อง request ซ้ำ, หมดอายุใน 600 วินาทีเพื่อไม่ให้ข้อมูล stale นาน (cache ผูกกับ function + arguments ใช้ร่วมกันทุก session)</li>
<li><b>end_exclusive</b>: บวก 1 วันแล้วใช้ <code>.lt</code> เพื่อรวมทุกเวลาของ End date (ถ้าใช้ <= end_date จะตัดที่ 00:00)</li>
<li><b>category != "All"</b>: เพิ่ม <code>.eq</code> เฉพาะเมื่อเลือกหมวด ถ้า All ไม่กรองหมวด</li>
<li><b>count="exact"</b>: ให้ database นับจำนวนแถวที่ตรงเงื่อนไขทั้งหมด คืนเป็น <code>response.count</code> คู่กับ <code>response.data</code> (ซึ่งอาจถูกจำกัดด้วย row limit) เพื่อเตือนเมื่อ rows returned &lt; matching</li></ul>`,
    keywords: [["cache_data", "cache"], ["ttl", "600"], ["end_exclusive", "+1", "บวก 1", "ถัดไป"], ["00:00", "เที่ยงคืน", "midnight"], ["eq", "all"], ["count", "นับ"]],
  },
  {
    id: "w12-w4", week: "w12", type: "written", topic: "Refresh",
    q: "ทำไมปุ่ม Refresh database data จึงเรียก <code>load_date_bounds.clear()</code> และ <code>run_query.clear()</code> ตามด้วย <code>st.rerun()</code> แต่<b>ไม่</b> clear <code>init_connection()</code>?",
    answer: `<p>ผล query ถูก cache ด้วย cache_data(ttl=600) ถ้าข้อมูลใน database เปลี่ยนแต่ cache ยังไม่หมดอายุ แอปจะแสดงข้อมูลเก่า (stale) การ <code>.clear()</code> ล้าง cache ของสองฟังก์ชันที่อ่านข้อมูลจาก database และ <code>st.rerun()</code> สั่งให้ script รันใหม่ทันที ทำให้ทั้งสองฟังก์ชัน cache miss แล้ว query ข้อมูลล่าสุดจาก Supabase</p>
<p>ไม่ clear <code>init_connection()</code> เพราะ Supabase client เป็น <b>resource</b> ที่ยังใช้ได้ — การได้ข้อมูลใหม่ไม่จำเป็นต้องสร้าง connection ใหม่ (flow: clear cached query results → rerun → reuse client → query fresh data)</p>`,
    keywords: [["stale", "ข้อมูลเก่า", "ไม่อัปเดต"], ["clear", "ล้าง"], ["rerun"], ["client", "connection"], ["resource", "reuse"], ["ttl"]],
  },
  {
    id: "w12-w5", week: "w12", type: "written", topic: "Setup",
    q: "อธิบายขั้นตอนเชื่อม Streamlit app กับ Supabase ใน Lab 12 ตั้งแต่ได้ key จนแอปอ่านตารางได้ (รวมเรื่อง key ที่ควรใช้/ไม่ควรใช้ และสิทธิ์ของ anon)",
    answer: `<ol><li>Project Settings → <b>API Keys</b>: คัดลอก <b>Publishable key</b> (sb_publishable_…) <b>ห้ามใช้</b> Secret key/Service Role key (sb_secret_…) เพราะสิทธิ์สูงและข้าม RLS</li>
<li>Integration → <b>Data API</b>: คัดลอก API URL <code>https://xxxx.supabase.co</code></li>
<li>ใส่ลง <code>.streamlit/secrets.toml</code> เป็น <code>supabase_url</code> และ <code>supabase_key</code> (แยก config จาก source code, ไม่ commit ขึ้น GitHub)</li>
<li>SQL Editor: <code>GRANT SELECT ON TABLE public.helpdesk_tickets, public.helpdesk_validation TO anon;</code> ให้ role anonymous อ่านตารางได้ (ไม่งั้นได้ permission denied)</li>
<li>ในโค้ด: <code>create_client(st.secrets["supabase_url"], st.secrets["supabase_key"])</code> ห่อด้วย cache_resource แล้ว query ด้วย .table().select()...execute()</li></ol>`,
    keywords: [["publishable", "sb_publishable"], ["secret key", "service role", "sb_secret"], ["secrets.toml", "st.secrets"], ["url", "supabase.co"], ["grant", "select"], "anon"],
  },
  {
    id: "w12-w6", week: "w12", type: "written", topic: "Preprocessing",
    q: "ใน Part 2 ทำไมต้อง preprocess (ลบ boilerplate) ก่อน train และทำไมต้องบันทึกลงตารางใหม่ <code>helpdesk_tickets_processed</code> แทนการแก้ตารางเดิม?",
    answer: `<p>model ใช้ TF-IDF ซึ่งเรียนจากคำและคู่คำ ถ้ามี boilerplate (Dear Customer Support, Best regards, Thank you ...) ที่บังเอิญพบในบาง category บ่อยกว่า model อาจเรียนเป็น <b>shortcut signal</b> แทนที่จะเรียนจาก technical problem จริง การลบจึงช่วยให้โฟกัสที่ปัญหา — แต่<b>ไม่ได้รับประกันว่า performance จะดีขึ้นเสมอ</b> เพราะอาจลบข้อมูลที่มีประโยชน์ด้วย</p>
<p>เก็บ raw table เป็น <b>read-only baseline</b> แล้วบันทึก processed version แยก เพื่อให้เปรียบเทียบ Raw vs Processed ได้อย่างยุติธรรม (Part 3) และไม่ทำลายข้อมูลต้นฉบับ บันทึกด้วย upsert(on_conflict="ticket_id") เป็น batch และทำเฉพาะเมื่อกดปุ่ม</p>`,
    keywords: [["boilerplate"], ["tf-idf", "tfidf"], ["shortcut"], ["raw", "ต้นฉบับ", "baseline"], ["เปรียบเทียบ", "compare"], ["ไม่เสมอ", "ไม่ได้ทำให้", "not automatically", "ไม่รับประกัน"]],
  },
  {
    id: "w12-w7", week: "w12", type: "written", topic: "Experiment",
    q: "Part 3 เปรียบเทียบ model ที่ train ด้วย Raw กับ Final Processed data (ซึ่งผ่านทั้ง boilerplate removal และ student-proposed preprocessing) ถ้า performance เปลี่ยน สรุปได้หรือไม่ว่าเป็นเพราะ student method เพียงอย่างเดียว? ถ้าไม่ได้ ควรทดลองเพิ่มอย่างไร",
    answer: `<p><b>สรุปไม่ได้</b> เพราะ processed data เปลี่ยนไปสองอย่างพร้อมกัน (boilerplate removal + student method) ผลที่เห็นจึงอาจมาจากขั้นใดขั้นหนึ่งหรือทั้งสอง — “observed a change” ไม่เท่ากับ “know which step caused it”</p>
<p>ควรเพิ่ม experiment แบบ <b>ablation / controlled</b>: train อีก model ด้วยข้อมูลที่ผ่าน <b>boilerplate removal อย่างเดียว</b> แล้วเทียบกับแบบที่เพิ่ม student method (ใช้ settings เดียวกัน ngram, C และ validation set เดียวกัน เปลี่ยนแค่ตัวแปรเดียว)</p>`,
    keywords: [["ไม่ได้", "สรุปไม่ได้", "cannot"], ["สองอย่าง", "สองขั้น", "พร้อมกัน", "two"], ["ablation", "แยกผล", "ทีละขั้น", "ทีละอย่าง"], ["boilerplate"], ["validation", "settings", "เงื่อนไขเดียวกัน", "ตัวแปรเดียว"]],
  }
);
