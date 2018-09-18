var calData = function () {
  $('#boxOffsetWidth span').text($('#box')[0].offsetWidth);
  $('#boxOffsetHeight span').text($('#box')[0].offsetHeight);
  $('#boxOffsetLeft span').text($('#box')[0].offsetLeft);
  $('#boxOffsetTop span').text($('#box')[0].offsetTop);

  $('#boxClientWidth span').text($('#box')[0].clientWidth);
  $('#boxClientHeight span').text($('#box')[0].clientHeight);
  $('#boxClientLeft span').text($('#box')[0].clientLeft);
  $('#boxClientTop span').text($('#box')[0].clientTop);

  $('#boxScrollWidth span').text($('#box')[0].scrollWidth);
  $('#boxScrollHeight span').text($('#box')[0].scrollHeight);
  $('#boxScrollLeft span').text($('#box')[0].scrollLeft);
  $('#boxScrollTop span').text($('#box')[0].scrollTop);
}

$(document).ready(function () {
  calData();
});

$(window).on('resize', function () {
  calData();
});

$('#box').on('scroll', function () {
  calData();
});
