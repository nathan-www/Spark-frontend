var Mixins = {

  data: function() {
    return {

      conveyorTracker: {
        counters: {},
        setters: {}
      },

      document: document,
      console: console,
    }
  },

  mounted() {

    setInterval(() => {
      let tooltipEls = document.querySelectorAll('[data-tooltip]');
      Object.values(tooltipEls).forEach((el) => {
        el.onmouseover = function(e) {
          document.getElementById('tooltip').style.top = (e.target.getBoundingClientRect()['bottom'] + 10) + 'px';
          document.getElementById('tooltip').style.left = (e.target.getBoundingClientRect()['left'] + (e.target.getBoundingClientRect()['width'] / 2)) + 'px';
          document.getElementById('tooltip-content').innerText = e.target.getAttribute('data-tooltip');
          document.getElementById('tooltip').style.display = 'block';
        };
        el.onmouseout = function(e){
          document.getElementById('tooltip').style.display = 'none';
        };
      });
    }, 300);



  },
  methods: {

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
        return "Yesterday, " + thenTime.getHours() + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else if (Math.abs(currentTimestamp - thenTimestamp) <= 432000) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][thenTime.getDay()] + ", " + thenTime.getHours() + ":" + ("0" + thenTime.getMinutes()).slice(-2);
      } else {
        return "";
      }

    },

    api_request: function(method, endpoint, data = []) {
      let api_base = "http://localhost:8081";
      let csrf_token = Math.round(Math.random() * 1000000000000);
      document.cookie = "spark_CSRFToken=" + csrf_token;

      if (method == "GET") {
        return fetch(api_base + endpoint, {
          method: "GET",
          headers: {
            'X-CSRF-TOKEN': csrf_token
          },
          credentials: 'include'
        }).then((t) => t.text());
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
        }).then((t) => t.text());
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