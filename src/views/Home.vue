<template>

    <div class="nav-bg"></div>

    <div class="nav">
        <div class="nav-left">
            <div class="nav-item">
                <img src="@/assets/img/logo.png" alt="" class="logo">
            </div>
        </div>
        <div class="nav-right">
            <div class="nav-item">
                <div class="btn-start flex" onclick="window.location.replace('/meetings')">
                    <div class="v-center">
                        <img src="@/assets/img/emoji/wave.png" alt="" class="emoji">
                    </div>
                    <div class="v-center">
                        &nbsp;Start a meeting
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="main">

        <div class="container">

            <h1 class="headline above-nav">Privacy-first <br> video calls</h1>
            <h2 class="subheading above-nav">Spark is a simple, no fuss meetings app that runs in your browser.
                End-to-end
                encryption keeps your conversations private and secure.</h2>

        </div>

    </div>

    <div class="container">

        <img src="@/assets/img/homepage/flagship.png" alt="" class="flagship" id="flagship">

    </div>


    <div class="container container-slim">

        <h1 class="headline-2">Bring your team together</h1>

        <div class="flex center">
            <div class="feature-container">
                <div class="feature-box feature-box-1 v-center">
                    <img src="@/assets/img/homepage/invitelink.png" alt="">
                </div>
                <div class="feature-box-text">
                    <h2 class="feature-title">Assemble your team in one click</h2>
                    <p>Joining a meeting is as simple as clicking a link</p>
                </div>
            </div>
            <div class="feature-container">
                <div class="feature-box feature-box-2 v-center">
                    <img class="rounded" src="@/assets/img/homepage/messaging.gif" alt="">
                </div>
                <div class="feature-box-text">
                    <h2 class="feature-title">Chat with all the bells and whistles</h2>
                    <p>Fully featured chat with emojis</p>
                </div>
            </div>
        </div>

        <div class="flex center">
            <div class="feature-container">
                <div class="feature-box feature-box-1 v-center">
                    <img src="@/assets/img/homepage/uploaddialog.png" alt="">
                </div>
                <div class="feature-box-text">
                    <h2 class="feature-title">Share files securely</h2>
                    <p>Share images, videos or other attachments right from inside the meeting</p>
                </div>
            </div>
            <div class="feature-container">
                <div class="feature-box feature-box-2 v-center">
                    <img class="rounded" src="@/assets/img/homepage/encrypted-message.png" alt="">
                </div>
                <div class="feature-box-text">
                    <h2 class="feature-title">Everything encrypted</h2>
                    <p>Chat messages and files protected with 256-bit AES end-to-end encryption. Audio and video protected by end-to-end DTLS encryption.</p>
                </div>
            </div>
        </div>

    </div>


    <div class="footer">
       <p> &copy; Spark Technologies (UK) &nbsp;&nbsp; <a href="/terms">Terms</a> &nbsp;&nbsp; <a href="/privacy">Privacy</a></p>
    </div>

</template>
    
<script>

import EpicScroll from '../mixins/EpicScroll';

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


        let myEpicScroll = new EpicScroll();
        window.myEpicScroll = myEpicScroll;

        window.addEventListener('load', function () {

            /* Flagship animation */
            let flagship = document.getElementById('flagship');
            let flagshipOriginalWidth = flagship.clientWidth;

            myEpicScroll.addAnimation({
                startY: flagship.getBoundingClientRect().top - 125,
                distance: flagship.clientHeight / 2,
                blockScroll: true,
                scrollSpeed: 0.5,
                callback: (progress) => {
                    flagship.style.width = flagshipOriginalWidth - (flagshipOriginalWidth / 2) * progress.progressPercentage / 100 + 'px';
                }
            });

        });

    }
}


var gradientAngle = 0;
setInterval(() => {

    if (document.querySelector('h1.headline') !== null) {
        let el = document.querySelector('h1');
        let c1 = window.getComputedStyle(el)['borderTopColor'];
        let c2 = window.getComputedStyle(el)['borderBottomColor'];
        el.style.backgroundImage = 'linear-gradient(' + gradientAngle + 'deg,' + c1 + ',' + c2 + ')';
        gradientAngle += 1.5;

        if (gradientAngle == 360) {
            gradientAngle = 0;
        }
    }

}, 50);


</script>
  
    
<style scoped lang="scss">
@use './../assets/scss/_home2' as *;
@use './../assets/scss/_theme' as *;
@use './../assets/scss/_elements' as *;


h1.headline {
    border-top-color: $lg-1;
    border-bottom-color: $lg-2;
    background-clip: text;
    color: transparent;
    font-size: 100px;
    user-select: none;
    margin-bottom: 30px;
}
</style>
    