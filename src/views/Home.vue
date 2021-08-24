<template>
<div class="top-banner">
  <div class="inner flex">
    <div class="v-center">
      <img class="emoji" src="@/assets/img/emoji/locked.png" />
    </div>
    <div class="v-center">
      &nbsp;&nbsp;&nbsp;New: Supporting 256-bit end-to-end encryption on all video, audio, chat and files.
    </div>
  </div>
</div>

<nav>
  <div class="nav-inner flex">
    <div class="v-center nav-item">
      <img src="@/assets/img/logo.png" alt="" class="logo">
    </div>

    <div class="nav-right"></div>

    <div class="v-center nav-item">
      <a class="nav-link" href="/account/login">Log in</a>
    </div>
    <div class="v-center nav-item">
      <a class="btn btn-action" href="/meetings">Start a meeting</a>
    </div>
  </div>
</nav>


<div class="top-spacer">

</div>
<div class="section">

  <h1 class="headline">Privacy-first video calls</h1>
  <p class="subheading">Spark protects your conversations with end-to-end encryption,<br />so your business stays your business.</p>

</div>

<div class="flagship-container">
  <img src="@/assets/img/homepage/flagship.png" alt="" class="flagship">
  <div class="flagship-right v-center">
    <div>
      <h1>Say hello to your new meeting room.</h1>
      <div class="items">
        <div class="item1 itemCard flex">
          <div class="v-center icon-container">
            <div class="spot-on"></div>
          </div>
          <div class="card-content">
            <p class="heading">Always-on</p>
            <p>Meetings on spark stay open until you delete them. Use yours as a drop-in room, or a virtual classroom.</p>
          </div>
        </div>
        <div class="item2 itemCard flex">
          <div class="v-center icon-container">
            <ion-icon name="lock-closed"></ion-icon>
          </div>
          <div class="card-content">
            <p class="heading">Secured with end-to-end encryption</p>
            <p>Using a combination of RSA, AES and DTLS, all your audio, video, chat and files are protected. Spark cannot read your data.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="spacer"></div>

<div class="section">
  <div class="feature flex left">
    <div class="feature-display alt-2 v-center">
      <img src="@/assets/img/homepage/invitelink.png" alt="" class="feature-img">
    </div>
    <div class="feature-content v-center">
      <div>
        <h1>Assemble your team in one click</h1>

        <div class="feature-info flex">
          <div class="icon-container v-center">
            <img class="emoji" src="@/assets/img/emoji/link.png" alt="">
          </div>
          <div class="content v-center">
            <div>
              <h1>Create a unique invite link</h1>
              <p>Anyone with the URL can join the meeting in a single click.</p>
            </div>
          </div>
        </div>

        <div class="feature-info flex">
          <div class="icon-container v-center">
            <img class="emoji" src="@/assets/img/emoji/envelope.png" alt="">
          </div>
          <div class="content v-center">
            <div>
              <h1>Invite members directly</h1>
              <p>Add members to the meeting with just a mobile phone number or email address.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="spacer" style="margin-top: 200px"></div>

<div class="section">
  <div class="feature flex">
    <div class="feature-content v-center">
      <div>
        <h1>Chat with all the bells and whistles</h1>
        <div class="flex">
          <div class="feature-sub">
            <img src="@/assets/img/homepage/emojigroup.png" alt="">
            <h2>Express yourself with Emojis</h2>
            <p>Supports shorthand such as :joy, and emoji picker.</p>
          </div>
          <div class="feature-sub">
            <h3><i>_italics_</i><br /><b>*bold*</b><br /><s>~strikethrough~</s></h3>
            <div style="position: absolute; bottom: 30px; margin-right: 30px;">
              <h2>Format with rich text modifiers</h2>
              <p>Surround text with _, *, or ~ characters to format.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="feature-display v-center">
      <img src="@/assets/img/homepage/messaging.gif" alt="" class="feature-img">
    </div>
  </div>
</div>

<div class="spacer" style="margin-top: 200px"></div>

