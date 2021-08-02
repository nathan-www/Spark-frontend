import emojiStuff from './emojiStuff';

var EncryptionMixin = {

  data: function() {
    return {
      hello: "hibye",
    }
  },

  methods: {

    b2str(buf) {
      let str = "";
      (new Uint8Array(buf)).forEach((i) => {
          str += String.fromCharCode(i);
      });
      return str;
    },

    str2ab(str) {
      var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
      var bufView = new Uint8Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    },

    b64DecodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },

    isJustEmojis(str) {
      let regex = new RegExp("^" + emojiStuff.emojiPattern + "{1,6}$");
      return regex.test(str);
    },

    async createAttachmentObject(file) {

      let keyObj = {};
      this.meeting.participants.forEach((p) => {
        if (p.user_id !== this.account.userID) {
          keyObj[p.user_id] = "000";
        }
      });

      let fileBuffer = await file.arrayBuffer();
      let fileString = btoa(this.b2str(fileBuffer));

      //TODO: Encrypt file
      return {
        type: "attachment",
        content: fileString,
        keys: keyObj,
        priv_key: "000",
        attachment: {
          name: app.formatFileName(file.name),
          mime_type: file.type
        }
      };

    },

    decryptAttachment(content, keys, priv_key, attachment_info){

      if(content.length == 0){
          let file = {
            "name":attachment_info.name,
            "size":attachment_info.size,
            "mime_type":attachment_info.mime_type,
            "attachment_id":attachment_info.attachment_id,
            "keys":keys,
            "priv_key":priv_key
          };

          return file;
      }
      else{

        //TODO: Decrypt file
        let fileBuffer = this.str2ab(atob(atob(content)));
        let file = new File([fileBuffer], attachment_info.name, {type: attachment_info.mime_type});
        return file;
      }

    },


    createMessageObject(messagetext) {

      let keyObj = {};
      this.meeting.participants.forEach((p) => {
        if (p.user_id !== this.account.userID) {
          keyObj[p.user_id] = "000";
        }
      });

      //TODO: Encrypt message
      return {
        type: "textmessage",
        content: messagetext,
        keys: keyObj,
        priv_key: "000"
      };

    },

    decryptMessage(content, keys, priv_key) {
      //TODO: Decrypt message
      return this.b64DecodeUnicode(content);
    },



  }
}

export default EncryptionMixin
