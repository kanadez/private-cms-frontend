var aSP = []; // массив json-объектов выбранных паттернов (левый блок)
var aCards = []; // массив json-объектов каждой из карточек на правой панели
var int1 = []; // односекундный интервал для создания эффекта симуляции загрузки с сервера (через секунду пропадает "крутилка" и в SP кладутся данные)
var lc_counter = 0; // глобальный счётчик для создания уникальных ключей-идентификаторов выбранных паттернов
var delete_all_dialog; // параметры диалога удаления всех выбранных паттернов
var counter = 0;

$(document).ready
(
   function()
   {
      resizeUi();
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
   
   $('#LOAD_SAVED_STATE').click
   (
      function()
      {
         loadPreconfiguredSPset();
      }
   );
}

function buildDeleteAllDialog() // создание диалога удаления всех выбранных паттернов
{
   delete_all_dialog = $('<div></div>').html("These items in the left side will be permanently deleted and cannot be recovered. Are you sure?")
   .dialog(
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
   });
}

function fill_aCards()
{
   var json = {};
   json.ID = counter;
   json.En = "En";
   json.Ru = "Имя";
   json.De = "De";
   json.NL = "NL";
   json.Len = 40;
   aCards.push(json);
   
   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Фамилия";
   json.De = "De";
   json.NL = "NL";
   json.Len = 40;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Дата рождения";
   json.De = "De";
   json.NL = "NL";
   json.Len = 8;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Город";
   json.De = "De";
   json.NL = "NL";
   json.Len = 40;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Область";
   json.De = "De";
   json.NL = "NL";
   json.Len = 40;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Район";
   json.De = "De";
   json.NL = "NL";
   json.Len = 40;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Образование";
   json.De = "De";
   json.NL = "NL";
   json.Len = 80;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Специальность";
   json.De = "De";
   json.NL = "NL";
   json.Len = 80;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Сведения о последнем месте работы";
   json.De = "De";
   json.NL = "NL";
   json.Len = 240;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Стаж работы по специальности";
   json.De = "De";
   json.NL = "NL";
   json.Len = 2;
   aCards.push(json);

   counter++;
   
   json.ID = counter;
   json.En = "En";
   json.Ru = "Результаты собеседования";
   json.De = "De";
   json.NL = "NL";
   json.Len = 0;
   aCards.push(json);

   counter++;
}

function buildLP() // наполнение правого блока (RC) паттернами для выбора. В идеале должны браться с сервера
{
   var w = 0;
   var h = 0;
   
   $('#LP').append("<div id='1' class='P'><div id='img_1' class='P_IMG'></div><div id='comment_1' class='P_COM'>comment 1</div></div>");
   $('#LP').append("<div id='2' class='P'><div id='img_2' class='P_IMG'></div><div id='comment_2' class='P_COM'>comment 2</div></div>");
   $('#LP').append("<div id='3' class='P'><div id='img_3' class='P_IMG'></div><div id='comment_3' class='P_COM'>comment 3</div></div>");
   $('#LP').append("<div id='4' class='P'><div id='img_4' class='P_IMG'></div><div id='comment_4' class='P_COM'>comment 4</div></div>");
   $('#LP').append("<div id='5' class='P'><div id='img_5' class='P_IMG'></div><div id='comment_5' class='P_COM'>comment 5</div></div>");
   $('#LP').append("<div id='6' class='P'><div id='img_6' class='P_IMG'></div><div id='comment_6' class='P_COM'>comment 6</div></div>");
   $('#LP').append("<div id='7' class='P'><div id='img_7' class='P_IMG'></div><div id='comment_7' class='P_COM'>comment 7</div></div>");

   $(".P").draggable(
   {
      helper:'clone',
      containment: 'LC',
      start:function(ev, ui)
      {
         w = $('.P').css('width');
         h = $('.P').css('height');
         $(ui.helper).css({'width':w, 'height':h});
      },
      stop:function(ev, ui) 
      {
      	var pos=$(ui.helper).offset();
      	objName = "#"+$(ui.helper).attr('id')+'_'+lc_counter;
      	$(objName).css(
      	{
      	   "left":pos.left,
      	   "top":pos.top
   	   });
   	   
      	$(objName).removeClass("P");
      }
   });

   $("#LC").droppable(
   {
      accept: '.P',
      drop: function(ev, ui) 
      {
		   lc_counter++;
		   var element=$(ui.helper).clone();
			element.addClass("tempclass");
			$(this).append(element);
			$(".tempclass").attr("id", $(ui.helper).attr('id')+'_'+lc_counter);
			var droppable_pattern = $("#"+$(ui.helper).attr('id')+'_'+lc_counter);
			droppable_pattern.removeClass("tempclass");
			itemDragged = "SP";
			droppable_pattern.css(
			{
			   'width':w,
			   'height':h
			});
			droppable_pattern.addClass(itemDragged);
			
			droppable_pattern.draggable(
         {
            containment: 'parent',
            stop: function(event, ui) 
  	         {
               aSP[cell].X = $('#'+SPjson.ID).offset().top;
               aSP[cell].Y = $('#'+SPjson.ID).offset().left;
  	         }
         });
         
            var SPjson = new Object();
            SPjson.ID = $(ui.helper).attr('id')+'_'+lc_counter;
            SPjson.W = $('#'+SPjson.ID).css('width');
            SPjson.H = $('#'+SPjson.ID).css('height');
            SPjson.X = $('#'+SPjson.ID).offset().top;
            SPjson.Y = $('#'+SPjson.ID).offset().left;
         
            var cell = aSP.length;
            
            aSP[cell] = SPjson;
            
            droppable_pattern.html("<div id='" + aSP[cell].ID + "_content' class='SP_CONTENT'><div id='load_" + aSP[cell].ID + "' class='LOAD'></div></div><a id='close_" + aSP[cell].ID + "' href='#'><img src='img/cross.png' style='float:right; margin:5px;' / ></a>");
            $('#close_'+ aSP[cell].ID).click(function()
            {
               $('#'+aSP[cell].ID).remove();
               aSP[cell] = 0;
            });
            
            int1[int1.length] = window.setInterval("onSPdataLoad('" + aSP[cell].ID + "', '"+cell+".html', "+int1.length+")", 1000);
         
     	      droppable_pattern.resizable(
     	      {
     	         stop: function(event, ui) 
     	         {
  	               aSP[cell].W = $('#'+SPjson.ID).css('width');
  	               aSP[cell].H = $('#'+SPjson.ID).css('height');
     	         },
     	         resize: function(event, ui)
     	         {
     	            $('#'+aSP[cell].ID+'_iframe').css(
     	            {
     	               'width':$('#'+aSP[cell].ID+'_content').width(),
     	               'height':$('#'+aSP[cell].ID+'_content').height()
  	               });
     	         }
  	         });
  	   }
   });
}

