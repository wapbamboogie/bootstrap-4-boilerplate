$( document ).ready(function() {

  $('body').scrollspy({target: ".navbar", offset: $("#scrollspy").height()});
  $("#scrollspy ul li a").on('click', function(e) {

    e.preventDefault();
 
    var hash = this.hash;
    
    $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 500, function(){

        window.location.hash = hash;
      });
 
 });

});
