window.onload = function() {
//tabs 
 
//progress circle 

(function($) {
  $('#circle-container').circleProgress({
    value: 0.34,
    size: 180,
    startAngle: 1.6,
    thickness:8,
    animation:100,
    emptyFill:"#eee",
    fill: "#353AC7"
  }).on('circle-animation-progress', function(event, progress, stepValue) {
    $(this).find('strong').text(stepValue.toFixed(2).substr(2));
  });
  })(jQuery);
  $(".account-tile").on({
    mouseenter: function () {
        $('#circle-container').circleProgress('value', 0.09);
    },
    mouseleave: function () {
        $('#circle-container').circleProgress('value', 0.00);
    }
  });
  $( ".primary-btn.spending-btn" ).click(function() {
      $('#circle-container').circleProgress('value', 0.50);
  });

 };


