var aSP = []; // массив json-объектов выбранных паттернов (левый блок)
var aCards = []; // массив json-объектов каждой из карточек на правой панели
var aBlock = []; // массив json-объектов блоков левой панели
var int1 = []; // односекундный интервал для создания эффекта симуляции загрузки с сервера (через секунду пропадает "крутилка" и в SP кладутся данные)
var lc_counter; // глобальный счётчик для создания уникальных ключей-идентификаторов выбранных паттернов
var delete_all_dialog; // параметры диалога удаления всех выбранных паттернов
var counter;
var dummy_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a purus nec tellus vestibulum fermentum. Morbi scelerisque feugiat augue nec pharetra. Suspendisse suscipit tempor sagittis. Fusce suscipit ultricies felis nec sodales. Vestibulum diam leo, auctor in commodo ut, interdum nec lorem. Pellentesque a urna sem, nec ultrices nibh. Maecenas commodo mollis erat, sed semper risus laoreet nec. Proin accumsan tortor et erat luctus venenatis. Aliquam ultricies tincidunt iaculis. Fusce quis pharetra tellus. Mauris in leo nunc. Aenean eleifend eros ut neque tempus molestie. Aliquam laoreet scelerisque lacus sed scelerisque. Quisque elit velit, dignissim et viverra quis, fringilla quis orci. Nunc non lorem turpis. Nunc euismod, tortor vel adipiscing auctor, metus odio ultricies est, a dignissim odio ante at sapien. Phasellus tempor nibh cursus arcu placerat imperdiet. Maecenas molestie, est et luctus hendrerit, magna ligula elementum libero, volutpat semper nibh risus eu turpis. Fusce id odio nisl, in fringilla mauris.Cras commodo, nibh vel tincidunt adipiscing, felis nulla sagittis risus, ac consequat nibh ligula quis libero. Aliquam felis quam,  venenatis at pretium ac, laoreet lacinia felis. Aenean eget velit sed nisi feugiat facilisis ac nec mauris. Praesent fermentum sagittis  est non malesuada. Fusce blandit blandit tortor vitae consequat. Donec tristique congue vestibulum. Donec euismod condimentum dui sit amet pretium. Nullam faucibus consequat ultricies. Cras imperdiet, nibh in faucibus porta, sapien libero faucibus arcu, quis  faucibus dui massa at sem. In eget ipsum in tellus dictum volutpat a id nisl.Morbi luctus bibendum vehicula. Maecenas hendrerit diam non mi volutpat ut porta metus pellentesque. Vivamus ut lacus tortor.  Suspendisse ac tortor sed dolor placerat vulputate. Mauris commodo porta ligula in accumsan. Praesent vulputate faucibus mi,  scelerisque aliquam libero eleifend ut. Donec accumsan vehicula velit, sit amet pellentesque dolor mattis id. Class aptent taciti  sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam malesuada bibendum odio, porta vulputate nulla consequat in. Aliquam nec eros quam, et mollis sem. Sed dignissim felis quis elit porttitor dignissim. Praesent vestibulum lobortis  massa, non laoreet neque imperdiet a. Etiam et leo non metus luctus rutrum. Vestibulum sodales rhoncus tincidunt. Aenean urna eros, tincidunt quis viverra nec, lobortis ac tortor.Nunc id massa non felis pretium bibendum laoreet nec tellus. Integer varius cursus ipsum, vel venenatis nunc vehicula sit amet.  Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed augue sem, eu tincidunt  metus. Suspendisse blandit congue nisi eget pulvinar. In hac habitasse platea dictumst. Suspendisse potenti. Curabitur aliquam pulvinar dolor. Praesent metus felis, blandit non porta id, ultrices vel ipsum. Aliquam eu massa quam, vitae sodales dui. Quisque quis arcu sapien. Maecenas arcu nisi, malesuada eget ultrices id, gravida sit amet risus. Aenean pharetra magna non urna molestie euismod. Vestibulum feugiat lobortis ipsum et blandit. Pellentesque tincidunt porttitor felis, sit amet vestibulum nisl aliquet ut.Ut tempor, sem quis laoreet consequat, neque est luctus arcu, a ullamcorper urna lectus a sapien. Maecenas fermentum aliquet  ipsum ac semper. Pellentesque quis ipsum quam. Cras rhoncus consectetur tincidunt. Cum sociis natoque penatibus et magnis dis  parturient montes, nascetur ridiculus mus. Proin consequat pharetra metus nec egestas. Nulla elementum luctus lorem nec sollicitudin. Aenean metus mi, volutpat id porta eu, luctus et nibh. Curabitur at dui nunc. Nunc sed justo at massa luctus elementum vitae vel nulla. Vestibulum tempor hendrerit elit at sagittis";
var cur_language = "Ru";

