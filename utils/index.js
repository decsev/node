const config = require('../config');
const crypto = require('crypto');
const { key } = config;

module.exports = {
  aesEn: (data) => {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },
  aesDe: (encrypted) => {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
  md5: (str) => {
    const hash = crypto.createHash('md5');
    hash.update(key);
    hash.update(str);
    return hash.digest('hex');
  }
}