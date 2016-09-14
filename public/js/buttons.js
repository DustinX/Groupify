$( document ).ready(function() {
  $('a').mouseenter(function() {
    $(this).animate({
      color: '#0099ff'
    }, 1000);
  }.mouseout(function(){
    $(this).animate({
      color: 'none'
    }, 1000);
  });
  }
});
