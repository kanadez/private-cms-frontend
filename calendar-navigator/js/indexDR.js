var aEvents = []; // массив выбранных паттернов (левый блок)
var intervals = []; // односекундный интервал для создания эффекта симуляции загрузки с сервера (через секунду пропадает "крутилка" и в SP кладутся данные)
var lc_counter = 0; // глобальный счётчик для создания уникальных ключей-идентификаторов выбранных паттернов
var curYear = 2011;
var radio_error_dialog;
var check_error_dialog;
var delete_event_dialog;
var filtered = 0;


$(document).ready(function()
{
   resizeUi();
   renderYearsRibbon();
   renderMonths();
   setDOMEvents();
   createTestEvents();
   readEvents();
   ////console.log('document ready');
});

var show_overlay_interval = 0;

function setDOMEvents()
{
   buildRadioErrorDialog();
   buildCheckErrorDialog();
   buildDeleteEventDialog();  
   $('#year_next').click(function()
   {
      showOverlay();
      show_overlay_interval = window.setInterval("nextYear()", 1000);
   });
   
   $('#year_prev').click(function()
   {
      showOverlay();
      show_overlay_interval = window.setInterval("prevYear()", 1000);
   });
   
   $('#copy_event').click(function()
   {
      if (copying_active == 0)
      {
         $(this).css('border', '1px solid #eaeaea');
         copying_active = 1;
         $('.day').css('cursor', 'pointer');
      }
      else if (copying_active == 1)
      {
         $(this).css('border', 'none');
         copying_active = 0;
         $('.day').css('cursor', 'default');
      }
   });
   
   $('#delete_event').click(function()
   {
      delete_event_dialog.dialog("open");
   });
   
   $('#date_input').datepicker({dateFormat: 'yy-mm-dd'});
   
   $('#new_event').click(function()
   {
      $('#LP').css('display', 'none');
      $('#D1').css('display', 'block');
      $('#D2').css('display', 'none');
      $('input:checked').each
      (
         function()
         {
            $(this).removeAttr('checked');
         }
      );
      $('#date_input').val('');
      $('#comment_input').val('');
   });
   
   $('#save_button').click(function()
   {
      var error = 0;
      
      if ($("input[@name=image]:checked").val() == null || $('#comment_input').val() == '' || $('#date_input').val() == '')
      {
         error = 1;
      }
      
      if (error == 0)
      {
         insertNewEvent();
         $('#LP').css('display', 'block');
         $('#D1').css('display', 'none');
      }
      else
      {
         radio_error_dialog.dialog('open');
      }
   });
   
   $('#cancel_save_button').click(function()
   {
      $('#LP').css('display', 'block');
      $('#D1').css('display', 'none');
   });
   
   $('#comment_input').focus(function()
   {
      $('#comment_input').css('background', '#fff');
   });
   
   $('#date_input').focus(function()
   {
      $('#date_input').css('background', '#fff');
   });
   
   $('#filter_events').click(function()
   {
      if (filtered == 1)
      {
         $('#filter_button').val("Unfilter");      
      }
      else
      {
         $('#filter_button').val("Filter");
      }
   
      $('input:checked').each
      (
         function()
         {
            $(this).removeAttr('checked');
         }
      );
      $('#LP').css('display', 'none');
      $('#D2').css('display', 'block');
      $('#D1').css('display', 'none');
   });
   
   $('#filter_button').click(function()
   {
      if ($("input[@name=filter_image]:checked").length != 0)
      {
         filterEvents();
         filtered = 1;
         $('#LP').css('display', 'block');
         $('#D2').css('display', 'none');
      }
      else if (($("input[@name=filter_image]:checked").length == 0) && (filtered == 1))
      {
         readEvents();
         filtered = 0;
         $('#LP').css('display', 'block');
         $('#D2').css('display', 'none');
      }
      else
      {
         check_error_dialog.dialog('open');
      }
   });
   
   $("input[name=filter_image]").change(function()
   {
      if (filtered == 1)
      {
         $('#filter_button').val("Filter");
      }
   });
   
   $('#cancel_filter_button').click(function()
   {
      $('#LP').css('display', 'block');
      $('#D2').css('display', 'none');
   });

   $('#post_data_model').click(function()
   {
      postDataModel();
   });
}

