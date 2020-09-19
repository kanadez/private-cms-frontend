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
      getICardsData();
      //fill_aCards();
      setEvents();
   }
);

function setEvents() // задание событий для DOM-объектов (статических, то есть находящихся на странице 100% времени) 
{
   $('#wrap').mouseover
   (
      function(ev)
      {     
         if ($('#popup1').length != 0 && bloc == 0)
         {
            $('#popup1').remove();
         }
      }
   );
   
   buildInDialogDialog();
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

var ints;

function getICardsData()
{
   ints = window.setInterval("buildICards('icards_block')", 1000);
}

function buildICards(icards_block_id)
{
   

   // сводный json получается с сервера в виде строки и преобразовывается в объект, затем
   $('.icard_wrapper').css({"background": "", "opacity": "0"});
   
   clearInterval(ints);
   
   var object = 
   {
      doc1 : 
      {
         doc : "doc1",
         title_field1 : "Фамилия",
         content_field1 : "Кукушка",
         title_field2 : "Имя",
         content_field2 : "Родион",
         title_field3 : "Должность",
         content_field3 : "Старший менеджер",
         title_field4 : "Статус",
         content_field4 : "Уволен"
      },
      doc2 : 
      {
         doc : "doc2",
         title_field1 : "Наименование",
         content_field1 : "Война и Мир",
         title_field2 : "Автор",
         content_field2 : "Л. Толстой",
         title_field3 : "Статус",
         content_field3 : "Читается читателем",
         title_field4 : "Имя читателя",
         content_field4 : "Кукушка Родион Геннадьевич"
      },
      doc3 : 
      {
         doc : "doc3",
         title_field1 : "Наименование товара",
         content_field1 : "Пылесос BOSCH P101",
         title_field2 : "Дата покупки",
         content_field2 : "13.05.1998",
         title_field3 : "Сумма покупки",
         content_field3 : "5000 руб 00 коп",
         title_field4 : "Спасибо",
         content_field4 : "за покупку!"
      }
   };
   //<div id="ICARD_doc1" class="icard"><div id="ICARD_1_field_1" class="field"><div id="ICARD_1_field_1_header" class="field_header"></div><div id="ICARD_1_field_1_content" class="field_content"></div></div><div id="ICARD_1_field_2" class="field"><div id="ICARD_1_field_2_header" class="field_header"></div><div id="ICARD_1_field_2_content" class="field_content"></div></div><div id="ICARD_1_field_3" class="field"><div id="ICARD_1_field_3_header" class="field_header"></div><div id="ICARD_1_field_3_content" class="field_content"></div></div><div id="ICARD_1_field_4" class="field"><div id="ICARD_1_field_4_header" class="field_header"></div><div id="ICARD_1_field_4_content" class="field_content"></div></div></div>
   for (var c in object)
   {
      if (!object.hasOwnProperty(c)) continue;
      var document_id = c;
      var object2 = object[c];
      
      $('#ICARD_'+document_id).children('.icard_wrapper').mouseenter
      (
         {
            id: '#ICARD_'+document_id
         },
         function(ev)
         {
            bloc = 1;
            if ($('#popup1').length == 0)
            {
               getCursorXY(ev);
               popup();
               renderPopup(ev.data.id, 0);
               
            }
            else if ($('#popup1').length != 0 && cur_mo_sp != ev.data.id)
            {
               $('#popup1').remove();
               getCursorXY(ev);
               popup();
               renderPopup(ev.data.id, 0);
            }
            
            
            /*if (($('#popup1').length != 0) && (cur_mo_sp == ev.data.id))
            {
               bloc = 1;
            }
            
            if (($('#popup1').length != 0) && (cur_mo_sp != ev.data.id))
            {
               popupRemove();
            }
            
            if ($('#popup1').length == 0)
            {
               getCursorXY(ev);
               popup();
               renderPopup(ev.data.id, 0);
            }*/
         }
      );
      
      $('#ICARD_'+document_id).children('.icard_wrapper').mouseleave
      (
         {
            id: '#ICARD_'+document_id
         },
         function(ev)
         {
            if (($('#popup1').length != 0) && (cur_mo_sp == ev.data.id))
            {
               bloc = 0;
            }
            bloc = 0;
         }
      );
      
      for (var c in object2)
      {
         if (!object2.hasOwnProperty(c)) continue;
         var field_name = c;
         var field_data = object2[c];
         var a = field_name.split("_");
         //console.log(a[1]);
         if (a[0] == "title")
         {
            $('#'+icards_block_id).children('#ICARD_'+document_id).children('#'+a[1]).children('#header').html(field_data+"&nbsp;");
         }
         if (a[0] == "content")
         {
            $('#'+icards_block_id).children('#ICARD_'+document_id).children('#'+a[1]).children('#content').html(field_data);
            /*if (isScrolling("#ICARD_"+document_id+" > #"+a[1]+" > #content"))
            {
               console.log(a[1]);
            }*/
         }
      }
   }
}

function isScrolling(id) // проверяет, есть ли в блоке полосы прокрутки
{
   var el = $(id)[0];
   return ((el.scrollHeight > el.clientHeight) || (el.scrollWidth > el.clientWidth));
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

function popupRemove(cur_mo_sp_id) // удаляет всплывающую панель блока
{
   $('#popup1').animate
   (
      {
         opacity: 0
      }, 
      100, 
      function()
      {
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
   $('#popup1').append("<a id='default_a' class='event tooltip' href='javascript:void(0)' style='background:url(img/default.png) no-repeat center; width: 16px'><span>Переключение в режим \"заданной конфигурации\"</span></a>");
   
   $('#in_dialog_a').click
   (
      {
         id: sp_id
      },
      function(ev)
      {
         inDialog(ev.data.id);
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

function inDialog(icard_id) // выводит невмещающийся в блоке контент в диалоговое окно
{
   console.log(icard_id);
   $('#in_dialog_content').html($(icard_id).html());
   in_dialog_dialog.dialog({width:(screenSize().w*2)/3, height: screenSize().h*0.9});
   in_dialog_dialog.dialog("open");
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