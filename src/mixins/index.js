import emojiStuff from './emojiStuff';

var Mixins = {

  data: function() {
    return {

      conveyorTracker: {
        counters: {},
        setters: {}
      },

      img_mimes: ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'],

      document: document,
      console: console,
      window: window
    }
  },

  mounted() {

    window.api_queue = [];

    setInterval(() => {
      let tooltipEls = document.querySelectorAll('[data-tooltip]');
      Object.values(tooltipEls).forEach((el) => {
        el.onmouseover = function(e) {
          document.getElementById('tooltip').style.top = (e.target.getBoundingClientRect()['bottom'] + 10) + 'px';
          document.getElementById('tooltip').style.left = (e.target.getBoundingClientRect()['left'] + (e.target.getBoundingClientRect()['width'] / 2)) + 'px';
          document.getElementById('tooltip-content').innerText = e.target.getAttribute('data-tooltip');
          document.getElementById('tooltip').style.display = 'block';
        };
        el.onmouseout = function(e) {
          document.getElementById('tooltip').style.display = 'none';
        };
      });
    }, 300);



  },
  methods: {

    isJustEmojis(str) {
      let regex = new RegExp("^" + emojiStuff.emojiPattern + "{1,6}$");
      return regex.test(str);
    },

    changeSliderYPos(el, event, amount = null) {

      if (amount == null) {
        amount = el.getBoundingClientRect()['bottom'] - event.clientY;
      }

      if (amount > 106) {
        amount = 106;
      }
      if (amount < 6) {
        amount = 6;
      }

      amount -= 6;

      if (amount < 1) {
        el.parentElement.querySelector('.volume-icon').name = 'volume-off';
      } else if (amount < 40) {
        el.parentElement.querySelector('.volume-icon').name = 'volume-low';
      } else if (amount < 80) {
        el.parentElement.querySelector('.volume-icon').name = 'volume-medium';
      } else {
        el.parentElement.querySelector('.volume-icon').name = 'volume-high';
      }

      let vidEl = el.parentElement.parentElement.parentElement.querySelector('video');
      el.parentElement.parentElement.parentElement.querySelector('video').volume = Math.floor(amount) / 100;

      el.querySelector('.volume-slider-handle').style.bottom = amount + "px";
      el.querySelector('.volume-slider-active').style.height = amount + "px";

    },

    formatFileSize: function(bytes) {

      if (bytes < 1000) {
        return bytes + "B";
      } else if (bytes < 1000000) {
        return Math.round(bytes / 100) / 10 + "KB";
      } else {
        return Math.round(bytes / 100000) / 10 + "MB";
      }

    },

    isMouseOverEl: function(event, elId) {

      if (document.getElementById(elId) == null) {
        return false;
      }
      let el = document.getElementById(elId);
      return ((event.clientY < el.getBoundingClientRect()['bottom']) && (event.clientY > el.getBoundingClientRect()['top']) && (event.clientX > el.getBoundingClientRect()['left']) && (event.clientX < el.getBoundingClientRect()['right']));

    },

    getEmojis: function() {
      return emojiStuff.emojis;
    },

    toggleDropdown: function(el) {

      if (el.style.display == 'block') {
        el.style.display = 'none';
      } else {
        el.style.display = 'block';
        document.body.onmousedown = (e) => {
          let rect = el.getBoundingClientRect();

          if ((e.clientX <= rect.right && e.clientX >= rect.left) && (e.clientY >= rect.top && e.clientY <= rect.bottom)) {
            //Click inside target element, ignore
          } else {
            //Click outside target, hide target
            el.style.display = 'none';
          }
        }
      }
    },

    conveyor: function(id, uniq, items) {

      if (!this.conveyorTracker.setters.hasOwnProperty(uniq)) {

        if (!this.conveyorTracker.counters.hasOwnProperty(id)) {
          this.conveyorTracker.counters[id] = 0;
        }
        if (this.conveyorTracker.counters[id] > (items.length - 1)) {
          this.conveyorTracker.counters[id] = 0;
        }

        this.conveyorTracker.setters[uniq] = items[this.conveyorTracker.counters[id]];
        this.conveyorTracker.counters[id]++;

      }

      return this.conveyorTracker.setters[uniq];

    },

    confirmDialog: function(icon, title, cancelText, confirmText, onConfirm) {

      let dialog = document.getElementById('popup-confirm');
      let backdrop = document.getElementById('popup-backdrop');
      dialog.querySelector('ion-icon').setAttribute("name", icon);
      dialog.getElementsByClassName('title')[0].innerText = title;
      dialog.getElementsByClassName('cancel-button')[0].innerText = cancelText;
      dialog.getElementsByClassName('continue-button')[0].innerText = confirmText;
      dialog.getElementsByClassName('continue-button')[0].onclick = () => {
        onConfirm();
        dialog.style.display = 'none';
        backdrop.style.display = 'none';
      };
      dialog.getElementsByClassName('cancel-button')[0].onclick = () => {
        dialog.style.display = 'none';
        backdrop.style.display = 'none';
      };
      dialog.style.display = 'block';
      backdrop.style.display = 'block';

    },

    niceTimeAlt: function(thenTimestamp) {

      thenTimestamp = Math.round(thenTimestamp / 1000);
      let currentTimestamp = Math.round((new Date()).getTime() / 1000);
      let currentTime = new Date();
      let thenTime = new Date(thenTimestamp * 1000);

      if (Math.abs(thenTimestamp - currentTimestamp) < 86400 && thenTime.getDay() == currentTime.getDay()) {
        return ("0" + thenTime.getHours()).slice(-2) + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else if (Math.abs(thenTimestamp - currentTimestamp) < 6050800) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][thenTime.getDay()] + " " + ("0" + thenTime.getHours()).slice(-2) + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else if (currentTime.getFullYear() == thenTime.getFullYear()) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][thenTime.getMonth()] + " " + thenTime.getDate() + " " + ("0" + thenTime.getHours()).slice(-2) + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][thenTime.getMonth()] + " " + thenTime.getDate() + " " + thenTime.getFullYear() + " " + ("0" + thenTime.getHours()).slice(-2) + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      }

    },

    niceTime: function(thenTimestamp) {
      let currentTimestamp = Math.round((new Date()).getTime() / 1000);
      let currentTime = new Date();
      let thenTime = new Date(thenTimestamp * 1000);

      if (Math.abs(currentTimestamp - thenTimestamp) < 60) {
        return "just now";
      } else if (Math.floor(Math.abs(currentTimestamp - thenTimestamp) / 60) == 1) {
        return "1 min ago";
      } else if (Math.floor(Math.abs(currentTimestamp - thenTimestamp) / 3600) < 1) {
        return Math.floor(Math.abs(currentTimestamp - thenTimestamp) / 60) + " mins ago";
      } else if (Math.floor(Math.abs(currentTimestamp - thenTimestamp) / 3600) == 1) {
        return "1 hour ago";
      } else if (Math.floor(Math.abs(currentTimestamp - thenTimestamp) / 3600) < 24) {
        return Math.floor(Math.abs(currentTimestamp - thenTimestamp) / 3600) + " hours ago";
      } else if (currentTime.getFullYear() !== thenTime.getFullYear()) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][thenTime.getMonth()] + " " + thenTime.getDate() + ", " + thenTime.getFullYear();
      } else if (currentTime.getMonth() !== thenTime.getMonth()) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][thenTime.getMonth()] + " " + thenTime.getDate();
      } else if (Math.abs(currentTimestamp - thenTimestamp) > 432000) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][thenTime.getMonth()] + " " + thenTime.getDate();
      } else if (Math.abs(+currentTime.getDay() - +thenTime.getDay()) == 1) {
        return "Yesterday, " + ("0" + thenTime.getHours()).slice(-2) + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else if (Math.abs(currentTimestamp - thenTimestamp) <= 432000) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][thenTime.getDay()] + ", " + ("0" + thenTime.getHours()).slice(-2) + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else {
        return "";
      }

    },

    getCookie(name) {
      var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
      return match ? match[1] : null;
    },

    api_request: function(method, endpoint, data = []) {
      let api_base = "https://withspark.co/api";
      let csrf_token = "";

      if(getCookie("spark_CSRFToken") == null){
        csrf_token = Math.round(Math.random() * 1000000000000);
        document.cookie = "spark_CSRFToken=" + csrf_token + "; path=/";
      }
      else{
        csrf_token = getCookie("spark_CSRFToken");
      }


      //Allow three requests in queue
      if (api_queue.reduce((a, q) => {
          if (q == endpoint) {
            return a + 1;
          } else {
            return a;
          }
        }, 0) < 4) {

        api_queue.push(endpoint);

        if (method == "GET") {
          return fetch(api_base + endpoint, {
            method: "GET",
            headers: {
              'X-CSRF-TOKEN': csrf_token
            },
            credentials: 'include'
          }).then((t) => {
            api_queue = api_queue.filter((q) => q !== endpoint);
            return t.text();
          }).catch((e) => {
            api_queue = api_queue.filter((q) => q !== endpoint);
          });
        }

        if (method == "POST") {
          return fetch(api_base + endpoint, {
            method: "POST",
            headers: {
              'X-CSRF-TOKEN': csrf_token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
          }).then((t) => {
            api_queue.splice(api_queue.indexOf(endpoint), 1)
            return t.text();
          }).catch((e) => {
            api_queue.splice(api_queue.indexOf(endpoint), 1)
          });

        }


      } else {

        return new Promise(function(resolve, reject) {
          reject("API queue full");
        });

      }
    },

    wait: function(ms) {
      return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), ms);
      });
    }

  },

  initials: function(fullName) {
    return fullName.split(" ");
  }
}

export default Mixins