$(document).ready
(
   function()
   {
      counter = 0;
      lc_counter = 0;
      resizeUi();
      fill_aCards();
      buildLP();
      buildDeleteAllDialog();
      setEvents();
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
         presetData();
      }
   );
   
   $('#UPLOAD_JSON').click
   (
      function()
      {
         gatherData();
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
               for (var i = 0; i < aCards.length; i++)
               {
                  $('#'+aCards[i].ID).children('.P_COM').html(aCards[i][cur_language]);
                  if (aBlock[i] != undefined)
                  {
                     var len = Number(aBlock[i].C);
                     var header_str = aBlock[i][cur_language];
                     var content_str;
                     if (len == 0)
                     {
                        content_str = dummy_text;
                     }
                     else
                     {
                        content_str = dummy_text.substr(0, len);
                     }
                     if (aBlock[i].P == 0)
                     {
                        $('#'+aBlock[i].ID).children().children('.sp_content_header').html("<strong>"+header_str+"</strong>"+aBlock[i].D+content_str);
                     }
                     else
                     {
                        $('#'+aBlock[i].ID).children().children('.sp_content_header').html("<strong>"+header_str+"</strong>");
                        $('#'+aBlock[i].ID).children().children('.sp_content_content').html(content_str);
                     }
                  }
               }
            }
         );
      }
   );
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

function fill_aCards()
{
   var json = {};
   json.ID = counter;
   json.En = "En_name";
   json.Ru = "Имя";
   json.De = "De_name";
   json.NL = "NL_name";
   json.Len = 40;
   aCards[json.ID] = json;
   
   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_lastname";
   json.Ru = "Фамилия";
   json.De = "De_lastname";
   json.NL = "NL_lastname";
   json.Len = 40;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_bd";
   json.Ru = "Дата рождения";
   json.De = "De_bd";
   json.NL = "NL_bd";
   json.Len = 8;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_city";
   json.Ru = "Город";
   json.De = "De_city";
   json.NL = "NL_city";
   json.Len = 40;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_region";
   json.Ru = "Область";
   json.De = "De_region";
   json.NL = "NL_region";
   json.Len = 40;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_dist";
   json.Ru = "Район";
   json.De = "De_dist";
   json.NL = "NL_dist";
   json.Len = 40;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_edu";
   json.Ru = "Образование";
   json.De = "De_edu";
   json.NL = "NL_edu";
   json.Len = 80;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_spec";
   json.Ru = "Специальность";
   json.De = "De_spec";
   json.NL = "NL_spec";
   json.Len = 80;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_lastjob";
   json.Ru = "Сведения о последнем месте работы";
   json.De = "De_lastjob";
   json.NL = "NL_lastjob";
   json.Len = 240;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_exper";
   json.Ru = "Стаж работы по специальности";
   json.De = "De_exper";
   json.NL = "NL_exper";
   json.Len = 2;
   aCards[json.ID] = json;

   counter++;
   var json = {};
   json.ID = counter;
   json.En = "En_interview";
   json.Ru = "Результаты собеседования";
   json.De = "De_interview";
   json.NL = "NL_interview";
   json.Len = 0;
   aCards[json.ID] = json;

   counter++;
}

