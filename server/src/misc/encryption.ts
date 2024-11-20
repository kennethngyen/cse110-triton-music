// https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs
import crypto from "crypto";
import 'dotenv/config';

// Using AES encryption (Advanced Encryption Standard)

//Encrypting text
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16); 
    const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Decrypting text
export function decrypt(text: string): string {
    const [ivHex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}