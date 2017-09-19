
  var userFeed = new Instafeed({
  get: 'user',
  userId: '37460794',
  accessToken: '37460794.c9aadc8.a2b34f53c98c4d19a10ecd5f8182e25a',
  limit: '6',
  template: '<div class="col-sm-6 col-md-4"> <a href="{{link}}"><img src="{{image}}" /></a> </div>',
  resolution: 'standard_resolution'
  });
  userFeed.run();
  var parallaxElements = $('.parallax'),
      parallaxQuantity = parallaxElements.length;

  $(window).on('scroll', function () {

    window.requestAnimationFrame(function () {

      for (var i = 0; i < parallaxQuantity; i++) {
        var currentElement =  parallaxElements.eq(i);
        var scrolled = $(window).scrollTop();

          currentElement.css({
            'transform': 'translate3d(0,' + scrolled * -0.15 + 'px, 0)'
          });

      }
    });

  });
