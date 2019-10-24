import * as CryptoJS from "crypto-js";
interface EncryptInterface {
  encryptPassword(pw: string): string;
}

class Encrypt implements EncryptInterface {
  encryptPassword = (pw: string): string => {
    return CryptoJS.SHA256(pw).toString();
  };
}

export default new Encrypt();
