<template>
<div id="loader" v-if="loading">
  <img src="./../assets/img/emoji/monkey.png" alt="">
</div>

<video id="autoplayVideo" style="display: none;"></video>

<div id="error-alert" class="flex fadeIn">
  <div class="icon-zone v-center">
    <ion-icon name="alert-circle-outline"></ion-icon>
  </div>
  <div class="content-zone v-center">
    <p id="error-alert-text">Oh no! Something went wrong.</p>
  </div>
  <div class="close-btn v-center" onclick="document.getElementById('error-alert').style.display = 'none'">
    <ion-icon name="close-outline"></ion-icon>
  </div>
</div>

<input type="file" id="fileInput" style="display: none;" name="filename" @change="uploadedFile = document.getElementById('fileInput').files[0]; uploadAttachment()">

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
    <div class="v-center" style="height: auto; margin-left: auto;">
      <a class="cancel-button">Cancel</a>
    </div>
    <div class="v-center" style="height: auto;">
      <div class="btn btn-danger btn-vsmall continue-button"></div>
    </div>
  </div>
</div>

<div class="file-upload-popup-outer fadeIn" v-if="uploadPopup" @mousedown="mainClick($event)"></div>

<div class="file-upload-popup" id="uploadPopup" v-if="uploadPopup">
  <div class="inner" @click="document.getElementById('fileInput').click()" ondrop="event.preventDefault(); event.stopPropagation(); app.fileDropHandler(event);" ondragleave="document.querySelector('#uploadPopup .inner').classList.remove('active')"
    ondragover="document.querySelector('#uploadPopup .inner').classList.add('active'); event.preventDefault(); event.stopPropagation();" ondragenter="event.preventDefault(); event.stopPropagation();">
    <h1>
      <ion-icon name="cloud-upload-outline"></ion-icon>
    </h1>
    <h2>Upload files</h2>
    <p>Drag and drop files here, or click to pick a file.</p>
  </div>
</div>

<div class="file-upload-popup-outer fadeIn" v-if="uploadingPopup" @mousedown="mainClick($event)"></div>

<div class="file-uploading-popup flex" v-if="uploadingPopup" id="uploadingPopup">
  <div class="icon-zone v-center">
    <ion-icon name="arrow-up-outline"></ion-icon>
  </div>
  <div class="content-zone v-center">
    <div>
      <h3>Uploading {{formatFileName(uploadedFile['name'])}}</h3>
    </div>
  </div>
</div>

<div class="file-upload-popup-outer fadeIn" v-if="sharedImgPopup !== ''" @mousedown="mainClick($event)"></div>
<div class="sharedImgPopup" v-if="sharedImgPopup !== ''" id="sharedImgPopup">
  <img :src="sharedImgPopup" />
  <a :href="sharedImgPopup" target="_blank">Open original</a>
</div>



