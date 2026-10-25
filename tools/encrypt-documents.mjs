import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';

const source = process.argv[2];
const password = process.env.PORTFOLIO_DOCUMENT_PASSWORD;
if (!source || !password) {
    console.error('Usage: set PORTFOLIO_DOCUMENT_PASSWORD, then run node tools/encrypt-documents.mjs <private-pdf-directory>');
    process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'assets', 'files');
fs.mkdirSync(destination, { recursive: true });
const filenames = ['Mehmet-Turgut-Aksel-CV.pdf', 'Mehmet-Turgut-Aksel-Cover-Letter.pdf'];
for (const filename of filenames) {
    const pdf = fs.readFileSync(path.join(path.resolve(source), filename));
    if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error('Invalid PDF: ' + filename);
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const iterations = 310000;
    const key = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(pdf), cipher.final()]);
    const tag = cipher.getAuthTag();
    const payload = {
        version: 1, algorithm: 'AES-GCM', kdf: 'PBKDF2', hash: 'SHA-256', iterations,
        salt: salt.toString('base64'), iv: iv.toString('base64'),
        ciphertext: Buffer.concat([encrypted, tag]).toString('base64')
    };
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const verified = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    if (!timingSafeEqual(pdf, verified)) throw new Error('Encryption verification failed: ' + filename);
    fs.writeFileSync(path.join(destination, filename + '.enc'), JSON.stringify(payload));
    key.fill(0);
    console.log('Encrypted and verified: ' + filename);
}
