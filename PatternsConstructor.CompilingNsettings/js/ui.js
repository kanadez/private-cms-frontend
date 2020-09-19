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
