import * as crypto from 'crypto';

export function encryptSession(message: string, secretKey: string){
    return crypto.createHmac('sha256', secretKey).update(message).digest('hex')
}
export function verifySession(newSession: string, hashed: string){
    return newSession === hashed
}