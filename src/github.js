const fs = require('fs');

// GitHub bu formatı görünce uyarıyı PR'daki ilgili satırın üstüne koyuyor
function annotasyonlar(bulgular) {
  return bulgular.map(
    (b) => `::error file=${b.dosya},line=${b.satir},title=Sır Avcısı::${b.kural} bulundu (${b.ornek}). Bu değeri koddan çıkarıp secret olarak sakla.`
  );
}

// Actions çalıştırma sayfasındaki özet tablosu
function ozetMetni({ dosyaSayisi, bulgular }) {
  if (!bulgular.length) {
    return `## 🔍 Sır Avcısı\n\n✅ **${dosyaSayisi}** dosya tarandı, sızmış sır bulunamadı.\n`;
  }
  const satirlar = bulgular.map((b) => `| \`${b.dosya}\` | ${b.satir} | ${b.kural} | \`${b.ornek}\` |`);
  return [
    '## 🔍 Sır Avcısı',
    '',
    `❌ **${dosyaSayisi}** dosya tarandı, **${bulgular.length}** olası sır bulundu.`,
    '',
    '| Dosya | Satır | Tür | Değer |',
    '|---|---|---|---|',
    ...satirlar,
    '',
    '> Sızan anahtarı **iptal edip yenisini oluştur**. Koddan silmek yetmez, eski değer commit geçmişinde kalır.',
    '',
  ].join('\n');
}

function githubaRaporla(sonuc) {
  for (const satir of annotasyonlar(sonuc.bulgular)) console.log(satir);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, ozetMetni(sonuc));
  }
}

module.exports = { annotasyonlar, ozetMetni, githubaRaporla };