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
   $('#LC').resizable
   (
      {
         maxWidth:$('#LC').width()-20,
         minWidth:$('#LC').width()-20,
         stop: function()
         {
            $('#wrap').css('min-width', $('#wrap').width());
         }
      }  
   );   
   $('#LP').height($('#RC').height()-$('#T').height()-25);
}

function screenSize() // считает текущий размер экрана в пикселях
{
   var w, h;
   w = (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth));
   h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));
   return {w:w, h:h};
}

function restyleContextMenu() // изменяет дефолтные стилевые характеристики контекстного меню
{
   $.contextMenu.defaults
   (
   {
      menuStyle : 
      {
         width: "350px"
      }
  });
}


function buildDeleteAllDialog() // создание диалога удаления всех выбранных паттернов
{
   delete_all_dialog = $('<div></div>').html("These items in the left side will be permanently deleted and cannot be recovered. Are you sure?").dialog
   (
      {
         autoOpen: false,
         title: 'Delete all items?',
         height: 100,
         width: 300,   
         resizable: false,
         modal: true,
         buttons: 
         {
            "Delete all": function() 
            {
               clearLC();
               $( this ).dialog( "close" );
            },
            "Cancel": function() 
            {
               $( this ).dialog( "close" );
            }
         }
      }
   );
}

function buildBorderSettingsDialog() // создаёт диалог настройки границы SP-блока
{
   var dialog_content = "<input type='checkbox' checked='checked' id='show_SP_border'/><label for='show_SP_border'>Показывать границу блока</label><div style='margin: 3px 3px 3px 4px'>Цвет границы: <input id='select_border_color' type='color' value='#eaeaea' data-text='hidden' style='height:20px;width:20px;' /></div><div style='margin: 3px 3px 3px 4px'>Ширина границы: <select id='border_width_select' style='width:100px'><option class='border_width_select' value='1px'>1 пискель</option><option class='border_width_select' value='2px'>2 пикселя</option><option class='border_width_select' value='3px'>3 пикселя</option><option class='border_width_select' value='4px'>4 пикселя</option><option class='border_width_select' value='5px'>5 пикселей</option></select></div><div style='margin: 3px 3px 3px 4px'>Пунктир: <select id='border_style_select' style='width:100px'><option class='border_style_select' value='dotted'>Точка</option><option class='border_style_select' value='dashed'>Штрих</option><option class='border_style_select' value='solid' selected='selected'>Сплошная</option></select></div>";

   border_settings_dialog = $('<div></div>').html(dialog_content).dialog
   (
      {
         autoOpen: false,
         title: 'Настройка границы блока',   
         resizable: false,
         modal: true,
         buttons: 
         {
            "OK": function() 
            {
               applyStyling();
               applyMode("border_styling");
                $(this).dialog("close");
            },
            "Отмена": function() 
            {
               resetStyling();
               $(this).dialog("close");
            }
         }
      }
   );

   $('#show_SP_border').change
   (
      function()
      {
         if ($(this).attr('checked'))
         {
            setBorderParameter("show", true);
         }
         else
         {
            setBorderParameter("show", false);
         }
      }
   );
   
   $('.border_width_select').click
   (
      function()
      {
         setBorderParameter("width", $(this).val());
      }
   );
   
   $('.border_style_select').click
   (
      function()
      {
         setBorderParameter("style", $(this).val());
      }
   );
}

function buildBgColorSettingsDialog() // создаёт диалог настройки границы SP-блока
{
   var dialog_content = "<div style='margin: 3px 3px 3px 4px'>Цвет фона: <input id='select_bg_color' type='color' value='#fff' data-text='hidden' style='height:20px;width:20px;' /></div>";

   bg_color_settings_dialog = $('<div></div>').html(dialog_content).dialog
   (
      {
         autoOpen: false,
         title: 'Настройка фонового цвета блока',   
         resizable: false,
         modal: true,
         buttons: 
         {
            "OK": function() 
            {
               applyStyling();
               applyMode("bg_styling");
                $( this ).dialog( "close" );
            },
            "Отмена": function() 
            {
               resetStyling();
               $( this ).dialog( "close" );
            }
         }
      }
   );
}

var content_separator_settings_dialog;

