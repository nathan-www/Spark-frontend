<template>
  <a class="main-logo">
    <img style="height: 1.6em;" src="./../assets/img/logo.png" alt="">
  </a>


  <div class="main v-center">


    <div class="login-section">
      <div class="color-border" id="animateBorder">


        <div class="inner v-center" v-if="login_stage=='query_identity' || login_stage=='new_user'">

          <div class="fadeIn" v-if="login_stage == 'query_identity'">
            <h1>Login</h1>
            <p>Login or register with your email address or mobile phone number.</p>

            <p class="color--danger" v-if="error">
              Invalid email or phone number
            </p>

            <div :class="'form-field' + ((error) ? ' form-field-danger':'')">

              <div class="dropdown-flag" v-if="current_type == 'phone'"
                @mouseup="toggleDropdown(document.getElementById('dropdown-zone'))">
                <div class="v-center">
                  <img class="flag" :src="'/img/'+country_codes[current_country_code].country+'.png'" />
                </div>
                <div class="v-center">+{{current_country_code}}</div>
                <div class="v-center caret">
                  <ion-icon name="caret-down-outline"></ion-icon>
                </div>

                <div class="dropdown-zone" id="dropdown-zone">
                  <div class="dropdown-item"
                    v-for="c in Object.keys(country_codes).filter((i) => { return i!==current_country_code; })"
                    @click="current_country_code = c">
                    <div class="v-center">
                      <img class="flag" :src="'/img/'+country_codes[c].country+'.png'" />
                    </div>
                    <div class="v-center">+{{c}}</div>
                  </div>
                </div>
              </div>

              <input @keyup.enter="loginRequest()" @input="filterPhoneNumber()" v-if="current_type == 'phone'"
                v-model="identity" type="text" autocomplete="off" placeholder="Mobile number">
              <input @keyup.enter="loginRequest()" @input="filterEmail()" v-if="current_type == 'email'"
                v-model="identity" type="text" autocomplete="off" placeholder="Email address">
            </div>


            <a class="switch" v-if="current_type == 'phone'" @click="identity = ''; current_type = 'email'">Use email
              address instead</a>
            <a class="switch" v-if="current_type == 'email'" @click="identity = ''; current_type = 'phone'">Use mobile
              number instead</a>

          </div>

          <div v-if="login_stage == 'new_user'">

            <h1>Looks like you’re new here</h1>
            <p class="emphasize">Welcome to {{appName}}: the private video calling app!<br />Let’s start by getting to
              know each other</p>

            <p class="color--danger" v-if="error">
              We couldn't register you with this name
            </p>

            <div class="flex">
              <div class="form-field">
                <input v-model="first_name" type="text" autocomplete="off" placeholder="First name" />
              </div>
              <div class="form-field">
                <input v-model="last_name" type="text" autocomplete="off" placeholder="Last name" />
              </div>
            </div>

          </div>


          <div id="recaptcha_here" data-sitekey="6Lf_U5IbAAAAAFNrRqPz8m89550GQiI8w0eP-YVm" data-theme="dark"></div>

          <a :class="'btn btn-primary' + ((loading) ? ' loading':'')" @click="loginRequest()">
            <span class="loading-text">Logging in... </span>
            <span class="normal-text">Login</span>
            &nbsp;&nbsp;
            <img class="icon loader" src="./../assets/img/loading.png" />
          </a>

        </div>



        <div class="inner v-center" v-if="login_stage=='click_link'">

          <h2>
            <ion-icon name="sparkles-sharp"></ion-icon>
          </h2>
          <h1>We sent you a magic link!</h1>
          <p>
            Please click the link we sent you to approve this login request
          </p>

          <div class="flex animate-container" id="animateSpots">
            <div class="animate-spot"></div>
            <div class="animate-spot"></div>
            <div class="animate-spot"></div>
            <div class="animate-spot"></div>
            <div class="animate-spot"></div>
            <div class="animate-spot"></div>
            <div class="animate-spot"></div>
          </div>

        </div>

        <div class="inner v-center" v-if="login_stage=='enter_code'">

          <h1>Enter the code from your other device</h1>
          <p>
            Looks like you clicked our magic link on a different device or browser. <br />
            No problem! Enter the 5-digit code to verify its really you
          </p>

          <p class="color--danger" v-if="error" style="text-align: center;">
            Oh no! We couldn't validate that code
          </p>

          <div class="flex digit-input-container">
            <div class="digit-input-loading-overlay" v-if="loading">
              <img class="icon loader" src="./../assets/img/loading.png" />
            </div>
            <input type="text" @keyup.delete="digitDelete($event)" @input.prevent="digitInput($event)" data-index="0"
              class="digit-input" placeholder="0" />
            <input type="text" @keyup.delete="digitDelete($event)" @input.prevent="digitInput($event)" data-index="1"
              class="digit-input" placeholder="0" />
            <input type="text" @keyup.delete="digitDelete($event)" @input.prevent="digitInput($event)" data-index="2"
              class="digit-input" placeholder="0" />
            <input type="text" @keyup.delete="digitDelete($event)" @input.prevent="digitInput($event)" data-index="3"
              class="digit-input" placeholder="0" />
            <input type="text" @keyup.delete="digitDelete($event)" @input.prevent="digitInput($event)" data-index="4"
              class="digit-input" placeholder="0" />
          </div>

        </div>


      </div>
    </div>

    <p class="credits">&copy; {{appName}} {{(new Date()).getFullYear()}}&nbsp; <a href="/">Home</a>&nbsp; <a
        href="/privacy">Privacy</a> &nbsp; <a href="/terms">Terms</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Login',
  computed: {
    appName() {
      return this.$store.state.appName
    }
  },
  mounted() {

    let URLParams = new URLSearchParams(window.location.search);
    if (URLParams.get('e') !== null) {
      this.identity = atob(URLParams.get('e'));
      this.current_type = "email";
    }

  },
  data() {
    return {
      login_stage: 'query_identity',
      identity: '',
      error: false,
      loading: false,

      first_name: "",
      last_name: "",

      request_id: "",

      current_country_code: "44",
      current_type: "phone",

      recaptcha_token: "6Lf_U5IbAAAAAFNrRqPz8m89550GQiI8w0eP-YVm",

      country_codes: {
        44: {
          "code": "44",
          "country": "united-kingdom"
        },
        1: {
          "code": "1",
          "country": "united-states"
        }
      }

    }
  },
  methods: {

    submitCode() {
      var code = "";
      document.querySelectorAll('.digit-input-container input').forEach((i) => {
        code += i.value + "";
      });

      if (code.length == 5) {
        this.login(code);
      }

    },

    digitInput(ev) {
      let el = ev.target;

      var i = +el.getAttribute('data-index');

      el.value = el.value.replace(/[^0-9]/g, "");

      el.value.split("").forEach((c) => {
        if (document.querySelector('[data-index="' + i + '"]') !== null) {
          document.querySelector('[data-index="' + i + '"]').value = c;
          if (document.querySelector('[data-index="' + (i + 1) + '"]') !== null) {
            document.querySelector('[data-index="' + (i + 1) + '"]').focus();
          }
        }
        i++;
      });

      this.submitCode();

    },

    digitDelete(ev) {

      let el = ev.target;
      var i = +el.getAttribute('data-index');

      if (el.value.length == 0 && i > 0) {
        document.querySelector('[data-index="' + (i - 1) + '"]').focus();
      }

    },


    login(code) {

      this.loading = true;
      this.error = false;

      this.api_request('POST', '/auth/login', {
        "request_id": this.request_id,
        "code": code
      }).then((resp) => {

        this.wait(1000).then(() => {
          resp = JSON.parse(resp);
          this.loading = false;

          if (resp.status == "fail" && resp.error == "Too many requests.") {
            this.loading = true;
            setTimeout(() => {
              this.login(code);
            }, 10000);
          }
          else if (resp.status == "fail") {
            this.error = true;
          }
          else if (resp.status == "success") {
            this.$router.replace('/meetings');
          }
        });


      });

    },

    loginRequest() {

      if (this.current_type == "phone") {
        if (this.identity.length > 0 && this.identity[0] == "0") {
          this.identity = this.identity.split("").splice(1).join("");
        }
      }

      this.loading = true;
      this.error = false;

      let reqObj = {
        "identity": this.identity,
        "recaptcha_token": this.recaptcha_token
      };

      if (this.current_type == "phone") {
        reqObj.identity = this.current_country_code + "" + this.identity;
      }

      if (this.login_stage == "new_user") {
        reqObj['full_name'] = this.first_name.trim() + " " + this.last_name.trim();
      }

      this.api_request('POST', '/auth/loginRequest', reqObj).then((resp) => {
        this.wait(1000).then(() => {

          this.loading = false;
          resp = JSON.parse(resp);
          if (resp.status == "success") {

            //Success, move on to link clicking
            this.error = false;
            this.request_id = resp.request_id;
            this.login_stage = "click_link";

            //Put request_id into localstorage, so we can bypass code-entering later if possible
            localStorage.request_id = resp.request_id;

            //Keep polling login status
            var loginStatusPoll = setInterval(() => {
              this.api_request("POST", "/auth/loginStatus", {
                "request_id": this.request_id
              }).then((resp) => {

                resp = JSON.parse(resp);

                if (resp.login_status == "Approved") {
                  //Link has been clicked, but not on this browser, so prompt for a code
                  this.login_stage = "enter_code";

                  //Give 10 second opportunity for automatic login from another tab, otherwise stop polling
                  setTimeout(() => {
                    clearInterval(loginStatusPoll);
                  }, 10000);

                } else if (resp.login_status == "Completed") {
                  //Completed (yay), so redirect to logged-in page
                  clearInterval(loginStatusPoll);
                  this.$router.replace('/meetings');
                }

              });
            }, 3000)

          } else {

            //Handle error

            if (resp.hasOwnProperty('require_full_name')) {
              //New user, ask for their full name
              this.error = false;
              this.login_stage = 'new_user';
            }

            if (resp.hasOwnProperty('require_recaptcha')) {
              //Load recaptcha
              document.getElementById('recaptcha_here').style.display = 'block';
              try {
                grecaptcha.render('recaptcha_here');
              } catch (error) { }

              //keep polling recaptcha until solved, then login
              var recaptcha_poll = setInterval(() => {
                if (grecaptcha.getResponse() !== "") {
                  clearInterval(recaptcha_poll);
                  this.recaptcha_token = grecaptcha.getResponse();
                  grecaptcha.reset();
                  this.loginRequest();
                }
              }, 100);

            } else if (resp.hasOwnProperty('require_full_name')) { } else {
              //Probably an invalid input
              this.error = true;
            }

          }

        });
      });

    },

    filterPhoneNumber() {
      if (this.identity.length > 0) {
        if (this.identity[0] == "0") {
          this.identity = this.identity.split("").splice(0, 11).join("").replace(/[^0-9]/g, "");
        } else {
          this.identity = this.identity.split("").splice(0, 10).join("").replace(/[^0-9]/g, "");
        }
      }
    },

    filterEmail() {
      this.identity = this.identity.replace(/[^A-Za-z0-9.@_+-]/g, "");
    }

  }
}

