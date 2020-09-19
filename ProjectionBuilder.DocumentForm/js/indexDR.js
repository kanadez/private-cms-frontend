var aSP = []; // массив json-объектов выбранных паттернов (левый блок)
var aCards = []; // массив json-объектов каждой из карточек на правой панели
var aBlock = []; // массив json-объектов блоков левой панели
var int1 = []; // односекундный интервал для создания эффекта симуляции загрузки с сервера (через секунду пропадает "крутилка" и в SP кладутся данные)
var lc_counter; // глобальный счётчик для создания уникальных ключей-идентификаторов выбранных паттернов
var counter;
var dummy_text = "<u>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a purus nec tellus vestibulum fermentum. Morbi scelerisque feugiat augue nec pharetra. Suspendisse suscipit tempor sagittis. Fusce suscipit ultricies felis nec sodales. Vestibulum diam leo, auctor in commodo ut, interdum nec lorem. Pellentesque a urna sem, nec ultrices nibh. Maecenas commodo mollis erat, sed semper risus laoreet nec. Proin accumsan tortor et erat luctus venenatis. Aliquam ultricies tincidunt iaculis. Fusce quis pharetra tellus. Mauris in leo nunc. Aenean eleifend eros ut neque tempus molestie. Aliquam laoreet scelerisque lacus sed scelerisque. Quisque elit velit, dignissim et viverra quis, fringilla quis orci. Nunc non lorem turpis. Nunc euismod, tortor vel adipiscing auctor, metus odio ultricies est, a dignissim odio ante at sapien. Phasellus tempor nibh cursus arcu placerat imperdiet. Maecenas molestie, est et luctus hendrerit, magna ligula elementum libero, volutpat semper nibh risus eu turpis. Fusce id odio nisl, in fringilla mauris.Cras commodo, nibh vel tincidunt adipiscing, felis nulla sagittis risus, ac consequat nibh ligula quis libero. Aliquam felis quam,  venenatis at pretium ac, laoreet lacinia felis. Aenean eget velit sed nisi feugiat facilisis ac nec mauris. Praesent fermentum sagittis  est non malesuada. Fusce blandit blandit tortor vitae consequat. Donec tristique congue vestibulum. Donec euismod condimentum dui sit amet pretium. Nullam faucibus consequat ultricies. Cras imperdiet, nibh in faucibus porta, sapien libero faucibus arcu, quis  faucibus dui massa at sem. In eget ipsum in tellus dictum volutpat a id nisl.Morbi luctus bibendum vehicula. Maecenas hendrerit diam non mi volutpat ut porta metus pellentesque. Vivamus ut lacus tortor.  Suspendisse ac tortor sed dolor placerat vulputate. Mauris commodo porta ligula in accumsan. Praesent vulputate faucibus mi,  scelerisque aliquam libero eleifend ut. Donec accumsan vehicula velit, sit amet pellentesque dolor mattis id. Class aptent taciti  sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam malesuada bibendum odio, porta vulputate nulla consequat in. Aliquam nec eros quam, et mollis sem. Sed dignissim felis quis elit porttitor dignissim. Praesent vestibulum lobortis  massa, non laoreet neque imperdiet a. Etiam et leo non metus luctus rutrum. Vestibulum sodales rhoncus tincidunt. Aenean urna eros, tincidunt quis viverra nec, lobortis ac tortor.Nunc id massa non felis pretium bibendum laoreet nec tellus. Integer varius cursus ipsum, vel venenatis nunc vehicula sit amet.  Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed augue sem, eu tincidunt  metus. Suspendisse blandit congue nisi eget pulvinar. In hac habitasse platea dictumst. Suspendisse potenti. Curabitur aliquam pulvinar dolor. Praesent metus felis, blandit non porta id, ultrices vel ipsum. Aliquam eu massa quam, vitae sodales dui. Quisque quis arcu sapien. Maecenas arcu nisi, malesuada eget ultrices id, gravida sit amet risus. Aenean pharetra magna non urna molestie euismod. Vestibulum feugiat lobortis ipsum et blandit. Pellentesque tincidunt porttitor felis, sit amet vestibulum nisl aliquet ut.Ut tempor, sem quis laoreet consequat, neque est luctus arcu, a ullamcorper urna lectus a sapien. Maecenas fermentum aliquet  ipsum ac semper. Pellentesque quis ipsum quam. Cras rhoncus consectetur tincidunt. Cum sociis natoque penatibus et magnis dis  parturient montes, nascetur ridiculus mus. Proin consequat pharetra metus nec egestas. Nulla elementum luctus lorem nec sollicitudin. Aenean metus mi, volutpat id porta eu, luctus et nibh. Curabitur at dui nunc. Nunc sed justo at massa luctus elementum vitae vel nulla. Vestibulum tempor hendrerit elit at sagittis</u>";
var cur_language = "Ru";
var default_mode = false;
var order_number = 0;
var cur_columns_number = 3;
var pagebreak_dragging = false;
var in_dialog_dialog;
var cursor_x = 0;
var cursor_y = 0;
var cur_mo_sp = null;
var sv_mode = false;
var bloc = 0;

$(document).ready
(
   function()
   {
      counter = 0;
      lc_counter = 0;
      resizeUi();
      //fill_aCards();
      buildLP();
      buildDeleteAllDialog();
      buildBorderSettingsDialog();
      buildBgColorSettingsDialog();
      buildContentSeparatorSettingsDialog();
      buildInDialogDialog();
      setEvents();
   }
);

 $(document).bind
