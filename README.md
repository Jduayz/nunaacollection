# Nunaa.Collection

เว็บไซต์สำหรับแบรนด์เสื้อผ้า Nunaa.Collection แนว Everyday Look ใช้ผ้าท้องถิ่นจากเชียงใหม่ ใส่สบาย แมตช์ง่าย และดูแลง่าย

## Live Domain

https://nunaacollection.com

## Features

- Responsive landing page
- Product catalog
- Shopping cart prototype
- Checkout information section
- Fabric story
- Fabric care guide
- Instagram contact button
- SEO meta tags
- GitHub Pages ready

## Tech Stack

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- Custom domain: nunaacollection.com

## Folder Structure

```txt
/
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── icons/
├── data/
├── docs/
├── index.html
├── CNAME
├── README.md
├── CHANGELOG.md
├── PROJECT_DISCOVERY.md
└── ROADMAP.md
```

## Deployment

1. Create a GitHub repository named `nunaacollection`
2. Upload all project files
3. Go to Settings -> Pages
4. Select branch `main` and folder `/root`
5. Add custom domain `nunaacollection.com`
6. Configure DNS at domain provider
7. Enable HTTPS

หลัง DNS ถูกต้อง ให้เปิด `Enforce HTTPS` ใน Settings → Pages และตรวจว่าทั้ง `http://nunaacollection.com` และ `http://www.nunaacollection.com` redirect ไป HTTPS

## DNS for GitHub Pages

```txt
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www <github-username>.github.io
```

## Visitor Analytics

หน้าร้านใช้ Google Analytics 4 รหัส `G-K9X60P9Y7D` เฉพาะ `index.html` เพื่อเก็บสถิติการเข้าชม โดยไม่ได้ติดตั้งบนหน้าผู้ดูแลหรือหน้าบันทึกยอดขาย

เปิด https://analytics.google.com/ ด้วยบัญชีที่มีสิทธิ์เข้าถึง property นี้ เลือก Reports → Realtime เพื่อตรวจการเข้าชมล่าสุด หรือรายงานผู้ใช้และหน้าเว็บเพื่อดูยอดตามช่วงเวลา จำนวนผู้ใช้กับจำนวนการเปิดหน้าเว็บเป็นคนละตัวเลข

เริ่มเก็บเมื่อโค้ดถูกเผยแพร่บนเว็บจริง ไม่สามารถสร้างยอดย้อนหลังที่ไม่ได้เก็บไว้ได้ การติดตั้งโค้ดเพียงอย่างเดียวยังไม่ยืนยันว่า property ได้รับข้อมูล ต้องตรวจใน Realtime หรือ Tag Assistant ด้วย

## License

Copyright © Nunaa.Collection. All rights reserved.
