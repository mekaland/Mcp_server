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



⚙️ Özellikler

✅ Kullanıcı İşlemleri (API üzerinden)

createUserViaApi: Yeni kullanıcı ekler

listUsersViaApi: Tüm kullanıcıları listeler

updateUserViaApi: Kullanıcı bilgilerini günceller

deleteUserViaApi: Belirtilen kullanıcıyı siler

➕ Yardımcı Araçlar
add, subtract, multiply, divide: Basit matematiksel işlemler

passwordStrengthChecker: Şifre gücünü analiz eder

format_final_json_response: AI agent için özel cevap formatlayıcı

🧪 Kurulum
1. MCP Server'ı Başlat
npm install
node server.js
MCP Server, http://localhost:4000/sse adresinde çalışır.

2. Katmanlı API’yi Docker ile Başlat

docker-compose up -d
API, http://localhost:3000/users üzerinden çalışır.

3. n8n Üzerinden Entegrasyon
MCP Tool node → http://host.docker.internal:4000/sse

Gemini, PostgreSQL ve MCP node’larını birbirine bağla.

Örnek mcp.json dosyasını Import Workflow diyerek yükle.

📮 API Endpoint'leri
🔹 Katmanlı API (3000 Portu)
Method	Endpoint	Açıklama
GET	/users	Tüm kullanıcıları getir
GET	/users/:id	Belirli kullanıcıyı getir
POST	/users	Yeni kullanıcı ekle
PUT	/users/:id	Kullanıcıyı güncelle
DELETE	/users/:id	Kullanıcıyı sil
