# Nunaa.Collection Team

ทีมนี้ถูกตั้งไว้สำหรับพัฒนาเว็บไซต์ Nunaa.Collection ให้สวยขึ้น ใช้งานง่ายขึ้น และช่วยให้ลูกค้าตัดสินใจซื้อได้มั่นใจขึ้น

## Core Team

| Role | Mission | Owns |
| --- | --- | --- |
| Team Lead / Agent Router | รับโจทย์จากเจ้าของโปรเจค แปลงเป็นงานย่อย และส่งต่อให้ role ที่เหมาะสม | Intake, routing, scope, priority, handoff |
| Brand / Creative Director | รักษาภาพรวมแบรนด์ให้ดูอบอุ่น เรียบง่าย และมีเอกลักษณ์ผ้าท้องถิ่นเชียงใหม่ | Brand voice, visual mood, storytelling |
| UX/UI Designer | ทำให้เว็บอ่านง่าย ซื้อของง่าย และดูดีบนมือถือ | Layout, interaction, responsive UX |
| Frontend Engineer | แปลงงานออกแบบเป็นเว็บที่เร็ว เสถียร และดูเนียน | HTML, CSS, JavaScript, performance |
| E-commerce / Conversion Specialist | เพิ่มความชัดเจนของสินค้า ความน่าเชื่อถือ และ flow การสั่งซื้อ | Product pages, CTA, cart, checkout |
| Content / Copywriter | เขียนข้อความให้เข้ากับแบรนด์และช่วยตอบคำถามลูกค้า | Product copy, FAQ, care guide, policy text |
| QA / Polish Reviewer | ตรวจความเรียบร้อยก่อนปล่อยงาน | Manual testing, mobile checks, broken links, polish |

## Default Working Rhythm

1. Product owner พูดโจทย์แบบธรรมชาติ เช่น เพิ่มยอดสั่งซื้อ, ปรับมือถือ, เพิ่มสินค้า
2. Team Lead แยกเจตนา ขอบเขต ความเสี่ยง และเลือก role ที่ควรรับงาน
3. Brand, UX/UI, Conversion หรือ Content วางแนวทางตามลักษณะงาน
4. Frontend ทำ implementation แบบเล็กและตรวจง่าย
5. QA ตรวจมือถือ, layout, link, form, cart และ checkout ก่อนปล่อย
6. Team Lead สรุปผล สิ่งที่เปลี่ยน สิ่งที่ยังค้าง และงานถัดไป
7. สรุปสิ่งที่เปลี่ยนใน `CHANGELOG.md` เมื่อเป็นงานที่กระทบผู้ใช้

## Team Rules

- Mobile-first เสมอ เพราะลูกค้าเสื้อผ้ามักดูจากมือถือ
- หลีกเลี่ยงการเปลี่ยนหลายเรื่องใน PR เดียว ถ้าไม่จำเป็น
- รูปสินค้าและราคาต้องตรวจซ้ำก่อน deploy
- CTA ต้องชัดเจน แต่ไม่เร่งขายจนเสียความรู้สึกของแบรนด์
- ทุกงานที่แก้ UI ต้องตรวจที่ desktop และ mobile อย่างน้อยหนึ่งรอบ
- ถ้าแตะข้อมูลสินค้า ให้ตรวจ `data/`, รูปใน `assets/images/products/`, และส่วน render ใน `assets/js/app.js`

## Current Team Status

ทีมเริ่มต้นที่เปิดใช้งาน:

- Team Lead / Agent Router
- UX/UI Designer
- Frontend Engineer
- E-commerce / Conversion Specialist
- Content / Copywriter
- QA / Polish Reviewer

Brand / Creative Director ทำหน้าที่เป็นคนคุม tone รวมของทีม และควรถูกดึงเข้ามาทุกครั้งที่เปลี่ยน hero, story, copy สำคัญ หรือภาพรวม visual identity

Team Lead / Agent Router เป็นหน้าด่านหลักของทีม เจ้าของโปรเจคสามารถสั่งงานกับ Team Lead ก่อนเสมอโดยไม่ต้องรู้ว่าควรเรียก role ไหน
