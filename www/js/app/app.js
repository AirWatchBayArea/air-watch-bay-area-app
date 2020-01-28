var app = {

    default_page: "report-pollution",

    initialize: function(){
        this.bindEvents();
    },
    
    bindEvents: function(){
        document.addEventListener('DOMContentLoaded', () => this.DOMReady(), false);
    },
    
    onDeviceReady: function(){
        StatusBar.overlaysWebView(false);
        console.log(device.platform);
        if(window.device) {
          if (device.platform.toUpperCase() === 'IOS') {
              document.querySelector('.app-link.ios').style.display = 'block';
          } else if (device.platform.toUpperCase() === 'ANDROID') {
              document.querySelector('.app-link.android').style.display = 'block';
          }
      }
    },

    showPage: function(p){
        var next_page = $("#"+p);
        var prev_page = $(".current-page");

        if (next_page.length == 0) {
            return false;
        }
        prev_page.removeClass("current-page");
        next_page.addClass("current-page");
        // pages[p]();
    },

    DOMReady: function(){
        document.addEventListener('deviceready', () => this.onDeviceReady(), false);
        reportingInit();
        uploadingInit();
        $('body').on('click', '[name=geolocation]', function(event){
            navigator.geolocation.getCurrentPosition(geolocationSuccess,
                                                     geolocationError,
                                                     { maximumAge: 3000, timeout: 10000, enableHighAccuracy: true })
        });
        app.showPage(app.default_page);
    },

    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};