import emojiStuff from './emojiStuff';

var EncryptionMixin = {

  data: function() {
    return {
      hello: "hibye",
    }
  },

  methods: {

    b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    isJustEmojis(str){
      let regex = new RegExp("^"+emojiStuff.emojiPattern+"{1,6}$");
      return regex.test(str);
    },


    createMessageObject(messagetext) {

      let keyObj = {};
      this.meeting.participants.forEach((p) => {
        if (p.user_id !== this.account.userID) {
          keyObj[p.user_id] = "000";
        }
      });

      //TODO: Encrypt stuff
      return {
        type: "textmessage",
        content: messagetext,
        keys: keyObj,
        priv_key: "000"
      };

    },

    decryptMessage(content,keys,priv_key){
      return this.b64DecodeUnicode(content);
    }

  }
}

export default EncryptionMixin
