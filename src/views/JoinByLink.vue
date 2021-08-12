<template>
<div class="v-center">
  <img class="icon loader" src="./../assets/img/loading.png" />
</div>
</template>

<script>
export default {
  name: 'JoinByLink',
  computed: {
    appName() {
      return this.$store.state.appName
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  mounted() {

    this.api_request("POST", "/meetings/join", {
      "join_link": this.$route.params.join_link
    }).then((resp) => {

      resp = JSON.parse(resp);

      if(resp.status == 'success'){
        this.$router.replace('/meeting/' + resp.meeting_id);
      }
      else{
        if(resp.error == 'Not logged in'){
          this.$router.replace('/account/login');
        }
        else{
          this.$router.replace('/404');
        }
      }
    })

  }
}
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

.icon.loader {
    margin: auto;
    display: block;
    height: 30px;
    width: 30px;
}
</style>
