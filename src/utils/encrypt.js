// import JSEncrypt from 'jsencrypt';

// const key = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiUc64nat35dVk/kZPkQdxikXL51C+ESf10maGiAYA8WiwgZGn9RFbtEJmKOsUN+W84AeqVTDgXRhMyezl+Y1c6U2WuvAfzeg6zodOQ50iUecLhNKtypEH3Hmd4IehjO+Xzex0OBo6LXhR0TCNjND19shEstU3IzNQM0vPBZL7f7bGK/EF1YH9o+rn94t6aUQNyw/loDMRDUxuXYUTVvGcaIOeEfUv6XxNc43WSpPTX36Fk+uOB/KnUsMbxDRbw+O8boe5r5v/w8woaT48xlxJYqxq8B8avsRk4v3lT0l4Ssb89brT4lug0fK8SVXGDF30rymou3bTvSRlgQrsFNR+wIDAQAB`;
export default function setEncrypt(msg) {
  // const jsencrypt = new JSEncrypt();
  // jsencrypt.setPublicKey(key);
  // return jsencrypt.encrypt(msg);

  return window.btoa(msg);
}
