import {
  toBase64Url,
  base64ToByteArray,
  fromBase64Url,
} from '../helpers/converters';
import * as CryptoJS from 'crypto-js';

// GetAddressFromPublicKey Get the formatted address from a raw public key
export function GetAddressFromPublicKey(publicKey: Uint8Array): string {
  const checksum = GetChecksumByte(publicKey);
  let binary = '';
  const bytes = new Uint8Array(33);
  bytes.set(publicKey, 0);
  bytes.set([checksum[0]], 32);

  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const address = toBase64Url(window.btoa(binary));

  return address;
}

export function GetChecksumByte(bytes): any {
  let n = bytes.length;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a += bytes[i];
  }
  const res = new Uint8Array([a]);
  return res;
}

export function generateEncKey(pin: string): string {
  return CryptoJS.PBKDF2(pin, 'salt', {
    keySize: 8,
    iterations: 10000,
  }).toString();
}

export function onCopyText(text: string) {
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.opacity = '0';
  selBox.value = text;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function addressValidation(address: string) {
  const addressBase64 = fromBase64Url(address);
  const addressBytes = base64ToByteArray(addressBase64);
  if (addressBytes.length == 33 && addressBase64.length == 44) {
    return true;
  } else return false;
}

export function isPubKeyValid(pubkey: string) {
  const addressBytes = base64ToByteArray(pubkey);
  if (addressBytes.length == 32 && pubkey.length == 44) {
    return true;
  } else return false;
}