function buildLP() // наполнение правого блока (RC) паттернами для выбора. В идеале должны браться с сервера
{
   var w = 0;
   var h = 0;
   
   
   for (var i = 0; i < aCards.length; i++)
   {
      var json = aCards[i];
      $('#LP').append("<div id='"+i+"' class='P'><div id='img_"+i+"' class='P_IMG'></div><div id='comment_"+i+"' class='P_COM'>"+json.Ru+"</div></div>");
      $("#"+i).draggable
      (
         {
            helper:"clone",
            containment: "LC",
            start:function(ev, ui)
            {
               //console.log();
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
      );
   }

   $("#LC").droppable
   (
      {
         accept: ".P",
         drop: function(ev, ui) 
         {
            lc_counter++;
            var element=$(ui.helper).clone();
            element.addClass("tempclass");
            $(this).append(element);
            $('.tempclass').attr("id", $(ui.helper).attr("id")+"_"+lc_counter);
            var droppable_pattern = $("#"+$(ui.helper).attr("id")+"_"+lc_counter);
            droppable_pattern.removeClass("tempclass");
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
            json.D = " ";
            json.Ru = aCards[$(ui.helper).attr("id")].Ru;
            json.En = aCards[$(ui.helper).attr("id")].En;
            json.De = aCards[$(ui.helper).attr("id")].De;
            json.NL = aCards[$(ui.helper).attr("id")].NL;
            json.C = aCards[$(ui.helper).attr("id")].Len;
            var cur_aBlock_cell = aBlock.length;
            aBlock.push(json);
            //-----------------------------------------------------------------
            
            droppable_pattern.draggable
            (
               {
                  containment: "parent",
                  stop: function(event, ui) 
                  {
                     aSP[cur_aSP_cell].X = aBlock[cur_aBlock_cell].X = Math.round($("#"+SPjson.ID).offset().top);
                     aSP[cur_aSP_cell].Y = aBlock[cur_aBlock_cell].Y = Math.round($("#"+SPjson.ID).offset().left);
                  }
               }    
            );
            
            droppable_pattern.html("<div id='" + aSP[cur_aSP_cell].ID + "_content' class='SP_CONTENT'><div id='load_" + aSP[cur_aSP_cell].ID + "' class='LOAD'></div></div><a id='close_" + aSP[cur_aSP_cell].ID + "' href='#'><img src='img/cross.png' style='float:right; margin:5px;' / ></a>");
            $("#close_"+ aSP[cur_aSP_cell].ID).click
            (
               function()
               {
                  $("#"+aSP[cur_aSP_cell].ID).remove();
                  delete aSP[cur_aSP_cell];
                  delete aBlock[cur_aBlock_cell];
               }
            );
            var len = Number(json.C);
            var header_str = json[cur_language];
            if (len == 0)
            {
               var content_str = dummy_text;
            }
            else
            {
               var content_str = dummy_text.substr(0, len);
            }
            int1[int1.length] = window.setInterval("onSPdataLoad('" + aSP[cur_aSP_cell].ID + "', '"+header_str+"', '"+content_str+"', "+json.P+", '"+json.D+"', "+int1.length+")", 1000);
            
            droppable_pattern.resizable
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
                     if ($(this).children().children(".sp_content_content").length != 0)
                     {
                        $(this).children().children(".sp_content_content").height($(this).height()-20);
                     }
                     else
                     {
                        $(this).children().children(".sp_content_header").height($(this).height()-6);
                     }
                  }
               }
            );
         }
      }
   );
}

