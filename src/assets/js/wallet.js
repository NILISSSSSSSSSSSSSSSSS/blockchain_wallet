"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Object.defineProperty(exports, "__esModule", { value: true });
const Util = require("./util");
var scryptsy = require('scryptsy');
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var path = require('path');
// //console.log(Util);
const currentPath = path.dirname(process.execPath);
const keystorePath = path.join(currentPath, "keystore");

//if (fs.existsSync(keystorePath) == false) {
//  fs.mkdirSync(keystorePath);
//}
const crypto = require("crypto");


const secret = '38d0f91a99c57d189416439ce377ccdcd92639d0';

export const Encrypt = class Encrypt{
    encode(text) {
    let cipher = crypto.createCipher('aes-256-cbc', secret);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }
    decode(text) {
    let decipher = crypto.createDecipher('aes-256-cbc', secret);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

}
export const MyWallet = class MyWallet{
    static Shared() {
        if (MyWallet._shared == null) {
            MyWallet._shared = new MyWallet();
        }
        return MyWallet._shared;
    }
    constructor() {
    }
    scanKeystoreFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._ketstoreList = [];
                let filePath = path.join(currentPath, "keystore");
                let files = fs.readdirSync(filePath);
                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        let fileName = files[i];
                        let filedir = path.join(filePath, fileName);
                        let stats = fs.statSync(filedir);
                        if (stats.isFile()) {
                            let json = this.readKeystoreFile(filedir);
                            if (json != null) {
                                this._ketstoreList.push({
                                    fileName: filedir,
                                    address: "0x" + json.address
                                });
                            }
                        }
                    }
                    if (this._ketstoreList.length > 0) {
                        return this._ketstoreList;
                    }
                }
            }
            catch (e) {
                //console.log(e);
                return null;
            }
        });
    }
    accounts() {
        return __awaiter(this, void 0, void 0, function* () {
            let accountsList = yield this.scanKeystoreFiles();
            return accountsList;
        });
    }
    getAddress(account) {
        return Util.publicToAddress(account.pubKey);
    }
    getAddressString(account) {
        return Util.bufferToHex(account.address);
    }
    newAccount(psw) {
        let priv = crypto.randomBytes(32);
        let pub = Util.privateToPublic(priv);
        let addr = Util.publicToAddress(pub);
        let acc = {
            privKey: priv,
            pubKey: pub,
            address: addr
        };
        return acc;
    }
    toKeyStore(account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                var salt = crypto.randomBytes(32);
                var iv = crypto.randomBytes(16);
                var kdfParams = {
                    dklen: 64,
                    salt: salt.toString('hex'),
                    prf: "hmac-sha256",
                    N: 0,
                    R: 0,
                    P: 0
                };
                //console.log("encrykeystore start");
                kdfParams.N = 16384;
                kdfParams.R = 8;
                kdfParams.P = 1;
                let derivedKey = scryptsy(Buffer.from(password), salt, kdfParams.N, kdfParams.R, kdfParams.P, kdfParams.dklen);
                //console.log("encrykeystore end");
                var cipher = crypto.createCipheriv('aes-128-ctr', derivedKey.slice(0, 16), iv);
                if (!cipher) {
                    throw new Error('Unsupported cipher');
                }
                var ciphertext = Buffer.concat([cipher.update(account.privKey), cipher.final()]);
                var mac = Util.keccak(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]));
                let keystoreJson = {
                    version: 1,
                    id: uuidv4({ random: crypto.randomBytes(16) }),
                    address: account.address.toString('hex'),
                    crypto: {
                        ciphertext: ciphertext.toString('hex'),
                        cipherparams: {
                            iv: iv.toString('hex')
                        },
                        cipher: 'aes-128-ctr',
                        kdf: 'scrypt',
                        kdfParams: kdfParams,
                        mac: mac.toString('hex')
                    }
                };
                let date = new Date();
                let fileName = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "|" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                + keystoreJson.address;
                //console.log(fileName);
                let content = JSON.stringify(keystoreJson);
                // console.log(content);
                resolve(content);

//              fs.writeFile(path.join('D:\Download\walletJson', fileName), content, function (err) {
////              fs.writeFile(path.join(keystorePath, fileName), content, function (err) {
//                  if (err) {
//                      //console.log('writeFile error:' + err);
//                      resolve(false);
//                  }
//                  else {
//                      //console.log('writeFile successed!');
//                      resolve(true);
//                  }
//              });
            });
        });
    }
    decryKeystore(input, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resove => {
              try{
                var json = (typeof input === 'object') ? input : JSON.parse(input);
                console.log("decryKeystore start");
                var kdfparams = json.crypto.kdfParams;

                var derivedKey = scryptsy(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.N, kdfparams.R, kdfparams.P, kdfparams.dklen);
                console.log("decryKeystore end");
                var ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');
                var mac = Util.keccak(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
                if (mac.toString('hex') !== json.crypto.mac) {
                  //throw new Error('Key derivation failed - possibly wrong passphrase')
                  resove(0);
                }
                var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
                var seed = this.decipherBuffer(decipher, ciphertext);

                var publicKey=Util.privateToPublic(seed);
                var address=Util.bufferToHex(Util.publicToAddress(publicKey));
                var jsonKey={seed,address};
                resove(jsonKey);
              }catch (err){
                resove(0);
              }

            });
        });
    }
    decipherBuffer(decipher, data) {
        return Buffer.concat([decipher.update(data), decipher.final()]);
    }
    readKeystoreFile(fileName) {
        try {
            let data = fs.readFileSync(fileName, 'utf-8');
            if (data != null) {
                let json = JSON.parse(data);
                return json;
            }
            else {
                return null;
            }
        }
        catch (e) {
            return null;
        }
    }
}
//exports.MyWallet = MyWallet;
//# sourceMappingURL=wallet.js.map
