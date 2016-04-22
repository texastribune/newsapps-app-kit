
/* global $ */

const Clipboard = require ('clipboard');

new Clipboard('#copy');

$('#html').hide();

$('#text-btn').click(function() {
  $('#text').show();
  $('#html').hide();
  $('#text-btn').addClass('active');
  $('#html-btn').removeClass('active');
});

$('#html-btn').click(function() {
  $('#html').show();
  $('#text').hide();
  $('#html-btn').addClass('active');
  $('#text-btn').removeClass('active');
});