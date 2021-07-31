<template>
<div id="loader" v-if="loading">
  <img src="./../assets/img/emoji/monkey.png" alt="">
</div>

<input type="text" id="copyinput" style="display: none;">

<div class="popup-backdrop fadeIn" id="popup-backdrop"></div>

<div class="popup-confirm" id="popup-confirm">

  <div class="popup-main">
    <h3 class="popup-icon">
      <ion-icon name="trash-outline"></ion-icon>
    </h3>
    <h2 class="title"></h2>
  </div>
  <div class="flex popup-buttons" style="margin-left: auto; justify-content: right;">
    <div class="v-center" style="height: auto;">
      <a class="cancel-button">Cancel</a>
    </div>
    <div class="v-center" style="height: auto;">
      <div class="btn btn-danger btn-vsmall continue-button"></div>
    </div>
  </div>
</div>


<div class="main flex" @mousedown="mainClick($event)">

  <div v-if="inviteModelOpen" class="popup-backdrop fadeIn" @click="peopleSearchResults = []" style="display: block;"></div>

  <div class="modal invite" v-if="inviteModelOpen">
    <div class="header flex">
      <div class="v-center">
        <h2>Invite participants</h2>
      </div>
      <div class="close-btn v-center" @click="inviteModelOpen = false">
        <ion-icon name="close-outline"></ion-icon>
      </div>
    </div>
    <div class="content" @click.self="peopleSearchResults = []">
      <p>Invite participants by name, email address or phone number</p>

      <div class="form-field form-field-small">
        <div class="search-icon v-center" style="height: auto; padding-left: 10px;">
          <ion-icon name="search-outline"></ion-icon>
        </div>
        <input v-model="newMeetingParticipantSearch" @input="peopleSearch(newMeetingParticipantSearch)" type="text" placeholder="Enter name, email, phone number">

        <div class="search-results fadeIn" v-if="peopleSearchResults.filter((i) => i.user_id !== account.userID).length > 0">

          <div class="result flex" v-for="r in peopleSearchResults.filter((i) => i.user_id !== account.userID)" @click="newMeetingInvite(r)">
            <div class="v-center">
              <div v-if="!r.hasOwnProperty('unregistered')" class="p-icon" :style="'background-color:' + conveyor('nm-search-results',r.user_id,['#d9730d','#dfab01','#0f7b6c','#0b6e99','#6940a5','#ad1a72','#e03e3e'])">
                {{r['first_name'][0]}}{{r['last_name'][0]}}
              </div>
              <div v-else class="p-icon" style="background-color: #aab;">
                ?
              </div>
            </div>
            <div class="v-center">
              <div>
                <p class="name">
                  <span v-if="!r.hasOwnProperty('unregistered')">{{r['first_name']}} {{r['last_name']}}</span>
                  <span v-else><i>Invite new user</i></span>
                </p>
                <p class="identity">
                  <span v-if="r.hasOwnProperty('display_identity')" class="identity">{{r['display_identity']}}</span>
                  <span v-else class="identity">{{r['identity']}}</span>
                  <span class="addedTag fadeIn" v-if="!(!isUserInMeeting({identity:r.identity}) && !isUserInMeeting({user_id:r.user_id}) && meeting.invitees.indexOf(r.identity) == -1)">Added</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="invited-participants flex">

        <div class="invitee flex" v-for="p in invitedParticipants" @click="invitedParticipants.splice(invitedParticipants.indexOf(p), 1)">
          <div class="v-center" v-if="!p.hasOwnProperty('unregistered')">
            {{p.first_name}} {{p.last_name}}
          </div>
          <div class="v-center" v-else-if="p.hasOwnProperty('display_identity')">
            {{p.display_identity}}
          </div>
          <div class="v-center" v-else>
            {{p.identity}}
          </div>
          <div class="v-center">
            <ion-icon name="close"></ion-icon>
          </div>
        </div>


      </div>


    </div>
    <div class="footer" v-if="invitedParticipants.length > 0" @click.self="peopleSearchResults = []">

      <a @click="inviteParticipants()" v-if="!loadingInvite" class="btn btn-primary btn-small">Invite</a>
      <a v-else style="width: 145px;" class="btn btn-primary btn-small">Inviting...&nbsp; <img class="loader icon" src="./../assets/img/loading.png" /></a>

    </div>
  </div>

  <div :class="'meeting-section' + ((sidebarOpen) ? ' chat-open':'')">

    <div class="control-bar flex">
      <div class="v-center">
        <div>
          <h2>{{meeting.title}}</h2>
          <div class="flex">
            <div class="control-bar-label flex" v-if="meeting.is_owner && meeting.allow_join_link" @click="copyText('main-join-link-copied')">
              <div class="copied-popup" id="main-join-link-copied">
                <div class="triangle"></div>
                Copied!
              </div>
              <div class="v-center">
                <span class="icon">
                  <ion-icon name="link-outline"></ion-icon>
                </span>
              </div>
              <div class="v-center">
                <p class="text">/{{meeting.join_link}}</p>
              </div>
            </div>
            <div class="control-bar-label flex">
              <div class="v-center">
                <span class="icon">
                  <ion-icon name="people"></ion-icon>
                </span>
              </div>
              <div class="v-center">
                <p class="text">{{meeting.participants.length}}&nbsp;/&nbsp;{{meeting.invitees.length + meeting.participants.length}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="button-group-center flex">
        <div class="v-center">
          <div class="circle-icon v-center">
            <ion-icon name="mic"></ion-icon>
          </div>
        </div>

        <div class="v-center">
          <div class="circle-icon v-center">
            <ion-icon name="videocam"></ion-icon>
          </div>
        </div>

        <div class="v-center">
          <div class="circle-icon v-center">
            <ion-icon name="scan"></ion-icon>
          </div>
        </div>

        <div class="v-center">
          <div class="circle-icon hangup v-center">
            <ion-icon name="call"></ion-icon>
          </div>
        </div>
      </div>

      <div class="button-group-right flex">
        <div class="v-center" @click="inviteModelOpen = true" v-if="meeting.is_owner">
          <div class="circle-icon v-center">
            <ion-icon name="person-add"></ion-icon>
          </div>
        </div>
        <div class="v-center" v-if="!sidebarOpen || !settingsOpen" @click="sidebarOpen = true; settingsOpen = true;">
          <div class="circle-icon v-center">
            <ion-icon name="settings-sharp"></ion-icon>
          </div>
        </div>
        <div class="v-center" v-if="!sidebarOpen || settingsOpen" @click="sidebarOpen = true; settingsOpen = false; unreadChat = 0;">
          <div class="circle-icon v-center">
            <div class="badge" v-if="unreadChat > 0">
              {{unreadChat}}
            </div>
            <ion-icon name="chatbox"></ion-icon>
          </div>
        </div>
      </div>

    </div>

  </div>


  <div class="sidebar settings" v-if="settingsOpen">

    <div class="sidebar-header flex">
      <div class="v-center">
        <h2>Settings</h2>
      </div>
      <div class="v-center" style="margin-left: auto;">
        <div class="close-btn v-center" @click="sidebarOpen = false;">
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </div>
    </div>

    <div class="settings-section">


      <div :class="'settings-card' + ((settingsTab == 'participants') ? ' active':'')">
        <div class="header flex" @click="switchSettingsTab('participants')">
          <div class="v-center">
            <p>Participants</p>
          </div>
          <div class="v-center dropdown-icon">
            <ion-icon name="caret-down"></ion-icon>
          </div>
        </div>
        <div class="content participants">
          <div class="participant-list">
            <div class="participant-item flex" v-for="p in meeting.participants">
              <div class="v-center">
                <div class="participant-icon" :style="'background-color:' + conveyor('settings-participants',p.user_id,['#d9730d','#dfab01','#0f7b6c','#0b6e99','#6940a5','#ad1a72','#e03e3e'])">
                  {{p.first_name[0].toUpperCase()}}{{p.last_name[0].toUpperCase()}}
                  <div v-if="p.last_seen > (Math.round(new Date().getTime()/1000) - 120)" class="participant-icon-status online"></div>
                  <div v-else class="participant-icon-status offline"></div>
                </div>
              </div>
              <div class="v-center">
                <div>
                  <h2>{{p.first_name}} {{p.last_name}} <span v-if="p.user_id == meeting.owner_id" class="host-label">Host</span></h2>
                  <p>{{p.identity}}</p>
                </div>
              </div>
              <div class="v-center kick-icon" v-if="meeting.is_owner && p.user_id !== meeting.owner_id"
                @click='confirmDialog("person-remove","Are you sure you want to remove this user from the meeting?","Cancel","Remove",() => removeUser(p.identity))'>
                <ion-icon name="close"></ion-icon>
              </div>

            </div>

            <div class="participant-item flex" v-for="p in meeting.invitees">
              <div class="v-center">
                <div class="participant-icon" style="background-color: rgb(170, 170, 187)">
                  ?
                </div>
              </div>
              <div class="v-center">
                <div>
                  <h2>{{p}}</h2>
                  <p><i>Invitation sent</i></p>
                </div>
              </div>
              <div class="v-center kick-icon" @click='confirmDialog("person-remove","Are you sure you want to remove this user from the meeting?","Cancel","Remove",() => removeUser(p))'>
                <ion-icon name="close"></ion-icon>
              </div>

            </div>
          </div>

          <center style="margin: 10px;" @click="inviteModelOpen = true" v-if="meeting.is_owner">
            <a class="btn btn-primary btn-vsmall">
              <ion-icon style="position: relative; top: 1.8px; --ionicon-stroke-width: 50px;" name="add"></ion-icon> Invite
            </a>
          </center>

        </div>
      </div>



      <div :class="'settings-card' + ((settingsTab == 'meeting') ? ' active':'')" v-if="meeting.is_owner">
        <div class="header flex" @click="switchSettingsTab('meeting')">
          <div class="v-center">
            <p>Meeting</p>
          </div>
          <div class="v-center dropdown-icon">
            <ion-icon name="caret-down"></ion-icon>
          </div>
        </div>
        <div class="content">

          <p class="label margin">Meeting name</p>
          <div class="form-field form-field-small">
            <input type="text" v-model="meeting_name_temp" @input='meeting_name_temp = meeting_name_temp.replace(/[^A-Za-z0-9-\/.&@,|_+$£#%!() ]/g,"").substr(0,25)' placeholder="e.g. Awesome Team Meeting">
            <div class="v-center" style="margin: 3px" v-if="meeting_name_temp !== meeting.title">
              <a class="btn btn-success btn-vsmall" v-if="loading_new_name" style="white-space: nowrap">Saving...&nbsp; <img class="icon loader" src="./../assets/img/loading.png" /></a>
              <a class="btn btn-success btn-vsmall" @click="newMeetingName()" v-else style="white-space: nowrap">Save</a>
            </div>
          </div>

          <div class="spacer"></div>

          <div class="flex">
            <div class="v-center">
              <p class="label margin">Enable invite link</p>
              <div class="control-bar-label flex" v-if="meeting.is_owner && meeting.allow_join_link" style="background-color: #1B2127;" @click="copyText('sidebar-join-link-copied')">
                <div class="copied-popup" id="sidebar-join-link-copied">
                  <div class="triangle"></div>
                  Copied!
                </div>
                <div class="v-center">
                  <span class="icon">
                    <ion-icon name="link-outline"></ion-icon>
                  </span>
                </div>
                <div class="v-center">
                  <p class="text">/{{meeting.join_link}}</p>
                </div>
              </div>
            </div>
            <div style="margin-left: auto;">
              <div :class="'toggle' + ((meeting.allow_join_link) ? ' active':'')" @click="toggleInviteLink(!meeting.allow_join_link)">
                <div class="toggle-inner"></div>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>

  </div>

  <div :class="'sidebar' + ((sidebarOpen) ? ' open':'')">

    <div class="sidebar-header flex">
      <div class="v-center">
        <h2>Chat</h2>
      </div>
      <div class="v-center" style="margin-left: auto;">
        <div class="close-btn v-center" @click="sidebarOpen = false">
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </div>
    </div>

    <div class="messages-area" @scroll="scrollEvent()">


      <template v-for="message in messages" :key="message.id">

        <div class="message-announcement" v-if="message.type == 'announcement'">
          <ion-icon v-if="message.icon !== ''" :name="message.icon"></ion-icon> {{message.announcement}}
          <span class="announcement-time"> &nbsp;{{niceTimeAlt(message.timestamp)}}</span>
        </div>

        <div class="message self" v-else-if="message.type == 'textmessage' && message.from == account.userID">
          <div class="message-info flex">
            <span class="message-time">{{niceTimeAlt(message.timestamp)}}</span>
            <span class="message-label">You</span>
          </div>
          <div :class="'bubble' + ((isJustEmojis(message.message)) ? ' emojiMessage':'')">
            {{message.message}}
          </div>
        </div>

        <div class="message" v-else-if="message.type == 'textmessage'">
          <div class="message-info flex">
            <span class="message-time">{{niceTimeAlt(message.timestamp)}}</span>
            <span class="message-label">{{participantById(message.from).first_name}}</span>
          </div>
          <div :class="'bubble' + ((isJustEmojis(message.message)) ? ' emojiMessage':'')">
            {{message.message}}
          </div>
        </div>
      </template>



      <div class="message-announcement">&nbsp;</div>

    </div>

    <div class="message-box flex">

      <div class="inline-emoji-picker flex" v-if="emojiSearch(inlineEmojiSearchText).length > 0">
        <template v-for="(emoji,i) in emojiSearch(inlineEmojiSearchText)">
          <div :class="'emoji-item v-center' + ((inlineEmojiIndex == i) ? ' active':'')" @mouseover="inlineEmojiIndex = i" @click="inlineEmojiIndex = i; useInlineEmoji()">
            {{emoji.emoji}}
          </div>
        </template>
      </div>

      <div class="emojiPicker" v-if="showEmojiPicker" id="emojiPicker">
        <div class="tabs flex">
          <div :class="'tab v-center' + ((emojiTab == 'Search') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Search'">
            <ion-icon name="search"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'People') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'People'">
            <ion-icon name="happy"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Nature') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Nature'">
            <ion-icon name="leaf"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Food') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Food'">
            <ion-icon name="pizza"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Travel') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Travel'">
            <ion-icon name="airplane"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Sport') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Sport'">
            <ion-icon name="american-football"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Objects') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Objects'">
            <ion-icon name="bulb"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Symbols') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Symbols'">
            <ion-icon name="medical"></ion-icon>
          </div>
          <div :class="'tab v-center' + ((emojiTab == 'Flags') ? ' active':'')" @click="emojiScrollTop(); emojiTab = 'Flags'">
            <ion-icon name="flag"></ion-icon>
          </div>
        </div>

        <div class="body" v-if="emojiTab !== 'Search'">
          <div class="emoji-item v-center" v-for="emoji in getEmojis()[emojiTab]" @click="typeEmoji(emoji.emoji)">
            {{emoji.emoji}}
          </div>
        </div>

        <div class="body-alt" v-if="emojiTab == 'Search'">

          <div class="search-bar">
            <div class="form-field form-field-small">
              <input type="text" placeholder="Search emojis..." v-model="emojiSearchText">
            </div>
          </div>

          <div class="body-inner">
            <template v-for="(emojis,cat) in getEmojis()">
              <div class="emoji-item v-center" v-for="emoji in emojis.filter((e) => e.shortcode.includes(emojiSearchText))" @click="typeEmoji(emoji.emoji)">
                {{emoji.emoji}}
              </div>
            </template>
          </div>

        </div>




      </div>

      <div v-if="showNewMessageAlert" class="scrolldown-alert" @click="scrollMessagesToBottom(); showNewMessageAlert = false;">
        New messages <ion-icon name="arrow-down"></ion-icon>
      </div>
      <input tabindex="-1" type="text" id="messageInput" v-model="newMessageText" placeholder="Write a message..." @keyup.enter="messageBoxEnter()" @keydown.left="panInlineEmojis($event,'left')" @keydown.right="panInlineEmojis($event,'right')" @input="messageBoxInput()">
      <div class="message-box-icon" @click="showEmojiPicker = !showEmojiPicker;" id="emojiPickerButton">
        <ion-icon name="happy-outline"></ion-icon>
      </div>
      <div class="message-box-icon">
        <ion-icon name="attach-outline"></ion-icon>
      </div>
    </div>


  </div>