function buildRadioErrorDialog() // создание диалога удаления всех выбранных паттернов
{
   radio_error_dialog = $('<div></div>').html("Please set all required event parameters.")
   .dialog(
   {
	   autoOpen: false,
	   title: 'Error creating event',  
	   resizable: false,
		modal: true,
		buttons: 
	   {
		   "OK": function() 
			{
			   $( this ).dialog( "close" );
			}
		}
   });
}

function buildCheckErrorDialog() // создание диалога удаления всех выбранных паттернов
{
   check_error_dialog = $('<div></div>').html("Please check at least one icon.")
   .dialog(
   {
	   autoOpen: false,
	   title: 'Error filtering events',  
	   resizable: false,
		modal: true,
		buttons: 
	   {
		   "OK": function() 
			{
			   $( this ).dialog( "close" );
			}
		}
   });
}

function buildDeleteEventDialog()
{
   delete_event_dialog = $('<div></div>').html("Are you sure you want to delete this event?")
   .dialog(
   {
	   autoOpen: false,
	   title: 'Delete event',  
	   resizable: false,
		modal: true,
		buttons: 
	   {
		   "Yes": function() 
			{
			   deleteEvent();
			   $( this ).dialog( "close" );
			},
			"No": function() 
			{
			   $( this ).dialog( "close" );
			}
		}
   });
}

function showOverlay()
{
   var w = $(document).width();
   var h = $(document).height();
   $('#overlay').width(w).height(h).css({"display": "block", "opacity":"0.8"});
   $(document.body).append("<div id='pls_wait'></div>");
   $('#pls_wait').width(w).height(h).css({"position":"absolute", "top":"0", "left":"0", "color":"#f9f9f9", "font-size":"22px", "text-align":"center", "line-height":h+"px"}).html("Pls wait...");
}

function unshowOverlay()
{
   $('#overlay').css({"display": "none"});
   $('#pls_wait').remove();
}

function createTestEvents()
{
   var event0 = {};
   event0.ID = 'EI_1_18_0';
   event0.Image = 'img/cake.png';
   event0.Date = '2011-02-18';
   event0.Comment = 'comment for EI_0_18';
   
   aEvents[0] = event0;
   
   var event1 = {};
   event1.ID = 'EI_1_18_5';
   event1.Image = 'img/bell.png';
   event1.Date = '2011-02-18';
   event1.Comment = 'comment for EI_2_25';
   
   aEvents[1] = event1;
   
   var event2 = {};
   event2.ID = 'EI_1_18_4';
   event2.Image = 'img/camera.png';
   event2.Date = '2011-02-18';
   event2.Comment = 'comment for EI_4_3';
   
   aEvents[2] = event2;
   
   var event3 = {};
   event3.ID = 'EI_1_18_8';
   event3.Image = 'img/cart.png';
   event3.Date = '2011-02-18';
   event3.Comment = 'comment for EI_4_3';
   
   aEvents[3] = event3;
   
   var event4 = {};
   event4.ID = 'EI_1_12_2';
   event4.Image = 'img/bomb.png';
   event4.Date = '2011-02-12';
   event4.Comment = 'comment for EI_4_3';
   
   aEvents[4] = event4;
   
   var event5 = {};
   event5.ID = 'EI_1_12_9';
   event5.Image = 'img/car.png';
   event5.Date = '2011-02-12';
   event5.Comment = 'comment for EI_4_3';
   
   aEvents[5] = event5;
   
   var event6 = {};
   event6.ID = 'EI_1_12_0';
   event6.Image = 'img/cart.png';
   event6.Date = '2011-02-12';
   event6.Comment = 'comment for EI_4_3';
   
   aEvents[6] = event6;
   
   var event7 = {};
   event7.ID = 'EI_1_12_5';
   event7.Image = 'img/camera.png';
   event7.Date = '2011-02-12';
   event7.Comment = 'comment for EI_4_3';
   
   aEvents[7] = event7;
   
    var event8 = {};
   event8.ID = 'EI_1_12_99';
   event8.Image = 'img/exclamation.png';
   event8.Date = '2011-02-12';
   event8.Comment = 'comment for EI_4_3';
   
   aEvents[8] = event8;
   
    var event9 = {};
   event9.ID = 'EI_1_12_98';
   event9.Image = 'img/cup.png';
   event9.Date = '2011-02-12';
   event9.Comment = 'comment for EI_4_3';
   
   aEvents[9] = event9;
   
}

