# Team Field Notes

บันทึกจาก kickoff review รอบแรกของทีม UX/UI, Conversion และ QA

## Shared Priorities

1. Hero ควรใช้ภาพสินค้าจริงหรือภาพงานคราฟต์ ไม่ใช่ mood card แบบ abstract เพียงอย่างเดียว
2. Product discovery ต้องช่วยให้ลูกค้าเลือกง่ายขึ้น เช่น filter, category, best sellers, sets หรือ quick detail
3. Cart-to-checkout flow บนมือถือเป็นจุดเสี่ยงหลัก ต้องลดความสับสนระหว่างตะกร้า, QR payment และ Instagram handoff
4. Checkout ต้องเพิ่ม trust signal เช่น ค่าส่ง, ระยะเวลาจัดส่ง, วิธีคอนเฟิร์มชำระเงิน, exchange policy และเวลาตอบกลับ
5. Product data ต้องตรวจสม่ำเสมอ เพราะข้อมูล live จาก Google Sheets และ fallback ใน `assets/js/app.js` อาจไม่ตรงกัน

## UX/UI Notes

- จุดแข็ง: มี storefront foundation ครบกว่าหน้า landing ทั่วไป ทั้ง product catalog, cart, checkout, QR payment, fabric story และ care guide
- โอกาสหลัก: first viewport ยังไม่โชว์เสื้อผ้าจริงพอสำหรับแบรนด์ fashion/craft
- งานแรกที่ควรทำ:
  - เปลี่ยน hero ให้มีภาพสินค้า/งานผ้าจริง
  - เพิ่ม filter หรือ structure ให้ catalog
  - ทำ mobile cart summary หรือ checkout CTA ให้ลูกค้าไม่หลุด flow

## Conversion Notes

- จุดแข็ง: funnel ชัดจาก hero CTA ไปสินค้า ตะกร้า checkout และ Instagram
- โอกาสหลัก: checkout ยังต้องพึ่ง copy order, scan QR, และส่ง slip เอง จึงควรมีคำอธิบายและ reassurance เพิ่ม
- งานแรกที่ควรทำ:
  - เพิ่ม confidence block ก่อน checkout
  - เพิ่ม conversion label ใน product card เช่น category, fit note, limited stock
  - ทำ Instagram CTA ให้พก order summary ไปให้มากที่สุดเท่าที่ทำได้

## QA Notes

- จุดเสี่ยง: Apps Script endpoint, duplicate order, CORS/permission, clipboard rejection และ stock ที่ตัดหลัง manual paid status
- สิ่งที่ต้องทดสอบ:
  - End-to-end mobile order
  - Stock edge cases
  - Apps Script failure modes
  - Responsive layout บนมือถือและ desktop
  - Product data integrity จาก Google Sheets เทียบกับ image files
- งานแรกที่ควรทำ:
  - สร้าง smoke-test checklist สำหรับ live purchase path
  - ทำ mobile viewport pass
  - ทำ checklist ตรวจ field สินค้าและรูปภาพ

## Workspace Note

ทีมสำรวจพบว่า `index.html` และ `assets/css/style.css` มี local modifications อยู่ก่อนแล้ว จึงควรถือว่าเป็น draft/user-owned changes และห้าม revert โดยไม่ได้รับคำสั่งชัดเจน
