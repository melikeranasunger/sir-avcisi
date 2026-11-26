const fs = require('fs');
const os = require('os');
const path = require('path');

// sahte sırları parça parça kuruyorum ki bu dosyanın kendisi taramaya takılmasın
const SAHTE = {
  aws: 'AKIA' + 'Q7RT2XMN5PLK8WEZ',
  github: 'ghp_' + 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8',
  dbSifresi: 'Erzurum' + '2026x!',
};

// içine verilen dosyaları yazan geçici bir klasör oluşturur
function geciciKlasor(dosyalar) {
  const kok = fs.mkdtempSync(path.join(os.tmpdir(), 'sir-'));
  for (const [ad, icerik] of Object.entries(dosyalar)) {
    const tam = path.join(kok, ad);
    fs.mkdirSync(path.dirname(tam), { recursive: true });
    fs.writeFileSync(tam, icerik);
  }
  return kok;
}

module.exports = { SAHTE, geciciKlasor };