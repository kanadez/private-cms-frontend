var cursor_x = 0;
var cursor_y = 0;

function resizeUi()
{
   $('#wrap').css('height', screenSize().h-50+'px');
}

function screenSize()
{
   var w, h;
   w = (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth));
   h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
   return {w:w, h:h};
}

function getCursorXY(e) 
{
   cursor_x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
   cursor_y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
   //console.log("x: "+cursor_x);
   //console.log("y: "+cursor_y);
}
         
function popup()
{
   if ($('#popup1').length != 0)
   {
      $('#popup1').remove();
   }
   var popup = $("<div></div>").attr({"id":"popup1", "class":"popup"}).css({"position":"absolute"});
   ////console.log(popup);
   $(document.body).append(popup);
}