var gradientAngle = 0;
setInterval(() => {

  if (document.getElementById('animateBorder') !== null) {
    let el = document.getElementById('animateBorder');
    let c1 = window.getComputedStyle(el)['borderTopColor'];
    let c2 = window.getComputedStyle(el)['borderBottomColor'];
    el.style.background = 'linear-gradient(' + gradientAngle + 'deg,' + c1 + ',' + c2 + ')';
    gradientAngle++;

    if (gradientAngle == 360) {
      gradientAngle = 0;
    }
  }

}, 50);


var spotIndex = 0;
var directionRight = true;
var pause = false;
setInterval(() => {

  if (!pause && document.getElementById('animateSpots') !== null) {
    let animateSpots = Object.values(document.getElementById('animateSpots').getElementsByClassName('animate-spot'));

    if (directionRight) {
      animateSpots = animateSpots.reverse();
      animateSpots[spotIndex].style.transform = "translateX(10px)";
    } else {
      animateSpots[spotIndex].style.transform = "translateX(-10px)";
    }

    spotIndex++;
    if (spotIndex > animateSpots.length - 1) {
      spotIndex = 0;
      directionRight = !directionRight;
      pause = true;
      setTimeout(() => {
        pause = false;
      }, 500);
    }
  }


}, 200);
</script>

