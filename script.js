$("#show").click(function () {
               
  if ($("#hamburger").is(":visible")) {
     $("#show").html('<i class="fas fa-bars text-2xl"></i>');
 }
 else {
     $("#show").html('<i id="hamburger-hide" class="fas fa-times text-2xl"></i>');
 } 
 $("nav").slideToggle(300);
});