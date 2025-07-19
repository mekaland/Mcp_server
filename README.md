# 🚀 MCP HTTP Server + Katmanlı API + n8n Entegrasyonu

Bu proje, **ModelContextProtocol (MCP)** SDK’sı kullanılarak geliştirilmiş, katmanlı mimariye sahip bir REST API ile entegre çalışan ve **n8n** otomasyon platformuna bağlanan bir Node.js sunucusudur.

---

## 📌 Proje Hedefi

💬 Kullanıcılarla doğal dilde etkileşim kuran bir yapay zeka aracılığıyla veritabanı işlemleri gerçekleştirmek. Sistem şunları içerir:

- n8n AI Agent
- Google Gemini Chat Model
- PostgreSQL tabanlı kullanıcı yönetimi
- MCP protokolü üzerinden veri akışı

---

## 🧱 Kullanılan Teknolojiler

| Katman             | Teknolojiler                                  |
|--------------------|-----------------------------------------------|
| API Sunucusu       | Node.js, Express, PostgreSQL (Docker)         |
| MCP Sunucusu       | @modelcontextprotocol/sdk                     |
| AI & Otomasyon     | n8n, Google Gemini                            |
| Bellek Sistemi     | PostgreSQL tabanlı Chat Memory                |
| Protokoller        | Server-Sent Events (SSE), JSON-RPC            |
| Yardımcılar        | Zod, Axios, body-parser, dotenv               |

---


📦 Proje Yapısı
.
├── server.js                 # MCP HTTP Server
├── docker-compose.yml       # Katmanlı API için Docker dosyası
├── api/                     # Katmanlı REST API (controller, service, repo)
├── .env                     # Ortam değişkenleri
├── mcp.json                 # n8n entegrasyonu için MCP Tool yapılandırması




### ✅ Kullanıcı İşlemleri (API Üzerinden)

- `createUserViaApi`: Yeni kullanıcı ekler  
- `listUsersViaApi`: Tüm kullanıcıları listeler  
- `updateUserViaApi`: Kullanıcı bilgilerini günceller  
- `deleteUserViaApi`: Belirtilen kullanıcıyı siler  

### ➕ Yardımcı Araçlar

- `add`, `subtract`, `multiply`, `divide`: Basit matematiksel işlemler  
- `passwordStrengthChecker`: Şifre gücünü analiz eder  
- `format_final_json_response`: AI agent için özel cevap formatlayıcı  

---

## 🧪 Kurulum

### 1. MCP Server'ı Başlat

```bash
npm install
node server.js