function renderYearsRibbon()
{
   $('#years_ribbon').html("<a id='year_"+Number(curYear-2)+"' class='year' href='javascript:void(0)'>"+Number(curYear-2)+"</a>");
   $('#years_ribbon').append("<a id='year_"+Number(curYear-1)+"' class='year' href='javascript:void(0)'>"+Number(curYear-1)+"</a>");
   $('#years_ribbon').append("<a id='year_"+curYear+"' class='year' href='javascript:void(0)'>"+curYear+"</a>");
   $('#year_'+Number(curYear)).css('border-color', '#8c8c8c');
   $('#years_ribbon').append("<a id='year_"+Number(curYear+1)+"' class='year' href='javascript:void(0)'>"+Number(curYear+1)+"</a>");
   $('#years_ribbon').append("<a id='year_"+Number(curYear+2)+"' class='year' href='javascript:void(0)'>"+Number(curYear+2)+"</a>");
}

function nextYear()
{
   if (show_overlay_interval != 0)
   {
      clearInterval(show_overlay_interval);
   }
   curYear++;
   renderYearsRibbon();
   renderMonths();
   unshowOverlay();
}

function prevYear()
{
   if (show_overlay_interval != 0)
   {
      clearInterval(show_overlay_interval);
   }
   curYear--;
   renderYearsRibbon();
   renderMonths();
   unshowOverlay();
}

var moving_event = {};
moving_event_array_cell = 0;
moving_event.ID = 0;
moving_event.Image = 0;
moving_event.Comment = 0;
var while_breaker = 1;
var while_counter = 0;

copying_active = 0;

var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function renderMonths()
{ 
   var cells_count = 0;
   $('#YC_UL').html('');
   
   for (var i = 0; i < 12; i++)
   {
      $('#YC_UL').append("<li id='MC_" + i + "' class='MC'><div id='" + i + "_content' class='MC_CONTENT'><div class='events_ribbon_month'>"+months[i]+"</div><div id='events_ribbon_"+i+"' class='events_ribbon'></div><div id='MD_"+i+"' class='days_ribbon'></div></div></li>");
      for (var d = 1; d <= getDaysCount(curYear, i); d++)
      {
         $('#MD_'+i).append("<div id='day_"+i+"_"+d+"' class='day'>"+d+"</div>");
         if (getDayOfTheWeek(curYear, i, d) == 0 || getDayOfTheWeek(curYear, i, d) == 6)
         {
            $('#day_'+i+'_'+d).css('background', '#cacaca');
         }
         $('#day_'+i+'_'+d).click(
         {
            month:i+1,
            day:d
         },
         function(ev)
         {
            copyEvent(ev.data.month, ev.data.day);
         });
         $('#day_'+i+'_'+d).droppable();
         $('#day_'+i+'_'+d).bind
         (
            'drop', 
            {
               month:i+1,
               day:d
            }, 
            function(ev)
            {
               moveEvent(ev.data.month, ev.data.day)
            }
         );
         $('#events_ribbon_'+i).append("<div id='events_col_"+i+"_"+d+"' class='events_col'></div>");
         $('#events_col_'+i+'_'+d).css('width', $('#day_'+i+'_'+d).width()+10);
      }
      
   }
   cells_count = Math.floor($('#events_col_1_1').height()/16);
   
   for (var i = 0; i < 12; i++)
   {
      for (var d = 1; d <= getDaysCount(curYear, i); d++)
      {
         for (var c = 2; c >= 0; c--)
         {
            $('#events_col_'+i+'_'+d).append("<div id='grid_cell_"+i+"_"+d+"_"+c+"'></div>");
            $('#grid_cell_'+i+'_'+d+'_'+c).css(
            {
               'width': $('#day_'+i+'_'+d).width()+8,
               'border': '1px solid #d6d6d6',
               'height': '16px'
         
            });
         }
      }
      
   }

   readEvents();
}