(
   'DOMUpdated', 
   function () 
   { 
      $('#select_border_color').bind
      (
         'colorpicked', 
         function () 
         {
            setBorderParameter("color", $(this).val());
         }
      );
      
      $('#select_bg_color').bind
      (
         'colorpicked', 
         function () 
         {
            setBgColor($(this).val());
         }
      );
   }
);

function setEvents() // задание событий для DOM-объектов (статических, то есть находящихся на странице 100% времени) 
{
   $('#DELETE_ALL').click
   (
      function()
      {
         delete_all_dialog.dialog('open');
      }
   );
   
   $('#LOAD_JSON').click
   (
      function()
      {
         presetDataLoad();
      }
   );
   
   $('#UPLOAD_JSON').click
   (
      function()
      {
         gatherData();
      }
   );
   
   $('#MINIMIZE').click
   (
      function()
      {
         minimizeRC();
      }
   );
   
   $('#pd_language').bind
   (
      'change',  
      function (ev) 
      {
         $('#'+$(this).attr('id')+' option:selected').each
         (
            function()
            {
               cur_language = $(this).text();
               for (var i = 0; i < aBlock.length; i++)
               {
                  //$('#'+aCards[i].ID).children('.P_COM').html(aCards[i][cur_language]);
                  if (aBlock[i] != undefined)
                  {
                     onSPdataLoad(i, aBlock[i].ID, aBlock[i][cur_language], aBlock[i].content, aBlock[i].P, aBlock[i].D, null, aBlock[i].noHeader, aBlock[i].noContent)
                  }
               }
            }
         );
      }
   );
   
   restyleContextMenu();   
   createPagebreak();
}

function buildInDialogDialog() // создание диалога удаления всех выбранных паттернов
{
   in_dialog_dialog = $('#in_dialog').dialog
   (
      {
         autoOpen: false,
         resizable: false,
         modal: true,
         buttons: 
         {
            "OK": function() 
            {
               $(this).dialog( "close" );
            }
         }
      }
   );
}

function fill_aCards() // заполняет массив карточек, содержащихся в правом блоке
{
   var json = {};
   json.ID = counter;
   json.En = "En_header";
   json.Ru = "Учётная карточка сотрудника организации";
   json.De = "De_header";
   json.NL = "NL_header";
   json.Len = 40;
   json.noHeader = 0;
   json.noContent = 1;
   aCards[json.ID] = json;
   
   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_name";
   json.Ru = "Имя";
   json.De = "De_name";
   json.NL = "NL_name";
   json.Len = 40;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;
   
   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_lastname";
   json.Ru = "Фамилия";
   json.De = "De_lastname";
   json.NL = "NL_lastname";
   json.Len = 40;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_bd";
   json.Ru = "Дата рождения";
   json.De = "De_bd";
   json.NL = "NL_bd";
   json.Len = 8;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_city";
   json.Ru = "Город";
   json.De = "De_city";
   json.NL = "NL_city";
   json.Len = 40;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_region";
   json.Ru = "Область";
   json.De = "De_region";
   json.NL = "NL_region";
   json.Len = 40;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_dist";
   json.Ru = "Район";
   json.De = "De_dist";
   json.NL = "NL_dist";
   json.Len = 40;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_edu";
   json.Ru = "Образование";
   json.De = "De_edu";
   json.NL = "NL_edu";
   json.Len = 80;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_spec";
   json.Ru = "Специальность";
   json.De = "De_spec";
   json.NL = "NL_spec";
   json.Len = 80;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_lastjob";
   json.Ru = "Сведения о последнем месте работы";
   json.De = "De_lastjob";
   json.NL = "NL_lastjob";
   json.Len = 240;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_exper";
   json.Ru = "Стаж работы по специальности";
   json.De = "De_exper";
   json.NL = "NL_exper";
   json.Len = 2;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_interview";
   json.Ru = "Результаты собеседования";
   json.De = "De_interview";
   json.NL = "NL_interview";
   json.Len = 0;
   json.noHeader = 0;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_footer";
   json.Ru = "Общие замечания и заключения";
   json.De = "De_footer";
   json.NL = "NL_footer";
   json.Len = 0;
   json.noHeader = 1;
   json.noContent = 0;
   aCards[json.ID] = json;

   counter++;
}

function createPagebreak() // создаёт Разрыв страницы
{
   $('#PAGEBREAK').draggable
      (
         {
            helper:"clone",
            containment: "LC",
            start:function(ev, ui)
            {
               $(ui.helper).css({"width":$(this).css("width"), "height":$(this).css("height")});
               pagebreak_dragging = true;
            },
            stop:function(ev, ui) 
            {
               var pos=$(ui.helper).offset();
               objName = "#"+$(ui.helper).attr("id")+"_"+lc_counter;
               $(objName).css
               (
                  {
                     "left":pos.left,
                     "top":pos.top
                  }
               );
               $(objName).removeClass("pb_draggable");
            }
         }
      );
}

