var EncryptionMixin = {

  data: function() {
    return {
      watchKey: [],
      keyPair: {}
    }
  },

  mounted() {

    window.app = this;

    setInterval(() => {

      if (app.account !== undefined) {

        //Make sure we have a kepair stored
        if (app.account.userID.length > 0 && localStorage.getItem('spark-privkey-' + app.account.userID) == null) {

          app.generateRSAKeypair().then((keyPair) => {
            localStorage.setItem('spark-privkey-' + app.account.userID, keyPair.private);
            localStorage.setItem('spark-pubkey-' + app.account.userID, keyPair.public);
          });

        }

        //Make sure the keypair is available in the app where it's needed
        if (Object.keys(app.keyPair).length !== 2 && app.account.userID.length > 0 && localStorage.getItem('spark-privkey-' + app.account.userID) !== null) {

          app.keyPair = {
            private: localStorage.getItem('spark-privkey-' + app.account.userID),
            public: localStorage.getItem('spark-pubkey-' + app.account.userID)
          };
          app.watchKey.forEach((func) => func(app.keyPair));
          app.watchKey = [];

        }

        //Make sure keys are in-sync with the server
        if (app.meeting !== undefined && app.meeting.participants.filter((p) => p.user_id == app.account.userID).length > 0 && app.keyPair.hasOwnProperty('public')) {
          if (app.meeting.participants.filter((p) => p.user_id == app.account.userID)[0].public_key !== app.keyPair.public) {
            app.setPeer({
              public_key: app.keyPair.public
            });
          };
        }
      }

    }, 2500);

  },

  methods: {

    async getKeyPair() {

      if (Object.keys(app.keyPair).length == 2) {
        return app.keyPair;
      } else {
        return await (new Promise(function(resolve) {
          app.watchKey.push(resolve);
        }));
      }

    },

    async generateRSAKeypair() {

      let keyPair = await window.crypto.subtle.generateKey({
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );

      let publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      let privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      return {
        "public": this.arrayBufferToBase64String(publicKey),
        "private": this.arrayBufferToBase64String(privateKey)
      };

    },

    async importRSAPrivate(key) {
      return await window.crypto.subtle.importKey(
        "pkcs8",
        app.base64StringToArrayBuffer(key), {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      );
    },

    async importRSAPublic(key) {
      return await window.crypto.subtle.importKey(
        "spki",
        app.base64StringToArrayBuffer(key), {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt"]
      );
    },

    async RSAEncrypt(key, content) {

      let enc = new TextEncoder();
      content = enc.encode(content);
      let encryptedBuffer = await window.crypto.subtle.encrypt({
          name: "RSA-OAEP"
        },
        key,
        content
      );
      return this.arrayBufferToBase64String(encryptedBuffer);
    },

    async RSADecrypt(key, ciphertext) {

      let decryptedBuffer = await window.crypto.subtle.decrypt({
          name: "RSA-OAEP"
        },
        key,
        this.base64StringToArrayBuffer(ciphertext)
      );

      let decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);

    },

    async generateAESKey() {

      let key = await window.crypto.subtle.generateKey({
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
      );

      return this.arrayBufferToBase64String(await window.crypto.subtle.exportKey('raw', key));

    },

    async importAESKey(key) {

      return await window.crypto.subtle.importKey(
        "raw",
        this.base64StringToArrayBuffer(key),
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
      );

    },

    async AESEncrypt(key, content) {

      let enc = new TextEncoder();
      content = enc.encode(content);

      let iv = window.crypto.getRandomValues(new Uint8Array(12));
      let encryptedBuffer = await window.crypto.subtle.encrypt({
          name: "AES-GCM",
          iv: iv
        },
        key,
        content
      );
      return this.arrayBufferToBase64String(encryptedBuffer) + "|" + this.arrayBufferToBase64String(iv);

    },

    async AESDecrypt(key, ciphertext) {

      let iv = ciphertext.split("|")[1];
      ciphertext = ciphertext.split("|")[0];

      let decryptedBuffer = await window.crypto.subtle.decrypt({
          name: "AES-GCM",
          iv: this.base64StringToArrayBuffer(iv)
        },
        key,
        this.base64StringToArrayBuffer(ciphertext)
      );

      let decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);

    },

    b64DecodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },

    arrayBufferToBase64String(arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer)
      var byteString = ''
      for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i])
      }
      return btoa(byteString)
    },

    base64StringToArrayBuffer(b64str) {
      var byteStr = atob(b64str)
      var bytes = new Uint8Array(byteStr.length)
      for (var i = 0; i < byteStr.length; i++) {
        bytes[i] = byteStr.charCodeAt(i)
      }
      return bytes.buffer
    },

    async createKeyObj(AESKey) {

      let keyObj = {};
      let promises = [];

      this.meeting.participants.forEach((p) => {

        promises.push(new Promise(async (resolve) => {
          try {
            let RSAKey = await this.importRSAPublic(p.public_key);
            keyObj[p.user_id] = await this.RSAEncrypt(RSAKey, AESKey);
          } catch (e) {
            keyObj[p.user_id] = "000";
          }
          resolve();
        }));

      });

      await Promise.all(promises);
      return keyObj;

    },

    async createAttachmentObject(file) {

      let messageKeyString = await app.generateAESKey();
      let messageKey = await app.importAESKey(messageKeyString);
      let keyObj = await app.createKeyObj(messageKeyString);

      let fileBuffer = await file.arrayBuffer();
      let fileString = this.arrayBufferToBase64String(fileBuffer);

      let encryptedFileString = await app.AESEncrypt(messageKey, fileString);

      return {
        type: "attachment",
        content: encryptedFileString,
        keys: keyObj,
        attachment: {
          name: app.formatFileName(file.name),
          mime_type: file.type
        }
      };

    },

    async decryptAttachment(content, keys, attachment_info) {

      if (content.length == 0) {
        let file = {
          "name": attachment_info.name,
          "size": attachment_info.size,
          "mime_type": attachment_info.mime_type,
          "attachment_id": attachment_info.attachment_id,
          "keys": keys
        };

        return file;

      } else {

        return new Promise(function(resolve, reject) {
          app.getKeyPair().then(async (keyPair) => {

            try {
              let RSAPrivateKey = await app.importRSAPrivate(keyPair.private);
              let messageKeyString = await app.RSADecrypt(RSAPrivateKey, keys[app.account.userID]);
              let messageKey = await app.importAESKey(messageKeyString);
              let attachmentContent = await app.AESDecrypt(messageKey, atob(content));

              let fileBuffer = app.base64StringToArrayBuffer(attachmentContent);
              let file = new File([fileBuffer], attachment_info.name, {
                type: attachment_info.mime_type
              });
              resolve(file);
            } catch (e) {
              reject();
            }

          });
        });

      }

    },


    async createMessageObject(messagetext) {

      let messageKeyString = await app.generateAESKey();
      let messageKey = await app.importAESKey(messageKeyString);
      let keyObj = await app.createKeyObj(messageKeyString);

      messagetext = await app.AESEncrypt(messageKey, messagetext);

      return {
        type: "textmessage",
        content: messagetext,
        keys: keyObj
      };

    },

    async decryptMessage(content, keys) {

      return new Promise(function(resolve, reject) {
        app.getKeyPair().then(async (keyPair) => {

          try {
            let RSAPrivateKey = await app.importRSAPrivate(keyPair.private);
            let messageKeyString = await app.RSADecrypt(RSAPrivateKey, keys[app.account.userID]);
            let messageKey = await app.importAESKey(messageKeyString);
            let messageContent = await app.AESDecrypt(messageKey, atob(content));
            resolve(messageContent);
          } catch (e) {
            reject();
          }

        });
      });

    },



  }
}

export default EncryptionMixin