<div class="main flex" @mousedown="mainClick($event)" @mouseup="sliderButtonDown = null" @mousemove="if($event.buttons == 1 && sliderButtonDown !== null){ changeSliderYPos($refs['slider'+sliderButtonDown],$event); }">

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
        <input autocomplete="off" v-model="newMeetingParticipantSearch" @input="peopleSearch(newMeetingParticipantSearch)" type="text" placeholder="Enter name, email, phone number">

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

    <div class="video-area flex" v-if="call.inCall" id="videoArea">

    <div class="meeting-loading v-center" v-if="meeting.participants.filter((p) => p.status == 'in-call' && p.user_id !== account.userID).length !== Object.keys(call.participant_streams).length && Math.abs(call.joinCallTime - Math.round((new Date())/1000)) < 8">
      <div>
        <div class="superstring-indicator-light"></div>
        <h2>Entangling superstrings...</h2>
      </div>
    </div>

    <div class="alone v-center" v-else-if="Object.keys(call.participant_streams).length == 0">
      <div class="inner">
        <lottie-player
            autoplay
            loop
            mode="normal"
            src="/animations/astronaout.json"
            style="width: 320px"
          >
      </lottie-player>
      <h2>You're alone in the call</h2>
      </div>

    </div>

    <template v-else v-for="(video,i) in call.participant_streams">

      <div :class="'video-card' + ((video.large) ? ' large':'')">

        <video v-show="!meeting.participants.filter((p) => p.user_id == i)[0].cam_off" :srcObject="video.stream" onloadstart="this.volume=0.75" autoplay disablePictureInPicture></video>

        <div class="user-shy v-center" :style="((video.micLevel < 1) ? 'border-color: transparent':'')" :data-mic="video.micLevel" v-if="meeting.participants.filter((p) => p.user_id == i)[0].cam_off">
          <span>
            {{ meeting.participants.filter((p) => p.user_id == i)[0].first_name[0].toUpperCase() }}{{ meeting.participants.filter((p) => p.user_id == i)[0].last_name[0].toUpperCase() }}
          </span>
        </div>


        <div class="video-card-nametag flex" v-if="meeting.participants.filter((p) => p.user_id == i).length > 0">
          <div class="v-center">
            <p>{{meeting.participants.filter((p) => p.user_id == i)[0]['first_name']}}</p>
          </div>
          <div class="v-center off-icon" v-if="meeting.participants.filter((p) => p.user_id == i)[0].mute">
            <ion-icon name="mic-off"></ion-icon>
          </div>
          <div class="v-center off-icon" v-if="meeting.participants.filter((p) => p.user_id == i)[0].cam_off">
            <ion-icon name="videocam-off"></ion-icon>
          </div>
          <div class="v-center">
            <div class="nametag-spot"></div>
          </div>
        </div>

        <div class="flex video-card-volume-buttons-right">
          <div v-if="!video.large" class="video-card-btn v-center" @click="Object.keys(call.participant_streams).forEach((id) => {call.participant_streams[id].large = false;}); call.participant_streams[i].large = true;">
            <ion-icon name="expand-outline"></ion-icon>
          </div>
          <div v-else class="video-card-btn v-center" @click="call.participant_streams[i].large = false;">
            <ion-icon name="contract-outline"></ion-icon>
          </div>
          <div class="video-card-btn v-center" @click="video.showVolSlider = true">

            <div class="volume-slider" :ref="'slider'+i" style="height: 112px" @mousedown="changeSliderYPos($refs['slider'+i],$event); sliderButtonDown = i;" @mouseover="video.volSliderHovered = true" @mouseout="video.volSliderHovered = false" v-show="video.showVolSlider">
              <div class="volume-slider-handle" @mousedown="sliderButtonDown = null;" style="bottom: 75px;"></div>
              <div class="volume-slider-active" style="height: 75px;"></div>
            </div>

            <ion-icon name="volume-medium" class="volume-icon"></ion-icon>
          </div>
        </div>

      </div>

    </template>

    </div>


    <div class="join-meeting-dialog-container v-center" v-else>


      <div class="join-meeting-dialog">

        <div class="in-meeting-list flex" v-if="meeting.participants.filter((p) => p.status == 'in-call' && p.user_id !== account.userID).length > 0">
          <div class="p-icon v-center" :data-tooltip="p.first_name + ' ' + p.last_name" v-for="p in meeting.participants.filter((p) => p.status == 'in-call' && p.user_id !== account.userID)" :style="'background-color:' + conveyor('in-meeting-list','settings-'+p.user_id,['#d9730d','#dfab01','#0f7b6c','#0b6e99','#6940a5','#ad1a72','#e03e3e'])">
            {{p.first_name[0].toUpperCase()}}{{p.last_name[0].toUpperCase()}}
            <div class="participant-icon-status in-call" data-tooltip="In call"></div>
          </div>
          <div class="label v-center">
            Already in the call
          </div>
        </div>

        <h2>Join the meeting</h2>

        <p class="explainer">Allow access to your camera and microphone to participate in the meeting</p>

        <div class="flex">
          <div class="v-center icon-container">
            <ion-icon name="videocam"></ion-icon>
          </div>
          <div class="v-center">
            <h3>Camera</h3>
          </div>

          <div class="v-center" v-if="call.availableDevices['video'].length > 0">
            <div class="device-dropdown flex">
              <div class="v-center device-active-label" @click="dropdownAreaVideo = true">
                {{ call.availableDevices['video'].filter((d) => d.current)[0].label }}
              </div>
              <div class="v-center" @click="dropdownAreaVideo = true">
                <ion-icon name="chevron-down"></ion-icon>
              </div>
              <div class="dropdown-area" id="dropdownAreaVideo" v-if="dropdownAreaVideo">
                <div class="item" v-for="device in call.availableDevices['video']" @click="changeDevice('video', device.id); dropdownAreaVideo = false;">
                  {{device.label}}
                </div>
              </div>
            </div>
          </div>

          <div class="v-center" style="margin-left: auto;" @click="allowMicCamera()" v-if="call.currentStream == null">
            <a class="btn btn-vsmall btn-success">Allow</a>
          </div>
          <div style="margin-left: auto;" class="v-center color--success device-checkmark" v-else>
            <ion-icon name="checkmark-outline"></ion-icon>
          </div>
        </div>

        <video class="camera-preview" style="margin-left: 25px;" v-if="call.currentStream !== null" :srcObject="call.currentStream" autoplay muted></video>


        <div class="divider"></div>

        <div class="flex">
          <div class="v-center icon-container">
            <ion-icon name="mic"></ion-icon>
          </div>
          <div class="v-center">
            <h3>Microphone</h3>
          </div>

          <div class="v-center" v-if="call.availableDevices['audio'].length > 0">
            <div class="device-dropdown flex">
              <div class="v-center device-active-label" @click="dropdownAreaAudio = true">
                {{ call.availableDevices['audio'].filter((d) => d.current)[0].label }}
              </div>
              <div class="v-center" @click="dropdownAreaAudio = true">
                <ion-icon name="chevron-down"></ion-icon>
              </div>
              <div class="dropdown-area" id="dropdownAreaAudio" v-if="dropdownAreaAudio">
                <div class="item" v-for="device in call.availableDevices['audio']" @click="changeDevice('audio', device.id); dropdownAreaAudio = false;">
                  {{device.label}}
                </div>
              </div>
            </div>
          </div>

          <div class="v-center" style="margin-left: auto;" @click="allowMicCamera()" v-if="call.currentStream == null">
            <a class="btn btn-vsmall btn-success">Allow</a>
          </div>
          <div style="margin-left: auto;" class="v-center color--success device-checkmark" v-else>
            <ion-icon name="checkmark-outline"></ion-icon>
          </div>
        </div>

        <div class="mic-level flex" style="margin-left: 25px;" v-if="call.currentStream !== null">
          <template v-for="i in 20">
            <div :class="'mic-level-chip' + ((call.micLevel > i*7.5) ? ' active':'') + ((i > 15) ? ' color--warning':'')"></div>
          </template>
        </div>


        <a class="btn btn-primary join-btn" v-if="call.currentStream !== null" @click="call.inCall = true; call.joinCallTime = Math.round((new Date())/1000);">
          Join meeting
        </a>

        <p class="nobody" v-if="meeting.participants.filter((p) => p.status == 'in-call' && p.user_id !== account.userID).length == 0"><img src="./../assets/img/emoji/sleeping.png" class="emoji" /> Nobody else in the call</p>

      </div>



    </div>

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
                <p @click="sidebarOpen = true; settingsOpen = true; settingsTab = 'participants';" class="text">{{meeting.participants.filter((p) => p.last_online > (Math.round(new Date().getTime()/1000) - 45)).length }}&nbsp;/&nbsp;{{meeting.invitees.length + meeting.participants.length}} online</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="button-group-center flex">

        <template v-if="call.currentStream !== null">
          <div class="v-center">
            <div :class="'circle-icon v-center' + ((call.currentStream.getAudioTracks()[0].enabled) ? '':' off')" @click="call.currentStream.getAudioTracks()[0].enabled = !call.currentStream.getAudioTracks()[0].enabled; $forceUpdate()">
              <ion-icon name="mic"></ion-icon>
              <div class="disabled"></div>
            </div>
          </div>

          <div class="v-center">
            <div :class="'circle-icon v-center' + ((call.currentStream.getVideoTracks()[0].enabled) ? '':' off')" @click="call.currentStream.getVideoTracks()[0].enabled = !call.currentStream.getVideoTracks()[0].enabled; $forceUpdate()">
              <ion-icon name="videocam"></ion-icon>
              <div class="disabled"></div>
            </div>
          </div>


        </template>



        <div class="v-center" v-if="call.inCall">
          <div class="circle-icon hangup v-center" @click="call.inCall = false">
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
                <div class="participant-icon" :style="'background-color:' + conveyor('settings-participants','settings-'+p.user_id,['#d9730d','#dfab01','#0f7b6c','#0b6e99','#6940a5','#ad1a72','#e03e3e'])">
                  {{p.first_name[0].toUpperCase()}}{{p.last_name[0].toUpperCase()}}

                  <div v-if="p.last_seen > (Math.round(new Date().getTime()/1000) - 45) && p.status == 'in-call'" class="participant-icon-status in-call" data-tooltip="In call"></div>
                  <div v-else-if="p.last_online > (Math.round(new Date().getTime()/1000) - 45)" class="participant-icon-status online" data-tooltip="Online"></div>
                  <div v-else class="participant-icon-status offline" data-tooltip="Offline"></div>
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
            <input autocomplete="off" type="text" v-model="meeting_name_temp" @input='meeting_name_temp = meeting_name_temp.replace(/[^A-Za-z0-9-\/.&@,|_+$£#%!() ]/g,"").substr(0,25)' placeholder="e.g. Awesome Team Meeting">
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

      <div :class="'settings-card' + ((settingsTab == 'security') ? ' active':'')" >
        <div class="header flex" @click="switchSettingsTab('security'); window.jdenticon.update('[data-jdenticon-value]')">
          <div class="v-center">
            <p>Security</p>
          </div>
          <div class="v-center dropdown-icon">
            <ion-icon name="caret-down"></ion-icon>
          </div>
        </div>
        <div class="content">

          <p class="label margin">Security code</p>
          <p class="label margin">
            To verify that end-to-end encryption is working, check that your security code and pattern match with other members of the meeting.
          </p>


          <div class="flex">
            <div class="v-center">
              <svg class="security_img" width="80" height="80" :data-jdenticon-value="verificationHash"></svg>
            </div>
            <div>
              <div class="v-center">
                <div class="security_code flex">
                  <div class="code-part flex" v-for="part in verificationHash.split(' ')">
                    <p v-for="digit in part.split('')"> {{digit}} </p>
                  </div>
                </div>
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
        <div>
          <h2>Chat</h2>
          <p @click="sidebarOpen = true; settingsOpen = true; settingsTab = 'participants';" class="online-now-text" v-if="meeting.participants.filter((p) => p.last_online > (Math.round(new Date().getTime()/1000) - 45)).length > 1">{{meeting.participants.filter((p) => p.last_online > (Math.round(new Date().getTime()/1000) - 45)).length }} online now</p>
        </div>
      </div>
      <div class="v-center" style="margin-left: auto;">
        <div class="close-btn v-center" @click="sidebarOpen = false">
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </div>
    </div>

    <div class="messages-area" @scroll="scrollEvent()">


      <template v-for="(message,i) in Object.values(messages).sort((a,b) => { if(a.timestamp < b.timestamp){ return 1; } else{ return -1; } })" :key="message.id">

        <div class="p-separator" v-if="Object.keys(messages).indexOf(i)>0 && messages[Object.keys(messages)[Object.keys(messages).indexOf(i)-1]].from !== message.from && messages[Object.keys(messages)[Object.keys(messages).indexOf(i)-1]].type !== 'announcement'"></div>

        <div class="message-announcement" v-if="message.type == 'announcement'">
          <ion-icon v-if="message.icon !== ''" :name="message.icon"></ion-icon> {{message.announcement}}
          <span class="announcement-time"> &nbsp;{{niceTimeAlt(message.timestamp)}}</span>
        </div>

        <div class="message" v-if="Object.keys(messages).indexOf(i) == 0">
          <div class="message-info flex">
            <div class="v-center message-label-container">
              <div class="message-label">Spark <span class="bot-label">Bot</span></div>
            </div>
            <div class="v-center">
              <div class="message-time">
                {{niceTimeAlt(message.timestamp)}}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="bubble">
              Welcome to Spark meetings! All of your chat, files, audio and video and end-to-end encrypted, so only you and your team mates have access. <img src="./../assets/img/emoji/locked.png" class="emoji" />
            </div>
          </div>
        </div>

        <div :class="'message' + ((message.from == account.userID) ? ' self':'')" v-if="message.type !== 'announcement'">

          <div class="message-info flex">
            <div class="v-center message-label-container">
              <div v-if="message.from == account.userID" class="message-label">You</div>
              <div v-else class="message-label">{{participantById(message.from).first_name}}</div>
            </div>
            <div class="v-center">
              <div class="message-time">{{niceTimeAlt(message.timestamp)}}</div>
            </div>
          </div>

          <template v-if="message.failed">

            <div class="flex">
              <div style="margin-left: auto;" v-if="message.from == account.userID"></div>

              <div class="bubble failed">
                <div class="inner">
                  {{ getFailMessageText(i) }}
                </div>

                <div class="message-failed v-center" >
                  <div>
                    <ion-icon name="lock-closed"></ion-icon> Cannot decrypt
                  </div>
                </div>
              </div>
            </div>

          </template>

          <template v-else-if="message.loading">

            <div class="message-loading"></div>

          </template>

          <template v-else-if="message.type == 'textmessage'">

            <div class="flex">
              <div style="margin-left: auto;" v-if="message.from == account.userID"></div>

              <div :class="'bubble' + ((message.isJustEmojis) ? ' emojiMessage':'')" v-html="processTextMessage(message.message)">
              </div>
            </div>

            <template v-for="embed in getEmbeds(message.message)">
              <div class="youtube-embed" v-if="embed.type == 'youtube'">
                <iframe :src="'https://www.youtube-nocookie.com/embed/' + embed.video" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </template>

          </template>

          <template v-else-if="message.type == 'attachment'">

            <div class="flex">
              <div style="margin-left: auto;" v-if="message.from == account.userID"></div>

              <img class="sharedImage" v-if="img_mimes.includes(message.attachment.type)" :src="message.objectURL" @click="sharedImgPopup = message.objectURL" />

              <div class="attachment-card flex" v-else
                @click="downloadAttachment(message.attachment.attachment_id, message.attachment.keys, {name: message.attachment.name, mime_type: message.attachment.mime_type, size: message.attachment.size})">
                <div class="icon-zone v-center">
                  <ion-icon name="document-attach-outline"></ion-icon>
                </div>
                <div class="content-zone v-center">
                  <h2>{{message.attachment.name}}</h2>
                  <p>{{formatFileSize(message.attachment.size)}}</p>
                </div>
              </div>

            </div>

          </template>



        </div>

      </template>



      <div class="message-announcement">&nbsp;</div>

    </div>

    <div :class="'message-box flex'  + ((messageBoxFocus) ? ' focussed':'')">

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
              <input autocomplete="off" type="text" placeholder="Search emojis..." v-model="emojiSearchText">
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
      <input autocomplete="off" tabindex="-1" type="text" id="messageInput" v-model="newMessageText" placeholder="Write a message..." @keyup.enter="messageBoxEnter()" @keydown.left="panInlineEmojis($event,'left')" @keydown.right="panInlineEmojis($event,'right')"
        @input="messageBoxInput()" @focus="messageBoxFocus = true" @blur="messageBoxFocus = false">
      <div class="message-box-icon" @click="showEmojiPicker = !showEmojiPicker;" id="emojiPickerButton">
        <ion-icon name="happy-outline"></ion-icon>
      </div>
      <div class="message-box-icon" @click="uploadPopup = true">
        <ion-icon name="attach-outline"></ion-icon>
      </div>
    </div>


  </div>



