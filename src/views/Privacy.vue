<template>
<a class="main-logo" @click="">
  <img src="@/assets/img/logo.png" style="height: 1.2em;" alt="">
</a>


<div class="main">
  <div class="inner">

    <h1>Privacy</h1>
    <h2>Spark technologies (UK) Ultd. Privacy Policy</h2>
    <br />

    <p>In keeping with our motto of 'privacy-first', we collect only the minimum amount of personal information required to offer a high-quality service, and use this information solely for this purpose.
    </p>

    <h4>Information we collect</h4>

    <ul>
      <li>
        E-Mail address and/or phone number
        <ul class="tab">
          <li>
            Used in order to identify user accounts and to facilitate login.
          </li>
          <li>
            Used to enable users to invite each other to meetings using another's email/phone number
          </li>
          <li>
            Used to notify users when events occur, such as being invited to a meeting.
          </li>
          <li>
            To notify users of critical changes to the service that are likely to affect them.
          </li>
          <li>
            Is NOT used for marketing purposes
          </li>
        </ul>
      </li>
      <li>
        IP address
        <ul class="tab">
          <li>Used for security purposes to identify suspicious login attempts</li>
        </ul>
      </li>
      <li>
        First and last name
        <ul class="tab">
          <li>
            Used to display a recognisable name to other members of a meeting
          </li>
        </ul>
      </li>
    </ul>

    <h4>Information we do NOT collect</h4>
    <ul>
      <li>
        Audio/video in live meetings
        <ul class="tab">
          <li>This data is sent peer-to-peer directly to your teammates. It does not touch Spark's servers.</li>
        </ul>
      </li>
      <li>Chat messages and shared files</li>
      <ul class="tab">
        <li>
          Chat messages and files are end-to-end encrypted, meaning they can only be decoded and read by you, and the intended recipient(s). Spark has no ability to decode this data.
          The file names and approximate file sizes are stored unencrypted.
        </li>
      </ul>
    </ul>

    <h4>GDPR rights</h4>
    <p>GDPR requests, including subject access, data ammendment and data erasure can be made by email to privacy@withspark.co, and will be processed as soon as reasonably practicable.
    <br /><br />The right to access, ammend or delete personal data is also extended to users outside the jurisdiction of the GDPR, and such requests can be made to the email address above.
    </p>

    <br />
    <h4>Data sharing</h4>
    <p>
      Data collected by Spark is not shared with any third-party under any circumstance, unless required under applicable law.
      <br /><br />
      Personal information and encrypted chat and file data may be provided to law enforcement entities if required by law. Note that Spark does not have the ability to decrypt chat messages or shared files, and so any of this data provided will be unreadbale.
    </p>

    <br />
    <h4>Security and Privacy claims</h4>
    <p>
      Spark claims to provide privacy-first video meetings, facilitated by the use of end-to-end encryption.
      <br />Spark makes these claims in good faith, and will make every effort to implement effective software in order to uphold these claims.
      <br />Spark accepts no liability for technological issues that may affect the security and reliability of the service.
    </p>

  </div>
</div>
</template>

<script>
export default {
  name: '404',
  computed: {
    appName() {
      return this.$store.state.appName
    }
  },
  data() {

  },
  methods: {

  }
}

var gradientAngle = 0;
setInterval(() => {

  if (document.querySelector('h1') !== null) {
    let el = document.querySelector('h1');
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
    background-color: #000;
    height: 100vh;
    width: 100vw;
    user-select: none;
}
</style>

<style scoped lang="scss">
@use './../assets/scss/_theme' as *;
@use './../assets/scss/_elements' as *;

.main {

    margin-top: 150px;

    .inner {
        max-width: 800px;
        padding: 50px;
        margin: 0 auto;
    }

}

h1 {
    border-top-color: $lg-1;
    border-bottom-color: $lg-2;
    background-clip: text;
    color: transparent;
    font-size: 150px;
    user-select: none;
    margin-bottom: 30px;
}

h2 {
    color: #ccc;
    font-weight: 400;
}

h4 {
    color: #fff;
    margin: 25px 0 5px;
    font-weight: 300;
    font-size: 18px;
}

li,
p {
    color: #999;
}

ul {
    margin-left: 15px;

    &.tab {
        margin-left: 30px;
    }
}
</style>