function moveEvent(month, day)
{
   filtered = 0;

   m = String(month);
   d = String(day);
   
   /* вычисляем дату */
   var date = curYear+'-';
   
   if (m.length == 1)
   {
      date += '0'+m+'-';
   }
   else
   {
      date += m+'-';
   }
   
   if (d.length == 1)
   {
      date += '0'+d;
   }
   else
   {
      date += d;
   }

   aEvents[moving_event_array_cell] = 0;        
   
   var event = {};
   event.ID = moving_event.ID;
   event.Image = moving_event.Image;
   event.Date = date;
   event.Comment = moving_event.Comment;
   
   aEvents[aEvents.length] = event;
   
   if ($('#ED_'+moving_event.ID).length != 0)
   {
      $('#comment_'+moving_event.ID).html(date.replace(/-/gi, ".")+"<p>"+moving_event.Comment);
   }
   moving_event = {};
   readEvents();
   
   if ($('#popup1').length != 0)
   {
      $('#popup1').remove();
   }
}

function copyEvent(month, day)
{
   //console.log("copy:"+1);
   if (copying_active == 1 && cur_EI_array_cell != -1)
   {
      //console.log("copy:"+2);
      filtered = 0;
      
      m = String(month);
      d = String(day);
   
      /* вычисляем дату */
      var date = curYear+'-';
   
      if (m.length == 1)
      {
         date += '0'+m+'-';
      }
      else
      {
         date += m+'-';
      }
   
      if (d.length == 1)
      {
         date += '0'+d;
      }
      else
      {
         date += d;
      }
      
      var i = cur_EI_array_cell;
      //console.log("cur_EI_array_cell:"+cur_EI_array_cell);
      var event = {};
      while_breaker = 1;
      while_counter = 0;
      while (while_breaker > 0)
      {
         if ($('#EI_'+month+'_'+day+'_'+while_counter).length != 0)
         {
            while_counter++;
         }
         else
         {
            event.ID = 'EI_'+month+'_'+day+'_'+while_counter;
            while_breaker--;
         }
      }
      event.Image = aEvents[i].Image;
      event.Date = date;
      event.Comment = aEvents[i].Comment;
      aEvents[aEvents.length] = event;

      $('#copy_event').css('border', 'none');
      copying_active = 0;
      $('.day').css('cursor', 'default');
      
      readEvents();
   
      if ($('#popup1').length != 0)
      {
         $('#popup1').remove();
      }
   }
}

function deleteEvent()
{
   if (cur_EI_array_cell != -1)
   {
      var i = cur_EI_array_cell;
      $('#'+aEvents[i].ID).remove();
      $('#ED_'+aEvents[i].ID).remove();
      aEvents[i] = 0;
   
      readEvents();
      
      if ($('#popup1').length != 0)
      {
         $('#popup1').remove();
      } 
   }
}

function getDaysCount(year, month)
{
   return 32 - new Date(year, month, 32).getDate();
}

function getDayOfTheWeek(year, month, day)
{
   var date = new Date(year, month, day);
   return date.getDay();
}

var overflowEvents = [];

