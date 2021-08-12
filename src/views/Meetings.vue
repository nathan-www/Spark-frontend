<template>
<div id="loader" v-if="loading">
  <img src="./../assets/img/emoji/monkey.png" alt="">
</div>

<a class="logo-alt">{{appName}}</a>

<div class="popup-backdrop fadeIn" id="popup-backdrop"></div>

<div class="popup-confirm" id="popup-confirm">

  <div class="popup-main">
    <h3 class="popup-icon">
      <ion-icon name="trash-outline"></ion-icon>
    </h3>
    <h2 class="title"></h2>
  </div>
  <div class="flex popup-buttons" style="margin-left: auto; justify-content: right;">
    <div class="v-center" style="height: auto; margin-left: auto;">
      <a class="cancel-button">Cancel</a>
    </div>
    <div class="v-center" style="height: auto;">
      <div class="btn btn-danger btn-vsmall continue-button"></div>
    </div>
  </div>
</div>

<div class="popup-new-meeting fadeIn" v-if="displayNewMeetingPopup">
  <div class="header flex">
    <div class="v-center">
      <h2><img src="./../assets/img/emoji/rocket.png" class="emoji" /> New meeting</h2>
    </div>
    <div class="v-center" style="margin-left: auto;">
      <div class="close-btn" @click="invitedParticipants = []; newMeetingError = false; newMeetingName = ''; displayNewMeetingPopup = false">
        <ion-icon name="close-outline"></ion-icon>
      </div>
    </div>
  </div>
  <div class="content">

    <p class="color--danger" style="font-size: 13px;" v-if="newMeetingError">Couldn't create meeting<br /><br /></p>

    <p class="subheading">Name</p>

    <div class="form-field form-field-small">
      <input @input='newMeetingName = newMeetingName.replace(/[^A-Za-z0-9-\/.&@,|_+$£#%!() ]/g,"").substr(0,25)' v-model="newMeetingName" type="text" placeholder="e.g. Awesome team meeting">
    </div>

    <p class="desc"></p>

    <div class="divider"></div>

    <div class="flex">
      <div>
        <p class="subheading">Enable join link</p>
        <p v-if="toggleInviteLink" class="desc">Share this secret link with others to invite them to the meeting.</p>
        <p v-else class="desc">You'll be able to invite participants with a secret link.</p>
        <div class="form-field form-field-small" style="user-select:all" v-if="toggleInviteLink">
          <span>{{joinLinkURL}}{{preliminaryJoinLink}}</span>
        </div>
      </div>
      <div :class="'toggle' + ((toggleInviteLink) ? ' active':'')" @click="toggleInviteLink = !toggleInviteLink">
        <div class="toggle-inner"></div>
      </div>
    </div>

    <div class="divider"></div>

    <p class="subheading">Invite participants</p>

    <div class="form-field form-field-small" style="user-select:all">
      <div class="v-center search-icon">
        <ion-icon name="search"></ion-icon>
      </div>
      <input type="text" v-model="newMeetingParticipantSearch" @input="peopleSearch(newMeetingParticipantSearch)" placeholder="Add by name, email or phone number" />
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
                <span class="addedTag fadeIn" v-if="!invitedParticipants.every((i) => i.identity !== r.identity)">Added</span>
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


    <div class="flex" style="margin-top: 20px;">
      <div style="margin-left: auto;"></div>
      <a v-if="!loadingNewMeeting" @click="createNewMeeting()" class="btn btn-primary btn-small">Create meeting</a>
      <a v-else class="btn btn-primary btn-small">Creating meeting...&nbsp; <img class="icon loader" src="./../assets/img/loading.png" /></a>
    </div>

  </div>
  <div class="footer"></div>
</div>

