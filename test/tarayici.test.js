const test = require('node:test');
const assert = require('node:assert');
const { metniTara, klasoruTara, maskele } = require('../src/tarayici');
const { SAHTE, geciciKlasor } = require('./yardimci');

test('AWS anahtarını bulur', () => {
  const b = metniTara(`const key = "${SAHTE.aws}";`);
  assert.strictEqual(b.length, 1);
  assert.strictEqual(b[0].kural, 'AWS Erişim Anahtarı');
});

test('GitHub token bulur ve doğru satırı verir', () => {
  const b = metniTara(`// ayarlar\n\nconst t = '${SAHTE.github}';`, 'config.js');
  assert.deepStrictEqual([b[0].dosya, b[0].satir, b[0].kural], ['config.js', 3, 'GitHub Token']);
});

test('koda gömülü parolayı bulur (Türkçe anahtar kelime dahil)', () => {
  assert.strictEqual(metniTara(`db.connect({ password: "${SAHTE.dbSifresi}" })`).length, 1);
  assert.strictEqual(metniTara(`const şifre = '${SAHTE.dbSifresi}';`).length, 1);
});

test('.env satırını bulur', () => {
  const b = metniTara(`PORT=3000\nDB_PASSWORD=${SAHTE.dbSifresi}`, '.env');
  assert.strictEqual(b.length, 1);
  assert.strictEqual(b[0].satir, 2);
});

test('yer tutucuları ve env okumalarını yanlış alarm saymaz', () => {
  const metin = ['password = "changeme"', 'DB_PASSWORD=${DB_PASSWORD}', 'const secret = process.env.SECRET;', 'API_KEY=your_api_key'].join('\n');
  assert.deepStrictEqual(metniTara(metin), []);
});

test('yoksay işaretli satırı atlar', () => {
  assert.deepStrictEqual(metniTara(`const k = "${SAHTE.aws}"; // sir-avcisi` + ':yoksay'), []);
});

test('sırrı maskeler', () => {
  assert.strictEqual(maskele(SAHTE.aws), 'AKIA********');
});

test('klasör taramasında node_modules, binary ve .sirignore atlanır', () => {
  const kok = geciciKlasor({
    'src/app.js': `const t = "${SAHTE.github}";`,
    'node_modules/paket/index.js': `const t = "${SAHTE.github}";`,
    'resim.png': Buffer.from([0x89, 0x50, 0x00, 0x01]),
    'fixtures/ornek.env': `SECRET_TOKEN=${SAHTE.dbSifresi}`,
    '.sirignore': '# test verileri\nfixtures/\n',
  });
  const { dosyaSayisi, bulgular } = klasoruTara(kok);
  assert.strictEqual(bulgular.length, 1);
  assert.strictEqual(bulgular[0].dosya, 'src/app.js');
  assert.strictEqual(dosyaSayisi, 2); // app.js + .sirignore
});