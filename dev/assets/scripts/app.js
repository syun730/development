// fizzbuzz();
//
// function fizzbuzz() {
//   for(i = 1; i <= 100; i++) {
//     if(i%15 == 0) {// 3と5の倍数
//       console.log(i + '番目 fizzbuzz')
//     } else if(i%3 == 0) {// 3の倍数
//       console.log(i + '番目 fizz')
//     } else if(i%5 == 0) {// 5の倍数
//       console.log(i + '番目 buzz')
//     } else {// それ以外
//       console.log(i + '番目')
//     }
//   }
// }


// Device
var os = 'pc';
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('android') != -1) {
  os = 'sm';
}

// Navigation
var Navigation = (function($) {
  function init() {
    var $wrapper = $('#l-wrapper');
    var $header = $('#l-header');
    var $nav = $header.find('.c-nav');
    var $nav_child = $header.find('.c-nav--child');
    var nav_state = ($wrapper.hasClass('is-nav-child-opened'))? 'opened' : 'closed';

    if(os == 'pc') {
      $nav.find('a').on('click', function(event){
        event.preventDefault();
      });
      $nav.hover(
        function() {
          if (nav_state == 'closed') {
            $wrapper.addClass('is-nav-child-open');
          }
        },
        function() {
          $wrapper.removeClass('is-nav-child-open');
        }
      );
    }
  }
  return { 'init': init }
})(jQuery);


// Document Ready
(function($) {
  $(document).ready(function(){
    console.log(os);
    Navigation.init();
  });
})(jQuery);