function buildLP() // наполняет правый блок (RC) паттернами (карточками) для выбора. В идеале должны браться с сервера
{
   var w = 0;
   var h = 0;
   
   for (var i = 0; i < aCards.length; i++)
   {
      var json = aCards[i];
      $('#LP').append("<div id='"+i+"' class='P'><div id='img_"+i+"' class='P_IMG'></div><div id='comment_"+i+"' class='P_COM'>"+json.Ru+"</div></div>");
      /*$("#"+i).draggable
      (
         {
            helper:"clone",
            containment: "LC",
            start:function(ev, ui)
            {
               $(ui.helper).css({"width":$(this).css("width"), "height":$(this).css("height")});
            },
            stop:function(ev, ui) 
            {
               var pos=$(ui.helper).offset();
               objName = "#"+$(ui.helper).attr("id")+"_"+lc_counter;
               $(objName).css
               (
                  {
                     "left":pos.left,
                     "top":pos.top
                  }
               );
               $(objName).removeClass("P");
            }
         }
      );*/
   }
   
   $('#LC').mouseover
   (
      {
         id: i
      },
      function(ev)
      {
         
         if ($('#popup1').length != 0 && bloc == 0)
         {
            popupRemove();
         }
      }
   );
   
   $('#LC').droppable
   (
      {
         accept: ".P, .pb_draggable",
         drop: function(ev, ui) 
         {
            lc_counter++;
            var element=$(ui.helper).clone();
            element.addClass("tempclass");
            $(this).append(element);
            $('.tempclass').attr("id", $(ui.helper).attr("id")+"_"+lc_counter);
            
            var droppable_pattern = $("#"+$(ui.helper).attr("id")+"_"+lc_counter);
            droppable_pattern.removeClass("tempclass");
            
            if ($(ui.helper).attr("id") == "PAGEBREAK")
            {
               droppable_pattern.addClass("pb");
               droppable_pattern.width(300);
               droppable_pattern.height(30);
               droppable_pattern.html("--- Разрыв страницы ---");
               /*droppable_pattern.draggable
               (
                  {
                     containment: "parent"      
                  }    
               );*/
               droppable_pattern.css("cursor","move");
               return;
            }
            
            itemDragged = "SP";
            droppable_pattern.css
            (
               {
                  "width": "300px",
                  "height": "80px"
               }
            );
            droppable_pattern.addClass(itemDragged);

            // содание json для текущего левого блока. Визуальная модель данных (старая)
            var SPjson = {};
            SPjson.ID = $(ui.helper).attr("id")+"_"+lc_counter;
            SPjson.W = $("#"+SPjson.ID).width();
            SPjson.H = $("#"+SPjson.ID).height();
            SPjson.X = Math.round($("#"+SPjson.ID).offset().top);
            SPjson.Y = Math.round($("#"+SPjson.ID).offset().left);
            var cur_aSP_cell = aSP.length;
            aSP.push(SPjson);
            //-----------------------------------------------------------------
            
            // создание json для текущего левого блока
            var json = {};
            json.ID = SPjson.ID;
            json.DBID = SPjson.ID;
            if (aCards[$(ui.helper).attr("id")].Ru == "Специальность" || aCards[$(ui.helper).attr("id")].Ru == "Результаты собеседования")
            {
               json.P = 1;
            }
            else 
            {
               json.P = 0;
            }
            json.W = SPjson.W;
            json.H = SPjson.H;
            json.X = SPjson.X;
            json.Y = SPjson.Y;
            json.B = 1;
            json.D = "&nbsp";
            json.Ru = aCards[$(ui.helper).attr("id")].Ru;
            json.En = aCards[$(ui.helper).attr("id")].En;
            json.De = aCards[$(ui.helper).attr("id")].De;
            json.NL = aCards[$(ui.helper).attr("id")].NL;
            json.C = aCards[$(ui.helper).attr("id")].Len;
            json.U = true;
            json.border = 
            {
               show:true,
               color:"#EAEAEA",
               width:"1px",
               style:"solid"
            }
            json.bg_color = "#fff";
            json.header =
            {
               W:0,
               H:0
            }
            json.noHeader =  aCards[$(ui.helper).attr("id")].noHeader;
            json.noContent =  aCards[$(ui.helper).attr("id")].noContent;
            json.ordernr = order_number;
            json.sv = 1;
            var cur_aBlock_cell = aBlock.length;
            aBlock.push(json);
            order_number++;
            //-----------------------------------------------------------------
            
            /*droppable_pattern.draggable
            (
               {
                  containment: "parent",
                  stop: function(event, ui) 
                  {
                     aSP[cur_aSP_cell].X = aBlock[cur_aBlock_cell].X = Math.round($("#"+SPjson.ID).offset().top);
                     aSP[cur_aSP_cell].Y = aBlock[cur_aBlock_cell].Y = Math.round($("#"+SPjson.ID).offset().left);
                  }
               }    
            );*/
            
            droppable_pattern.html("<div id='" + aSP[cur_aSP_cell].ID + "_content' class='SP_CONTENT'><div id='load_" + aSP[cur_aSP_cell].ID + "' class='LOAD'></div></div>");      
            
           //<a id='close_" + aSP[cur_aSP_cell].ID + "' class='CLOSE_SP' href='#'><img src='img/cross.png' style='float:right; margin:5px;' / ></a>
            /*$("#close_"+ aSP[cur_aSP_cell].ID).click
            (
               function()
               {
                  $("#"+aSP[cur_aSP_cell].ID).remove();
                  delete aSP[cur_aSP_cell];
                  delete aBlock[cur_aBlock_cell];
               }
            );*/
            droppable_pattern.mouseover
            (
               {
                  id: aSP[cur_aSP_cell].ID
               },
               function(ev)
               {
                  if (($('#popup1').length != 0) && (cur_mo_sp != ev.data.id))
                  {
                     popupRemove();
                  }
               }
            );
            
            $("#"+aSP[cur_aSP_cell].ID).contextMenu
            (
               'context_menu', 
               {
                  bindings: 
                  {
                     "SP_border_settings": function(t) 
                     {
                        styling_global_id = t.id;
                        border_settings_dialog.dialog("open");
                     },
                     "bg_color": function(t) 
                     {
                        styling_global_id = t.id;
                        bg_color_settings_dialog.dialog("open");
                     },
                     "content_separator": function(t) 
                     {
                        styling_global_id = t.id;
                        content_separator_settings_dialog.dialog("open");
                     },
                     "underline": function(t) 
                     {    
                        styling_global_id = t.id;
                        setUnUnderlinedConent();
                     },
                     "sv_on": function(t) 
                     {    
                        switchBlockSV(t.id);
                     }
                  }
               }
            );
            var len = Number(json.C);
            var header_str = json[cur_language];
            
            if (len == 0)
            {
               var content_str = aBlock[cur_aSP_cell].content;
            }
            else
            {
               var content_str = aBlock[cur_aSP_cell].content.substr(0, len);
            }
            
            int1[int1.length] = window.setInterval("onSPdataLoad('" + cur_aSP_cell + "', '" + aSP[cur_aSP_cell].ID + "', '"+header_str+"', '"+content_str+"', "+json.P+", '"+json.D+"', "+int1.length+", "+json.noHeader+", "+json.noContent+")", 1000);
            
            /*droppable_pattern.resizable
            (
               {
                  stop: function(event, ui) 
                  {
                     aSP[cur_aSP_cell].W = $("#"+SPjson.ID).width();
                     aSP[cur_aSP_cell].H = $("#"+SPjson.ID).height();
                  },
                  resize: function(event, ui)
                  {
                     $(this).children(".SP_CONTENT").width($(this).width()-29);
                  
                     $("#"+aSP[cur_aSP_cell].ID+"_iframe").css
                     (
                        {
                           "width":$("#"+aSP[cur_aSP_cell].ID+"_content").width(),
                           "height":$("#"+aSP[cur_aSP_cell].ID+"_content").height()
                        }
                     );
                     aBlock[cur_aBlock_cell].W = $("#"+SPjson.ID).width();
                     aBlock[cur_aBlock_cell].H = $("#"+SPjson.ID).height();
                     $(this).children(".SP_CONTENT").height($(this).height()-6);
                  }
               }
            );*/
         }
      }
   );
}



