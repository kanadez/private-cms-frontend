function resizeUi() // пересчитывает некоторые размерные параметры DOM-объетов при загрузке документа и изменении размера окна браузера
{
   $('#wrap').css('height', screenSize().h-50+'px');
   $('#wrap').css('min-width', screenSize().w-150+'px');
   $('#LC').resizable(
   {
      maxWidth:$('#LC').width()-20,
      minWidth:$('#LC').width()-20,
      stop: function()
      {
         $('#wrap').css('min-width', $('#wrap').width());
      }
   });   
}

function screenSize() // считает текущий размер экрана в пикселях
{
   var w, h;
   w = (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth));
   h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
   return {w:w, h:h};
}
