"use strict";
//Object.defineProperty(export, "__esModule", { value: true });
const createKeccakHash = require('keccak');
const BN = require('bn.js');
const secp256k1 = require('secp256k1');
const rlp = require('rlp');
// const saveAS=require();
export function keccak(a, bits) {
    a = toBuffer(a);
    if (!bits)
        bits = 256;
    return createKeccakHash('keccak' + bits).update(a).digest();
}
//export.keccak = keccak;
/**
 * Creates SHA-3 hash of the RLP encoded version of the input
 * @param {Buffer|Array|String|Number} a the input data
 * @return {Buffer}
 */
export function rlphash(a) {
    return keccak(rlp.encode(a));
}
/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param {*} v the value
 */
export function toBuffer(v) {
    if (!Buffer.isBuffer(v)) {
        if (Array.isArray(v)) {
            v = Buffer.from(v);
        }
        else if (typeof v === 'string') {
            if (isHexString(v)) {
                v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex');
            }
            else {
                v = Buffer.from(v);
            }
        }
        else if (typeof v === 'number') {
            v = intToBuffer(v);
        }
        else if (v === null || v === undefined) {
            v = Buffer.allocUnsafe(0);
        }
        else if (BN.isBN(v)) {
            v = v.toArrayLike(Buffer);
        }
        else if (v.toArray) {
            // converts a BN to a Buffer
            v = Buffer.from(v.toArray());
        }
        else {
            throw new Error('invalid type');
        }
    }
    return v;
}
/**
 * Converts a `Buffer` into a hex `String`
 * @param {Buffer} buf
 * @return {String}
 */
export function bufferToHex(buf) {
    buf = toBuffer(buf);
    return '0x' + buf.toString('hex');
}
/**
 * Is the string a hex string.
 *
 * @method check if string is hex string of specific length
 * @param {String} value
 * @param {Number} length
 * @returns {Boolean} output the string is a hex string
 */
export function isHexString(value, length) {
    if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
/**
 * Removes '0x' from a given `String` is present
 * @param {String} str the string value
 * @return {String|Optional} a string by pass if necessary
 */
export function stripHexPrefix(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return isHexPrefixed(str) ? str.slice(2) : str;
}
/**
* Returns a `Boolean` on whether or not the a `String` starts with '0x'
* @param {String} str the string input value
* @return {Boolean} a boolean if it is or is not hex prefixed
* @throws if the str input is not a string
*/
export function isHexPrefixed(str) {
    if (typeof str !== 'string') {
        throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
    }
    return str.slice(0, 2) === '0x';
}
/**
 * Pads a `String` to have an even length
 * @param {String} value
 * @return {String} output
 */
export function padToEven(value) {
    var a = value; // eslint-disable-line
    if (typeof a !== 'string') {
        throw new Error('[ethjs-util] while padding to even, value must be string, is currently ' + typeof a + ', while padToEven.');
    }
    if (a.length % 2) {
        a = '0' + a;
    }
    return a;
}
/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
export function intToHex(i) {
    var hex = i.toString(16); // eslint-disable-line
    return '0x' + padToEven(hex);
}
/**
* Converts an `Number` to a `Buffer`
* @param {Number} i
* @return {Buffer}
*/
export function intToBuffer(i) {
    var hex = intToHex(i);
    return new Buffer(hex.slice(2), 'hex');
}
/**
 * Converts a `Buffer` to a `Number`
 * @param {Buffer} buf
 * @return {Number}
 * @throws If the input number exceeds 53 bits.
 */
export function bufferToInt(buf) {
    return new BN(toBuffer(buf)).toNumber();
}
/**
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param {Buffer} pubKey The two points of an uncompressed key, unless sanitize is enabled
 * @param {Boolean} [sanitize=false] Accept public keys in other formats
 * @return {Buffer}
 */
export function publicToAddress(pubKey, sanitize) {
  pubKey = toBuffer(pubKey);
  if (sanitize && (pubKey.length !== 64)) {
    pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1);
  }
  // Only take the lower 160bits of the hash
  return keccak(pubKey).slice(-20);
}
/**
 * Returns the ethereum public key of a given private key
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {Buffer}
 */
export function privateToPublic(privateKey) {
    privateKey = toBuffer(privateKey);
    // skip the type flag and use the X, Y points
    return secp256k1.publicKeyCreate(privateKey, false).slice(1);
}
//# sourceMappingURL=util.js.map
