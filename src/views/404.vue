<template>
<a class="main-logo" @click="">
  <img src="@/assets/img/logo.png" style="height: 1.2em;" alt="">
</a>


<div class="main v-center">
  <div class="inner">

    <h1>Not Found.</h1>
    <h2>We couldn't find the page you were looking for</h2>

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

    .inner {
        max-width: 600px;
        margin: auto;
    }

}

h1{
  border-top-color: $lg-1;
  border-bottom-color: $lg-2;
  background-clip: text;
  color: transparent;
  font-size: 150px;
  user-select: none;
  margin-bottom: 30px;
}

h2{
  color: #ccc;
  font-weight: 400;
}


</style>
