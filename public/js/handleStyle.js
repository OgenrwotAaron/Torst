$(document).ready(() => {
  var scroll_pos = 0;
  $(document).scroll(function () {
    scroll_pos = $(this).scrollTop();
    $("#navbar").toggleClass(
      "scrolled",
      $(this).scrollTop() > $("#navbar").height()
    );
  });
});