<style lang="scss">
@use './../assets/scss/_theme' as *;

body {
  background-color: $bg-main;
  height: 100vh;
  width: 100vw;
  user-select: none;
}
</style>

<style scoped lang="scss">
@use './../assets/scss/_theme' as *;
@use './../assets/scss/_elements' as *;

.main {
  background-color: #000;
}

.login-section {
  margin: auto;
  text-align: center;
  max-width: 600px;

  .color-border {
    padding: 4px;
    border-radius: 20px;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.15);
    border-top-color: $lg-1;
    border-bottom-color: $lg-2;
  }

  .inner {
    padding: 40px;
    background-color: $bg-secondary;
    color: #fff;
    border-radius: 18px;
    min-height: 450px;
  }

}

h1 {
  font-weight: 600;
  font-size: 35px;
  margin-bottom: 25px;
}

p {
  color: $text-grey;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 25px;
}

p.emphasize {
  line-height: 24px;
  color: #fff;
}

.btn {
  margin-top: 25px;
}

.btn:not(.loading) .loader,
.btn:not(.loading) .loading-text {
  display: none;
}

.btn.loading .normal-text {
  display: none;
}

.btn.loading:hover {
  filter: none;
  cursor: default;
}

p.color--danger {
  text-align: left;
  margin-bottom: 10px;
}

