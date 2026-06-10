import crypto from 'crypto';

let privateKeyPem: string = process.env.LTI_PRIVATE_KEY || '';
let publicKeyJwk: any = null;

// Generate fallback RSA keypair if not set in environment
if (!privateKeyPem) {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    privateKeyPem = privateKey;
    publicKeyJwk = crypto.createPublicKey(publicKey).export({ format: 'jwk' });
  } catch (err) {
    console.error('Error generating dynamic LTI RSA keypair:', err);
  }
} else {
  try {
    const pubKey = crypto.createPublicKey(privateKeyPem);
    publicKeyJwk = pubKey.export({ format: 'jwk' });
  } catch (e) {
    console.error('Failed to parse LTI_PRIVATE_KEY from environment:', e);
  }
}

if (publicKeyJwk) {
  publicKeyJwk.kid = 'openprimer-lti-key-1';
  publicKeyJwk.alg = 'RS256';
  publicKeyJwk.use = 'sig';
}

export function getPrivateKey(): string {
  return privateKeyPem;
}

export function getPublicKeyJwk() {
  return publicKeyJwk;
}

export function getJwks() {
  return {
    keys: publicKeyJwk ? [publicKeyJwk] : []
  };
}