function onSPdataLoad(sp_id, data_url, int_array_cell) // событие по загрузке данных для выбранных паттернов с сервера
{
   $('#load_'+sp_id).remove();
   clearInterval(int1[int_array_cell]);
   $('#'+sp_id+'_content').load(data_url);
}

function clearLC() // очистка левого блока от выбранных паттернов. очищается и массив тоже
{
   for (var i = 0; i < aSP.length; i++)
   {
      if (aSP[i] != 0)
      {
         $('#'+aSP[i].ID).remove();
      }
   }
   
   aSP = new Array();
}

function loadPreconfiguredSPset() // загрузка заранее сохранённго набора выбранных паттернов в левый блок. в идеале должно браться с сервера
{
   clearLC();

   var SPjson = new Object();
   SPjson.ID = '1_1';
   SPjson.W = '300px';        
   SPjson.H = '400px';
   SPjson.X = '10px';
   SPjson.Y = '10px';
   aSP[0] = SPjson;
   
   var SPjson2 = new Object();
   SPjson2.ID = '1_2';
   SPjson2.W = '300px';
   SPjson2.H = '100px';
   SPjson2.X = '400px';
   SPjson2.Y = '10px';
   aSP[1] = SPjson2;
   
   var SPjson3 = new Object();
   SPjson3.ID = '1_3';
   SPjson3.W = '300px';
   SPjson3.H = '100px';
   SPjson3.X = '400px';
   SPjson3.Y = '250px';
   aSP[2] = SPjson3;
   
   for (var i = 0; i < 3; i++)
   {
      createSPfromJson(i);
   }
}

function createSPfromJson(array_cell) // создание выбранного паттерна на основе загруженного с сервера json-объекта. (сечас создаётся локально).
{
   $('#LC').append("<div class='SP' id='"+aSP[array_cell].ID+"' style='position: absolute; width: "+aSP[array_cell].W+"; height: "+aSP[array_cell].H+"; left: "+aSP[array_cell].X+"; top: "+aSP[array_cell].Y+";'><div id='" + aSP[array_cell].ID + "_content' class='SP_CONTENT'><div id='load_" + aSP[array_cell].ID + "' class='LOAD'></div></div><a id='close_" + aSP[array_cell].ID + "' href='#'><img src='img/cross.png' style='float:right; margin:5px;' / ></a></div>");
   
   $('#'+aSP[array_cell].ID).draggable(
   {
      containment: 'parent',
      stop: function(event, ui) 
      {
         aSP[array_cell].X = $('#'+aSP[array_cell].ID).offset().top;
         aSP[array_cell].Y = $('#'+aSP[array_cell].ID).offset().left;
      }
   });

   $('#close_'+ aSP[array_cell].ID).click(function()
   {
      $('#'+aSP[array_cell].ID).remove();
      aSP[array_cell] = 0;
   });
         
   int1[int1.length] = window.setInterval("onSPdataLoad('" + aSP[array_cell].ID + "', '" +array_cell+".html' , "+int1.length+")", 1000);

   $('#'+aSP[array_cell].ID).resizable(
   {
      stop: function(event, ui) 
      {
         aSP[array_cell].W = $('#'+aSP[array_cell].ID).css('width');
         aSP[array_cell].H = $('#'+aSP[array_cell].ID).css('height');
      }
   });
}


