window.onload = function() {
  var userFeed = new Instafeed({
  get: 'user',
  userId: '37460794',
  accessToken: '37460794.c9aadc8.a2b34f53c98c4d19a10ecd5f8182e25a'
  });
  userFeed.run();
}