.flag {
  height: 25px;
  margin-right: 7px;
}

.dropdown-flag {
  display: flex;
  padding-left: 15px;
  cursor: pointer;
  position: relative;

  .caret {
    margin-left: 4px;
    font-size: 0.7em;
  }

  .dropdown-zone {
    display: none;
  }
}

.flex .form-field:first-of-type {
  margin-right: 15px;
}

.dropdown-zone {
  border: 1px solid $border-grey;
  background-color: $element-dark;
  border-radius: 9px;
  position: absolute;
  bottom: -2px;
  left: 0;
  animation: fadeIn 0.2s;

  transform: translateY(100%);
}

.fadeIn {
  animation: fadeIn 0.2s;
}

.dropdown-item {
  display: flex;
  padding: 10px 15px;
  transition: background-color 0.2s;
  border-radius: 9px;

  &:hover {
    background-color: $bg-main;
  }
}

#recaptcha_here {
  display: none;
  margin-top: 10px;
}

a.switch {
  font-size: 12px;
  text-decoration: underline;
  width: fit-content;
  margin: auto;
  margin-top: 12px;
  color: $text-grey;
  cursor: pointer;
  display: block;
}

h2 {
  margin-bottom: 20px;
  font-size: 2em;
}

.animate-container {
  margin: 10px auto 0;
}

.animate-spot {
  height: 6px;
  width: 6px;
  background-color: #fff;
  border-radius: 50%;
  margin: 2px;
  transition-timing-function: ease-in;
  transition: transform 0.5s;
}

.digit-input-container {
  justify-content: center;
  position: relative;
  margin: 0px auto;
}

.digit-input {
  border: 1px solid $border-grey;
  background-color: $element-dark;
  border-radius: 9px;
  font-size: 25px;
  color: #fff;
  padding: 18px;
  text-align: center;
  width: 57px;
  height: 57px;

  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
}

.digit-input::placeholder {
  color: $text-grey;
}

.digit-input-loading-overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba($bg-main, 0.8);
  border: 1px solid $border-grey;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  .icon {
    margin: auto;
    font-size: 1.2em;
  }
}

p.credits {
  margin-top: 25px;
  font-size: 13px;
  color: $text-grey;
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
