const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { annotasyonlar, ozetMetni } = require('../src/github');
const { SAHTE, geciciKlasor } = require('./yardimci');

const CLI = path.join(__dirname, '..', 'bin', 'sir-avcisi.js');

test('annotasyon GitHub formatında üretilir', () => {
  const [satir] = annotasyonlar([{ dosya: 'src/db.js', satir: 7, kural: 'GitHub Token', ornek: 'ghp_****' }]);
  assert.match(satir, /^::error file=src\/db\.js,line=7,title=Sır Avcısı::GitHub Token bulundu/);
});

test('özet tablosu bulguları listeler', () => {
  const ozet = ozetMetni({ dosyaSayisi: 4, bulgular: [{ dosya: '.env', satir: 2, kural: '.env Gizli Değeri', ornek: 'Erzu****' }] });
  assert.match(ozet, /\*\*1\*\* olası sır/);
  assert.match(ozet, /\| `\.env` \| 2 \|/);
});

test('Actions ortamında CLI annotasyon basar ve özet yazar', () => {
  const ozetDosyasi = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ozet-')), 'ozet.md');
  const r = spawnSync(process.execPath, [CLI, geciciKlasor({ 'config.js': `token: "${SAHTE.github}"` })], {
    encoding: 'utf8',
    env: { ...process.env, GITHUB_ACTIONS: 'true', GITHUB_STEP_SUMMARY: ozetDosyasi },
  });
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /::error file=config\.js,line=1/);
  assert.match(fs.readFileSync(ozetDosyasi, 'utf8'), /Sır Avcısı/);
});