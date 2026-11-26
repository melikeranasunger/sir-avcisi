// her kural: ad + regex. grup 1 varsa asıl gizli değer o
const ANAHTAR_KELIMELER = 'password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|[şs]ifre|parola';

module.exports = [
  { ad: 'AWS Erişim Anahtarı', desen: /\b((?:AKIA|ASIA)[0-9A-Z]{16})\b/ },
  { ad: 'GitHub Token', desen: /\b((?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{60,})/ },
  { ad: 'Google API Anahtarı', desen: /\b(AIza[0-9A-Za-z_-]{35})/ },
  { ad: 'Slack Token', desen: /\b(xox[abprs]-[0-9A-Za-z-]{10,})/ },
  { ad: 'Stripe Gizli Anahtarı', desen: /\b(sk_live_[0-9A-Za-z]{24,})/ },
  { ad: 'Özel Anahtar (Private Key)', desen: /(-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----)/ },
  // kodda: password = "...", apiKey: '...'
  {
    ad: 'Koda Gömülü Parola/Anahtar',
    desen: new RegExp(`(?<![A-Za-z0-9_])(?:${ANAHTAR_KELIMELER})[A-Za-z0-9_]*["']?\\s*[:=]\\s*["']([^"'\\s]{6,})["']`, 'i'),
  },
  // .env dosyalarında: DB_PASSWORD=...
  {
    ad: '.env Gizli Değeri',
    desen: /^\s*(?:export\s+)?[A-Z0-9_]*(?:PASSWORD|PASSWD|SECRET|TOKEN|API_KEY|SIFRE|PAROLA)[A-Z0-9_]*\s*=\s*["']?([^\s"'#]{6,})/,
  },
];