function switchBlockSV(block_id) // задаёт выдачу/не выдачу блока в сокращённый режим (через контестное меню правой клавиши)
{
   var cell;

   for (var i = 0; i < aBlock.length; i++)
   {
      if ((aBlock[i] != undefined) && (aBlock[i].ID == block_id))
      {
         cell = i;
      }
   }
   
   if (aBlock[cell].sv == 0)
   {
      aBlock[cell].sv = 1;
      $("#"+aBlock[cell].ID).contextMenu
      (
         'context_menu',
         {
            bindings: 
            {
               "SP_border_settings": function(t) 
               {
                  styling_global_id = t.id;
                  border_settings_dialog.dialog("open");
               },
               "bg_color": function(t) 
               {
                  styling_global_id = t.id;
                  bg_color_settings_dialog.dialog("open");
               },
               "content_separator": function(t) 
               {
                  styling_global_id = t.id;
                  content_separator_settings_dialog.dialog("open");
               },
               "underline": function(t) 
               {    
                  styling_global_id = t.id;
                  setUnUnderlinedConent();
               },
               "sv_on": function(t) 
               {    
                  switchBlockSV(t.id);
               }
            }
         }
      );
   }
   else if (aBlock[cell].sv == 1)
   {
      aBlock[cell].sv = 0;
      $("#"+aBlock[cell].ID).contextMenu
      (
         'context_menu2',                
         {
            bindings: 
            {
               "SP_border_settings2": function(t) 
               {
                  styling_global_id = t.id;
                  border_settings_dialog.dialog("open");
               },
               "bg_color2": function(t) 
               {
                  styling_global_id = t.id;
                  bg_color_settings_dialog.dialog("open");
               },
               "content_separator2": function(t) 
               {
                  styling_global_id = t.id;
                  content_separator_settings_dialog.dialog("open");
               },
               "underline2": function(t) 
               {    
                  styling_global_id = t.id;
                  setUnUnderlinedConent();
               },
               "sv_on2": function(t) 
               {    
                  switchBlockSV(t.id);
               }
            }
         }
      );
   }
}
//var show_content_underlines = false;

/*function showContentUnderlines()
{
   if (show_content_underlines == true)
   {
      show_content_underlines = false;
      $('#underline_tick').attr("src", "null.png");
   }
   else
   {
      show_content_underlines = true;
      $('#underline_tick').attr("src", "img/tick.png");
   }
}*/