function readEvents()
{  
   $('.event').remove();
   
   for (var i = 0; i < aEvents.length; i++)
   {      
      if (aEvents[i] != 0)
      {         
         var parsed_date = parseDate(aEvents[i].Date);
         var year = parsed_date[0];
         var month = Number(parsed_date[1])-1;// месяц преващяется в яваскриптный (0-11)  
         var day = Number(parsed_date[2]);
         if (year == curYear)
         {
            while_breaker = 1;
            while_counter = 0;
            
            while (while_breaker > 0)
            {
               if ( ($('#grid_cell_'+month+'_'+day+'_'+while_counter+':has(a)').length != 0) && ($('#grid_cell_'+month+'_'+day+'_'+while_counter+'>a').attr('id')) != aEvents[i].ID)
               {
                  while_counter++;
               }
               else
               {
                  if (while_counter < 3)
                  {
                     $('#grid_cell_'+month+'_'+day+'_'+while_counter).append("<a id='"+aEvents[i].ID+"' class='event' href='javascript:void(0)'></a>");
                     if ($('#'+month+'_'+day+'_arrow_up').length != 0)
                     {
                        $('#'+month+'_'+day+'_arrow_up').remove();
                     }
                  }
                  else
                  {
                     $('#grid_cell_'+month+'_'+day+'_2').html("<a id='"+month+'_'+day+"_arrow_up' class='event arrow_up' href='javascript:void(0)'>...</a>");
                     $('#'+month+'_'+day+'_arrow_up').click
                     (
                        {
                           month:month,
                           day:day
                        },
                        function(ev)
                        {
                           getCursorXY(ev);
                           popup();
                           eventsScroll(ev.data.month, ev.data.day);
                        }
                     );
                  }
                  while_breaker = 0;
               }
            }
            $('#'+aEvents[i].ID).click(
            {
               ID:aEvents[i].ID, 
               Comment:aEvents[i].Comment,
               Date:aEvents[i].Date,
               cell:i
            },
            function(ev)
            {
               selectEventEI(ev.data.ID, ev.data.Comment, ev.data.Date, ev.data.cell);
            });
            $('#'+aEvents[i].ID).css('width', $('#events_col_'+month+'_'+day).width()-2);
            $('#'+aEvents[i].ID).css('background', "url("+aEvents[i].Image+") no-repeat center");
            $('#'+aEvents[i].ID).draggable(
            { 
               containment: 'document', 
               appendTo: 'body',
               revert: "invalid"
            });
            
            $('#'+aEvents[i].ID).bind(
               "dragstart", 
               {
                  ID:aEvents[i].ID,
                  Image:aEvents[i].Image,
                  Comment:aEvents[i].Comment,
                  array_cell:i
               }, 
               function(event)
               {
                  moving_event.ID = event.data.ID;
                  moving_event.Image = event.data.Image;
                  moving_event.Comment = event.data.Comment;
                  moving_event_array_cell = event.data.array_cell;
               }
            );
         }
      }
   }
   if ($('#ED_'+cur_selected_EI).length != 0)
   {
      for (var i = 0; i < aEvents.length; i++)
      {
         if (aEvents[i].ID == cur_selected_EI)
         {
            selectEventEI(aEvents[i].ID, aEvents[i].Comment, aEvents[i].Date, i);
         }
      }
      
   }

}

var tmpEvents = [];
var cellsNumArray = [];

function eventsScroll(month, day)
{
   
   tmpEvents = [];
   cellsNumArray = [];

   m = String(month+1);
   d = String(day);
   
   /* вычисляем дату */
   var date = curYear+'-';
   
   if (m.length == 1)
   {
      date += '0'+m+'-';
   }
   else
   {
      date += m+'-';
   }
   
   if (d.length == 1)
   {
      date += '0'+d;
   }
   else
   {
      date += d;
   }
   
   var c = 0;
   
   if (filtered == 0)
   {
      for (var i = 0; i < aEvents.length; i++) // выбираем все события, совпадающие с прокручиваемой датой
      {
         if (aEvents[i].Date == date)
         {
            
            tmpEvents[c] = aEvents[i];
            cellsNumArray[c] = i;
            c++;
         }
      }
   }
   else if (filtered == 1)
   {
      for (var i = 0; i < aLastFiltered.length; i++)
      {
         if (aLastFiltered[i].Date == date)
         {
            
            tmpEvents[c] = aLastFiltered[i];
            for (var l = 0; l < aEvents.length; l++) // выбираем все события, совпадающие с прокручиваемой датой
            {
               if (aEvents[l].ID == aLastFiltered[i].ID)
               {
                  cellsNumArray[c] = l;
                  //console.log("l:"+l);
               }
            }
            
            c++;
         }
      }
   }
   
   
   renderEventsForScroll(month, day, cellsNumArray);
}

