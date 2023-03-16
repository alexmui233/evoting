$(".animated-progress span").each(function () {
  $(this).animate(
    {
      width: $(this).attr("data-progress") + "%",
    },
    1000
  );
  $(this).text($(this).attr("data-progress") + "%");
});
/* function increase() {
  // Change the variable to modify the speed of the number increasing from 0 to (ms)
  let SPEED = 40;
  // Retrieve the percentage value
  let limit = 25;

  for(let i = 0; i <= limit; i++) {
      setTimeout(function () {
          document.getElementsById("resultbar").style.width = i + "%";
      }, SPEED * i);
  }
} */

//increase();

/* var i = 0;
function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
} */