<div class="main flex">

  <div class="sidebar">

    <div class="sidebar-content">
      <div class="account-biscuit flex" @mouseup="toggleDropdown(document.getElementById('biscuit-dropdown'))">

        <div class="v-center">
          <div class="profile-circle-bg">
            <div class="inner v-center">
              {{(account.firstName[0])}}{{(account.lastName[0])}}
            </div>
          </div>
        </div>

        <div class="v-center">
          <div>
            <h3>{{account.firstName}} {{account.lastName}}</h3>
            <h4><span class="spot-green"></span>Available</h4>
          </div>
        </div>

        <div class="down-chevron-container v-center">
          <ion-icon name="chevron-down-outline"></ion-icon>
        </div>

        <div class="account-biscuit-dropdown" id="biscuit-dropdown">
          <div class="item item-danger flex" style="height: auto;" @click="logout()">
            <div class="v-center">
              <ion-icon name="log-out-outline"></ion-icon>
            </div>
            <div class="v-center">
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="sidebar-content">

      <div :class="'flex sidebar-tab' + ((activePage == 'meetings') ? ' active':'')" @click="activePage = 'meetings'">
        <div class="sidebar-tab-icon">
          <img src="./../assets/img/emoji/wave.png" class="emoji" />
        </div>
        <div class="sidebar-tab-text">
          Meetings
        </div>
      </div>

      <div :class="'flex sidebar-tab' + ((activePage == 'settings') ? ' active':'')" @click="activePage = 'settings'">
        <div class="sidebar-tab-icon">
          <img src="./../assets/img/emoji/gear.png" class="emoji" />
        </div>
        <div class="sidebar-tab-text">
          Settings
        </div>
      </div>

    </div>


    <div class="separator"></div>

    <div class="sidebar-content">

      <div v-if="meetings.length == 0" class="no-meetings-sidebar">
          <div class="icon">
            <ion-icon name="fish"></ion-icon>
          </div>
          <p>You aren't part of any meetings yet.</p>
      </div>

      <div class="flex" v-if="meetings.filter((m) => m.is_owner).length > 0">
        <div class="v-center">
          <h3 class="sidebar-heading">Meetings you host</h3>
        </div>

        <div class="v-center" style="margin-left: auto;">
          <div class="sidebar-buttons-right">
            <div class="btn-sidebar" @click="displayNewMeetingPopup = true">
              <ion-icon name="add-outline"></ion-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar-item flex" v-for="m in [...meetings].filter((m) => m.is_owner).sort((a,b) => a.creation_timestamp < b.creation_timestamp)" @click="navigate('/meeting/'+m.id)">
        <div class="v-center">
          <img class="emoji" :src='"img/emoji/"+conveyor("sidebar",m.id,["green","orange","purple","blue","yellow","brown","black","white"])+"-circle.png"' />
        </div>
        <div class="v-center">
          <h4>{{m.title}}</h4>
        </div>
      </div>

      <br v-if="meetings.filter((m) => m.is_owner).length > 0">

      <div class="flex" v-if="meetings.filter((m) => !m.is_owner).length > 0">
        <div class="v-center">
          <h3 class="sidebar-heading">Meetings you participate in</h3>
        </div>
      </div>

      <div class="sidebar-item flex" v-for="m in [...meetings].filter((m) => !m.is_owner).sort((a,b) => a.creation_timestamp < b.creation_timestamp)" @click="navigate('/meeting/'+m.id)">
        <div class="v-center">
          <img class="emoji" :src='"img/emoji/"+conveyor("sidebar",m.id,["green","orange","purple","blue","yellow","brown","black","white"])+"-circle.png"' />
        </div>
        <div class="v-center">
          <h4>{{m.title}}</h4>
        </div>
      </div>


    </div>

    <div class="sidebar-content bottom">
      <div class="btn btn-primary" @click="displayNewMeetingPopup = true; getPreliminaryJoinLink()">
        <ion-icon name="add-outline"></ion-icon> New meeting
      </div>

      <p class="credits">
        &copy; {{appName}} {{(new Date()).getFullYear()}} &nbsp;<a href="/privacy">Privacy</a> &nbsp; <a href="/terms">Terms</a>
      </p>
    </div>

  </div>

  <div class="main-content" v-if="activePage == 'meetings'">

    <template v-if="meetings.length > 0">

      <h1><img src="./../assets/img/emoji/wave.png" class="emoji" /> All meetings</h1>

      <div class="meeting-cards-container">

        <div class="meeting-card" v-for="meeting in [...meetings].sort((a,b) => a.creation_timestamp < b.creation_timestamp)">

          <div v-if="meeting.is_owner" class="delete-button" @click='confirmDialog("trash","Are you sure you want to delete this meeting?","Cancel","Delete",() => deleteMeeting(meeting.id))'>
            <ion-icon name="trash-outline"></ion-icon>
          </div>
          <div v-else class="delete-button" @click='confirmDialog("trash","Are you sure you want to leave this meeting?","Cancel","Leave",() => leaveMeeting(meeting.id))'>
            <ion-icon name="trash-outline"></ion-icon>
          </div>

          <div class="participant-icons flex">

            <div class="p-icon" v-for="p in meeting.participants" :style="'background-color:' + conveyor('meeting-cards',p.user_id,['#d9730d','#dfab01','#0f7b6c','#0b6e99','#6940a5','#ad1a72','#e03e3e'])"
              :data-tooltip="p.first_name + ' ' + p.last_name">
              {{p.first_name[0].toUpperCase()}}{{p.last_name[0].toUpperCase()}}

              <div v-if="p.last_seen > (Math.round(new Date().getTime()/1000) - 45) && p.status == 'in-call'" class="status-spot in-call" data-tooltip="In call"></div>
              <div v-else-if="p.last_online > (Math.round(new Date().getTime()/1000) - 45)" class="status-spot online" data-tooltip="Online"></div>
              <div v-else class="status-spot offline" data-tooltip="Offline"></div>

            </div>

            <div class="v-center additional-participants" v-if="meeting.invitees.length > 0">+{{meeting.invitees.length}}</div>
          </div>


          <h2>{{meeting.title}}
            <ion-icon v-if="meeting.is_owner" data-tooltip="You are the host" aria-label="." class="owner-icon" name="star"></ion-icon>
          </h2>

          <div class="flex card-bottom">
            <p class="started-text">
              <ion-icon name="time-outline"></ion-icon> Started {{niceTime(meeting.creation_timestamp)}}
            </p>
            <a class="btn btn-primary btn-small" @click="navigate('/meeting/'+meeting.id)">Join</a>
          </div>

        </div>

      </div>

    </template>

    <template v-else>

      <div class="welcome-area">
        <lottie-player
            autoplay
            loop
            mode="normal"
            src="/animations/jetpack.json"
            style="width: 620px; height: 300px;"
          >
        </lottie-player>

        <h1>Welcome to Spark!</h1>
        <p>
          We're glad to have you onboard. To get started, hit 'New meeting' at the bottom left.<br />Happy meetings!
        </p>

      </div>



    </template>


    <div class="explainer-section">
      <h1>
        <ion-icon name="people"></ion-icon>
      </h1>
      <h2>How do I join a meeting?</h2>
      <p>
        Ask the meeting owner to invite your email or mobile number, or provide you with a join link.
      </p>
    </div>

  </div>

  <div class="main-content settings" v-if="activePage == 'settings'">
    <h1><img src="./../assets/img/emoji/gear.png" class="emoji" /> Settings</h1>

    <div class="flex">
      <div class="flex form-section">
        <div>
          <p>First name</p>
          <div class="form-field">
            <input type="text" placeholder="First name" v-model="firstNameTemp">
          </div>
        </div>
        <div>
          <p>Last name</p>
          <div class="form-field">
            <input type="text" placeholder="Last name" v-model="lastNameTemp">
          </div>
        </div>
      </div>

      <div class="v-center" style="height: auto; margin-top: 17.5px;" v-if="(firstNameTemp !== account.firstName) || (lastNameTemp !== account.lastName)" @click="changeName(firstNameTemp + ' ' + lastNameTemp)">
        <a class="btn btn-success btn-vsmall fadeIn">Save <img v-if="loadingNameSave" src="./../assets/img/loading.png" class="icon loader save-loader" /></a>
      </div>

    </div>

    <br />
    <br />

    <div class="flex form-section">
      <div>
        <p v-if="isNaN(account.identities[0])">Email address</p>
        <p v-else>Phone number</p>
        <div class="form-field">
          <input type="text" :value="account.identities[0]" disabled>
        </div>
      </div>
    </div>

    <br />
    <br />

    <p>Active logins</p>

    <div class="sessions-container">

      <div class="session-item flex" v-for="s in [...sessions].sort((a,b) => { if(a.last_seen < b.last_seen){ return 1; } else{ return -1; } })">

        <div class="v-center">
          <ion-icon name="location-outline"></ion-icon>
        </div>

        <div class="v-center">
          <div>
            <p class="location">
              {{s.ip_location}}
            </p>
            <p class="details">
              <span class="time">Active {{niceTime(s.last_seen)}}</span>&nbsp;&bull;
              <span class="device" v-if="!s.current_session">{{s.device}}</span>
              <span class="device current" v-else>This device</span>
            </p>
          </div>
        </div>

        <div class="v-center delete-session-btn" style="margin-left: auto;">
          <ion-icon @click='confirmDialog("log-out-outline","Are you sure you want to log out of this device?","Cancel","Logout",() => deleteSession(s.session_id))' data-tooltip="Logout" name="trash"></ion-icon>
        </div>


      </div>

    </div>

    <a class="btn btn-vsmall btn-danger logout-button" @click='confirmDialog("log-out-outline","Are you sure you want to log out of all devices?","Cancel","Logout",() => deleteSession("all"))' v-if="sessions.length > 2">Logout of all</a>


  </div>