function onSPdataLoad(cur_asp_cell, sp_id, header_content, content_content, p, d, int_array_cell, no_header, no_content) // событие по загрузке данных для выбранных паттернов с сервера
{
   $('#'+sp_id+'_content').html("");
   $('#load_'+sp_id).remove();
   clearInterval(int1[int_array_cell]);
   if (p == 0)
   {
      if (no_header == 0)
      {
         $('#'+sp_id+'_content').append("<div id='"+sp_id+"_content_header' class='sp_content_header'></div>");
         $("#"+sp_id+"_content_header").css({"width":"auto", "float":"left", "height":"auto", "overflow":"hidden", "border":"1px solid #eaeaea", "text-align":"center"}).html("<strong>"+header_content+"</strong>"+d);
      }
      
      if (no_content == 0)
      {
         $('#'+sp_id+'_content').append(content_content);
      }
   }
   else
   {
      var br_str = "";
      for (var i = 0;  i < p; i++)
      {
         br_str += "<br>";
      }
      
      if (no_header == 0)
      {
         $('#'+sp_id+'_content').append("<div id='"+sp_id+"_content_header' class='sp_content_header'></div>");
         $("#"+sp_id+"_content_header").css({"width":"auto", "height":"auto", "overflow":"hidden", "border":"1px solid #eaeaea", "text-align":"center"}).html("<strong>"+header_content+"</strong>"+d);
      }
      
      if (no_content == 0)
      {
         $('#'+sp_id+'_content').append(br_str+content_content);
      }
   }

   if (no_header == 0)
   {
      if (aBlock[cur_asp_cell].header.W != 0 )
      {
         $("#"+sp_id+"_content_header").width(aBlock[cur_asp_cell].header.W);
      }
      
      if (aBlock[cur_asp_cell].header.H != 0)
      {
         $("#"+sp_id+"_content_header").height(aBlock[cur_asp_cell].header.H);
      }
      
      $("#"+sp_id+"_content_header").css("line-height", $("#"+sp_id+"_content_header").height()+"px");
      /*$("#"+sp_id+"_content_header").resizable
      (
         {
            resize: function()
            {
               $(this).css("line-height", $(this).height()+"px");
            },
            stop: function()
            {
               aBlock[cur_asp_cell].header.W = $(this).width();
               aBlock[cur_asp_cell].header.H = $(this).height();
            }
         }
      );*/
   }
   
   if (no_content == 0)
   {
      $('#'+sp_id+'_content').height($("#"+sp_id+"_content").parent().height()-6);
   }
   
   if (no_header == 0)
   {
      $("#"+sp_id+"_content_header").bind
      (
         "mouseover",
         {
            id:sp_id,
            cell:cur_asp_cell
         },
         function(ev)
         {
            if ($('#popup1').length == 0)
            {
               getCursorXY(ev);
               popup();
               renderPopup(ev.data.id, ev.data.cell);
            }
         }
      );
   }
   else if (no_content == 0)
   {
      $("#"+sp_id+"_content").bind
      (
         "mouseover",
         {
            id:sp_id
         },
         function(ev)
         {
            if ($('#popup1').length == 0)
            {
               getCursorXY(ev);
               popup();
               renderPopup(ev.data.id);
            }
         }
      );
   }
   
   //disableHeaderEditing(cur_asp_cell);
}

function clearLC() // очистка левого блока от выбранных паттернов. очищается и массив тоже
{
   for (var i = 0; i < aSP.length; i++)
   {
      if (aSP[i] != undefined)
      {
         $('#'+aSP[i].ID).remove();
      }
   }
   
   aSP = [];
   aBlock = [];
}

function presetDataLoad() // загрузка заранее сохранённго набора выбранных паттернов в левый блок. в идеале должно браться с сервера
{
   clearLC();
   
   var SPjson = {};
   SPjson.ID = '1_1';
   SPjson.W = 300;        
   SPjson.H = 400;
   SPjson.X = 10;
   SPjson.Y = 10;
   SPjson.noHeader = 0;
   SPjson.noContent = 0;
   aSP.push(SPjson);
   
   var json = {};
   json.ID = SPjson.ID;
   json.DBID = SPjson.ID;
   json.P = 1;
   json.W = SPjson.W;
   json.H = SPjson.H;
   json.X = SPjson.X;
   json.Y = SPjson.Y;
   json.B = 1;
   json.D = "&nbsp";
   json.Ru = "Специальность";
   json.En = "En_spec";
   json.De = "De_spec";
   json.NL = "NL_spec";
   json.C = 80;
   json.U = true;
   json.border = 
   {
      show:true,
      color:"#EAEAEA",
      width:"1px",
      style:"solid"
   }
   json.bg_color = "#fff";
   json.header =
   {
      W:0,
      H:0
   }
   json.noHeader =  SPjson.noHeader;
   json.noContent = SPjson.noContent;
   json.ordernr = order_number;
   json.sv = 1;
   json.content = "<u>fvhjkfbvb fvjbhjjhv bfjhvbfjhbvfjg hbvjghfbvj fbghvjhfbgv jbfgjhvb jhfgbvjh</u>";
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   order_number++;
   
   var SPjson = {};
   SPjson.ID = '1_2';
   SPjson.W = 300;        
   SPjson.H = 100;
   SPjson.X = 353;
   SPjson.Y = 10;
   SPjson.noHeader = 0;
   SPjson.noContent = 0;
   aSP.push(SPjson);
   
   var json = {};
   json.ID = SPjson.ID;
   json.DBID = SPjson.ID;
   json.P = 1;
   json.W = SPjson.W;
   json.H = SPjson.H;
   json.X = SPjson.X;
   json.Y = SPjson.Y;
   json.B = 1;
   json.D = "&nbsp";
   json.En = "En_bd";
   json.Ru = "Дата рождения";
   json.De = "De_bd";
   json.NL = "NL_bd";
   json.C = 8;
   json.U = true;
   json.border = 
   {
      show:true,
      color:"#EAEAEA",
      width:"1px",
      style:"solid"
   }
   json.bg_color = "#fff";
   json.header =
   {
      W:0,
      H:0
   }
   json.noHeader =  SPjson.noHeader;
   json.noContent = SPjson.noContent;
   json.ordernr = order_number;
   json.sv = 1;
   json.content = "<u>11111111777 77777744 444444 499999 99992 22222 22</u>";
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   order_number++;
   
   var SPjson = {};
   SPjson.ID = '1_3';
   SPjson.W = 300;        
   SPjson.H = 100;
   SPjson.X = 353;
   SPjson.Y = 120;
   SPjson.noHeader = 0;
   SPjson.noContent = 0;
   aSP.push(SPjson);
   
   var json = {};
   json.ID = SPjson.ID;
   json.DBID = SPjson.ID;
   json.P = 1;
   json.W = SPjson.W;
   json.H = SPjson.H;
   json.X = SPjson.X;
   json.Y = SPjson.Y;
   json.B = 1;
   json.D = "&nbsp";
   json.En = "En_lastname";
   json.Ru = "Фамилия";
   json.De = "De_lastname";
   json.NL = "NL_lastname";
   json.C = 40;
   json.U = true;
   json.border = 
   {
      show:true,
      color:"#EAEAEA",
      width:"1px",
      style:"solid"
   }
   json.bg_color = "#fff";
   json.header =
   {
      W:0,
      H:0
   }
   json.noHeader =  SPjson.noHeader;
   json.noContent = SPjson.noContent;
   json.ordernr = order_number;
   json.sv = 1;
   json.content = "<u>656575 756677856 67566575675 75656657 6565756 7565757</u>";
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   order_number++;
   
   var SPjson = {};
   SPjson.ID = '1_4';
   SPjson.W = 300;        
   SPjson.H = 100;
   SPjson.X = 353;
   SPjson.Y = 250;
   SPjson.noHeader = 0;
   SPjson.noContent = 0;
   aSP.push(SPjson);
   
   var json = {};
   json.ID = SPjson.ID;
   json.DBID = SPjson.ID;
   json.P = 1;
   json.W = SPjson.W;
   json.H = SPjson.H;
   json.X = SPjson.X;
   json.Y = SPjson.Y;
   json.B = 1;
   json.D = "&nbsp";
   json.En = "En_region";
   json.Ru = "Область";
   json.De = "De_region";
   json.NL = "NL_region";
   json.C = 40;
   json.U = true;
   json.border = 
   {
      show:true,
      color:"#EAEAEA",
      width:"1px",
      style:"solid"
   }
   json.bg_color = "#fff";
   json.header =
   {
      W:0,
      H:0
   }
   json.noHeader =  SPjson.noHeader;
   json.noContent = SPjson.noContent;
   json.ordernr = order_number;
   json.sv = 1;
   json.content = "<u>5y5y5y5yy 5y5y55ij u5hjh5jhv5h gv5h55gv 5g55gv5g5 vb55l5;5 5mj5k5</u>";
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   order_number++;
   
   var SPjson = {};
   SPjson.ID = '1_5';
   SPjson.W = 280;        
   SPjson.H = 100;
   SPjson.X = 670;
   SPjson.Y = 10;
   SPjson.noHeader = 0;
   SPjson.noContent = 0;
   aSP.push(SPjson);
   
   var json = {};
   json.ID = SPjson.ID;
   json.DBID = SPjson.ID;
   json.P = 1;
   json.W = SPjson.W;
   json.H = SPjson.H;
   json.X = SPjson.X;
   json.Y = SPjson.Y;
   json.B = 1;
   json.D = "&nbsp";
   json.Ru = "Специальность";
   json.En = "En_spec";
   json.De = "De_spec";
   json.NL = "NL_spec";
   json.C = 80;
   json.U = true;
   json.border = 
   {
      show:true,
      color:"#EAEAEA",
      width:"1px",
      style:"solid"
   }
   json.bg_color = "#fff";
   json.header =
   {
      W:0,
      H:0
   }
   json.noHeader =  SPjson.noHeader;
   json.noContent = SPjson.noContent;
   json.ordernr = order_number;
   json.sv = 1;
   json.content = "<u>535353 53535353 53535353 5353535 35353535 35fffffghi hiojnhon jkioonn</u>";
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   order_number++;
   
   for (var i = 0; i < 5; i++)
   {
      createSPfromJson(i);
   }
   
   //disableBlockEditing();
}

