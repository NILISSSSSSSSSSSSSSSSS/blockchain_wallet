"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const Util = require("./util");
const secp256k1 = require('secp256k1');
var rlp = require('rlp');
export const Transaction = class Transaction {
// export class Transaction {
    constructor(from, to, value) {
        try {
            this._from = Util.toBuffer(from);
            this._to = Util.toBuffer(to);
            this._value = value;
        }
        catch (e) {
            // console.log("Transaction invalid param");
        }
    }
    hash() {
        let items = new Buffer([]);
        let time = Date.now();
        items = Buffer.concat([this._from, this._to, Util.toBuffer(this._value), Util.toBuffer(time)]);
        return Util.rlphash(items);
    }
    encode(input) {
        let encodeData = rlp.encode(input);
        return encodeData;
    }
    decode(input) {
        let decodeData = rlp.decode(input);
        console.log(Util.bufferToHex(decodeData));
        return decodeData;
    }
    sign(privateKey) {
        let msgHash = this.hash();
        let sig = this.ecsign(msgHash, privateKey);
        let transJson = {
            from: Util.bufferToHex(this._from),
            to: Util.bufferToHex(this._to),
            value: this._value,
            hash: Util.bufferToHex(msgHash),
            sig: {
                r: Util.bufferToHex(sig.r),
                s: Util.bufferToHex(sig.s),
                v: sig.v
            }
        };
        console.log("encode hash:" + transJson.hash);
        let buffer = Util.toBuffer(JSON.stringify(transJson));
        let signCode = Util.bufferToHex(buffer);
        return signCode;
    }
    ecsign(msgHash, privateKey) {
        let sig = secp256k1.sign(msgHash, privateKey);
        let ret = {
            r: sig.signature.slice(0, 32),
            s: sig.signature.slice(32, 64),
            v: sig.recovery
        };
        return ret;
    }
    ecrecover(msgHash, r, s, v) {
        const signature = Buffer.concat([r, s], 64);
        const senderPubKey = secp256k1.recover(msgHash, signature, v);
        return secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
    }
    verifySignature(input) {
        try {
            let trans = JSON.parse(input);
            let hash = Util.toBuffer(trans.hash);
            console.log("decode hash:" + hash);
            let v = Util.bufferToInt(trans.sig.v);
            let r = Util.toBuffer(trans.sig.r);
            let s = Util.toBuffer(trans.sig.s);
            let senderPubKey = this.ecrecover(hash, r, s, v);
            return senderPubKey;
        }
        catch (e) {
            return null;
        }
    }
}
// exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map
