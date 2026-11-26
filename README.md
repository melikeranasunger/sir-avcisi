# 🔍 Sır Avcısı

Koda yanlışlıkla gömülmüş **şifre, token ve API anahtarlarını** commit'lenmeden ve yayılmadan yakalayan bir komut satırı aracı ve GitHub Action.

## Hangi problemi çözüyor?

Geliştiriciler zaman zaman `.env` dosyasını, veritabanı şifresini veya bir API anahtarını farkında olmadan GitHub'a push ediyor. Herkese açık depolar botlar tarafından sürekli taranıyor ve sızan bir anahtar dakikalar içinde kötüye kullanılabiliyor. Sonrasında anahtarı koddan silmek de yetmiyor, çünkü değer commit geçmişinde kalıyor. En ucuz çözüm, sırrı **ana dala girmeden önce** yakalamak.

## Kimin için?

Projelerini GitHub'da tutan öğrenciler, küçük ekipler ve açık kaynak geliştiricileri için. Ücretli güvenlik araçlarına ihtiyaç duymadan, tek bir komutla ya da CI hattına eklenen tek bir satırla kullanılabilir (DevSecOps).

## İş takip panosu

Pano: **[GitHub Projects panosu](https://github.com/users/melikeranasunger/projects/3)**

Panoda "Yapılacak", "Devam Ediyor" ve "Tamamlandı" sütunları var. Her kartta görevin açıklaması ve kabul kriterleri yer alıyor.