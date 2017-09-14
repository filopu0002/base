$(window).scroll(function() {
  var scroll = $(window).scrollTop();
	$("#coverPost img").css({
		transform: 'translate3d(-50%, -'+(scroll/100)+'%, 0) scale('+(100 + scroll/25)/100+')',
	});
});
