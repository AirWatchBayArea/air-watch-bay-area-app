var app = {

    default_page: "main",

    initialize: function(){
        this.bindEvents();
    },
    
    bindEvents: function(){
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function(){
        StatusBar.overlaysWebView(false);
        $(function(){
            $('[name=geolocation]').click(function(event){
                navigator.geolocation.getCurrentPosition(geolocationSuccess,
                                                         geolocationError,
                                                         { maximumAge: 3000, timeout: 10000, enableHighAccuracy: true })
            });
        });
    },

    showPage: function(p){
        var next_page = $("#"+p);
        var prev_page = $(".current-page");

        if (next_page.length == 0) {
            return false;
        }
        prev_page.removeClass("current-page");
        next_page.addClass("current-page");
        pages[p]();
    }
};