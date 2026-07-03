# Kickoff Backlog

## Sprint 1: Make The Shop Easier To Buy From

**Goal:** ให้ลูกค้าเข้าเว็บจากมือถือ เห็นสินค้า เข้าใจราคา/รายละเอียด และรู้วิธีสั่งซื้อภายในไม่กี่วินาที

### Team Lead / Agent Router

- รับโจทย์รอบ Sprint 1 จากเจ้าของโปรเจคและแปลงเป็น task list
- จัดลำดับงานให้ชัดว่าอะไรต้อง design ก่อน implementation และอะไรทดสอบทีหลัง
- กัน scope ชนกันระหว่างงาน hero, product card, checkout และ content
- สรุป decision log สั้น ๆ เมื่อมีการเลือกแนวทางสำคัญ

### Brand / Creative Director

- นิยาม brand voice สั้น ๆ 5-7 bullet สำหรับใช้กับ hero, product, FAQ
- ตรวจ hero section ว่าบอกตัวตน Nunaa.Collection ชัดตั้งแต่ viewport แรกหรือยัง
- ระบุ visual guardrails สำหรับสี, texture, photo treatment, และ spacing

### UX/UI Designer

- ตรวจ mobile product grid และ cart flow
- เสนอ layout ที่ทำให้ CTA และราคาสแกนง่ายขึ้น
- ตรวจ text overflow ในปุ่ม, card, และ checkout area

### Frontend Engineer

- ทำ local smoke test ของ `index.html`, `assets/css/style.css`, และ `assets/js/app.js`
- ตรวจ console error และ asset path
- เตรียมรายการ refactor เล็ก ๆ ที่ลดความซ้ำใน CSS/JS โดยไม่เปลี่ยนพฤติกรรม

### E-commerce / Conversion Specialist

- ตรวจ product card ว่ามีข้อมูลพอให้ตัดสินใจหรือยัง
- เสนอ trust signals ที่ควรเพิ่ม เช่น shipping, payment, contact, return/exchange
- ตรวจ cart และ checkout prototype ว่าขั้นตอนถัดไปชัดเจนหรือไม่

### Content / Copywriter

- ตรวจ product descriptions ว่าช่วยขายและไม่ยาวเกินไป
- ร่าง FAQ ชุดแรก: ไซซ์, เนื้อผ้า, การดูแล, การจัดส่ง, วิธีสั่งซื้อ
- ปรับ CTA microcopy ให้สอดคล้องกันทั้งเว็บ

### QA / Polish Reviewer

- ทำ checklist ทดสอบบน Chrome desktop และ mobile viewport
- ตรวจรูปสินค้าทั้งหมดใน `assets/images/products/`
- ตรวจ cart actions: add, increase, decrease, remove, empty cart

## Definition Of Done

- หน้าเว็บไม่มี console error ใน flow หลัก
- Product browsing และ cart ใช้งานได้บนมือถือ
- CTA/contact ชัดเจน
- รูปสินค้าและข้อมูลหลักโหลดครบ
- มีบันทึกการเปลี่ยนแปลงเมื่อแก้สิ่งที่ผู้ใช้เห็น
