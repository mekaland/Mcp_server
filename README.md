# MCP Server Projesi

![MCP Server](https://raw.githubusercontent.com/mekaland/Mcp_server/main/logo.png)  
*ModelContextProtocol (MCP) tabanlı kullanıcı yönetimi ve yapay zeka destekli araçlar sunan Node.js sunucusu*

---

## 🚀 Proje Hakkında

Bu proje, MCP (ModelContextProtocol) SDK kullanılarak geliştirilmiş, PostgreSQL veritabanı ile entegre çalışan bir Node.js sunucusudur. Kullanıcı ekleme, listeleme, güncelleme ve silme gibi temel CRUD işlemlerini REST ve SSE (Server-Sent Events) üzerinden destekler. Ayrıca, matematiksel araçlar ve şifre güç kontrolü gibi yardımcı fonksiyonlar da içerir.

Projede ayrıca, n8n otomasyon platformunda kullanılmak üzere yapılandırılmış bir `mcp.json` dosyası bulunmaktadır. Bu dosya ile MCP araçları, Google Gemini dil modeli ve Postgres tabanlı sohbet belleği n8n iş akışlarına entegre edilir.

---

## 🛠️ Özellikler

- **Kullanıcı Yönetimi:**  
  - `createUser`: Yeni kullanıcı ekleme  
  - `listUsers`: Kayıtlı tüm kullanıcıları listeleme  
  - `updateUser`: Kullanıcı bilgilerini güncelleme  
  - `deleteUser`: Kullanıcı silme  

- **Matematiksel İşlemler:**  
  - Toplama, çıkarma, çarpma, bölme (bölme sıfıra bölünemez)  

- **Şifre Güç Kontrolü:**  
  - Uzunluk, büyük/küçük harf, rakam ve özel karakter kontrolü  
  - Güç seviyesi: Zayıf, Orta, Güçlü  

- **İleri MCP Entegrasyonu:**  
  - `format_final_json_response` aracı ile JSON çıktı formatlama  
  - n8n ile kolay entegrasyon için `mcp.json` workflow dosyası  

---

## 📋 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (versiyon 16 veya üstü önerilir)  
- PostgreSQL veritabanı (Docker ya da lokal)  
- MCP SDK: `@modelcontextprotocol/sdk` ve diğer bağımlılıklar

### Veritabanı Ayarları

PostgreSQL’de aşağıdaki bilgileri kullanarak bir `mcp` veritabanı oluşturun ve aşağıdaki tabloyu ekleyin:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
