const VideoMixin = {
  data() {
    return {

      call: {
        analyserSession: 0,
        peer: null,
        inCall: false,
        currentStream: null,
        micLevel: 0,
        availableDevices: {
          video: [],
          audio: []
        },
        participant_streams: {}
      }

    }
  },
  mounted() {

    window.app = this;

    app.initPeerJS();

    setInterval(() => {
      app.manageCall();
    }, 2000);

    setInterval(() => {
      if (app.call.inCall) {
        app.setPeer({});
      }
    }, 15000);

  },
  methods: {

    initPeerJS() {

      this.call.peer = new Peer();

      this.call.peer.on('open', function(id) {
        //Ensure updated peer ID is on server
        if (app.meeting.participants.filter((i) => i.user_id == app.account.userID)[0]['peer_id'] !== id) {
          app.setPeer({
            peer_id: id
          });
        }
      });

      this.call.peer.on('call', function(call) {
        if (app.call.inCall) {

          call.answer(app.call.currentStream);
          call.on('stream', function(stream) {

            app.call.participant_streams[call.metadata.caller_peer] = {
              stream: stream,
              micLevel: 0,
              large: false,
              call_id: call.metadata.call_id
            };

            console.log("Answered call " + call.metadata.call_id);

            app.audioAnalyser(stream, function(micLevel) {
              if (app.call.participant_streams.hasOwnProperty(call.metadata.caller_peer)) {
                app.call.participant_streams[call.metadata.caller_peer].micLevel = micLevel;
              }
            });
          });

        }
      });

    },

    //Call function periodically while in call to keep things running
    manageCall() {

      if (this.call.peer !== null) {
        if (app.meeting.participants.filter((i) => i.user_id == app.account.userID)[0]['peer_id'] !== app.call.peer.id) {
          app.setPeer({
            peer_id: app.call.peer.id
          });
        }
      }

      if (this.call.currentStream !== null && !this.call.currentStream.active) {
        //Stream no longer active
        this.call.inCall = false;
        this.call.currentStream = null;
      }

      if (this.call.inCall) {

        //make sure the server knows mute and cam status
        let self = this.meeting.participants.filter((i) => i.user_id == this.account.userID)[0];
        if (self['mute'] == app.call.currentStream.getAudioTracks()[0].enabled || self['cam_off'] == app.call.currentStream.getVideoTracks()[0].enabled) {
          app.setPeer({
            mute: !app.call.currentStream.getAudioTracks()[0].enabled,
            cam_off: !app.call.currentStream.getVideoTracks()[0].enabled
          });
        }

        //make sure the server knows we're in the call
        if (this.meeting.participants.filter((i) => i.user_id == this.account.userID)[0]['status'] !== "in-call") {
          app.setPeer({
            call_status: "in-call"
          });
        }

        //Remove unused peer connections
        Object.keys(app.call.peer.connections).forEach((p) => {
          app.call.peer.connections[p].forEach((c) => {
            if (Object.values(app.call.participant_streams).filter((s) => s.call_id == c.metadata.call_id).length < 1) {
              c.close();
            }
          });
        });

        //remove any hung-up participant streams, or those that are inactive
        Object.keys(this.call.participant_streams).forEach((p_id) => {
          let p = app.meeting.participants.filter((i) => i.user_id == p_id);
          if (p.length == 0 || p[0].status == 'hung-up') {
            delete this.call.participant_streams[p_id];
          }

          if (this.call.participant_streams[p_id].stream.getTracks().every((t) => t.readyState == 'ended')) {
            delete this.call.participant_streams[p_id];
          }
        });

        this.meeting.participants.forEach((p) => {

          //Call participant if they're marked as 'in-call' but not in stream array
          if (p.status == "in-call" && !this.call.participant_streams.hasOwnProperty(p.user_id) && p.user_id !== this.account.userID) {
            console.log("Calling ... " + p.peer_id);

            let call_id = Math.random().toString().substr(2, 8);
            let call = app.call.peer.call(p.peer_id, this.call.currentStream, {
              metadata: {
                "caller_peer": app.account.userID,
                "call_id": call_id
              }
            });

            try{
              call.on('stream', function(stream) {
                app.call.participant_streams[p.user_id] = {
                  stream: stream,
                  micLevel: 0,
                  large: false,
                  call_id: call_id
                };

                app.audioAnalyser(stream, function(micLevel) {
                  if (app.call.participant_streams.hasOwnProperty(p.user_id)) {
                    app.call.participant_streams[p.user_id].micLevel = micLevel;
                  }
                });

                console.log(p.peer_id + " answered call " + call_id);
              });
            }
            catch(e){
                app.initPeerJS();
            }

          }
        });


      } else {

        //make sure the server knows we're NOT in the call
        if (this.meeting.participants.filter((i) => i.user_id == this.account.userID)[0]['status'] !== "hung-up") {
          app.setPeer({
            call_status: "hung-up"
          });
        }

        //close any peer-to-peer connections
        Object.keys(app.call.peer.connections).forEach((p) => {
          app.call.peer.connections[p].forEach((c) => c.close());
        });

      }
    },

    setPeer(obj) {

      app.api_request("POST", "/meetings/" + app.meeting_id + "/setPeer", obj);

    },

    audioAnalyser(stream, func) {

      //monitor microphone volume level
      let audioContext = new AudioContext();
      let analyser = audioContext.createAnalyser();
      let microphone = audioContext.createMediaStreamSource(stream);
      let javascriptNode = null;
      javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      javascriptNode.onaudioprocess = function() {
        let array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        let length = array.length;
        for (let i = 0; i < length; i++) {
          values += array[i];
        }

        let micLevel = values / length;
        if (micLevel > 150) {
          micLevel = 150;
        }

        func(Math.floor(micLevel));
      }

    },

    //Create a audio/video stream, requesting user permission if required
    getDevicePermission(videoConstraints = true, audioConstraints = true) {
      navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      }).then((stream) => {
        this.getAvailableDevices();
        this.call.currentStream = stream;


        //Start monitoring microphone volume level
        let analyserSession = app.call.analyserSession + 1;
        app.call.analyserSession = analyserSession;
        app.audioAnalyser(stream, function(micLevel) {
          if (app.call.analyserSession == analyserSession) {
            app.call.micLevel = Math.floor(micLevel);
          }
        });



      }).catch((e) => {
        console.log(e);
        this.displayError("Could not connect your microphone and camera!");
      });
    },


    //List available audio and video devices
    getAvailableDevices() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((d) => {
          if (d.kind == "videoinput" && d.label.length > 0) {
            this.call.availableDevices.video = this.call.availableDevices.video.filter((i) => i.id !== d.deviceId);
            this.call.availableDevices.video.push({
              label: d.label,
              id: d.deviceId,
              current: !this.call.currentStream.getTracks().every((i) => i.label !== d.label)
            });
          } else if (d.kind == "audioinput" && d.label.length > 0) {
            this.call.availableDevices.audio = this.call.availableDevices.audio.filter((i) => i.id !== d.deviceId);
            this.call.availableDevices.audio.push({
              label: d.label,
              id: d.deviceId,
              current: !this.call.currentStream.getTracks().every((i) => i.label !== d.label)
            });
          }
        });
      });
    },

    //Change audio and video device of current stream
    changeDevice(kind, deviceId) {

      let current_audio = this.call.availableDevices.audio.filter((i) => i.current)[0].id;
      let current_video = this.call.availableDevices.video.filter((i) => i.current)[0].id;

      let videoConstraints = {
        deviceId: {
          exact: current_video
        }
      };

      let audioConstraints = {
        deviceId: {
          exact: current_audio
        }
      };

      if (kind == "audio") {
        audioConstraints.deviceId = {
          exact: deviceId
        };
      } else if (kind == "video") {
        videoConstraints.deviceId = {
          exact: deviceId
        };
      }

      this.call.currentStream.getTracks().forEach((d) => d.stop());
      this.getDevicePermission(videoConstraints, audioConstraints);

    }

  }
}

export default VideoMixin
