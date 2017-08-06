Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,-8);
});

function scrollToElmMiddle($elm){
  var elOffset = $elm.offset().top;
  var elHeight = $elm.height();
  var windowHeight = $(window).height();
  var offset;

  if (elHeight < windowHeight) {
    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  }
  else {
    offset = elOffset;
  }
  $('html,body').animate({scrollTop: offset});
  return false;
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