function buildContentSeparatorSettingsDialog() // создаёт диалог настройки границы SP-блока
{
   var dialog_content = "<div style='margin: 3px 3px 3px 4px'>Символ разделителя: <select id='separator_symbol_select' style='width:100px'><option class='separator_symbol_select' value='&nbsp'>Пробел</option><option class='separator_symbol_select' value=' : '>Двоеточие</option><option class='separator_symbol_select' value=' - '>Тире</option></select></div><div style='margin: 3px 3px 3px 4px'>Другой символ: <input id='other_separator_symbol_input' maxlength=1 / ></div>";

   content_separator_settings_dialog = $('<div></div>').html(dialog_content).dialog
   (
      {
         autoOpen: false,
         title: 'Разделитель заголовка и содержания',   
         resizable: false,
         modal: true,
         buttons: 
         {
            "OK": function() 
            {
               applyStyling();
               applyMode("content_separator_styling");
                $( this ).dialog( "close" );
            },
            "Отмена": function() 
            {
               resetStyling();
               $( this ).dialog( "close" );
            }
         }
      }
   );
   
   $('.separator_symbol_select').click
   (
      function()
      {
         $('#other_separator_symbol_input').val("");
         setSeparatorSymbol($(this).val()+"&nbsp");
      }
   );
   
   $('#other_separator_symbol_input').keyup
   (
      function()
      {
         setSeparatorSymbol("&nbsp"+$(this).val()+"&nbsp");
      }
   );
}

function applyStyling() // применяет стиль, одновременно записав его в глобальный json
{
   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         if (styling_global_json_border != null)
         {
            $.extend(true, aBlock[i].border, styling_global_json_border); 
         }
         if (styling_global_json_bg_color != null)
         {
            aBlock[i].bg_color = styling_global_json_bg_color;
         }
         if (styling_global_json_symbol != null)
         {
            aBlock[i].D = styling_global_json_symbol;
         }
      }
   }
}

function applyMode(mode)
{
   var sp = $('#'+styling_global_id);
   var cell;
   
   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         cell = i;
      }
   }
   
   if (mode == "border_styling")
   {
      if ($('#show_SP_border').attr("checked"))
      {
         sp.css
         (
            {
               "border-style": aBlock[cell].border.style,
               "border-width": aBlock[cell].border.width,
               "border-color": aBlock[cell].border.color
            }
         );
      }
      else
      {
         sp.css("border", "none");
      }
      
      sp.css("border-color", $('#select_border_color').val());
      
      $('.border_width_select:selected').each
      (
         function()
         {
            sp.css("border-width", $(this).val());
         }
      );
      
      $('.border_style_select:selected').each
      (
         function()
         {
            sp.css("border-style", $(this).val());
         }
      );
   }
   else if (mode == "bg_styling")
   {
      sp.css("background", $('#select_bg_color').val());
      sp.children('.SP_CONTENT').css("background", $('#select_bg_color').val());
   }
   else if (mode == "content_separator_styling")
   {
      if ($('#other_separator_symbol_input').val() != "")
      {
         var len = Number(aBlock[cell].C);
         var header_str = aBlock[cell][cur_language];

         if (len == 0)
         {
            var content_str = dummy_text;
         }
         else
         {
            var content_str = dummy_text.substr(0, len);
         }
      
         onSPdataLoad(cell, aBlock[cell].ID, header_str, content_str, aBlock[cell].P, "&nbsp"+$('#other_separator_symbol_input').val()+"&nbsp", int1.length, aBlock[cell].noHeader, aBlock[cell].noContent);
      }
      else
      {
         $('.separator_symbol_select:selected').each
         (
            function()
            {
               var len = Number(aBlock[cell].C);
               var header_str = aBlock[cell][cur_language];
   
               if (len == 0)
               {
                  var content_str = dummy_text;
               }
               else
               {
                  var content_str = dummy_text.substr(0, len);
               }
   
               onSPdataLoad(cell, aBlock[cell].ID, header_str, content_str, aBlock[cell].P, $(this).val()+"&nbsp", int1.length, aBlock[cell].noHeader, aBlock[cell].noContent);
            }
         );
      }
   }
}

function resetStyling() // сбрасывает заданные стили при нажатии Отмена в диалоге
{
   var cell;
   
   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         cell = i;
      }
   }
   
   var sp = $("#"+styling_global_id);
   if (aBlock[cell].border.show == true)
   {
      sp.css
      (
         {
            "border-style": aBlock[cell].border.style,
            "border-width": aBlock[cell].border.width,
            "border-color": aBlock[cell].border.color
         }
      );
   }
   else
   {
      sp.css("border", "none");
   }
   
   sp.css("background", aBlock[cell].bg_color);
   sp.children('.SP_CONTENT').css("background", aBlock[cell].bg_color);
   
   var len = Number(aBlock[cell].C);
   var header_str = aBlock[cell][cur_language];
   
   if (len == 0)
   {
      if (aBlock[cell].U == false)
      {
         var content_str = removeUnderline(dummy_text);
      }
      else
      {
         var content_str = dummy_text;
      }
   }
   else
   {
      if (aBlock[cell].U == false)
      {
         var content_str = removeUnderline(dummy_text.substr(0, len));
      }
      else
      {
         var content_str = dummy_text.substr(0, len);
      }
   }
   
   onSPdataLoad(cell, aBlock[cell].ID, header_str, content_str, aBlock[cell].P, aBlock[cell].D, int1.length, aBlock[cell].noHeader, aBlock[cell].noContent);
}

