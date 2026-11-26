const fs = require('fs');
const path = require('path');
const kurallar = require('./kurallar');

const ATLANACAK_KLASORLER = ['.git', 'node_modules'];
const MAKS_BOYUT = 1024 * 1024; // 1 MB üstü dosyalara bakmıyorum
const YOKSAY_ISARETI = 'sir-avcisi:yoksay';

// "changeme", "${DB_PASS}", "process.env.X" gibi şeyler gerçek sır değil
function yerTutucuMu(deger) {
  return (
    /^(x+|\*+|changeme|password|parola|sifre|şifre|your[_-]?\w*|example\w*|ornek\w*|dummy\w*|test\w*)$/i.test(deger) ||
    /^[$<{%]/.test(deger) ||
    deger.includes('process.env')
  );
}

// ekrana basarken sırrın tamamını göstermemek için
function maskele(deger) {
  if (deger.length <= 6) return deger[0] + '*****';
  return deger.slice(0, 4) + '*'.repeat(Math.min(deger.length - 4, 8));
}

function metniTara(metin, dosya = '<metin>') {
  const bulgular = [];
  metin.split(/\r?\n/).forEach((satir, i) => {
    if (satir.includes(YOKSAY_ISARETI)) return; // bilerek bırakılmış satır
    for (const kural of kurallar) {
      const eslesme = satir.match(kural.desen);
      if (!eslesme) continue;
      const deger = eslesme[1] || eslesme[0];
      if (yerTutucuMu(deger)) continue;
      bulgular.push({ dosya, satir: i + 1, kural: kural.ad, ornek: maskele(deger) });
      break; // aynı satırı iki kere raporlamasın
    }
  });
  return bulgular;
}

// .sirignore: her satır bir yol öneki, # ile başlayanlar yorum
function yoksayListesiOku(kok) {
  const yol = path.join(kok, '.sirignore');
  if (!fs.existsSync(yol)) return [];
  return fs
    .readFileSync(yol, 'utf8')
    .split(/\r?\n/)
    .map((s) => s.trim().replace(/^\.\//, ''))
    .filter((s) => s && !s.startsWith('#'));
}

function dosyalariListele(kok) {
  const yoksay = yoksayListesiOku(kok);
  const sonuc = [];

  (function gez(klasor) {
    for (const girdi of fs.readdirSync(klasor, { withFileTypes: true })) {
      const tam = path.join(klasor, girdi.name);
      const goreli = path.relative(kok, tam).split(path.sep).join('/');
      if (yoksay.some((y) => goreli === y.replace(/\/$/, '') || goreli.startsWith(y.endsWith('/') ? y : y + '/'))) continue;
      if (girdi.isDirectory()) {
        if (!ATLANACAK_KLASORLER.includes(girdi.name)) gez(tam);
      } else if (girdi.isFile()) {
        sonuc.push(goreli);
      }
    }
  })(kok);

  return sonuc;
}

function klasoruTara(kok) {
  const bulgular = [];
  let dosyaSayisi = 0;

  for (const goreli of dosyalariListele(kok)) {
    const tam = path.join(kok, goreli);
    if (fs.statSync(tam).size > MAKS_BOYUT) continue;
    const icerik = fs.readFileSync(tam);
    if (icerik.includes(0)) continue; // binary dosya, geç
    dosyaSayisi++;
    bulgular.push(...metniTara(icerik.toString('utf8'), goreli));
  }
  return { dosyaSayisi, bulgular };
}

module.exports = { metniTara, klasoruTara, dosyalariListele, maskele, yerTutucuMu };