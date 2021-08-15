<template>
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
        <div class="item2 itemCard flex"></div>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <div class="feature">
    <h2>This is a feature</h2>
  </div>
</div>
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

  },
  methods: {

  },

  mounted() {

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

        if(a.virtualScroll > 2500){
          a.el.querySelector('.flagship-right').style.opacity = 1;
        }
        else if(a.virtualScroll > 2000){
          a.el.querySelector('.flagship-right').style.opacity = 0;
          a.el.querySelector('.flagship-right').style.display = 'flex';
        }
        else{
          a.el.querySelector('.flagship-right').style.display = 'none';
        }

        if(a.virtualScroll > 5000){
          a.el.querySelector('.flagship-right .items').style.height = '200px';
        }
        else if(a.virtualScroll > 3500){
          a.el.querySelector('.flagship-right .items').style.height = (((a.virtualScroll-3500)/1500) * 200) + "px";
        }
        else{
          a.el.querySelector('.flagship-right .items').style.height = '0px';
        }

        if(a.virtualScroll > 5000){
          a.el.querySelector('.flagship-right .items .item1').style.display = 'flex';
          a.el.querySelector('.flagship-right .items .item2').style.display = 'flex';
        }
        else if(a.virtualScroll > 4250){
          a.el.querySelector('.flagship-right .items .item1').style.display = 'flex';
          a.el.querySelector('.flagship-right .items .item2').style.display = 'none';
        }
        else{
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