function setBorderParameter(parameter, parameter_value)
{
   var sp = $('#'+styling_global_id);
   var cell;
   var json = {};
   
   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         cell = i;
      }
   }
   
   if (parameter == "show")
   {
      if (parameter_value == false)
      {
         sp.css("border", "none");
         json.show = false;
      }
      else
      {
         sp.css
         (
            {
               "border-style": aBlock[cell].border.style,
               "border-width": aBlock[cell].border.width,
               "border-color": aBlock[cell].border.color
            }
         );
         json.show = true;
      }
   }
   else if (parameter == "color")
   {
      sp.css("border-color",  parameter_value);
      json.color = parameter_value;
   }
   else if (parameter == "width")
   {
      sp.css("border-width",  parameter_value);
      json.width = parameter_value;
   }
   else if (parameter == "style")
   {
      sp.css("border-style",  parameter_value);
      json.style = parameter_value;
   }
   $.extend(true, styling_global_json_border, json); 
   
}

function setBgColor(color_value)
{
   var sp = $('#'+styling_global_id);
   var cell;
   
   for (var i = 0; i < aBlock.length; i++)
   {
      
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         cell = i;
      }
   }
   
   sp.css("background", color_value);
   sp.children('.SP_CONTENT').css("background", color_value);
   styling_global_json_bg_color = color_value;
}

function setSeparatorSymbol(symbol_value)
{
   var sp = $('#'+styling_global_id);
   var cell;
   
   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         cell = i;
      }
   }
   var len = Number(aBlock[cell].C);
   var header_str = aBlock[cell][cur_language];
   
   if (len == 0)
   {
      var content_str = dummy_text;
   }
   else
   {
      var content_str = dummy_text.substr(0, len);
   }
   
   onSPdataLoad(cell, aBlock[cell].ID, header_str, content_str, aBlock[cell].P, symbol_value, int1.length, aBlock[cell].noHeader, aBlock[cell].noContent);
   styling_global_json_symbol = symbol_value;
}

function removeUnderline(str)
{
   return str.replace(/(<u>|<\/u>)/g,""); 
}

function setUnUnderlinedConent()
{
   var sp = $('#'+styling_global_id);
   var cell;
   
   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == styling_global_id))
      {
         cell = i;
      }
   }
   
   if (aBlock[cell].U == true)
   {
      aBlock[cell].U = false;
   }  
   else
   {
      aBlock[cell].U = true;
   }
   
   var len = Number(aBlock[cell].C);
   var header_str = aBlock[cell][cur_language];
   
   if (len == 0)
   {
      if (aBlock[cell].U == false)
      {
         var content_str = removeUnderline(dummy_text);
      }
      else
      {
         var content_str = dummy_text;
      }
   }
   else
   {
      if (aBlock[cell].U == false)
      {
         var content_str = removeUnderline(dummy_text.substr(0, len));
      }
      else
      {
         var content_str = dummy_text.substr(0, len);
      }
   }
   
   onSPdataLoad(cell, aBlock[cell].ID, header_str, content_str, aBlock[cell].P, aBlock[cell].D, int1.length, aBlock[cell].noHeader, aBlock[cell].noContent);
}

function minimizeRC()
{
   $('#T').css("display", "none");
   $('#LP').css("display", "none");
   $('#RC').css({"background": "#f4f4f4", "width": "20px", "cursor": "pointer"});
   $('#LC').css("width", "96%");
   $('#LC').resizable
   (
      {
         maxWidth:$('#LC').width()-20,
         minWidth:$('#LC').width()-20,
         stop: function()
         {
            $('#wrap').css('min-width', $('#wrap').width());
         }
      }  
   ); 
   $(
      "<div />", 
      {
         id: "RC_clickable",
         style: "width:100%; height:100%"
      }
   ).appendTo("#RC");
   $('#RC_clickable').click
   (
      function()
      {
         maximizeRC();
      }
   );
}

function maximizeRC()
{
   $('#RC_clickable').unbind();
   $('#RC_clickable').remove();
   $('#LC').css("width", "75%");
   $('#LC').resizable
   (
      {
         maxWidth:$('#LC').width()-20,
         minWidth:$('#LC').width()-20,
         stop: function()
         {
            $('#wrap').css('min-width', $('#wrap').width());
         }
      }  
   ); 
   $('#RC').css({"background": "#fff", "width": "23%", "cursor": "default"});
   $('#T').css("display", "block");
   $('#LP').css("display", "block");
}