function renderEventsForScroll(month, day, cells_num_array)
{
   for (var i = 2; i < tmpEvents.length; i++)
   {
      $('#popup1').append("<a id='"+tmpEvents[i].ID+"' class='event' href='javascript:void(0)' style='background:url("+tmpEvents[i].Image+") no-repeat center; width:"+($('#events_col_'+month+'_'+day).width()-2)+"px'></a>");
      
      var event = $('#'+tmpEvents[i].ID);
      
      event.click(
      {  
         ID:tmpEvents[i].ID, 
         Comment:tmpEvents[i].Comment,
         Date:tmpEvents[i].Date,
         cell:cells_num_array[i]
      },
      function(ev)
      {
         selectEventEI(ev.data.ID, ev.data.Comment, ev.data.Date, ev.data.cell);
      });
      
      event.draggable
      (
         { 
            containment: 'document', 
            appendTo: 'body',
            revert: "invalid"
         }
      );
            
      event.bind
      (
         "dragstart", 
         {
            ID:tmpEvents[i].ID,
            Image:tmpEvents[i].Image,
            Comment:tmpEvents[i].Comment,
            array_cell:cells_num_array[i]
         }, 
         function(ev)
         {  
            moving_event.ID = ev.data.ID;
            moving_event.Image = ev.data.Image;
            moving_event.Comment = ev.data.Comment;
            moving_event_array_cell = ev.data.array_cell;
         }
      );
   }
   
   $('#popup1').css({"left":cursor_x-($('#popup1').width()/2),"top":cursor_y-($('#popup1').height()+22)});
   $('#popup1').append("<a id='close_popup' href='javascript:void(0)' class='close_ED' style='margin: 0 0 0 26px;'></a>");
   $('#close_popup').click
   (
      function()
      {
         $('#popup1').remove();   
      }
   );
}

var cur_selected_EI = -1;
var cur_selected_ED = -1;

function parseDate(string)
{
   return string.split("-");filtered = 0;
}

var cur_EI_array_cell = -1;

function selectEventEI(EI_id, EI_comment, EI_date, array_cell)
{
   if ($('#popup1').length != 0)
   {
      $('#popup1').remove();
   }
   
   cur_EI_array_cell = array_cell;
   
   if ($('#ED_'+EI_id).length == 0)
   {
      if (cur_selected_EI != -1)
      {
         $('#'+cur_selected_EI).css('border', 'none');
         $('#'+EI_id).css('width', $('#'+EI_id).width());
      }
      
      cur_selected_EI = EI_id;
      
      $('#'+EI_id).css('border', 'solid 1px #8c8c8c');
      $('#'+EI_id).css('width', $('#'+EI_id).width());
      
      var LP_content = $('#LP').html();
      $('#LP').html("<div id='ED_"+EI_id+"' class='ED' onclick=\"selectEventED('ED_"+EI_id+"', '"+EI_id+"', "+array_cell+")\"><div id='comment_"+EI_id+"' class='ED_COM'>"+EI_date.replace(/-/gi, ".")+"<p>"+EI_comment+"</div><a id='close_"+EI_id+"' href='javascript:void(0)' class='close_ED' onclick=\"onEDclose('#ED_"+EI_id+"')\"></a></div>");
      $('#LP').append(LP_content);
      
      $('#ED_'+EI_id).css('cursor', 'default');
      
      if (cur_selected_ED != -1)
      {
         $('#'+cur_selected_ED).css('background', '#fff');
         $('#'+cur_selected_ED).css('cursor', 'pointer');
      }
      cur_selected_ED = 'ED_'+EI_id;
      $('#ED_'+EI_id).css('background', '#f8f8f8')
   }
   else
   {
      if (cur_selected_EI != -1)
      {
         $('#'+cur_selected_EI).css('border', 'none');
         $('#'+EI_id).css('width', $('#'+EI_id).width());
      }
      
      if (cur_selected_ED != -1)
      {
         $('#'+cur_selected_ED).css('background', '#fff');
         $('#'+cur_selected_ED).css('cursor', 'pointer');
      }
      cur_selected_ED = 'ED_'+EI_id;
      cur_selected_EI = EI_id;
      $('#'+EI_id).css('border', 'solid 1px #8c8c8c');
      $('#'+EI_id).css('width', $('#'+EI_id).width());
      $('#ED_'+EI_id).css('background', '#f8f8f8');
      $('#ED_'+EI_id).css('cursor', 'default');
   }
}

