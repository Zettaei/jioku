import type { Lang } from "./en";

export const th: Lang = {
  nav: {
    search: "ค้นหา",
    deck: "ชุดบัตร",
    settings: "ตั้งค่า",
    login: "เข้าสู่ระบบ",
    appTitle: "J I O K U",
  },

  search: {
    title: "พจนานุกรม",
    subtitle: "ค้นหาพจนานุกรมด้วยข้อความ รูปภาพ หรือเสียง",
    placeholder: "ค้นหา...",
    placeholderListening: "กำลังฟัง...",
    placeholderProcessing: "กำลังประมวลผล...",

    attachImage: {
      label: "แนบรูปภาพ",
      tooltip: "อ่านข้อความจากรูปภาพ รองรับ PNG, JPG, WEBP และ BMP",
    },

    voiceInput: {
      label: "แปลงเสียงเป็นข้อความ",
      tooltip: "แยกภาษาญี่ปุ่นจากเสียง ต้องใช้ไมโครโฟน",
      stopRecording: "หยุดบันทึก",
      searchByVoice: "ค้นหาด้วยเสียง",
    },

    translation: {
      label: "แปลเป็น",
    },

    history: {
      title: "ประวัติคำค้นหา",
      clearAll: "ล้างทั้งหมด",
      confirmTitle: "ล้างประวัติการค้นหา",
      confirmMessage:
        "คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการค้นหาทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้",
    },
  },

  card: {
    quickTranslation: "การแปลอย่างรวดเร็ว:",
    searchKeywords: "คำค้นหา:",
    resultFound: "พบผลลัพธ์",
    alternatives: "คำอื่น ๆ",
    reading: "การอ่าน",
    meaning: "ความหมาย",
  },

  common: {
    yes: "ใช่",
    no: "ไม่",
  },
};