function createSPfromJson(array_cell) // создание выбранного паттерна на основе загруженного с сервера json-объекта. (сечас создаётся локально).
{
   $('#LC').append("<div class='SP' id='"+aBlock[array_cell].ID+"' style='position: absolute;'><div id='" + aBlock[array_cell].ID + "_content' class='SP_CONTENT'><div id='load_" + aBlock[array_cell].ID + "' class='LOAD'></div></div></div>");
   //<a id='close_" + aBlock[array_cell].ID + "' class='CLOSE_SP' href='#'><img src='img/cross.png' style='float:right; margin:5px;' / ></a>
   var block = $('#'+aBlock[array_cell].ID);
   block.height(aBlock[array_cell].H);
   block.width(aBlock[array_cell].W);
   block.offset({top: aBlock[array_cell].Y, left:aBlock[array_cell].X});
   
   /*block.draggable
   (
      {
         containment: 'parent',
         stop: function(event, ui) 
         {
            aSP[array_cell].X = aBlock[array_cell].X = Math.round($("#"+aBlock[array_cell].ID).offset().left);
            aSP[array_cell].Y = aBlock[array_cell].Y = Math.round($("#"+aBlock[array_cell].ID).offset().top);
         }
      }
   );*/
   
   block.mouseover
   (
      {
         id: aSP[array_cell].ID
      },
      function(ev)
      {
         if (($('#popup1').length != 0) && (cur_mo_sp != ev.data.id))
         {
            popupRemove();
         }
         else if (($('#popup1').length != 0) && (cur_mo_sp == ev.data.id))
         {
            bloc = 1;
         }
      }
   );
   
   block.mouseout
   (
      {
         id: aSP[array_cell].ID
      },
      function(ev)
      {
         if (($('#popup1').length != 0) && (cur_mo_sp == ev.data.id))
         {
            bloc = 0;
         }
      }
   );

   /*$('#close_'+ aBlock[array_cell].ID).click(function()
   {
      $('#'+aBlock[array_cell].ID).remove();
      delete aSP[array_cell];
      delete aBlock[array_cell];
   });*/
   
   block.contextMenu
   (
      'context_menu', 
      {
         bindings: 
         {
            "SP_border_settings": function(t) 
            {
               styling_global_id = t.id;
               border_settings_dialog.dialog("open");
            },
            "bg_color": function(t) 
            {
               styling_global_id = t.id;
               bg_color_settings_dialog.dialog("open");
            },
            "content_separator": function(t) 
            {
               styling_global_id = t.id;
               content_separator_settings_dialog.dialog("open");
            },
            "underline": function(t) 
            {    
               styling_global_id = t.id;
               setUnUnderlinedConent();
            },
            "sv_on": function(t)
            {
               switchBlockSV(t.id);
            }
         }
      }
   );
   
   var len = Number(aBlock[array_cell].C);
   var header_str = aBlock[array_cell][cur_language];
   
   if (len == 0)
   {
      var content_str = aBlock[array_cell].content;
   }
   else
   {
      var content_str = aBlock[array_cell].content.substr(0, len);
   }
   
   int1[int1.length] = window.setInterval("onSPdataLoad('" +array_cell + "', '" + aSP[array_cell].ID + "', '"+header_str+"', '"+content_str+"', "+aBlock[array_cell].P+", '"+aBlock[array_cell].D+"', "+int1.length+","+aBlock[array_cell].noHeader+","+aBlock[array_cell].noContent+")", 1000);

   /*block.resizable
   (
      {
         stop: function(event, ui) 
         {
            aSP[array_cell].W = aBlock[array_cell].W = block.width();
            aSP[array_cell].H = aBlock[array_cell].H = block.height();
         },
         resize: function(event, ui)
         {
            $(this).children(".SP_CONTENT").width($(this).width()-29);
            
            $("#"+aSP[array_cell].ID+"_iframe").css
            (
               {
                  "width":$("#"+aSP[array_cell].ID+"_content").width(),
                  "height":$("#"+aSP[array_cell].ID+"_content").height()
               }
            );
            aBlock[array_cell].W = $("#"+aSP[array_cell].ID).width();
            aBlock[array_cell].H = $("#"+aSP[array_cell].ID).height();
            $(this).children(".SP_CONTENT").height($(this).height()-6);
         }
      }
   );*/
}

