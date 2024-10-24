import * as Random from 'expo-crypto';
import { decode, encode } from 'base-64';

window.addEventListener = (x) => x;
window.removeEventListener = (x) => x;

if (!global.navigator.userAgent) {
  global.navigator.userAgent = 'React Native';
}

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

if (typeof window === 'object') {
  if (!window.crypto) window.crypto = {};
  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = async function getRandomValues(arr) {
      let orig = arr;
      if (arr.byteLength != arr.length) {
        arr = new Uint8Array(arr.buffer);
      }
      const bytes = await Random.getRandomBytesAsync(arr.length);
      for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i];
      }
      return orig;
    };
  }
}

require('@usecapsule/react-native-wallet').shim();