<div class="section">
  <div class="feature flex left">
    <div class="feature-display alt-1 v-center">
      <img src="@/assets/img/homepage/uploaddialog.png" alt="" class="feature-img">
    </div>
    <div class="feature-content sharefile v-center">
      <div>
        <h1>Secure file sharing</h1>
        <p>Send images, documents and other file attachments to your teammates.</p>
        <div class="feature-info flex">
          <div class="icon-container v-center">
            <ion-icon name="lock-closed"></ion-icon>
          </div>
          <div class="content v-center">
            <h2>End-to-end encrypted with industry-standard 256-bit AES.</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div style="margin-top: 200px;"></div>

<div class="demoVideoBreakpoint"></div>

<div class="video-container">

  <div class="demoVideo">
    <video autoplay muted loop>
      <source src="@/assets/img/homepage/videocall.mp4" type="video/mp4">
    </video>
    <div class="nametag flex">
      <p class="name">Casper</p>
      <div class="icon v-center">
        <div class="spot"></div>
      </div>
    </div>

    <div class="volume-button v-center">
      <div class="volume-slider">
        <img src="@/assets/img/homepage/cursor.png" :style="'bottom: '+volSlider1+'px'" class="cursor">
        <div class="slider-inner" :style="'height: '+(volSlider1+5)+'px'"></div>
        <div class="toggle" :style="'bottom: '+volSlider1+'px'"></div>
      </div>
      <ion-icon name="volume-medium"></ion-icon>
    </div>
  </div>

  <div class="sideVideo v1">
    <video autoplay muted loop>
      <source src="@/assets/img/homepage/videocall2.mp4" type="video/mp4">
    </video>
    <div class="nametag flex">
      <p class="name">Nicole</p>
      <div class="icon v-center">
        <div class="spot"></div>
      </div>
    </div>

    <div class="volume-button v-center">
      <div class="volume-slider">
        <img src="@/assets/img/homepage/cursor.png" :style="'bottom: '+volSlider2+'px'" class="cursor">
        <div class="slider-inner" :style="'height: '+(volSlider2+5)+'px'"></div>
        <div class="toggle" :style="'bottom: '+volSlider2+'px'"></div>
      </div>
      <ion-icon name="volume-medium"></ion-icon>
    </div>
  </div>

  <div class="sideVideo v2">
    <video autoplay muted loop>
      <source src="@/assets/img/homepage/videocall3.mp4" type="video/mp4">
    </video>
    <div class="nametag flex">
      <p class="name">James</p>
      <div class="icon v-center">
        <div class="spot"></div>
      </div>
    </div>

    <div class="volume-button v-center">
      <div class="volume-slider">
        <img src="@/assets/img/homepage/cursor.png" :style="'bottom: '+volSlider3+'px'" class="cursor">
        <div class="slider-inner" :style="'height: '+(volSlider3+5)+'px'"></div>
        <div class="toggle" :style="'bottom: '+volSlider3+'px'"></div>
      </div>
      <ion-icon name="volume-medium"></ion-icon>
    </div>
  </div>

</div>


<div class="section volume-section">
  <h1>Adjust individual user volume</h1>
  <h2>No more shouting over one another, just turn up and down each person for optimal listening.</h2>
</div>


<div style="margin-top: 170px;"></div>



<footer>
  <div class="footer-top flex">
    <div class="left">
      <img src="@/assets/img/logo.png" />
      <p>Privacy-first video meetings</p>
      <a style="margin-top: 20px; display: block; width: 150px;" class="btn btn-action" href="/meetings">Start a meeting</a>
    </div>
    <div class="right">
      <div class="flex">
        <div>
          <h2>Resources</h2>
          <span class="item"><a href="/terms">Terms of Service</a><br /></span>
          <span class="item"><a href="/privacy">Privacy Policy</a><br /></span>
          <span class="item">Contact: <a href="mailto:info@withspark.co">info@withspark.co</a></span>

        </div>
        <div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>Copyright &copy; {{(new Date).getFullYear()}}, Spark Technologies (UK). All rights reserved.</p>
  </div>
</footer>

</template>