</div>
</template>

<script>

import "@lottiefiles/lottie-player";

export default {
  name: 'Login',
  computed: {
    appName() {
      return this.$store.state.appName;
    },
    joinLinkURL() {
      return this.$store.state.joinLinkURL;
    }
  },
  data() {
    return {

      account: {
        identities: [],
        firstName: "",
        lastName: ""
      },

      firstNameTemp: null,
      lastNameTemp: null,

      loadingNameSave: false,

      peopleSearchResults: [],

      sessions: [],
      meetings: [],

      loading: true,
      activePage: "meetings",

      toggleInviteLink: true,

      preliminaryJoinLink: "...",

      newMeetingParticipantSearch: "",

      invitedParticipants: [],

      newMeetingName: "",

      displayNewMeetingPopup: false,

      loadingNewMeeting: false,

      newMeetingError: false

    }
  },
  methods: {

    navigate(dest){
      clearInterval(app.interval);
      this.$router.push(dest);
    },

    createNewMeeting() {

      app.loadingNewMeeting = true;
      app.newMeetingError = false;

      app.api_request('POST', '/meetings/new', {
        'title': app.newMeetingName,
        'allow_join_link': app.toggleInviteLink,
        'invitees': app.invitedParticipants.map((i) => i.identity)
      }).then((resp) => {

        app.wait(1000).then(() => {

          resp = JSON.parse(resp);
          app.loadingNewMeeting = false;
          if (resp.status == "success") {
            app.navigate('/meeting/' + resp.meeting_id);
          } else {
            app.newMeetingError = true;
          }

        });

      })

    },

    newMeetingInvite(identity) {

      if (app.invitedParticipants.every((i) => i.identity !== identity.identity)) {
        app.invitedParticipants.push(identity);
      }

    },

    getPreliminaryJoinLink: function() {
      app.api_request('GET', '/meetings/preliminaryJoinLink').then((resp) => {
        resp = JSON.parse(resp);
        if (resp.status == "success") {
          app.preliminaryJoinLink = resp.preliminaryJoinLink;
        }
      });
    },

    validateEmail: function(email) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true;
      }
      return false;
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

    leaveMeeting: function(meeting_id) {
      app.api_request('GET', '/meetings/' + meeting_id + '/leave').then(() => {
        app.loadMeetings();
      });
    },

    deleteMeeting: function(meeting_id) {
      app.api_request('POST', '/meetings/' + meeting_id + '/delete').then(() => {
        app.loadMeetings();
      });
    },

    changeName: function(full_name) {
      app.loadingNameSave = true;

      app.api_request("POST", "/auth/changeName", {
        "full_name": full_name
      }).then(() => {
        app.wait(800).then(() => {
          app.loadAccount();

        })
      });
    },

    alert: function(a) {
      alert(a);
    },

    logout: function() {
      app.api_request("GET", "/auth/logout").then((resp) => {
        app.loadAccount();
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

          if (app.firstNameTemp == null) {
            app.firstNameTemp = resp.firstName;
            app.lastNameTemp = resp.lastName;
          }

          app.loading = false;
          app.loadingNameSave = false;

        } else {
          app.$router.replace('/account/login');
        }

      }).catch(() => {
        //Error getting account info, assume not logeed in
        app.$router.replace('/account/login');
      });
    },

    loadSessions: function() {
      app.api_request("GET", "/auth/listSessions").then((resp) => {
        resp = JSON.parse(resp);
        if (resp.status == "success") {
          app.sessions = resp.sessions;
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

    deleteSession: function(session_id) {
      this.api_request("POST", "/auth/deleteSession", {
        "session_id": session_id
      }).then((resp) => {
        this.loadAccount();
        this.loadSessions();
      });
    }

  },

  mounted() {

    window.app = this;

    if(window.hasOwnProperty('intervals')){
      window.intervals.forEach((i) => {
        clearInterval(i);
      });
    }
    else{
      window.intervals = [];
    }

    //Reload account, sessions and meetings every 30 sec
    let mainInterval = setInterval(() => {
      app.loadSessions();
      app.loadAccount();
      app.loadMeetings();
    },30000);

    window.intervals.push(mainInterval);

    app.loadSessions();
    app.loadAccount();
    app.loadMeetings();

    window.app = app;



  }
}
</script>

<style lang="scss">
@use './../assets/scss/_theme' as *;

body {
    background-color: $bg-secondary;
    height: 100vh;
    width: 100vw;
    user-select: none;
}
</style>

<style scoped lang="scss">
@use './../assets/scss/_theme' as *;
@use './../assets/scss/_elements' as *;

.no-meetings-sidebar{
  color: $text-grey;
  text-align: center;

  .icon{
    font-size: 1.2em;
    margin-bottom: 10px;
  }
}

.welcome-area{

  text-align: center;

  lottie-player{
    margin: 0px auto;
  }

  h1{
    margin-top: 35px;
  }

  p{
    color: $text-grey;
    line-height: 1.7;
  }
}

.p-icon {
    height: 32px;
    width: 32px;
    background-color: #F2C94C;
    border-radius: 50%;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-weight: 500;
    font-size: 13px;
    margin-right: 4px;
    position: relative;

    .status-spot {
        position: absolute;
        bottom: -4px;
        right: -4px;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        border: 2px solid $element-dark;
        background-color: $text-grey;

        &.online {
            background-color: $success;
        }
        &.in-call{
          background-color: $danger;
        }
    }
}

.nav {
    padding: 20px;
    .v-center {
        height: auto;
    }
}

.nav-logo {
    color: #fff;
    font-size: 25px;
    font-weight: 600;
    cursor: pointer;
}

.btn {
    margin: 0;
    width: auto;
    margin-left: 15px;

    ion-icon {
        position: relative;
        top: 1.5px;
        --ionicon-stroke-width: 60px;
    }
}

.account-biscuit-dropdown {

    display: none;
    animation: fadeIn 0.2s;

    border: 1px solid $border-grey;
    background-color: $bg-main;
    border-radius: 9px;
    padding: 7px;
    color: #eee;
    position: absolute;
    bottom: -5px;
    left: 0;
    transform: translateY(100%);
    width: 100%;
    z-index: 10;

    .item {
        padding: 7px;
        transition: background-color 0.2s;
        border-radius: 5px;
        font-size: 14px;

        ion-icon {
            margin-right: 7px;
        }

        &-danger {
            color: $danger;

            &:hover {
                background-color: $danger;
                color: #eee;
            }
        }

        &:not(&-danger):hover {
            background-color: $bg-secondary;
        }
    }
}

.account-biscuit {

    border: 1px solid $border-grey;
    border-radius: 9px;
    padding: 10px 15px;
    color: #fff;
    cursor: pointer;
    margin: 20px 0 25px;
    transition: background-color 0.2s;
    position: relative;

    &:hover {
        background-color: $bg-secondary;
    }

    h3 {
        font-weight: 400;
        font-size: 16px;
    }

    h4 {
        font-weight: 400;
        font-size: 13px;
    }

    .v-center {
        height: auto;
    }
}

.profile-circle-bg {
    background: linear-gradient($lg-1,$lg-2);
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;

    .inner {
        width: 35px;
        height: 35px;
        background-color: $bg-main;
        border-radius: 50%;
        margin: 2.5px;
        color: #fff;
        text-align: center;
        font-weight: 600;
    }
}

.spot-green {
    width: 9px;
    height: 9px;
    background-color: $success;
    display: inline-block;
    border-radius: 50%;
    margin-right: 5px;
}

.down-chevron-container {
    margin-left: auto;
}

.sidebar {
    width: 300px;
    background-color: $bg-main;
    height: 100%;
    border-right: 1px solid $border-grey;
    position: relative;
    flex-shrink: 0;

    .separator {
        width: 100%;
        height: 1.2px;
        background-color: $border-grey;
        margin: 20px 0;
    }

    .sidebar-content {
        margin: 0 20px;

        &.bottom {
            margin-top: auto;
            position: absolute;
            bottom: 0;
            text-align: center;
            width: 100%;
            width: calc(100% - 40px);
        }
    }

    .sidebar-heading {
        font-weight: 500;
        font-size: 14px;
        color: $text-grey;
    }
}

.sidebar-buttons-right {
    margin-left: auto;
}

.btn-sidebar {
    color: $text-grey;
    background-color: $element-dark;
    padding: 0 6px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 15px;
    transition: background-color 0.2s;

    &:hover {
        background-color: $bg-secondary;
    }

    position: relative;
    top: -1px;

    ion-icon {
        position: relative;
        top: 1.5px;
        --ionicon-stroke-width: 50px;
    }
}

.sidebar-item {

    margin-top: 5px;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
    cursor: pointer;
    margin-left: -8px;

    .emoji {
        margin-right: 7px;
        position: relative;
        top: 1px;
    }

    &:hover {
        background-color: $bg-secondary;
    }

    h4 {
        color: #efefef;
        font-weight: 400;
        font-size: 15px;
    }

}

.circle-tag {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #E9C557;
    margin-right: 12px;
}

.main {
    height: 100vh;
}

.sidebar-content .btn {
    margin: 0;
}

.meeting-cards-container {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
}

p.credits {
    margin-top: 25px;
    font-size: 13px;
    color: $text-grey;
    margin-bottom: 15px;
}

.main-content {
    width: 100%;
    padding: 50px;
    position: relative;
    overflow-y: scroll;

    h1 {
        font-weight: bold;
        font-size: 34px;
        color: #fff;
        margin-bottom: 25px;
    }
}

.meeting-card {
    background-color: $element-dark;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid $border-grey;
    position: relative;
    margin: 10px;
    flex-shrink: 0;
    transition: filter 0.2s;
    width: 350px;

    .btn {
        margin-left: auto;
    }

    &:hover {
        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
    }

    h2 {
        font-weight: 600;
        font-size: 20px;
        color: #fff;
    }

    p.started-text {
        font-weight: normal;
        font-size: 13px;
        color: $text-grey;
        margin-top: auto;
        margin-bottom: 5px;
        margin-right: 70px;

        ion-icon {
            position: relative;
            top: 1.5px;
        }
    }

    .card-bottom {
        margin-top: 30px;
    }

}

.participant-icons {
    margin: 10px 0;
}

.delete-button {
    position: absolute;
    top: 15px;
    right: 15px;
    color: $text-grey;
    cursor: pointer;
}

.explainer-section {
    text-align: center;
    margin: 100px auto auto 0;

    h1 {
        margin: 0 0 10px;
        color: $text-grey;

    }
    h2 {
        font-weight: 500;
        font-size: 20px;
        color: #fff;
        margin-bottom: 8px;
    }
    p {
        font-weight: normal;
        font-size: 14px;
        color: $text-grey;
    }

}

.logo-alt {
    position: fixed;
    top: 15px;
    right: 25px;
    font-weight: 600;
    font-size: 20px;
    color: rgba(255,255,255,0.1);
}

.owner-icon {
    font-size: 0.7em;
    color: $gold;
    cursor: pointer;
}

.sidebar-tab {

    color: #eee;

    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
    cursor: pointer;
    margin-left: -8px;

    &.active,
    &:hover {
        background-color: $bg-secondary;
    }

    .sidebar-content:hover &.active:not(:hover) {
        background-color: transparent;
    }

    .sidebar-tab-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 10px;
    }

    .sidebar-tab-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

}

.form-section {
    .form-field {
        margin-right: 10px;
    }
}

.settings p {
    color: $text-grey;
    font-size: 14px;
    margin-bottom: 5px;
}

.identity-item {
    background-color: $element-dark;
    display: inline-block;
    padding: 8px 17px;
    border-radius: 5px;
    color: $text-grey;
    margin-top: 5px;
}

.settings .form-section {
    width: 550px;
    & > div {
        width: 100%;
    }
}

input[disabled] {
    user-select: none;
    cursor: not-allowed;
}

.sessions-container {

    .v-center {
        height: auto;
    }

    .session-item {
        max-width: 520px;
        background-color: $element-dark;
        border: 1px solid $border-grey;
        padding: 12px;
        border-radius: 9px;
        margin-top: 8px;
        color: #eee;

        ion-icon {
            font-size: 2em;
            margin-right: 15px;
            position: relative;
            top: -1.5px;
        }

        .location {
            font-size: 16px;
            color: #eee;
        }

        .device.current {
            color: $success;
        }

        .details {
            position: relative;
            top: 1px;
        }
    }

}

.logout-button {
    margin-left: 0;
    margin-top: 15px;
}

.sessions-container .session-item .delete-session-btn {
    ion-icon {
        font-size: 1.2em;
        color: $text-grey;
        cursor: pointer;
    }
}

.additional-participants {
    height: auto;
    margin-left: 4px;
    font-size: 12px;
    color: $text-grey;
}

.save-loader {
    position: relative;
    top: 1px;
    margin-left: 5px;
}

.popup-new-meeting {
    position: fixed;
    bottom: 120px;
    left: 30px;
    background-color: $bg-secondary;
    z-index: 100;
    border: 1px solid $border-grey;
    border-radius: 9px;
    color: #eee;

    box-shadow: 0 0 2px $border-grey;

    .form-field {
        max-width: 350px;
    }

    h2 {
        font-weight: 500;
        font-size: 16px;
        padding-bottom: 2px;
    }

    p.subheading {
        font-size: 14px;
        margin-bottom: 10px;
    }

    p.desc {
        font-size: 14px;
        color: $text-grey;
        max-width: 280px;
        margin-bottom: 15px;
    }

    .toggle {
        margin-left: auto;
    }

    .v-center {
        height: auto;
    }

    .header {
        padding: 16px;
        border-bottom: 1px solid $border-grey;
    }

    .content {
        padding: 16px;
    }

    .search-icon {
        padding-left: 10px;
        font-size: 14px;
        color: $text-grey;
    }

    .divider {
        border-bottom: 1px solid $border-grey;
        width: calc(100% + 32px);
        margin: 15px -16px;
    }

    .v-center {
        height: auto;
    }

    .close-btn {
        height: 1.3em;
        width: 1.3em;
        color: $text-grey;
        font-size: 20px;
        --ionicon-stroke-width: 40px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 200px;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: #fff;
        }

        ion-icon {
            margin: auto;
        }
    }

    .form-field {
        position: relative;
    }

    .p-icon {
        margin-right: 7px;
    }

    .search-results {
        position: absolute;
        left: 0;
        bottom: 40px;
        background-color: $element-dark;
        border: 1px solid $border-grey;
        padding: 5px;
        border-radius: 6px;
        width: calc(100% - 60px);
        margin-left: 30px;

        max-height: 215px;
        overflow-y: scroll;

        .addedTag {
            padding-left: 0;
            font-size: 12px;
            color: $success;
        }

        .result {

            padding: 10px;
            border-radius: 7px;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
                background-color: $bg-main;
            }
        }

        .name {
            font-size: 14px;
            user-select: text;
        }

        .identity {
            font-size: 12px;
            user-select: text;
        }

    }
}

.invited-participants {
    margin: 10px -5px -5px;
    flex-wrap: wrap;
    width: 450px;
}

.invitee {
    ion-icon {
        position: relative;
        top: 0.5px;
        margin-left: 8px;
        cursor: pointer;
    }
    background-color: $text-grey;
    border-radius: 6px;
    padding: 4px 7px;
    margin: 5px;
    font-size: 13px;
}
</style>