function gatherData() // сбор данных json для отправки на сервер
{
   var json = {};
   for (var i = 0; i < aBlock.length; i++)
   {  
      if (aBlock[i] != undefined)
      {
         json[aBlock[i].ID] = aBlock[i];
      }
   }
   var result_str = $.toJSON(json);
   alert(result_str);
}

function switchDefault(to) // переключает режим по умолчанию - заданной конфигурации
{
   if (to == false)
   {
      for (var i = 0; i < aBlock.length; i++)
      {
         if (aBlock[i] != undefined)
         {
            var block = $('#'+aBlock[i].ID);
            
            if ((aBlock[i].sv == 0))
            {
               block.css("display", "block");
            }
            
            block.width(aBlock[i].W);
            block.height(aBlock[i].H);
            block.children('.SP_CONTENT').height(block.height()-6).width(block.width()-29);
            block.children('.CLOSE_SP').css("display", "block");
            block.offset({top: aBlock[i].Y, left:aBlock[i].X});
         }
      }
      default_mode = false;
   }
   else
   {
      var aOrder = [];
      var column_width;
      var order_counter_h = 0;
      var order_counter_v = 0;
      var top_line_filled = false;
      var left_line_filling = true;
      
      for (var i = 0; i < aBlock.length; i++)
      {
         if (aBlock[i] != undefined)
         {
            var block = $('#'+aBlock[i].ID);
            
            if ((aBlock[i].sv == 0) && (sv_mode == false))
            {
               block.css("display", "block");
            }
            
            column_width = Math.round($('#LC').width()/cur_columns_number);
            block.width(column_width - 20);
            block.css("height", "6em");
            block.children('.SP_CONTENT').height(block.height()-6).width(block.width()-29);
            block.children('.CLOSE_SP').css("display", "none");
            aOrder[i] = aBlock[i].ordernr;
         }
      }

      aOrder.sort(function(a,b){return a - b});
      
      for (var i = 0; i < aOrder.length; i++)
      {
         for (var z = 0; z < aBlock.length; z++)
         {            
            if ((aBlock[z] != undefined) && (aBlock[z].ordernr == aOrder[i]))
            {  
               if (top_line_filled == false)
               {
                  var block = $('#'+aBlock[z].ID);
                  var top_offset = Math.floor($('#LC').offset().top +10);
                  var left_offset;
                  
                  if (left_line_filling == true)
                  {
                     left_offset = Math.floor($('#LC').offset().left +10);
                     left_line_filling = false;
                  }
                  else
                  {
                     left_offset = Math.floor($('#LC').offset().left + (block.width()*order_counter_h)+(10*(order_counter_h+1)));
                  }
                  block.offset({top: top_offset, left: left_offset});
                  
                  if (order_counter_h == cur_columns_number-1)
                  {
                     top_line_filled = true;
                  }
                  
                  if (sv_mode == true)
                  {
                     if (aBlock[z].sv != 0)
                     {
                        order_counter_h++;
                     }
                  }
                  else if (sv_mode == false)
                  {
                     order_counter_h++;
                  }
               }
               else
               {
                  var block = $('#'+aBlock[z].ID);
                  var top_offset = Math.floor($('#LC').offset().top + (96*order_counter_v)+10); 
                  var left_offset;
          
                  if (left_line_filling == true)
                  {
                     left_offset = Math.floor($('#LC').offset().left +10);
                     left_line_filling = false;
                  }
                  else
                  {
                     left_offset = Math.floor($('#LC').offset().left + (block.width()*order_counter_h)+(10*(order_counter_h+1)));
                  }
                  block.offset({top: top_offset, left: left_offset});
                  
                  if (sv_mode == true)
                  {
                     if (aBlock[z].sv != 0)
                     {
                        order_counter_h++;
                     }
                  }
                  else if (sv_mode == false)
                  {
                     order_counter_h++;
                  }
               }
               
               if (order_counter_h > cur_columns_number-1)
               {
                   if (sv_mode == true)
                  {
                     if (aBlock[z].sv != 0)
                      {order_counter_v++;
                     order_counter_h = 0;}
                  }else
                  if (sv_mode == false)
                  {
                     order_counter_v++;
                     order_counter_h = 0;
                  }
               }
               
               if (order_counter_h == cur_columns_number)
               {
                  left_line_filling = true;
               }
               
               if ((aBlock[z].sv == 0) && (sv_mode == true))
               {
                  block.css("display", "none");
               }                 
            }
         }
      }
      default_mode = true;
   }
}

