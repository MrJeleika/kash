import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function replaceUuidChar(char: string) {
  const random = Math.random() * 16;
  if (char === 'x') {
    return Math.floor(random).toString(16);
  }
  // char === 'y'
  return ((Math.floor(random) & 0x3) | 0x8).toString(16);
}

export function generateUuid() {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto?.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }
  return uuidTemplate.replace(/[xy]/g, replaceUuidChar);
}
