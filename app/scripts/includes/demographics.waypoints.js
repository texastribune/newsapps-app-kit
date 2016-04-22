/* global $ */

var text1 = $('#explainer1');
var text2 = $('#explainer2');
var text3 = $('#explainer3');
var text4 = $('#explainer4');
var text5 = $('#explainer5');

var pos1 = $('#explainerPos1');
var pos2 = $('#explainerPos2');
var pos3 = $('#explainerPos3');
var pos4 = $('#explainerPos4');
var pos5 = $('#explainerPos5');

pos1.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint1').offset().top }, 500);
});

pos2.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint2').offset().top - 500 }, 500);
});

pos3.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint3').offset().top - 500 }, 500);
});

pos4.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint4').offset().top - 500 }, 500);
});

// pos5.click(function() {
//   $('body, html').animate({ scrollTop: $('#waypoint5').offset().top - 600 }, 500);
// });

$('.chart__scroll--prompt').click(function() {
  var y = $(window).scrollTop();
  $(window).scrollTop(y+500);
})

var sticky = new Waypoint.Sticky({
  element: $('.sticky-charts')[0]
});

var inview6 = new Waypoint.Inview({
  element: $('#waypoint6')[0],
  enter: function(direction) {
    if (direction === 'down') {
      $('.sticky-charts').removeClass('stuck');
      $('.chart__position--content').css('position', 'absolute');
      $('.chart__position--content').css('bottom', 0);
      $('.chart__position--content').css('width', '100%');
      $('.chart__scroll--prompt').hide();
    }  
  },
  exit: function(direction) {
    if (direction === 'up') {
      $('.sticky-charts').addClass('stuck');
      $('.chart__position--content').css('position', 'relative');
      $('.chart__position--content').css('bottom', '');
      $('.chart__scroll--prompt').show();
    }
  }
});

var inview1 = new Waypoint.Inview({
  element: $('#waypoint1')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text1.show();
      pos1.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.chart__legend--tx').show();
      $('.chart__header').show();
    } 
  },
  exit: function(direction) {
    if (direction === 'up') {
      text1.hide();
      pos1.removeClass('fa-circle').addClass('fa-circle-thin');
      $('.chart__legend--tx').hide();
      $('.chart__header').hide();
    }
  }
});

var inview2 = new Waypoint.Inview({
  element: $('#waypoint2')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text1.hide();
      text2.show();
      
      pos1.removeClass('fa-circle').addClass('fa-circle-thin');
      pos2.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.chart__legend--ut').animate({opacity: 1});
    }
  },
  exit: function(direction) {
    if (direction === 'up') {
      text1.show();
      text2.hide();
      pos2.removeClass('fa-circle').addClass('fa-circle-thin');
      pos1.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.chart__legend--ut').animate({opacity: 0});
    }
  }
});

var inview3 = new Waypoint.Inview({
  element: $('#waypoint3')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text2.hide();
      text3.show();
      pos2.removeClass('fa-circle').addClass('fa-circle-thin');
      pos3.removeClass('fa-circle-thin').addClass('fa-circle');
    }
  },
  exit: function(direction) {
    if (direction === 'up') {
      text2.show();
      text3.hide();
      pos3.removeClass('fa-circle').addClass('fa-circle-thin');
      pos2.removeClass('fa-circle-thin').addClass('fa-circle');
    }
  }
});

var inview4 = new Waypoint.Inview({
  element: $('#waypoint4')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text3.hide();
      text4.show();
      pos3.removeClass('fa-circle').addClass('fa-circle-thin');
      pos4.removeClass('fa-circle-thin').addClass('fa-circle');
      $('#white svg').hide();
      $('#black svg').hide();
      $('#hispanic svg').hide();
      $('.chart__lastSlide').height($('#white svg').height()).show();
      $('.chart__lastSlide').animate({ opacity: 1 });
      $('.chart__legend').hide();
    }
  },
  exit: function(direction) {
    if (direction === 'up') {
      text3.show();
      text4.hide();
      pos4.removeClass('fa-circle').addClass('fa-circle-thin');
      pos3.removeClass('fa-circle-thin').addClass('fa-circle');
      $('#white svg').show();
      $('#black svg').show();
      $('#hispanic svg').show();
      $('.chart__lastSlide').hide();
      $('.chart__lastSlide').css('opacity', '0');
      $('.chart__legend').show();
    }
  }
});

// var inview5 = new Waypoint.Inview({
//   element: $('#waypoint5')[0],
//   enter: function(direction) {
//     if (direction === 'down') {
//       text4.hide();
//       text5.show();
//       pos4.removeClass('fa-circle').addClass('fa-circle-thin');
//       pos5.removeClass('fa-circle-thin').addClass('fa-circle');
//     }
//   },
//   exit: function(direction) {
//     if (direction === 'up') {
//       text4.show();
//       text5.hide();
//       pos5.removeClass('fa-circle').addClass('fa-circle-thin');
//       pos4.removeClass('fa-circle-thin').addClass('fa-circle');
//     }
//   }
// });