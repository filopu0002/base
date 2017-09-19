$(window).scroll(function() {
  var scroll = $(window).scrollTop();
  // if( screen.width <= 1025) {
    $("#coverPost img").css({
      transform: 'translate3d(-50%, -'+(scroll/100)+'%, 0) scale('+(100 + scroll/25)/100+')',
    });
  // }
  // else{
  //   $("#coverPost img").css({
  //     transform: 'translate3d(0%, -'+(scroll/100)+'%, 0) scale('+(100 + scroll/25)/100+')',
  //   });
  // }

});


  $(function () {
    $(document).scroll(function () {
  	  var $nav = $(".navbar-fixed-top");
  	  $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  	});
  });

if( screen.width <= 1025) {
$(".map").remove();

  var didScroll;
  var lastScrollTop = 0;
  var delta = 10;
  var navbarHeight = $('header').outerHeight();

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
      var st = $(this).scrollTop();

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          $('header').removeClass('nav-down').addClass('nav-up');
      } else {
          // Scroll Up
          if(st + $(window).height() < $(document).height()) {
              $('header').removeClass('nav-up').addClass('nav-down');
          }
      }

      lastScrollTop = st;
  }

}