</div>
</template>

<script>

import VideoMixin from './../mixins/video.js';
import "@lottiefiles/lottie-player";

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
  mixins: [ VideoMixin ],
  data() {
    return {

      document: document,

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

      showEmojiPicker: false,

      uploadPopup: false,
      uploadingPopup: false,
      uploadedFile: null,

      ignoreScrollEvents: false,

      sharedImgPopup: '',

      sliderButtonDown: null,

      videoCardNum: 0,

      dropdownAreaVideo: false,
      dropdownAreaAudio: false,

      verificationHash: "",

      failMessageText: {},

      messageBoxFocus: false

    }
  },
  methods: {

    getFailMessageText(message_id){
      if(!app.failMessageText.hasOwnProperty(message_id)){
        app.failMessageText[message_id] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".substr(Math.round((Math.random()*100)),Math.round((Math.random()*50)+20)).trim();
      }

      return app.failMessageText[message_id];
    },


    resizeVideoCards(){

      if(document.getElementById('videoArea') !== null){


        let numCards = document.getElementById('videoArea').querySelectorAll('.video-card').length;

        if(numCards !== app.videoCardNum){

          app.videoCardNum = numCards;

          let numX = Math.ceil(Math.sqrt(numCards));
          let numY = Math.ceil(numCards/Math.ceil(Math.sqrt(numCards)));

          Array.from(document.getElementById('videoArea').querySelectorAll('.video-card')).forEach((c) => {
            c.style.height = Math.floor(100/numY) + "%";
            c.style.width = Math.floor(100/numX) + "%";
          });

        }
    }

    },

    allowMicCamera(){

      document.getElementById('autoplayVideo').play();
      this.getDevicePermission();

    },

    getEmbeds(message){

      let embeds = [];

      /* Youtube embeds */
      let search1 = Array.from(message.matchAll(/((http)(s|)(:\/\/)(www\.|)youtube\.com\/watch\?v=)([A-Za-z0-9]*)/g));
      let search2 = Array.from(message.matchAll(/(http)(s|)(:\/\/)(www\.|)youtu\.be\/([A-Za-z0-9]*)/g));
      let results = search1.concat(search2);

      results = [...new Set(results.map((r) => r[r.length-1]))];
      results.forEach((yt) => {
        embeds.push({
          type:"youtube",
          video:yt
        });
      });

      return embeds;


    },

    processTextMessage(message) {

      var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '+': "&#43;"
      };

      var htmlEscaper = /[+&<>"']/g;

      var message = ('' + message).replace(htmlEscaper, function(match) {
        return htmlEscapes[match];
      });

      //Allow in-text formatting
      var specialOperators = {
        '_': 'i',
        '*': 'b',
        '~':'s'
      };

      Object.keys(specialOperators).forEach((symbol) => {
        let tag = specialOperators[symbol];
        message = message.replaceAll(RegExp('(?:['+symbol+'])([^'+symbol+']*)(?:['+symbol+'])','g'),(e) => '<'+tag+'>'+e.replaceAll(RegExp('(^(['+symbol+']))|((['+symbol+'])$)','g'),"")+'</'+tag+'>');
      });

      //Make links link!
      message = message.replaceAll(/(http)(s|)(:\/\/)[A-Za-z0-9_/=.&+?-]*/g,"<a target='_blank' href='$&'>$&</a>");


      return message;
    },

    fileDropHandler(ev) {

      ev.preventDefault();

      if (ev.dataTransfer.items) {
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            app.uploadedFile = file;
          }
        }
      } else {
        app.uploadedFile = ev.dataTransfer.files[0];
      }

      if (app.uploadedFile !== null) {
        app.uploadAttachment();
      }

    },

    formatFileName(name) {

      let firstPart = name.split(".").slice(0, name.split(".").length - 1).join(".");
      let ext = name.split(".").slice(name.split(".").length - 1).join(".");

      if (firstPart.length > 15) {
        firstPart = firstPart.slice(0, 7) + "..." + firstPart.slice(firstPart.length - 7);
      }

      return firstPart + "." + ext;

    },

    displayError(errorText) {
      document.getElementById('error-alert-text').innerText = errorText;
      document.getElementById('error-alert').style.display = 'flex';
    },

    uploadAttachment() {

      app.uploadPopup = false;

      if (app.uploadedFile.size > 2000000) { //Max 2MB
        app.displayError("Oh no! Your file is too large to send.");
      } else {

        app.uploadingPopup = true;

        app.createAttachmentObject(app.uploadedFile).then((attachmentObj) => {

          app.api_request("POST", "/meetings/" + app.meeting_id + "/sendMessage", attachmentObj).then((resp) => {
            app.wait(500).then(() => {
              app.uploadingPopup = false;
            });
            resp = JSON.parse(resp);
            if (resp.status !== "success") {
              if (resp.error == "Message too large") {
                app.displayError("Oh no! Your file is too large to send.");
              } else {
                app.displayError("Oh no! Your file failed send.");
              }
            }
            app.getChatMessages();
          });

        });

      }
    },

    messageBoxInput() {

      let searchText = app.newMessageText.slice(0, document.getElementById('messageInput').selectionStart);

      if (/:[A-Za-z0-9-]{1,}$/.test(searchText)) {
        app.inlineEmojiSearchText = searchText.match(/:[A-Za-z0-9-]{1,}$/)[0];
        app.inlineEmojiIndex = 0;
        document.querySelector('.inline-emoji-picker').scrollLeft = 0;
      } else {
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
        this.$nextTick(() => {
          document.querySelector('.inline-emoji-picker .emoji-item.active').scrollIntoView();
        });
      }

    },

    emojiSearch(term) {

      let results = [];

      if (term.length > 0) {

        if (term[0] == ":") {
          term = term.slice(1);
        }

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
      if (!app.isMouseOverEl(event, "uploadPopup")) {
        app.uploadPopup = false;
      }
      if (!app.isMouseOverEl(event, "sharedImgPopup")) {
        app.sharedImgPopup = '';
      }
      if (!app.isMouseOverEl(event, "dropdownAreaVideo")) {
        app.dropdownAreaVideo = false;
      }
      if (!app.isMouseOverEl(event, "dropdownAreaAudio")) {
        app.dropdownAreaAudio = false;
      }


      Object.keys(app.call.participant_streams).forEach((i) => {
        let video = app.call.participant_streams[i];
        if(!video.hasOwnProperty('volSliderHovered') || !video.volSliderHovered){
          app.call.participant_streams[i].showVolSlider = false;
        }
      });



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
      } else if (!app.ignoreScrollEvents) {
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
      app.ignoreScrollEvents = true;

      var scrollInterval = setInterval(() => {

        if (count >= amount) {
          clearInterval(scrollInterval);
          app.ignoreScrollEvents = false;
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
      let results =  app.meeting.participants.filter((i) => i.user_id == id);
      if(results.length > 0){
        return results[0];
      }
      else{
        return {first_name: "Unknown"};
      }
    },

    sendChatMessage(message) {

      if ((message.length > 0) && (message.length < 1500)) {
        app.createMessageObject(message).then((messageObj) => {

          app.api_request("POST", "/meetings/" + app.meeting_id + "/sendMessage", messageObj).then(() => {
            app.getChatMessages();
          }).catch(() => {
            app.displayError("Failed to send message");
          });

        }).catch(() => {
          app.displayError("Failed to send message");
        });
      }
      else{
        app.displayError("Message too long! Maximum 1500 characters");
      }

    },

    downloadAttachment(attachment_id, keys, attachment_info) {

      app.api_request("POST", '/meetings/downloadAttachment', {
        attachment_id: attachment_id
      }).then((resp) => {

        resp = JSON.parse(resp);

        if (resp.status == "success") {

          let file = app.decryptAttachment(resp.content_base64, keys, attachment_info).then((file) => {
            var element = document.createElement('a');
            element.setAttribute('href', URL.createObjectURL(file));
            element.setAttribute('download', file.name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }).catch(() => app.displayError("There was a problem downloading this attachment"));


        } else {
          app.displayError("There was a problem downloading this attachment");
        }

      });

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
                loading: true,
                failed: false
              }

              app.decryptMessage(message.content.content_base64, message.content.keys).then((content) => {
                app.messages[message.id].message = content;
                app.messages[message.id].isJustEmojis =  app.isJustEmojis(content);
                app.messages[message.id].loading = false;
              }).catch(() => {
                app.messages[message.id].failed = true;
              });

            }


            if (message.type == "attachment") {

              app.messages[message.id] = {
                type: "attachment",
                timestamp: message.timestamp,
                from: message.from,
                last_modified: message.content.last_modified,
                loading: true,
                failed: false
              }

              app.decryptAttachment(message.content.content_base64, message.content.keys, {
                name: message.content.attachment_name,
                mime_type: message.content.attachment_mime_type,
                size: message.content.attachment_size,
                attachment_id: message.content.attachment_id
              }).then((attachment) => {
                app.messages[message.id].attachment = attachment;
                app.messages[message.id].objectURL = ((app.img_mimes.includes(attachment.type)) ? URL.createObjectURL(attachment) : '');
                app.messages[message.id].loading = false;
              }).catch(() => {
                app.messages[message.id].failed = true;
              });


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

      navigator.clipboard.writeText(app.joinLinkURL + app.meeting.join_link);

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

          document.title = "Spark - " + resp.meeting.title;

          if (app.meeting_name_temp == "") {
            app.meeting_name_temp = resp.meeting.title;
          }


          //Calculate security hash from participant public keys
          let publicKeys = [];
          app.meeting.participants.forEach((p) => {
            publicKeys.push(p.public_key);
          });
          publicKeys.sort((a,b) => { if(a < b){ return 1; } else{ return -1; } });

          let encoder = new TextEncoder();
          crypto.subtle.digest("SHA-256", encoder.encode(publicKeys.join(","))).then((buff) => {
            app.verificationHash = (new Uint16Array(buff)).map((i) => (i.toString()+"00000").substr(0,5)).join(" ");
          });



        } else {

          if(resp.error !== "Not logged in"){
            app.navigate('/404');
          }
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

  beforeUnmount(){

    if(window.hasOwnProperty('micNodes')){
      window.micNodes.forEach((n) => { n.onaudioprocess = null; n = null; });
    }

  },

  mounted() {


    window.app = this;
    app.loadAccount();
    app.loadMeeting();
    app.loadMeetings();
    app.getChatMessages();

    if(window.hasOwnProperty('intervals')){
      window.intervals.forEach((i) => {
        clearInterval(i);
      });
    }
    else{
      window.intervals = [];
    }

    let mainInterval = setInterval(() => {
      app.loadAccount();
      app.loadMeeting();
    }, 30000);

    let chatInterval = setInterval(() => {
      app.getChatMessages();
    }, 1000);

    window.intervals.push(mainInterval);
    window.intervals.push(chatInterval);

    window.intervals.push(setInterval(() => {
      app.manageCall();
    }, 2000));

    window.intervals.push(setInterval(() => {
      if (app.call.inCall) {
        app.setPeer({});
      }
    }, 15000));

    window.intervals.push(setInterval(() => {
      window.jdenticon.update('[data-jdenticon-value]');
    }, 1000));



    var oldMaxscrollPos = 0;

    let messageAreaInterval = setInterval(() => {

      app.resizeVideoCards();

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

    window.intervals.push(messageAreaInterval);



    app.resizeVideoCards();


  }
}
</script>

<style>
  body{
    overflow: hidden;
  }
</style>

<style lang="scss" scoped>
@use './../assets/scss/_theme' as *;
@use './../assets/scss/_elements' as *;
@use './../assets/scss/_app' as *;
</style>
