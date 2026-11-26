#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { klasoruTara } = require('../src/tarayici');

const arg = process.argv[2] || '.';

if (arg === '--yardim' || arg === '-h') {
  console.log('Kullanım: sir-avcisi [klasör]\nKlasördeki dosyalarda sızmış şifre, token ve API anahtarı arar.\nSır bulunursa çıkış kodu 1 olur.');
  process.exit(0);
}

const kok = path.resolve(arg);
if (!fs.existsSync(kok) || !fs.statSync(kok).isDirectory()) {
  console.error(`Klasör bulunamadı: ${arg}`);
  process.exit(2);
}

const { dosyaSayisi, bulgular } = klasoruTara(kok);

console.log(`🔍 Sır Avcısı: ${dosyaSayisi} dosya tarandı`);

if (!bulgular.length) {
  console.log('✅ Sızmış sır bulunamadı.');
} else {
  console.log(`❌ ${bulgular.length} olası sır bulundu:\n`);
  const genislik = Math.max(...bulgular.map((b) => `${b.dosya}:${b.satir}`.length));
  for (const b of bulgular) {
    console.log(`  ${`${b.dosya}:${b.satir}`.padEnd(genislik)}  ${b.kural.padEnd(28)}  ${b.ornek}`);
  }
  console.log('\nYanlış alarm ise satırın sonuna "sir-avcisi:yoksay" yaz ya da yolu .sirignore dosyasına ekle.');
}

process.exit(bulgular.length ? 1 : 0);