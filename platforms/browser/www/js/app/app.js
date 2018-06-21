var app = {

    default_page: "report-pollution",

    initialize: function(){
        this.bindEvents();
    },
    
    bindEvents: function(){
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.DOMReady, false);
    },
    
    onDeviceReady: function(){
        StatusBar.overlaysWebView(false);
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
        reportingInit();
        uploadingInit();
        $('body').on('click', '[name=geolocation]', function(event){
            navigator.geolocation.getCurrentPosition(geolocationSuccess,
                                                     geolocationError,
                                                     { maximumAge: 3000, timeout: 10000, enableHighAccuracy: true })
        });
        app.showPage(app.default_page);
    }
};