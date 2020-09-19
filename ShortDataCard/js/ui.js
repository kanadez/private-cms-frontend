var styling_global_json_border = {};
var styling_global_json_bg_color = null;
var styling_global_json_symbol = null;
var styling_global_id = null;
var delete_all_dialog; // параметры диалога удаления всех выбранных паттернов
var border_settings_dialog;
var bg_color_settings_dialog;

function resizeUi() // пересчитывает некоторые размерные параметры DOM-объетов при загрузке документа и изменении размера окна браузера
{
   $('#wrap').css('height', screenSize().h-50+'px');
   
   if (screenSize().w > 1023)
   {
      $('#wrap').css('min-width', screenSize().w-150+'px');
   }

   $('#icards_block').height(screenSize().h / 3);
   $('#icards_block').width(screenSize().w / 3);
   if ($('.icard').width() > (screenSize().w / 5))
   {
      $('.icard').width(screenSize().w / 5);
   }
   
}

function screenSize() // считает текущий размер экрана в пикселях
{
   var w, h;
   w = (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth));
   h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
   return {w:w, h:h};
}