var ED_recently_closed = 0;

function onEDclose(closing_ED)
{
   $(closing_ED).remove();
   $('#'+cur_selected_EI).css('border', 'none');
   //console.log(cur_selected_EI);
   cur_selected_EI = -1;
   cur_selected_ED = -1;
   cur_EI_array_cell = -1;
   ED_recently_closed = 1;
}

function selectEventED(ED_id, EI_id, array_cell)
{
   if ($('#popup1').length != 0)
   {
      $('#popup1').remove();
   }
   
   if (ED_recently_closed == 0)
   {
      //console.log("selectEventED() exe");
      cur_EI_array_cell = array_cell;
      if (cur_selected_EI != EI_id)
      {
         if (cur_selected_EI != -1)
         {
            $('#'+cur_selected_EI).css('border', 'none');
            $('#'+EI_id).css('width', $('#'+EI_id).width());
         }
         cur_selected_EI = EI_id;
         $('#'+EI_id).css('width', $('#'+EI_id).width());
         $('#'+EI_id).css('border', 'solid 1px #8c8c8c');
      }  
      
      if (cur_selected_ED != ED_id)
      {  
         if (cur_selected_ED != -1)
         {
            $('#'+cur_selected_ED).css('background', '#fff');
            $('#'+cur_selected_ED).css('cursor', 'pointer');
         }  
         cur_selected_ED = ED_id;
         //$('#'+ED_id).css('width', $('#'+ED_id).width());
         $('#'+ED_id).css('background', '#f8f8f8');
         $('#ED_'+EI_id).css('cursor', 'default');
      }  
   }
   else
   {
      ED_recently_closed = 0;
   }
}

function insertNewEvent()
{
   
   var parsed_date = parseDate($('#date_input').val());
   var year = parsed_date[0];
   var m = parsed_date[1];
   var d = parsed_date[2];
   
   var date = curYear+'-';
   
   if (m.length == 1)
   {
      date += '0'+m+'-';
   }
   else
   {
      date += m+'-';
   }
   
   if (d.length == 1)
   {
      date += '0'+d;
   }
   else
   {
      date += d;
   }
   
   var event = {};
   while_breaker = 1;
   while_counter = 0;
   while (while_breaker > 0)
   {
      if ($('#EI_'+m+'_'+d+'_'+while_counter).length != 0)
      {
         while_counter++;
      }
      else
      {
         event.ID = 'EI_'+m+'_'+d+'_'+while_counter;
         while_breaker--;
      }
   }
   
   event.Image = $('#'+$("input[@name=image]:checked").val()+'_img').attr('src');
   event.Date = date;
   event.Comment = $('#comment_input').val();

   aEvents[aEvents.length] = event;
   
   readEvents();
}

var aLastFiltered = [];

