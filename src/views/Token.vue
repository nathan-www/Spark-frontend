<template>
<a class="main-logo">{{appName}}</a>


<div class="main v-center">
  <div class="inner">

    <div class="biscuit" v-if="!loading">
      <h2 v-if="!error">Verification code</h2>
      <p v-if="error" class="color--danger">
        Oh no! We couldn't verify this token. Please try logging-in again.
      </p>
      <h1 id="code">{{code}}</h1>

      <p v-if="!error" class="help">
        <ion-icon name="help-circle-outline"></ion-icon>&nbsp;Go back to the login page and enter the above code
      </p>
    </div>

    <div class="biscuit" v-if="loading">
      <img class="icon loader" src="./../assets/img/loading.png" />

    </div>

  </div>
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
  data() {
    return {
      loading: true,
      error: false,
      code: ""
    }
  },
  methods: {

  },
  mounted() {

    this.api_request("POST", "/auth/tokenToCode", {
      "token": this.$route.params.token
    }).then((resp) => {

      this.wait(1000).then(() => {

        this.loading = false;
        resp = JSON.parse(resp);

        if (resp.status == "success") {

          this.loading = true;

          //Check if request_id is in localstorage and we can login on this device
          if(localStorage.request_id !== null){
            this.api_request("POST","/auth/login",{
              "code": resp.code,
              "request_id": localStorage.request_id
            }).then((resp) => {

              resp = JSON.parse(resp);
              if(resp.status == "success"){
                localStorage.removeItem("request_id");
                //Login right away
                this.$router.replace('/meetings');
              }
              else{
                this.loading = false;
              }

            });
          }

          this.code = resp.code;

        } else {
          this.error = true;
        }

      });

    });

  }
}

var gradientAngle = 0;
setInterval(() => {

  if (document.getElementById('code') !== null) {
    let el = document.getElementById('code');
    let c1 = window.getComputedStyle(el)['borderTopColor'];
    let c2 = window.getComputedStyle(el)['borderBottomColor'];
    el.style.backgroundImage = 'linear-gradient(' + gradientAngle + 'deg,' + c1 + ',' + c2 + ')';
    gradientAngle++;

    if (gradientAngle == 360) {
      gradientAngle = 0;
    }
  }

}, 50);
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

    .inner {
        max-width: 600px;
        margin: auto;
    }

}

h1#code {
    border-top-color: $lg-1;
    border-bottom-color: $lg-2;
    background-clip: text;
    color: transparent;
    font-size: 45px;
    letter-spacing: 15px;
    user-select: text;

    &::selection{
      color: #fff;
    }
}

.biscuit {
    background-color: $bg-secondary;
    padding: 25px;
    color: #fff;
    border: 1px solid $border-grey;
    border-radius: 20px;
    text-align: center;
    width: 500px;
    max-width: calc(100vw - 20px);
    margin: 10px;
}

h2 {
    margin-bottom: 15px;
    weight: 500;
}



.icon {
    font-size: 2em;
    margin: 50px;
}

.help {
    color: $text-grey;
    margin-top: 35px;
    font-size: 0.9em;

    ion-icon {
        position: relative;
        top: 1.5px;
    }
}
</style>