function switchColumnsNumber(number_value) // переключает количество колонок режима по умолчанию
{
   switchDefault(true);
   if (default_mode == true)
   {
      cur_columns_number = number_value;
      switchDefault(true);
   }
}

function switchSV(to) // переключает сокращённый и полный режимы
{   

   switchDefault(true);
   if (default_mode == true)
   {
      if (to == true)
      {
         sv_mode = true;
         switchDefault(true);
      }
      else
      {
         sv_mode = false;
         switchDefault(true);
      }
   }
}

function getCursorXY(e) // получает текущие координаты курсора
{
   cursor_x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
   cursor_y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

function popup() // инициализирует всплывающее окно блока
{
   var popup = $("<div></div>").attr({"id":"popup1", "class":"popup"}).css({"position":"fixed", "opacity": "0"});
   $(document.body).append(popup);
   $('#popup1').animate({opacity: 1}, 100);
}

function popupRemove() // удаляет всплывающую панель блока
{
   $('#popup1').animate
   (
      {
         opacity: 0
      }, 
      100, 
      function()
      {
         $('#popup1').remove();
      }
   );
}

function renderPopup(sp_id, cur_arr_cell) // отприсовывает всплывающую панель блока
{
   cur_mo_sp = sp_id;
   
   $('#popup1').append("<a id='link_go_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/link_go.png) no-repeat center; width: 16px'><span>Переход по ссылке</span></a>");
   $('#popup1').append("<a id='in_dialog_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/in_dialog.png) no-repeat center; width: 16px'><span>Открытие в диалоговом окне</span></a>");
   $('#popup1').append("<a id='links_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/links.png) no-repeat center; width: 16px'><span>Просмотр связей</span></a>");
   $('#popup1').append("<a id='attachments_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/attach.png) no-repeat center; width: 16px'><span>Просмотр вложений</span></a>");
   $('#popup1').append("<a id='sv_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/sv.png) no-repeat center; width: 16px'><span>Переключение режима просмотра \"сокращённый - полный\"</span></a>");
   $('#popup1').append("<a id='default_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/default.png) no-repeat center; width: 16px'><span>Переключение в режим \"заданной конфигурации\"</span></a>");
   $('#popup1').append("<a id='1_col_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/1_cols.png) no-repeat center; width: 16px'><span>Переключение в режим 1 колонка</span></a>");
   $('#popup1').append("<a id='2_col_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/2_cols.png) no-repeat center; width: 16px'><span>Переключение в режим 2 колонки</span></a>");
   $('#popup1').append("<a id='3_col_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/3_cols.png) no-repeat center; width: 16px'><span>Переключение в режим 3 колонки</span></a>");
   
   $('#in_dialog_a').click
   (
      {
         id: sp_id,
         cell: cur_arr_cell
      },
      function(ev)
      {
         inDialog(ev.data.id, "in_dialog", ev.data.cell);
      }
   );
      
   $('#sv_a').click
   (
      function(ev)
      {
         if (sv_mode == true)
         {
            switchSV(false);
         }
         else
         {
            switchSV(true);
         }
      }
   );
      
   $('#default_a').click
   (
      function(ev)
      {
         switchDefault(false);
      }
   );
      
   $('#1_col_a').click
   (
      function(ev)
      {
         switchColumnsNumber(1);
      }
   );
      
   $('#2_col_a').click
   (
      function(ev)
      {
         switchColumnsNumber(2);
      }
   );
      
   $('#3_col_a').click
   (
      function(ev)
      {
         switchColumnsNumber(3);
      }
   );

   $('#popup1').css({"left":cursor_x-($('#popup1').width()/2),"top":cursor_y-($('#popup1').height()+22)});
}

function isScrolling(id) // проверяет, есть ли в блоке полосы прокрутки
{
   return ((document.getElementById(id).offsetHeight > document.getElementById(id).clientHeight) || (document.getElementById(id).offsetWidth > document.getElementById(id).clientWidth));
}

function inDialog(block_id, operation_type, cell) // выводит невмещающийся в блоке контент в диалоговое окно
{
   if (isScrolling(block_id+"_content") == true)
   {
      $('#in_dialog_content').html(aBlock[cell].content);
      in_dialog_dialog.dialog({width:(screenSize().w*2)/3, height: screenSize().h*0.9, title: aBlock[cell][cur_language]});
      in_dialog_dialog.dialog("open");
   }
}

/*function disableBlockEditing() 
{
   for (var i = 0; i < aBlock.length; i++)
   {
      var block = $('#'+aBlock[i].ID);
      block.resizable("disable");
      block.draggable("disable");
      block.css({"opacity": "1", "cursor": "default"});
   }
   
   $('.SP_CONTENT').css("cursor", "default");
   $('.CLOSE_SP').remove();
}

function disableHeaderEditing(cell)
{
   var block = $('#'+aBlock[cell].ID);
   block.children().children('.sp_content_header').resizable("disable");
   block.children().children('.sp_content_header').css("opacity", "1");
}*/