function onSPdataLoad(sp_id, header_content, content_content, p, d, int_array_cell) // событие по загрузке данных для выбранных паттернов с сервера
{
   $('#load_'+sp_id).remove();
   clearInterval(int1[int_array_cell]);
   if (p == 0)
   {
      $('#'+sp_id+'_content').append("<div id='"+sp_id+"_content_header' class='sp_content_header'></div>");
      $("#"+sp_id+"_content_header").css({"width":"100%", "height":"auto", "overflow":"auto"}).html("<strong>"+header_content+"</strong>"+d+content_content);
      $("#"+sp_id+"_content_header").height($("#"+sp_id+"_content_header").parent().parent().height()-6);
   }
   else
   {
      $('#'+sp_id+'_content').append("<div id='"+sp_id+"_content_header' class='sp_content_header'></div>");//load(data_url);
      $('#'+sp_id+'_content').append("<div id='"+sp_id+"_content_content' class='sp_content_content'></div>");//load(data_url);
      $("#"+sp_id+"_content_header").css({"width":"100%", "height":"auto", "overflow":"auto"}).html("<strong>"+header_content+"</strong>");
      $("#"+sp_id+"_content_content").css({"width":"100%", "overflow":"auto"}).html(content_content);
      $("#"+sp_id+"_content_content").height($("#"+sp_id+"_content_content").parent().parent().height()-20);
      //console.log($("#"+sp_id+"_content_content").parent().parent().height());
   }
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

function presetData() // загрузка заранее сохранённго набора выбранных паттернов в левый блок. в идеале должно браться с сервера
{
   clearLC();
   
   var SPjson = new Object();
   SPjson.ID = '1_1';
   SPjson.W = 300;        
   SPjson.H = 400;
   SPjson.X = 10;
   SPjson.Y = 10;
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
   json.D = " ";
   json.Ru = "Специальность";
   json.En = "En_spec";
   json.De = "De_spec";
   json.NL = "NL_spec";
   json.C = 80;
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   
   var SPjson2 = new Object();
   SPjson2.ID = '1_2';
   SPjson2.W = 300;
   SPjson2.H = 100;
   SPjson2.X = 400;
   SPjson2.Y = 10;
   aSP.push(SPjson2);
   
   var json = {};
   json.ID = SPjson2.ID;
   json.DBID = SPjson2.ID;
   json.P = 0;
   json.W = SPjson2.W;
   json.H = SPjson2.H;
   json.X = SPjson2.X;
   json.Y = SPjson2.Y;
   json.B = 1;
   json.D = " ";
   json.Ru = "Имя";
   json.En = "En_name";
   json.De = "De_name";
   json.NL = "NL_name";
   json.C = 40;
   var cur_aBlock_cell = aBlock.length;
   aBlock.push(json);
   
   for (var i = 0; i < 2; i++)
   {
      createSPfromJson(i);
   }
}

function createSPfromJson(array_cell) // создание выбранного паттерна на основе загруженного с сервера json-объекта. (сечас создаётся локально).
{
   $('#LC').append("<div class='SP' id='"+aSP[array_cell].ID+"' style='position: absolute; width: "+aSP[array_cell].W+"px; height: "+aSP[array_cell].H+"px; left: "+aSP[array_cell].X+"px; top: "+aSP[array_cell].Y+"px;'><div id='" + aSP[array_cell].ID + "_content' class='SP_CONTENT'><div id='load_" + aSP[array_cell].ID + "' class='LOAD'></div></div><a id='close_" + aSP[array_cell].ID + "' href='#'><img src='img/cross.png' style='float:right; margin:5px;' / ></a></div>");
   
   $('#'+aSP[array_cell].ID).draggable(
   {
      containment: 'parent',
      stop: function(event, ui) 
      {
         aSP[array_cell].X = aBlock[array_cell].X = Math.round($("#"+aBlock[array_cell].ID).offset().top);
         aSP[array_cell].Y = aBlock[array_cell].Y = Math.round($("#"+aBlock[array_cell].ID).offset().left);
      }
   });

   $('#close_'+ aSP[array_cell].ID).click(function()
   {
      $('#'+aSP[array_cell].ID).remove();
      delete aSP[array_cell];
      delete aBlock[array_cell];
   });
   
   var len = Number(aBlock[array_cell].C);
   var header_str = aBlock[array_cell][cur_language];
   if (len == 0)
   {
      var content_str = dummy_text;
   }
   else
   {
      var content_str = dummy_text.substr(0, len);
   }
   int1[int1.length] = window.setInterval("onSPdataLoad('" + aSP[array_cell].ID + "', '"+header_str+"', '"+content_str+"', "+aBlock[array_cell].P+", '"+aBlock[array_cell].D+"', "+int1.length+")", 1000);

   $('#'+aSP[array_cell].ID).resizable
   (
      {
         stop: function(event, ui) 
         {
            aSP[array_cell].W = $('#'+aSP[array_cell].ID).width();
            aSP[array_cell].H = $('#'+aSP[array_cell].ID).height();
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
            if ($(this).children().children('.sp_content_content').length != 0)
            {
               $(this).children().children('.sp_content_content').height($(this).height()-20);
            }
            else
            {
               $(this).children().children(".sp_content_header").height($(this).height()-6);
            }
         }
      }
   );
}

function gatherData()
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
