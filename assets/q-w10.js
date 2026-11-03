/* Week 10 question bank — Caching & Efficient Model Integration */
window.QB = window.QB || [];
window.QB.push(
  {
    id: "w10-m1", week: "w10", type: "mcq", topic: "Cache HIT",
    q: "เมื่อเกิด <b>cache hit</b> กับฟังก์ชันที่ใช้ <code>@st.cache_data</code> ข้อใดถูกต้องที่สุด?",
    choices: ["Script ไม่ rerun เลย", "Script ยัง rerun จากบนลงล่าง แต่ body ของ cached function ถูกข้าม", "Function body ถูกรันแต่ไม่แสดงผล", "Streamlit restart server เพื่อดึงค่าจาก cache"],
    answer: 1,
    explain: "Caching skips a function body — not the script rerun. การตัดสิน HIT/MISS เกิดขึ้นภายใน rerun ส่วนอื่นของ script ยังรันตามปกติ",
  },
  {
    id: "w10-m2", week: "w10", type: "mcq", topic: "Trace",
    q: "เรียกตามลำดับดังนี้ จะมี cache MISS ทั้งหมดกี่ครั้ง?",
    code: `@st.cache_data
def slow_square(x):
    time.sleep(3)
    return x * x

slow_square(5)
slow_square(5)
slow_square(7)
slow_square(5)
slow_square(7)`,
    choices: ["1 ครั้ง", "2 ครั้ง", "3 ครั้ง", "5 ครั้ง"],
    answer: 1,
    explain: "MISS ครั้งแรกของ x=5 และครั้งแรกของ x=7 เท่านั้น ที่เหลือเป็น HIT — cached function มีหลาย entry ได้ (1 entry ต่อ cache identity)",
  },
  {
    id: "w10-m3", week: "w10", type: "mcq", topic: "Decorator choice",
    q: "ฟังก์ชันที่สร้าง <b>database connection</b> หรือโหลด <b>ML model</b> ควรใช้ decorator ใด?",
    choices: ["<code>@st.cache_data</code>", "<code>@st.cache_resource</code>", "<code>@st.session_state</code>", "ไม่ควร cache"],
    answer: 1,
    explain: "Shared resources (models, DB connections, engines) ใช้ cache_resource ซึ่งคืน object ตัวเดียวกันโดยไม่ copy และประหยัด memory",
  },
  {
    id: "w10-m4", week: "w10", type: "mcq", topic: "Copy vs shared",
    q: "User A กดปุ่ม Append 99 หนึ่งครั้ง หลังจากนั้น User B (อีก session) กด rerun จะเห็นค่าอะไร?",
    code: `@st.cache_resource
def create_list():
    return [1, 2, 3]

my_list = create_list()
if st.button("Append 99"):
    my_list.append(99)
st.write("Current list:", my_list)`,
    choices: ["[1, 2, 3]", "[1, 2, 3, 99]", "[99]", "Error เพราะ list hash ไม่ได้"],
    answer: 1,
    explain: "cache_resource คืน shared object ตัวเดียวกัน User A mutate object ส่วนกลาง User B จึงเห็นค่าที่ถูกแก้ใน rerun ถัดไป (ถ้าเป็น cache_data User B จะเห็น [1, 2, 3])",
  },
  {
    id: "w10-m5", week: "w10", type: "mcq", topic: "Copy vs shared",
    q: "ถ้าเปลี่ยน decorator ในโค้ดข้อก่อนเป็น <code>@st.cache_data</code> แล้ว User A กด Append 99 จากนั้นกด rerun (โดยไม่กดปุ่ม) User A จะเห็นอะไร?",
    choices: ["[1, 2, 3, 99]", "[1, 2, 3]", "[1, 2, 3, 99, 99]", "ValueError"],
    answer: 1,
    explain: "cache_data คืน <b>สำเนาใหม่</b>ทุกครั้ง (deserialize จาก cache) การ append ในรอบก่อนแก้แค่สำเนาของรอบนั้น รอบใหม่จึงได้ [1, 2, 3]",
  },
  {
    id: "w10-m6", week: "w10", type: "mcq", topic: "Find the bug",
    q: "โค้ดนี้ทำงานได้ใน run แรก แต่ run ที่สองเกิด error เพราะอะไร?",
    code: `@st.cache_resource
def get_numbers():
    return [1, 2, 3]

numbers = get_numbers()
numbers.remove(1)`,
    choices: ["cache_resource ใช้กับ list ไม่ได้", "run ที่สอง HIT ได้ object ตัวเดิมที่เหลือ [2, 3] แล้ว remove(1) อีกจึงเกิด ValueError", "ฟังก์ชันไม่มี argument จึง cache ไม่ได้", "ต้องใส่ ttl"],
    answer: 1,
    explain: "Shared mutable object remembers every change — ห้าม mutate object ที่ได้จาก cache_resource",
  },
  {
    id: "w10-m7", week: "w10", type: "mcq", topic: "Hashing",
    q: "ในโค้ดนี้ parameter ใด<b>เป็นส่วนหนึ่งของ cache key</b>?",
    code: `@st.cache_data
def fetch_data(_db_connection, num_rows):
    return _db_connection.fetch(num_rows)`,
    choices: ["ทั้งสองตัว", "เฉพาะ <code>_db_connection</code>", "เฉพาะ <code>num_rows</code>", "ไม่มีตัวใดเลย"],
    answer: 2,
    explain: "parameter ที่ขึ้นต้นด้วย _ จะถูก Streamlit ignore (ไม่ hash) จึงเหลือ num_rows เป็น cache key",
  },
  {
    id: "w10-m8", week: "w10", type: "mcq", topic: "ttl",
    q: "<code>@st.cache_data(ttl=3600)</code> หมายความว่าอย่างไร?",
    choices: ["เก็บได้สูงสุด 3600 entries", "entry มีอายุ 3600 วินาที (1 ชั่วโมง) หลังหมดอายุ การเรียกครั้งถัดไปจะรันใหม่", "cache ขนาดสูงสุด 3600 MB", "รันฟังก์ชันอัตโนมัติทุก 3600 วินาที"],
    answer: 1,
    explain: "ttl = time-to-live หน่วยวินาที (ใช้ timedelta ได้) — ไม่ได้รันเองอัตโนมัติ แต่ access ครั้งถัดไปหลังหมดอายุจะ MISS",
  },
  {
    id: "w10-m9", week: "w10", type: "mcq", topic: "max_entries",
    q: "ข้อใดถูกต้องเกี่ยวกับ <code>max_entries</code>?",
    choices: ["จำกัดขนาด cache เป็น byte", "เมื่อ cache เต็มแล้วมี entry ใหม่ entry ที่เก่าที่สุดจะถูกลบ และจำกัดที่จำนวน entry ไม่ใช่ขนาด byte", "เมื่อเต็มแล้วจะไม่รับ entry ใหม่", "ใช้กำหนดจำนวน user ที่เข้าใช้ได้"],
    answer: 1,
    explain: "A limit controls the number of cached entries — not their exact byte size. Object size still matters.",
  },
  {
    id: "w10-m10", week: "w10", type: "mcq", topic: "Staleness",
    q: "ไฟล์ <code>data.csv</code> ถูกแก้ แต่ function code และ arguments เหมือนเดิม การเรียก <code>load_data(\"data.csv\")</code> ที่มี <code>@st.cache_data</code> (ไม่มี ttl) จะได้อะไร?",
    choices: ["DataFrame ใหม่ เพราะ Streamlit ตรวจไฟล์ให้", "DataFrame เก่า (stale cache hit)", "Error", "DataFrame ว่าง"],
    answer: 1,
    explain: "Streamlit ดูแค่ function + args + code ถ้าไม่ได้ทำให้การเปลี่ยนแปลงมองเห็นใน inputs (เช่นส่ง mtime) จะเป็น stale hit",
  },
  {
    id: "w10-m11", week: "w10", type: "mcq", topic: "Clear",
    q: "ต้องการล้าง cache ของฟังก์ชัน <code>load_data</code> <b>เพียงฟังก์ชันเดียว</b> ควรเขียนอย่างไร?",
    choices: ["<code>st.cache_data.clear()</code>", "<code>load_data.clear()</code>", "<code>st.cache_resource.clear()</code>", "<code>del load_data</code>"],
    answer: 1,
    explain: "func.clear() ล้างเฉพาะฟังก์ชันนั้น ส่วน st.cache_data.clear() ล้าง cache_data ทุกฟังก์ชัน",
  },
  {
    id: "w10-m12", week: "w10", type: "mcq", topic: "Should cache?",
    q: "ข้อใด<b>ไม่ควร</b> cache?",
    choices: ["อ่านไฟล์ CSV ขนาดใหญ่โดยมี ttl", "โหลด fitted model ที่ใช้ซ้ำ", "Chat history ของผู้ใช้แต่ละคน", "Transform ข้อมูลที่แพงและ input ซ้ำบ่อย"],
    answer: 2,
    explain: "user-specific mutable workflow state ควรเก็บใน Session State (Week 11) — cache ใช้ร่วมกันข้าม session",
  },
  {
    id: "w10-m13", week: "w10", type: "mcq", topic: "Lab 10",
    q: "ใน Lab 10 ทำไมจึงแปลงข้อมูลเป็น <code>tuple(tickets_df[\"text\"])</code> ก่อนส่งให้ <code>train_classifier_cached(texts, labels)</code>?",
    choices: ["เพราะ tuple เร็วกว่าในการ train", "เพราะ tuple เป็น immutable/hashable จึงใช้เป็นส่วนของ cache key ได้เสถียร", "เพราะ scikit-learn รับเฉพาะ tuple", "เพื่อซ่อนข้อมูลจาก user"],
    answer: 1,
    explain: "Cached function parameters must be hashable — Streamlit ต้องสร้าง key ที่เสถียรจาก arguments",
  },
  {
    id: "w10-m14", week: "w10", type: "mcq", topic: "Lab 10",
    q: "ใน <code>semantic_search</code> ทำไม <code>query_embedding[0] @ corpus_embeddings.T</code> จึงได้ cosine similarity?",
    choices: ["เพราะ @ คือ decorator ของ Streamlit", "เพราะ embeddings ถูกสร้างด้วย normalize_embeddings=True ทำให้ทุก vector ยาว 1 dot product จึงเท่ากับ cosine similarity", "เพราะ MiniLM คืนค่า probability", "เพราะ TF-IDF normalize ให้"],
    answer: 1,
    explain: "cos(a,b) = a·b / (|a||b|) เมื่อ |a| = |b| = 1 จะได้ a·b ตรง ๆ",
  },

  /* ---------- written ---------- */
  {
    id: "w10-w1", week: "w10", type: "written", topic: "Caching",
    q: "Caching คืออะไร? อธิบาย cache hit และ cache miss และเหตุใดจึงต้องใช้ caching ใน Streamlit",
    answer: `<p><b>Caching</b> คือการเก็บผลลัพธ์ที่เคยคำนวณไว้เพื่อนำกลับมาใช้ซ้ำเมื่อเจองานเดิม</p>
<p><b>Cache hit</b>: มี entry ที่ตรงกันและยังใช้ได้ → คืนค่าที่เก็บไว้ ไม่รัน function body (fast path)</p>
<p><b>Cache miss</b>: ไม่มี entry ที่ตรง → รันฟังก์ชันแล้วเก็บผลลัพธ์เป็น entry ใหม่ (slow path)</p>
<p>จำเป็นใน Streamlit เพราะทุกการโต้ตอบทำให้ script <b>rerun</b> งานหนัก (อ่านไฟล์ใหญ่ เรียก API/DB โหลด model สร้าง embeddings) จะถูกทำซ้ำ ทำให้ช้าและเปลือง resource — cache งานที่ expensive และ stable</p>`,
    keywords: [["hit"], ["miss"], ["rerun", "รันใหม่"], ["body", "ฟังก์ชัน", "function"], ["เก็บ", "store"], ["expensive", "แพง", "ช้า"]],
  },
  {
    id: "w10-w2", week: "w10", type: "written", topic: "data vs resource",
    q: "เปรียบเทียบ <code>st.cache_data</code> กับ <code>st.cache_resource</code> ทั้งด้านพฤติกรรม (copy vs shared) ประเภทข้อมูลที่เหมาะ และข้อควรระวัง",
    answer: `<p><b>cache_data</b>: ตอน miss รันฟังก์ชันแล้ว serialize ผลเก็บ ตอน hit deserialize แล้ว<b>คืนสำเนาใหม่</b> ให้ผู้เรียกแต่ละคน → ใช้กับ DataFrame, array, dict, list, str, number, ผล API/transform/inference</p>
<p><b>cache_resource</b>: เก็บ object ไว้และคืน <b>instance ตัวเดียวกัน</b> (ไม่ copy) ใช้ร่วมกันข้าม rerun และ session → ใช้กับ ML model, database connection, engine และประหยัด memory</p>
<p>ข้อควรระวังของ cache_resource: object ต้อง <b>thread-safe</b> และ<b>ห้าม mutate</b> เพราะทุก session จะเห็นการเปลี่ยนแปลง (เช่น append 99 หรือ remove(1) แล้ว error)</p>
<p>คำถามตัดสิน: ผู้เรียกควรได้ isolated result หรือใช้ object ร่วมกันโดยตั้งใจ?</p>`,
    keywords: [["copy", "สำเนา"], ["shared", "ร่วม", "ตัวเดียว"], ["dataframe", "data"], ["model", "connection"], ["thread", "mutate", "แก้"]],
  },
  {
    id: "w10-w3", week: "w10", type: "written", topic: "Code reading",
    q: "อธิบายผลลัพธ์ของ User A และ User B ในแต่ละขั้น เมื่อใช้ <code>@st.cache_resource</code>: (1) A เปิดแอป (2) A กด Append 99 (3) B เปิดแอป/rerun และถ้าเปลี่ยนเป็น <code>@st.cache_data</code> ผลต่างกันอย่างไร",
    code: `@st.cache_resource
def create_list():
    return [1, 2, 3]
my_list = create_list()
if st.button("Append 99"):
    my_list.append(99)
st.write("Current list:", my_list)`,
    answer: `<p><b>cache_resource</b>: (1) A: MISS สร้าง [1, 2, 3] (2) A: HIT ได้ object เดิมแล้ว append → [1, 2, 3, 99] และ object ใน cache ถูกแก้ (3) B: HIT ได้ object ตัวเดียวกัน → เห็น [1, 2, 3, 99]</p>
<p><b>cache_data</b>: ทุกครั้งได้สำเนา (2) A เห็น [1, 2, 3, 99] เฉพาะรอบนั้น (3) B เห็น [1, 2, 3] และ A rerun ครั้งต่อไปก็กลับเป็น [1, 2, 3] — copies isolate data</p>`,
    keywords: [["[1, 2, 3, 99]", "99"], ["shared", "ร่วม", "ตัวเดียวกัน"], ["copy", "สำเนา"], ["hit"], ["session", "user"]],
  },
  {
    id: "w10-w4", week: "w10", type: "written", topic: "Cache identity",
    q: "Cache identity ประกอบด้วยอะไรบ้าง? และการใส่ <code>_</code> หน้า parameter มีผลอย่างไร ควรระวังอะไร",
    answer: `<p>Cache hit ต้องเป็น “งานเดียวกัน”: (A) <b>cached function เดียวกัน</b> (B) <b>ค่า arguments ที่เกี่ยวข้องตรงกัน</b> (C) <b>source code ของฟังก์ชันไม่เปลี่ยน</b> — ถ้าเปลี่ยนอย่างใดอย่างหนึ่งจะ miss และสร้าง entry ใหม่</p>
<p>Arguments ต้อง <b>hashable</b> เพื่อให้ Streamlit สร้าง key ที่เสถียร การใส่ <code>_</code> นำหน้า (เช่น <code>_db_connection</code>) ทำให้ Streamlit <b>ไม่ hash/ไม่นับ</b> parameter นั้นเป็น key ใช้กับ object ที่ hash ไม่ได้</p>
<p>ข้อควรระวัง: อย่า ignore parameter ที่การเปลี่ยนค่าควรทำให้ผลลัพธ์เปลี่ยน ไม่งั้นจะได้ผลเก่าผิด ๆ</p>`,
    keywords: [["function", "ฟังก์ชัน"], ["argument", "parameter", "อาร์กิวเมนต์"], ["code", "โค้ด"], ["hash"], ["_", "underscore", "ขีดล่าง"]],
  },
  {
    id: "w10-w5", week: "w10", type: "written", topic: "Freshness",
    q: "Stale cache คืออะไร? อธิบายวิธีจัดการความสดของข้อมูลอย่างน้อย 3 วิธี พร้อมตัวอย่างโค้ดสั้น ๆ",
    answer: `<p><b>Stale cache</b>: ข้อมูลต้นทาง (ไฟล์/DB) เปลี่ยนแล้วแต่ code และ args เหมือนเดิม จึงยัง HIT และคืนข้อมูลเก่า</p>
<ul><li><b>ttl</b>: <code>@st.cache_data(ttl=3600)</code> หรือ <code>ttl=timedelta(hours=1)</code> หมดอายุแล้ว access ถัดไปรันใหม่</li>
<li><b>Manual clear</b>: <code>load_data.clear()</code> (ฟังก์ชันเดียว) / <code>st.cache_data.clear()</code> / <code>st.cache_resource.clear()</code> ผ่านปุ่ม</li>
<li><b>Version the input</b>: ส่ง <code>os.path.getmtime(path)</code> เป็น argument ไฟล์เปลี่ยน → mtime เปลี่ยน → miss อัตโนมัติ (Lab 13 ใช้ <code>st_mtime_ns</code>)</li></ul>
<p>นอกจากนี้ <code>max_entries</code> ใช้จำกัดจำนวน entry เพื่อกัน memory ล้น (ลบ entry เก่าสุด)</p>`,
    keywords: [["stale", "เก่า"], "ttl", ["clear"], ["mtime", "modification"], ["max_entries"]],
  },
  {
    id: "w10-w6", week: "w10", type: "written", topic: "Code reading",
    q: "อธิบายว่าโค้ดนี้ทำงานอย่างไรเมื่อผู้ใช้กดปุ่ม Test cache ครั้งแรกและครั้งที่สอง (ใช้เวลาประมาณเท่าใด แสดงอะไร)",
    code: `st.button('Test cache')
@st.cache_data
def cach_example(count):
    for i in range(1, count):
        time.sleep(1)
        st.write('.'*i)
    ans = pow(count, 2)
    return ans
out = cach_example(6)
st.write(f'Answer: {out}')`,
    answer: `<p>ครั้งแรก (MISS): loop <code>range(1, 6)</code> 5 รอบ sleep รอบละ 1 วินาที ≈ <b>5 วินาที</b> แสดงจุด . ถึง ..... แล้วคืน 6² = <b>36</b> และเก็บผลลง cache</p>
<p>ครั้งที่สอง: script rerun ทั้งไฟล์ แต่ <code>cach_example(6)</code> ใช้ args เดิม → <b>HIT</b> ข้าม body ไม่ sleep ได้ 36 ทันที แสดง Answer: 36 (ถ้าไม่มี decorator จะต้องรอ 5 วินาทีทุกครั้ง)</p>`,
    keywords: [["5", "ห้า"], "36", ["miss"], ["hit"], ["rerun", "รันใหม่"]],
  },
  {
    id: "w10-w7", week: "w10", type: "written", topic: "Design test",
    q: "จะตัดสินอย่างไรว่างานใดควร cache? ยกตัวอย่างงานที่ GOOD และ SKIP อย่างละ 2 ตัวอย่างพร้อมเหตุผล",
    answer: `<p>ถาม 2 ข้อ: <b>(1) การใช้ซ้ำประหยัดงานได้จริงไหม (2) การใช้ซ้ำยังถูกต้องไหม</b></p>
<p><b>GOOD</b>: อ่านไฟล์/DB/API ที่แพงโดยมีกฎความสด (ttl), การ transform แบบ deterministic ที่แพงและ input ซ้ำ, การโหลด fitted model ที่ใช้ซ้ำ</p>
<p><b>MAYBE</b>: prediction เมื่อ request ซ้ำจริง</p>
<p><b>SKIP</b>: เลขคณิต/format string ที่เร็ว, input แทบไม่ซ้ำ, state เฉพาะ user ที่เปลี่ยนได้ (ใช้ Session State), งานที่มี side effect ต้องเกิดทุกครั้ง (ส่งอีเมล เขียน DB)</p>`,
    keywords: [["ประหยัด", "save", "meaningful"], ["ถูกต้อง", "correct"], ["side effect", "side-effect"], ["session state", "session_state"], ["model", "ไฟล์", "api"]],
  },
  {
    id: "w10-w8", week: "w10", type: "written", topic: "Lab 10",
    q: "ใน Lab 10 ฟังก์ชันต่อไปนี้ควรใช้ decorator ใด เพราะอะไร: <code>load_data_cached</code>, <code>train_classifier_cached</code>, <code>load_embedding_model</code>, <code>create_corpus_embeddings</code> และอธิบายความต่างระหว่าง Tiny classifier กับ MiniLM โดยย่อ",
    answer: `<ul><li><code>load_data_cached</code> → <b>cache_data</b> (คืน DataFrame)</li>
<li><code>train_classifier_cached</code> → <b>cache_resource</b> (fitted Pipeline ใช้ร่วมกัน ไม่ copy; รับ tuple ที่ hash ได้)</li>
<li><code>load_embedding_model</code> → <b>cache_resource</b> (SentenceTransformer model)</li>
<li><code>create_corpus_embeddings</code> → <b>cache_data</b> (ndarray ของตัวเลข)</li></ul>
<p>Tiny classifier = TF-IDF (1–2 gram) + Logistic Regression ที่ train จาก dataset ของ lab ให้ <b>class probability</b> ส่วน MiniLM แปลงข้อความเป็น embedding 384 มิติ แล้วใช้ <b>cosine similarity</b> หา ticket ที่ใกล้ที่สุด (retrieval) จึงรับมือ paraphrase ได้ดีกว่า แต่ similarity ≠ probability</p>`,
    keywords: [["cache_data"], ["cache_resource"], ["tf-idf", "tfidf"], ["embedding", "384"], ["cosine", "similarity"], ["probability", "ความน่าจะเป็น"]],
  }
);
