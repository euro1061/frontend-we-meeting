
# We-Meeting Frontend

We-Meeting เป็นแอปพลิเคชันเว็บสำหรับการจองและจัดการห้องประชุม ที่เก็บนี้ประกอบด้วยโค้ด frontend สำหรับโปรเจค We-Meeting

![Logo](https://img5.pic.in.th/file/secure-sv1/We-Meeting.jpg)

## สารบัญ

- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
  - [ความต้องการเบื้องต้น](#ความต้องการเบื้องต้น)
  - [การติดตั้ง](#การติดตั้ง)
- [การรันแอปพลิเคชัน](#การรันแอปพลิเคชัน)
- [การสร้างเวอร์ชันสำหรับใช้งานจริง](#การสร้างเวอร์ชันสำหรับใช้งานจริง)
- [การมีส่วนร่วมในการพัฒนา](#การมีส่วนร่วมในการพัฒนา)
- [ลิขสิทธิ์](#ลิขสิทธิ์)

## เทคโนโลยีที่ใช้

- [TypeScript](https://www.typescriptlang.org/)
- [Nuxt.js](https://nuxt.com/) (Vue.js framework)
- [Nuxt UI](https://ui.nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [dayjs](https://day.js.org/)
- [axios](https://axios-http.com/)
- [yup](https://github.com/jquense/yup)

## โครงสร้างโปรเจค

```
frontend-we-meeting/
├── components/      # คอมโพเนนต์ Vue ที่นำกลับมาใช้ใหม่ได้
├── composables/     # โค้ดที่ใช้ร่วมกัน (เช่น useBookingForm, useAuth)
├── layouts/         # เลย์เอาต์ของแอปพลิเคชัน
├── pages/           # หน้าต่างๆ ของแอปพลิเคชัน
├── plugins/         # ปลั๊กอิน Nuxt
├── utils/           # ฟังก์ชันยูทิลิตี้และ API client
├── nuxt.config.ts   # ไฟล์การตั้งค่า Nuxt
├── tailwind.config.js # การตั้งค่า Tailwind CSS
└── package.json     # รายการ dependencies และ scripts ของโปรเจค
```

## เริ่มต้นใช้งาน

### ความต้องการเบื้องต้น

- Node.js (เวอร์ชัน 14 หรือใหม่กว่า)
- npm หรือ yarn

### การติดตั้ง

1. โคลนที่เก็บ:
   ```
   git clone https://github.com/your-username/frontend-we-meeting.git
   cd frontend-we-meeting
   ```

2. ติดตั้ง dependencies:
   ```
   npm install
   # หรือ
   yarn install
   ```

3. ตั้งค่าตัวแปรสภาพแวดล้อม:
   สร้างไฟล์ `.env` ในไดเรกทอรีหลักและเพิ่มตัวแปรต่อไปนี้:
   ```
   API_BASE_URL=http://your-backend-api-url
   ```

## การรันแอปพลิเคชัน

เพื่อรันแอปพลิเคชันในโหมดพัฒนา:

```
npm run dev
# หรือ
yarn dev
```

แอปพลิเคชันจะสามารถเข้าถึงได้ที่ `http://localhost:3000`

## การสร้างเวอร์ชันสำหรับใช้งานจริง

เพื่อสร้างแอปพลิเคชันสำหรับการใช้งานจริง:

```
npm run build
# หรือ
yarn build
```

เพื่อเริ่มเซิร์ฟเวอร์สำหรับการใช้งานจริง:

```
npm run start
# หรือ
yarn start
```

## การมีส่วนร่วมในการพัฒนา

เรายินดีต้อนรับการมีส่วนร่วมในโปรเจค We-Meeting กรุณาอ่านแนวทางการมีส่วนร่วมของเราก่อนส่ง pull requests

## ลิขสิทธิ์

โปรเจคนี้อยู่ภายใต้ [ลิขสิทธิ์ MIT](LICENSE)