function filterEvents()
{
   aLastFiltered = [];
   
   $('.event').remove();
   for (var i = 0; i < aEvents.length; i++)
   {
      //$('#'+moving_event.ID).remove();
      if (aEvents[i] != 0)
      {
         var parsed_date = parseDate(aEvents[i].Date);
         var year = parsed_date[0];
         var month = Number(parsed_date[1])-1;// месяц преващяется в яваскриптный (0-11)  
         var day = Number(parsed_date[2]);
         if (year == curYear)
         {
            while_breaker = 1;
            while_counter = 0;
            
            while (while_breaker > 0)
            {
               if( ($('#grid_cell_'+month+'_'+day+'_'+while_counter+':has(a)').length != 0) && ($('#grid_cell_'+month+'_'+day+'_'+while_counter+'>a').attr('id')) != aEvents[i].ID)
               {
                  while_counter++;
               }
               else
               {
                  if (while_counter < 3)
                  {
                     $('input:checked').each
                     (
                        function()
                        {
                           if (aEvents[i].Image == $('#'+$(this).attr('id')+'_img').attr('src'))
                           {
                              aLastFiltered[aLastFiltered.length] = aEvents[i];
                              $('#grid_cell_'+month+'_'+day+'_'+while_counter).append("<a id='"+aEvents[i].ID+"' class='event' href='javascript:void(0)'></a>");
                           }                  
                        }
                     );
                  }
                  else
                  {
                     //console.log(aEvents[i].Date+" : "+aEvents[i].Image);
                     aLastFiltered[aLastFiltered.length] = aEvents[i];
                     $('#grid_cell_'+month+'_'+day+'_2').html("<a id='"+month+'_'+day+"_arrow_up' class='event arrow_up' href='javascript:void(0)'>...</a>");
                     $('#'+month+'_'+day+'_arrow_up').click
                     (
                        {
                           month:month,
                           day:day
                        },
                        function(ev)
                        {
                           getCursorXY(ev);
                           popup();
                           eventsScroll(ev.data.month, ev.data.day);
                        }
                     );
                  }
                  while_breaker = 0;
               }
            }
            $('#'+aEvents[i].ID).click(
            {
               ID:aEvents[i].ID, 
               Comment:aEvents[i].Comment,
               Date:aEvents[i].Date,
               cell:i
            },
            function(ev)
            {
               selectEventEI(ev.data.ID, ev.data.Comment, ev.data.Date, ev.data.cell);
            });
            $('#'+aEvents[i].ID).css('width', $('#events_col_'+month+'_'+day).width()-2);
            $('#'+aEvents[i].ID).css('background', "url("+aEvents[i].Image+") no-repeat center");
            $('#'+aEvents[i].ID).draggable(
            { 
               containment: 'document', 
               appendTo: 'body',
               revert: "invalid"
            });
            
            $('#'+aEvents[i].ID).bind(
               "dragstart", 
               {
                  ID:aEvents[i].ID,
                  Image:aEvents[i].Image,
                  Comment:aEvents[i].Comment,
                  array_cell:i
               }, 
               function(event)
               {
                  moving_event.ID = event.data.ID;
                  moving_event.Image = event.data.Image;
                  moving_event.Comment = event.data.Comment;
                  moving_event_array_cell = event.data.array_cell;
               }
            );         
         }
      }
   }
}

function postDataModel()
{
   var str = "[";
   var first = 0;
   var array_empty = 1;
   
   for (var i = 0; i < aEvents.length; i++)
   {
      if (aEvents[i] != 0)
      {
         array_empty = 0;
         if (first == 0)
         {
            str += "'"+aEvents[i].ID+"':['Comment':'"+aEvents[i].Comment+"', 'Date':'"+aEvents[i].Date+"', 'Image':'"+aEvents[i].Image+"']";
            first = 1;
         }
         else
         {
            str += ",'"+aEvents[i].ID+"':['Comment':'"+aEvents[i].Comment+"', 'Date':'"+aEvents[i].Date+"', 'Image':'"+aEvents[i].Image+"']";
         }
      }
   }
   str += "]";
   
   if (array_empty == 1)
   {
      alert("There are no events.");
   }
   else
   {
      alert(str);
   }
}
