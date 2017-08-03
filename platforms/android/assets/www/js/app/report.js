// var serverURL = 'http://api.smellpittsburgh.org/api/v1/smell_reports?area=BA';
var serverURL = 'http://api.smellpittsburgh.org/api/v1/smell_reports?area=BA';

// generate a hash for the user
function generateUserHash() {
  var userHash;
  var bayAreaPrefix = "BA"
  var random = Math.floor(Math.random()*9007199254740991);
  var date = new Date();
  var epoch = ((date.getTime()-date.getMilliseconds())/1000);
  var input = random + " " + epoch;
  userHash = bayAreaPrefix + MD5(input);
  return userHash;
}

function geocodeAddress(geocoder, callback) {
  var address = document.getElementById('address').value;
  if($('[name=location]').prop('disabled')){
    var latlng = address.split(',').map(parseFloat);
    callback([{'geometry':{'location':new google.maps.LatLng(latlng[0],latlng[1])}}]);
  }else{
    geocoder.geocode({'address': address, 'bounds': 
      new google.maps.LatLngBounds(
        new google.maps.LatLng(37.851624286540286, -122.56790076098628), 
        new google.maps.LatLng(38.14975803797967,-121.97875891528315))
     }, function(results, status) {
      if (status === 'OK') {
        callback(results);
      } else if (status === 'ZERO_RESULTS'){
        reportFailed('address to coordinate conversion failed.\nPlease be more exact in your location description.');
      }else{
        reportFailed('of internal error. The error will be reported.');
        //REPORT ERROR HERE
      }
    });
  }
}

function serializeForm(geocodeResults){
  //userhash
  if(!localStorage.getItem('AWBAuser') || localStorage.getItem('AWBAuser').substring(0,2) != "BA") {
      localStorage.setItem('AWBAuser', generateUserHash());
  }
  //latlong
  var latlng = geocodeResults[0]['geometry']['location'];
  var data = 
  {
    "user_hash" : localStorage.getItem('AWBAuser'),
      "latitude" : latlng.lat(),
      "longitude" : latlng.lng(),
      "smell_value" : parseInt($('[name=smell]:checked').val()),
      "smell_description" : $('[name=describe-air]').val() ? $('[name=describe-air]').val() : null,
      "feelings_symptoms" : $('[name=symptoms]').val() ? $('[name=symptoms]').val() : null,
      "additional_comments" : $('[name=additional-comments]').val()
                  ? $('[name=additional-comments]').val() : null
  };
  console.log(latlng.lat(), latlng.lng());
  postData(data);
}

function postData(data, successCallback){
  $.ajax({
    method: 'POST',
    url: serverURL,
    data: data,
  }).done(function(msg) {
    console.log("POST Result:", msg);
    if (typeof msg === 'string' || msg instanceof String) {
      reportFailed("there was an error connecting to the server. Please try again later!")
    }else {
      try {
        submitImgs({
          'smell_report':JSON.stringify(msg),
          'alt':msg['smell_description'], 
          'caption':$('#photo-description').val(),
          'when':$('#photo-date').val(),
          'additional_comments':msg['additional_comments']
        }); 
    }catch(err){
        reportFailed("there was an error uploading the photo(s). Please refresh and try again!");
        console.log(err);
      }
    }
  });
}


function scrollToElmBottom($elm){
  $('html,body').animate({scrollTop: $elm.height() - $(window).height()});
}

function scrollToTop(){
  $('html,body').animate({scrollTop: 0});
}

function scrollToBottom(){
  $('html,body').animate({scrollTop: $(document).height()});
}

function submissionSuccess(){
  scrollToBottom();
  disableSubmit();
  $('#submit-success').show();
}

function disableSubmit(){
  $('#report-submit').prop('disabled', true);
  $('#file-upload').prop('disabled', true);
}

function roundLatLng(val){
  var dither = 0.002;
  return val+=(Math.random()-0.5)*dither;
}

function geolocationSuccess(position){
  $('.geocheck').remove();
  $('.geoerror').remove();
  $('[name=location]')
    .val([roundLatLng(position.coords.latitude),roundLatLng(position.coords.longitude)].join(", "))
    .before('<span class="geocheck">&#9989;</span>')
    .prop('disabled',true);
}

function geolocationError(error){
  $('.geocheck').remove();
  $('.geoerror').remove();
  // $('[name=geolocation]').prop('disabled', true);
  $('[name=geolocation]').after('<span class="geoerror" style="color:red"><br>Cannot retrieve location, please enter location in textbox directly underneath or check location permissions in Settings.<span>');
  alert('We were unable to retrieve your location data. Please enter your location in the textbox below the GPS button or check your location permissions in Settings.');
}

function reportFailed(reason){
  alert('Smell report failed because ' + reason);
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,-8);
});

function resetReport(){
  document.getElementById("report-form").reset();
    $('#report-submit').prop('disabled', false);
    $('#file-upload').prop('disabled', false);
    $('#submit-success').hide();
    $('.thumbnails').html('');
    $('.num-file-status').text('');
    $('.photo-upload').hide();
    $('#photo-date').val(new Date().toDateInputValue());
    $('.geoerror').remove();
    $('.geocheck').remove();
    $('[name=geolocation]').prop('disabled', false);
    $('[name=location]').prop('disabled', false);
}

$(function() {
  var geocoder = new google.maps.Geocoder();
  $('#report-form').submit(function(event){
     event.preventDefault();
     disableSubmit();
     geocodeAddress(geocoder, serializeForm);
  });

  $('#submit-another-report').click(function(){
    scrollToTop();
    resetReport();
  });

  $('#clear-form').click(function(){
    if(window.confirm("Reset the form?")){
      scrollToTop();
      resetReport();
    }
  });

  resetReport();
  //DEBUG:
  // submissionSuccess();
  // setTimeout(geolocationError, 3000);
});