<script>
export default {
  name: 'Home',
  computed: {
    appName() {
      return this.$store.state.appName
    }
  },
  data() {

    return {
      volSlider1: 20,
      volSlider2: 65,
      volSlider3: 15,
    }

  },
  methods: {

  },

  mounted() {

    var targetVals = [40, 20, 65];
    var app = this;

    setInterval(() => {
      if (targetVals[0] > app.volSlider1) {
        app.volSlider1++;
      } else if (targetVals[0] < app.volSlider1) {
        app.volSlider1--;
      } else {
        targetVals[0] = Math.round(Math.random() * (90 - 10) + 10);
      }

      if (targetVals[1] > app.volSlider2) {
        app.volSlider2++;
      } else if (targetVals[1] < app.volSlider2) {
        app.volSlider2--;
      } else {
        targetVals[1] = Math.round(Math.random() * (90 - 10) + 10);
      }

      if (targetVals[2] > app.volSlider3) {
        app.volSlider3++;
      } else if (targetVals[2] < app.volSlider3) {
        app.volSlider3--;
      } else {
        targetVals[2] = Math.round(Math.random() * (90 - 10) + 10);
      }
    }, 50);

    let videoAnimation = new SparkAnimation({
      el: document.querySelector('.demoVideoBreakpoint'),
      distance: document.querySelector('.demoVideo').getBoundingClientRect()['height'] + 1000,
      enter: (a) => {
        if (a.direction == 'down') {
          let el = document.querySelector('.demoVideo');
          let b = el.getBoundingClientRect();
          el.style.width = b.width + "px";
          a.state.shrinkBy = b.width - 350;
          a.state.initialWidth = b.width;
          el.style.width = a.state.initialWidth + "px";
        }
      },
      leave: (a) => {
        let el = document.querySelector('.demoVideo');
        el.style.width = a.state.initialWidth + "px";
        document.body.style.overflow = 'scroll';
      },
      handler: (a) => {

        let distance = a.distance - 1000;

        let virtualScroll = a.virtualScroll;
        let virtualScrollMax = a.virtualScroll;
        if (a.virtualScroll > distance) {
          virtualScroll = distance;
        }
        if (a.virtualScroll > a.distance) {
          virtualScrollMax = a.distance;
        }

        let shrinkBy = ((a.state.shrinkBy / distance) * (virtualScroll));
        let el = document.querySelector('.demoVideo');
        el.style.width = (a.state.initialWidth - shrinkBy) + "px";
        el.style.borderRadius = ((20 / distance) * virtualScroll) + "px";

        if (a.virtualScroll <= distance || a.virtualScroll == a.distance) {
          document.body.style.overflow = 'scroll';
        } else {
          document.body.style.overflow = 'hidden';
        }

        if (a.virtualScroll > distance && a.virtualScroll < a.distance) {
          let translateX = (virtualScrollMax - distance) * ((350 + (window.innerWidth - (3 * 350)) / 4) / (a.distance - distance));
          document.querySelector('.sideVideo.v1').style.transform = "translateX(" + (translateX) + "px)";
          document.querySelector('.sideVideo.v2').style.transform = "translateX(" + (translateX - (2 * translateX)) + "px)";
        } else if (a.direction == "up") {
          document.querySelector('.sideVideo.v1').style.transform = null;
          document.querySelector('.sideVideo.v2').style.transform = null;
        }


      }
    });

    let flagShipAnimation = new SparkAnimation({
      el: document.querySelector('.flagship-container'),
      distance: 6000,
      enter: (a) => {

        document.body.style.overflow = 'hidden';
        let b = a.el.getBoundingClientRect();

        a.el.classList.add('scrolling');

        let binner = a.el.querySelector('.flagship').getBoundingClientRect();
        a.el.querySelector('.flagship').style.width = binner.width + "px";
        a.el.querySelector('.flagship').style.height = binner.height + "px";

        if (a.direction == "down") {

          a.state.growByX = window.innerWidth - b.width;
          a.state.growByY = window.innerHeight - b.height;
          a.state.initialW = b.width;
          a.state.initialH = b.height;

          a.el.style.width = b.width + "px";
          a.el.style.height = b.height + "px";
          a.el.style.maxWidth = "100vw";
        }

        window.scrollBy(0, (b.y + b.height) - window.innerHeight);
      },
      leave: (a) => {

        document.body.style.overflow = 'scroll';
      },
      handler: (a) => {

        let virtualScroll = a.virtualScroll;
        if (a.virtualScroll > 2000) {
          virtualScroll = 2000;
        }

        let b = a.el.getBoundingClientRect();
        let additionalW = (a.state.growByX / 2000) * virtualScroll;
        let additionalH = (a.state.growByY / 2000) * virtualScroll;
        a.el.style.width = a.state.initialW + additionalW + "px";
        a.el.style.height = a.state.initialH + additionalH + "px";

        a.el.style.borderRadius = ((2000 - virtualScroll) * (10 / 2000)) + "px";
        a.el.querySelector('.flagship').style.marginLeft = ((virtualScroll) * (45 / 2000)) + "px";

        window.scrollBy(0, (b.y + b.height) - window.innerHeight);

        if (a.virtualScroll > 2500) {
          a.el.querySelector('.flagship-right').style.opacity = 1;
        } else if (a.virtualScroll > 2000) {
          a.el.querySelector('.flagship-right').style.opacity = 0;
          a.el.querySelector('.flagship-right').style.display = 'flex';
        } else {
          a.el.querySelector('.flagship-right').style.display = 'none';
        }

        if (a.virtualScroll > 5000) {
          a.el.querySelector('.flagship-right .items').style.height = '200px';
        } else if (a.virtualScroll > 3500) {
          a.el.querySelector('.flagship-right .items').style.height = (((a.virtualScroll - 3500) / 1500) * 200) + "px";
        } else {
          a.el.querySelector('.flagship-right .items').style.height = '0px';
        }

        if (a.virtualScroll > 5000) {
          a.el.querySelector('.flagship-right .items .item1').style.display = 'flex';
          a.el.querySelector('.flagship-right .items .item2').style.display = 'flex';
        } else if (a.virtualScroll > 4250) {
          a.el.querySelector('.flagship-right .items .item1').style.display = 'flex';
          a.el.querySelector('.flagship-right .items .item2').style.display = 'none';
        } else {
          a.el.querySelector('.flagship-right .items .item1').style.display = 'none';
          a.el.querySelector('.flagship-right .items .item2').style.display = 'none';
        }


      }
    });

  }
}

