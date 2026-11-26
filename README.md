# 🔍 Sır Avcısı

Koda yanlışlıkla gömülmüş **şifre, token ve API anahtarlarını** commit'lenmeden ve yayılmadan yakalayan bir komut satırı aracı ve GitHub Action.

## Hangi problemi çözüyor?

Geliştiriciler zaman zaman `.env` dosyasını, veritabanı şifresini veya bir API anahtarını farkında olmadan GitHub'a push ediyor. Herkese açık depolar botlar tarafından sürekli taranıyor ve sızan bir anahtar dakikalar içinde kötüye kullanılabiliyor. Sonrasında anahtarı koddan silmek de yetmiyor, çünkü değer commit geçmişinde kalıyor. En ucuz çözüm, sırrı **ana dala girmeden önce** yakalamak.

## Kimin için?

Projelerini GitHub'da tutan öğrenciler, küçük ekipler ve açık kaynak geliştiricileri için. Ücretli güvenlik araçlarına ihtiyaç duymadan, tek bir komutla ya da CI hattına eklenen tek bir satırla kullanılabilir (DevSecOps).

## İş takip panosu

Pano: **[GitHub Projects panosu](https://github.com/users/melikeranasunger/projects/3)**

Panoda "Yapılacak", "Devam Ediyor" ve "Tamamlandı" sütunları var. Her kartta görevin açıklaması ve kabul kriterleri yer alıyor.

## Neleri yakalar?

| Tür | Örnek biçim |
|---|---|
| AWS erişim anahtarı | `AKIA` + 16 karakter |
| GitHub token | `ghp_...`, `github_pat_...` |
| Google API anahtarı | `AIza...` |
| Slack / Stripe anahtarları | `xoxb-...`, `sk_live_...` |
| Özel anahtar dosyaları | `BEGIN ... PRIVATE KEY` başlığı |
| Koda gömülü parola | `password: "..."`, `apiKey = '...'`, `şifre = "..."` |
| `.env` değerleri | `DB_PASSWORD=...`, `SECRET_TOKEN=...` |

`changeme`, `${DB_PASS}`, `process.env.X` gibi yer tutucular **yanlış alarm sayılmaz**. Bulunan değerin tamamı ekrana basılmaz, maskelenerek gösterilir.

## Projeyi çalıştırma

Gereksinim: **Node.js 18 veya üzeri**. Harici paket yok, `npm install` gerekmiyor.

```bash
git clone https://github.com/melikeranasunger/sir-avcisi.git
cd sir-avcisi
npm test                          # testleri çalıştırır
node bin/sir-avcisi.js <klasör>   # bir klasörü tarar
```

Çıkış kodları: `0` sır yok, `1` sır bulundu, `2` klasör bulunamadı.

**Yanlış alarmı susturmak:** Satırın sonuna `sir-avcisi:yoksay` yorumu eklenebilir ya da yol, kök dizindeki `.sirignore` dosyasına yazılabilir (örneğin `test/fixtures/`).

## Özellikleri nasıl denersiniz?

### 1) Klasördeki sızmış sırları tespit eden CLI

```bash
mkdir deneme
echo "PORT=3000" > deneme/.env
echo "DB_PASSWORD=Erzurum2026x" >> deneme/.env          # sir-avcisi:yoksay
echo 'const ayar = { password: "changeme" };' > deneme/ayar.js
node bin/sir-avcisi.js deneme
```

Beklenen:
- `.env:2` satırı **.env Gizli Değeri** olarak raporlanır, değer `Erzu********` şeklinde maskelenir.
- `ayar.js` içindeki `changeme` yer tutucu olduğu için raporlanmaz.
- Çıkış kodu `1` olur (`echo $?` ile görülebilir).
- `deneme/.env` silinip tekrar çalıştırılınca "✅ Sızmış sır bulunamadı." yazar.