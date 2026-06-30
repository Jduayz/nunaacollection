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
- ตอนลูกค้ากดคัดลอกออเดอร์ เว็บจะส่ง order ไป Apps Script
- Apps Script จะบันทึก order ลงชีต `Orders`
- Apps Script จะลด stock ในชีต `Products`
- ถ้ายังไม่ใส่ `appsScriptUrl` เว็บจะใช้ข้อมูลสินค้าเดิมในไฟล์ `assets/js/app.js`