class SparkAnimation {
  constructor({
    el,
    distance,
    enter,
    leave,
    handler
  }) {
    this.state = {};
    this.el = el;
    this.handler = handler;
    this.enter = enter;
    this.leave = leave;
    this.active = false;
    this.virtualScroll = 0;
    this.distance = distance;
    this.direction = "down";

    let animation = this;
    window.addEventListener('wheel', (event) => {

      let offsetY = (animation.el.getBoundingClientRect()['top'] - window.innerHeight) + animation.el.getBoundingClientRect()['height'] + event.wheelDeltaY;

      if (offsetY < 0 && animation.virtualScroll == 0 && !animation.active && event.wheelDeltaY < 1) {
        animation.active = true;
        animation.direction = "down";
        animation.enter(animation);
      } else if (offsetY > 0 && animation.virtualScroll == animation.distance && !animation.active && event.wheelDeltaY > 0) {
        animation.active = true;
        animation.direction = "up";
        animation.enter(animation);
      } else if (animation.active) {

        animation.virtualScroll -= event.wheelDeltaY;
        if (animation.virtualScroll < 0) {
          animation.active = false;
          animation.virtualScroll = 0;
          animation.direction = "up";
          animation.leave(animation);
        } else if (animation.virtualScroll >= animation.distance) {
          animation.active = false;
          animation.virtualScroll = animation.distance;
          animation.direction = "down";
          animation.leave(animation);
        }

        animation.handler(animation);

      }

    });

  }
}

window.scrollTo(0, 0);


var scrollPos = 0;
window.addEventListener("scroll", (event) => {

  let scrollChange = window.scrollY - scrollPos;
  scrollChange = scrollChange - (2 * scrollChange);

  document.querySelectorAll('.parallax').forEach((el) => {
    let changeBy = (el.getAttribute('data-parallax-speed') * scrollChange) / 100;
    let oldVal = +el.style.transform.replace("translateY(", "").replace("px)", "");
    el.style.transform = "translateY(" + (oldVal + changeBy) + "px)";
  });

  scrollPos = window.scrollY;
});
</script>

<style>
body {
  background-color: #000;
}
</style>

<style scoped lang="scss">
@use './../assets/scss/_home' as *;
</style>
