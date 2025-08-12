import CryptoJS from "crypto-js";
import CFG from "@/config/config.json";

const getHmacEncryption = (data: string) => {
  return CryptoJS.HmacSHA256(data, CFG.encryption_key).toString();
};

export const encryptData = (data: string): string => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(data, CFG.encryption_key).toString();
    return `${encryptedData}:${getHmacEncryption(encryptedData)}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed");
  }
};

export const decryptData = (encryptedData: string): string => {
  try {

    // Check if data is in the expected format
    if (!encryptedData.includes(":")) {
      throw new Error("Invalid encrypted data format");
    }

    const [encryptedString, receivedHmac] = encryptedData.split(":");

    // Validate HMAC
    const expectedHmac = getHmacEncryption(encryptedString);

    if (expectedHmac !== receivedHmac) {
      throw new Error("Data integrity check failed");
    }

    // Decrypt
    const bytes = CryptoJS.AES.decrypt(encryptedString, CFG.encryption_key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption failed - empty result");
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
};