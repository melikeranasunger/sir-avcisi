const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const path = require('path');
const { SAHTE, geciciKlasor } = require('./yardimci');

const CLI = path.join(__dirname, '..', 'bin', 'sir-avcisi.js');

function calistir(klasor, env = {}) {
  // testler Actions içinde koşarken annotasyon basmasın diye GITHUB_ACTIONS'ı sıfırlıyorum
  return spawnSync(process.execPath, [CLI, klasor], { encoding: 'utf8', env: { ...process.env, GITHUB_ACTIONS: '', GITHUB_STEP_SUMMARY: '', ...env } });
}

test('temiz klasörde çıkış kodu 0', () => {
  const r = calistir(geciciKlasor({ 'app.js': 'console.log("merhaba")' }));
  assert.strictEqual(r.status, 0);
  assert.match(r.stdout, /Sızmış sır bulunamadı/);
});

test('sır varsa çıkış kodu 1 ve dosya:satır yazılır', () => {
  const r = calistir(geciciKlasor({ '.env': `PORT=3000\nAPI_KEY=${SAHTE.dbSifresi}` }));
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /\.env:2/);
  assert.ok(!r.stdout.includes(SAHTE.dbSifresi), 'sırrın tamamı ekrana basılmamalı');
});

test('olmayan klasörde çıkış kodu 2', () => {
  assert.strictEqual(calistir('/yok/boyle/bir/klasor').status, 2);
});