</div>
</template>

<script>
export default {
  name: 'Meeting',
  computed: {
    appName() {
      return this.$store.state.appName;
    },
    joinLinkURL() {
      return this.$store.state.joinLinkURL;
    },
    meeting_id() {
      return this.$route.params.meeting_id;
    }
  },
  data() {
    return {
      sidebarOpen: true,

      account: {
        identities: [],
        firstName: "",
        lastName: "",
        userID: ""
      },

      meeting: {
        participants: [],
        invitees: []
      },

      meetings: [],

      meeting_name_temp: "",
      loading_new_name: false,

      loading: true,

      unreadChat: 0,

      settingsOpen: false,
      settingsTab: "participants",

      peopleSearchResults: [],
      newMeetingParticipantSearch: "",
      invitedParticipants: [],

      loadingInvite: false,
      inviteModelOpen: false,

      chatSince: "0000000000000",

      messages: {},

      newMessageText: "",

      autoscroll: true,

      showNewMessageAlert: false,

      emojiTab: "Search",

      emojiSearchText: "",
      inlineEmojiSearchText: "",
      inlineEmojiIndex: 0,

      showEmojiPicker: false

    }
  },
  methods: {

    messageBoxInput(){

      let searchText = app.newMessageText.slice(0,document.getElementById('messageInput').selectionStart);

      if(/:[A-Za-z0-9-]{1,}$/.test(searchText)){
        app.inlineEmojiSearchText = searchText.match(/:[A-Za-z0-9-]{1,}$/)[0];
        app.inlineEmojiIndex = 0;
        document.querySelector('.inline-emoji-picker').scrollLeft = 0;
      }
      else{
        app.inlineEmojiSearchText = "";
      }

    },

    useInlineEmoji() {

      app.newMessageText = app.newMessageText.replace(app.inlineEmojiSearchText, app.emojiSearch(app.inlineEmojiSearchText)[app.inlineEmojiIndex].emoji);
      app.inlineEmojiIndex = 0;
      app.inlineEmojiSearchText = "";

    },

    messageBoxEnter() {

      let srcount = app.emojiSearch(app.inlineEmojiSearchText).length;

      if (srcount > 0) {
        app.useInlineEmoji();
      } else {
        app.sendChatMessage(app.newMessageText);
        app.newMessageText = '';
      }

    },

    panInlineEmojis(event, direction) {

      let srcount = app.emojiSearch(app.inlineEmojiSearchText).length;

      if (direction == 'right' && app.inlineEmojiIndex < srcount - 1) {
        app.inlineEmojiIndex += 1;
      } else if (direction == 'left' && app.inlineEmojiIndex > 0) {
        app.inlineEmojiIndex -= 1;
      }

      if (srcount > 0) {
        event.preventDefault();
        document.querySelector('.inline-emoji-picker .emoji-item.active').scrollIntoView();
      }

    },

    emojiSearch(term) {

      let results = [];

      if (term.length > 0) {
        Object.values(this.getEmojis()).forEach((cat) => {
          cat.forEach((e) => {
            if (e.shortcode.includes(term)) {
              results.push(e);
            }
          });
        });
      }

      return results;

    },

    typeEmoji(emoji) {

      let messageTextArr = app.newMessageText.split("")
      messageTextArr.splice(document.getElementById('messageInput').selectionStart, 0, emoji);
      app.newMessageText = messageTextArr.join("");

    },

    mainClick(event) {

      if (!app.isMouseOverEl(event, "emojiPickerButton") && !app.isMouseOverEl(event, "emojiPicker")) {
        app.showEmojiPicker = false;
      }

    },

    emojiScrollTop() {

      if (document.getElementById('emojiPickerBody') !== null) {
        document.getElementById('emojiPickerBody').scrollTop = 0;
      }
    },

    scrollEvent() {

      let maxScrollPos = document.getElementsByClassName('messages-area')[0].scrollHeight - document.getElementsByClassName('messages-area')[0].clientHeight;
      let isBottom = (Math.abs(maxScrollPos - document.getElementsByClassName('messages-area')[0].scrollTop) < 10);
      if (isBottom) {
        app.autoscroll = true;
        app.showNewMessageAlert = false;
      } else {
        app.autoscroll = false;
      }

    },

    smoothScrollDown(el, amount, fast) {

      if (fast) {
        var moveBy = Math.ceil(amount / 30);
      } else {
        var moveBy = Math.ceil(amount / 100);
      }
      var count = 0;

      var scrollInterval = setInterval(() => {

        if (count >= amount) {
          clearInterval(scrollInterval);
        } else {
          el.scrollTop += moveBy;
          count += moveBy;
        }

      }, 3);

    },

    scrollMessagesToBottom(fast = false) {

      let maxScrollPos = document.getElementsByClassName('messages-area')[0].scrollHeight - document.getElementsByClassName('messages-area')[0].clientHeight;

      app.smoothScrollDown(document.getElementsByClassName('messages-area')[0], Math.abs(document.getElementsByClassName('messages-area')[0].scrollTop - maxScrollPos), fast);

    },

    participantById(id) {
      return app.meeting.participants.filter((i) => i.user_id == id)[0];
    },

    sendChatMessage(message) {

      if ((message.length > 0) && (message.length < 1500)) {
        app.api_request("POST", "/meetings/" + app.meeting_id + "/sendMessage", app.createMessageObject(message)).then(() => {
          app.getChatMessages();
        });
      }

    },

    getChatMessages() {

      app.api_request("POST", "/meetings/" + app.meeting_id + "/listMessages", {
        since: app.chatSince
      }).then((resp) => {

        resp = JSON.parse(resp);

        if (resp.status == "success") {

          let initialMessageCount = Object.keys(app.messages).length;

          resp.messages.forEach((message) => {

            //Only handle events when they come in live
            if (message.type == "event" && app.chatSince > 0) {

              //Meeting change, reload meeting
              if (message.content.event_type == "meeting_change" || message.content.event_type == "meeting_delete") {
                app.loadMeeting();
              } else if (message.content.event_type == "message_change") {
                //TODO: Handle message changes
              }
            }

            if (message.type == "announcement") {
              app.messages[message.id] = {
                type: "announcement",
                timestamp: message.timestamp,
                id: message.id,
                icon: message.content.icon,
                announcement: message.content.announcement,
              };
            }


            if (message.type == "textmessage") {
              app.messages[message.id] = {
                type: "textmessage",
                timestamp: message.timestamp,
                from: message.from,
                last_modified: message.content.last_modified,
                message: app.decryptMessage(message.content.content_base64, message.content.keys, message.content.priv_key)
              }
            }

          });

          if (Object.keys(app.messages).length !== initialMessageCount && (!app.sidebarOpen || app.settingsOpen)) {
            app.unreadChat += 1;
          }


          if (resp.last_timestamp !== 0) {
            app.chatSince = resp.last_timestamp;
          }

        }

      });

    },

    newMeetingName() {

      app.loading_new_name = true;
      app.api_request("POST", "/meetings/" + app.meeting_id + "/rename", {
        title: app.meeting_name_temp
      });

    },

    copyText(el) {

      navigator.clipboard.writeText(app.joinLinkURL + app.meeting.join_link)

      document.getElementById(el).style.display = 'block';
      setTimeout(() => {
        document.getElementById(el).style.display = 'none';
      }, 800);

    },

    switchSettingsTab(name) {
      if (app.settingsTab == name) {
        app.settingsTab = "";
      } else {
        app.settingsTab = name;
      }
    },

    removeUser(identity) {

      app.api_request("POST", "/meetings/" + app.meeting_id + "/removeUser", {
        identity: identity
      });

    },

    validateEmail: function(email) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true;
      }
      return false;
    },

    isUserInMeeting(obj) {

      if (Object.keys(obj)[0] == "user_id") {
        return !app.meeting.participants.every((i) => i.user_id !== obj.user_id);
      } else {
        return !app.invitedParticipants.every((i) => i.identity !== obj.identity);
      }

    },

    inviteParticipants() {

      app.loadingInvite = true;

      let requests = [];
      app.invitedParticipants.forEach((i) => {
        requests.push(app.api_request('POST', '/meetings/' + app.meeting_id + '/inviteUser', {
          "identity": i.identity
        }));
      });

      Promise.all(requests).then(() => {
        app.wait(1000).then(() => {
          app.loadingInvite = false;
          app.inviteModelOpen = false;
          app.invitedParticipants = [];
        })
      });

    },

    newMeetingInvite(identity) {

      if (!app.isUserInMeeting({
          identity: identity.identity
        }) && !app.isUserInMeeting({
          user_id: identity.user_id
        }) && app.meeting.invitees.indexOf(identity.identity) == -1) {
        app.invitedParticipants.push(identity);
      }

    },

    peopleSearch: function(term) {

      let people = {};

      if (term !== null && (term + "").length > 2) {

        function getContacts() {
          app.meetings.forEach((m) => {
            m.participants.forEach((p) => {
              if ((p.first_name + " " + p.last_name).toLowerCase().includes(term.toLowerCase()) || p.identity.toLowerCase().includes(term.toLowerCase())) {
                people[p.user_id] = p;
              }
            });
          });
        }

        if (app.validateEmail(term) || (!isNaN(term.replaceAll("+", "").replaceAll(" ", "")) && term.length > 9)) {

          if (!app.validateEmail(term)) {
            term = term.replaceAll("+", "").replaceAll(" ", "");
          }

          app.api_request('POST', '/contacts/lookup', {
            "identity": term
          }).then((resp) => {

            resp = JSON.parse(resp);
            if (resp.status == "success") {

              resp.users.forEach((u) => {
                people[u.user_id] = u;
              });
              getContacts();
              app.peopleSearchResults = Object.values(people);
            } else {
              getContacts();
              app.peopleSearchResults = Object.values(people);
            }
          }).catch(() => {
            getContacts();
            app.peopleSearchResults = Object.values(people);
          });
        } else {
          getContacts();
          app.peopleSearchResults = Object.values(people);
        }


      } else {
        app.peopleSearchResults = [];
      }


    },

    navigate(dest) {
      clearInterval(app.interval);
      clearInterval(app.chatInterval);
      clearInterval(app.messageAreaInterval);
      this.$router.push(dest);
    },

    toggleInviteLink(bool) {

      app.meeting.allow_join_link = bool;

      app.api_request('POST', '/meetings/' + app.meeting_id + '/toggleJoinLink', {
        allow_join_link: bool
      });

    },

    loadMeeting: function() {

      app.api_request("GET", '/meetings/' + app.meeting_id + '/get').then((resp) => {

        resp = JSON.parse(resp);

        if (resp.status == "success") {
          app.meeting = resp.meeting;
          app.loading_new_name = false;

          if (app.meeting_name_temp == "") {
            app.meeting_name_temp = resp.meeting.title;
          }
        } else {
          app.navigate('/meetings#meetingNotExist');
        }

      });

    },

    loadMeetings: function() {
      app.api_request("GET", "/meetings/list").then((resp) => {
        resp = JSON.parse(resp);
        if (resp.status == "success") {
          app.meetings = resp.meetings;
        }
      });
    },

    loadAccount: function() {
      app.api_request("GET", "/auth/accountInfo").then((resp) => {
        resp = JSON.parse(resp);

        if (resp.status == "success") {
          app.account.identities = resp.identities;
          app.account.firstName = resp.firstName;
          app.account.lastName = resp.lastName;
          app.account.userID = resp.userID;

          app.loading = false;

        } else {
          app.navigate('/account/login');
        }

      }).catch(() => {
        //Error getting account info, assume not logeed in
        app.navigate('/account/login');
      });
    },

  },

  mounted() {


    app = this;
    app.loadAccount();
    app.loadMeeting();
    app.loadMeetings();
    app.getChatMessages();

    app.interval = setInterval(() => {
      app.loadAccount();
      app.loadMeeting();
    }, 30000);

    app.chatInterval = setInterval(() => {
      app.getChatMessages();
    }, 1000);


    var oldMaxscrollPos = 0;

    app.messageAreaInterval = setInterval(() => {

      let maxScrollPos = document.getElementsByClassName('messages-area')[0].scrollHeight - document.getElementsByClassName('messages-area')[0].clientHeight;
      let isBottom = (Math.abs(maxScrollPos - document.getElementsByClassName('messages-area')[0].scrollTop) < 10);

      if (!isBottom && (app.autoscroll || oldMaxscrollPos == 0) && oldMaxscrollPos !== maxScrollPos) {
        if (oldMaxscrollPos == 0) {
          document.getElementsByClassName('messages-area')[0].scrollTop = maxScrollPos;
        } else {
          app.scrollMessagesToBottom(true);
        }
      } else if (!isBottom && oldMaxscrollPos !== maxScrollPos) {
        app.showNewMessageAlert = true;
      }

      oldMaxscrollPos = maxScrollPos;

    }, 10);


  }
}
</script>

<style lang="scss" scoped>
@use './../assets/scss/_theme' as *;
@use './../assets/scss/_elements' as *;
@use './../assets/scss/_app' as *;
</style>
