# Google Sheets Stock Setup

ใช้โฟลเดอร์นี้สำหรับต่อเว็บ Nunaa.Collection กับ Google Sheets

## 1. สร้าง Google Sheet

สร้างชีตชื่อ `Products` แล้วใส่ header แถวแรกตามนี้:

```text
code,name,price,detail,image,colorName,colorValue,stock,active
```

ตัวอย่าง 1 สีต่อ 1 แถว:

```text
nn-001,Pumpkins crop top,250,Cotton • Chest 24"-36",assets/images/products/nn-001-pumpkins-crop-top.jpeg,ขาว,#edf1ee,3,TRUE
nn-001,Pumpkins crop top,250,Cotton • Chest 24"-36",assets/images/products/nn-001-pumpkins-crop-top.jpeg,ส้มอิฐ,#bb4a33,2,TRUE
```

ถ้าสินค้ามีหลายสี ให้ใช้ `code` เดิมซ้ำหลายแถว และเปลี่ยน `colorName`, `colorValue`, `stock`

## 2. เพิ่ม Apps Script

1. เปิด Google Sheet
2. ไปที่ `Extensions > Apps Script`
3. วางโค้ดจาก `google-apps-script/Code.gs`
4. กด Save

## 3. Deploy เป็น Web App

ก่อน deploy ให้เปิด `Project Settings > Script Properties` แล้วเพิ่ม:

```text
FIREBASE_WEB_API_KEY = Firebase Web API key ของโปรเจกต์
```

ค่านี้ใช้เฉพาะฝั่ง Apps Script สำหรับตรวจ Firebase ID token และไม่ควรเขียนไว้ใน `Code.gs`

1. กด `Deploy > New deployment`
2. เลือก type เป็น `Web app`
3. Execute as: `Me`
4. Who has access: `Anyone`
5. กด Deploy
6. Copy Web App URL ที่ลงท้ายด้วย `/exec`

## 4. ใส่ URL ในเว็บ

เปิดไฟล์ `assets/js/config.js` แล้วใส่ URL:

```js
window.NUNAA_CONFIG = {
  appsScriptUrl: 'https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec'
};
```

## การทำงาน

- หน้าเว็บจะโหลดสินค้าและ stock จากชีต `Products`
- ตอนลูกค้ายืนยันออเดอร์ เว็บจะส่ง order ไป Apps Script
- Apps Script จะตรวจ stock และยอดจองที่ยังไม่หมดอายุ แล้วบันทึก order เป็น `pending` โดยยังไม่หัก stock จริง
- ราคา จำนวน ยอดรวม และเวลาหมดอายุจะถูกตรวจและคำนวณใหม่จากชีต `Products`/เวลาเซิร์ฟเวอร์ ไม่เชื่อค่าที่ส่งมาจาก browser
- ระบบรับสูงสุด 10 ชิ้นต่อออเดอร์และปฏิเสธจำนวนที่ไม่ใช่จำนวนเต็มบวก
- เมื่อลูกค้าส่งสลิปแล้วกดแจ้งชำระเงิน สถานะจะเปลี่ยนเป็น `payment_reported` และขยายเวลาจองสำหรับการตรวจสอบ 24 ชั่วโมง
- ออเดอร์ที่สร้างตั้งแต่ 22:00 น. เป็นต้นไปและแจ้งชำระแล้ว จะแจ้งลูกค้าว่าร้านจะตรวจสอบภายใน 13:00 น. ของวันถัดไป โดย stock ยังถูกจองไว้
- ถ้า order ยังเป็น `pending` จนครบ 15 นาที ระบบจะเปลี่ยนเป็น `expired` และคืน stock ให้อัตโนมัติเมื่อมีการเรียก Apps Script ครั้งถัดไป
- หลังร้านตรวจสลิปแล้ว ให้เปลี่ยน `status` เป็น `paid` ระบบจึงหัก stock จริงและบันทึก `paidAt`
- ถ้าต้องยกเลิก order ให้เปลี่ยน `status` เป็น `cancelled` หรือ `expired` ระบบจะคืน stock ให้ถ้า order นั้นเคยหัก stock แล้ว
- ถ้ายังไม่ใส่ `appsScriptUrl` เว็บจะใช้ข้อมูลสินค้าเดิมในไฟล์ `assets/js/app.js`

## วิธีจัดการ order หลังลูกค้าสั่งซื้อ

ในชีต `Orders`:

- ถ้าลูกค้าโอนแล้ว ให้แก้ column `status` จาก `pending` เป็น `paid`
- ถ้าสถานะเป็น `payment_reported` และสลิปถูกต้อง ให้เปลี่ยนเป็น `paid`; หากสลิปไม่ถูกต้องให้เปลี่ยนเป็น `payment_rejected` เพื่อคืน stock
- ถ้าลูกค้ายกเลิกหรือไม่โอน ให้แก้ column `status` เป็น `cancelled` หรือ `expired`

ถ้า `onEdit` ไม่ทำงานอัตโนมัติ ให้กลับไป Apps Script แล้วกด Run ฟังก์ชัน:

```text
processPaidOrders
```

หลัง deploy ครั้งแรก ให้กด Run ฟังก์ชัน `setupOrderEditTrigger` หนึ่งครั้งและอนุญาตสิทธิ์ เพื่อให้การเปลี่ยน `status` คืน/หัก stock ได้อัตโนมัติ หากมีออเดอร์ `cancelled` หรือ `expired` ที่ยังไม่คืน stock ให้กด Run ฟังก์ชัน `processCancelledOrders`

สำหรับ order ที่หมดอายุ ให้เรียก action `products` จากหน้าเว็บหรือเปิดเว็บตามปกติ ระบบจะรัน `expirePendingOrders` ตอนสร้าง order ใหม่ หรือจะเพิ่ม time-driven trigger ให้รันฟังก์ชัน `expirePendingOrders` เป็นระยะก็ได้

## Rate limit และ CAPTCHA

- API จำกัดคำขอต่อ client ID แยกตาม create order, report payment และ order status
- มี honeypot field สำหรับ bot อัตโนมัติ
- หากใช้ Cloudflare Turnstile ให้ใส่ site key ใน `assets/js/config.js` และเพิ่ม Script Property ชื่อ `TURNSTILE_SECRET_KEY` ใน Apps Script จากนั้น deploy ทั้งเว็บและ Web App ใหม่
