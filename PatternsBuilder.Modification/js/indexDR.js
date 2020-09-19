var aSP = []; // массив выбранных паттернов, перетёк из модели данных самой первой версии данного приложения
var aInts = []; // массив интервалов для получения данных с сервера
var aKS = []; // массив шаблонов. в данном приложениии один шаблон всегда.
var aGlobal = []; // глобальный массив хранения полей шаблона
var cur_KS = "ks_0"; // id текущего шаблона
var cur_KNP = ""; // id текущего поля
var lc_counter = 0; // счётчик для создания уникальных id для каждого элемента. для эмуляции общения с сервером
var pattern_receiving_state = 0; // стадия полученя сохранённого шаблона с сервера. всего 3 стадии
var form_view_1 = "<div id='wrap_KNP' class='wrap_KNP wrap_KNP_ns'><div id='ceil' class='horizontal_block'><div id='ceil_left'><div id='label1'>text for label1</div><div id='label2'>text for label2</div></div><div id='ceil_right'><input id='TXT1' class='fname fname_ns' /><select id='PD' name='language_select' class='pd_language pd_language_ns'><option>Ru</option><option>En</option><option>De</option><option>NL</option></select></div></div><div id='ftitle_div'><div id='radio0_div' class='radio'><input id='ftitle_radio0' type='radio' name='ftitle_radio' value='ftitle_radio0' class='check_radio ftitle_radio0' checked='checked'/><label for='ftitle_radio0'>Text</label></div><div id='radio1_div' class='radio'><input id='ftitle_radio1' type='radio' name='ftitle_radio' value='ftitle_radio1' class='check_radio ftitle_radio1' /><label for='ftitle_radio1'>HTML</label></div><div id='TXT2_div'><textarea id='TXT2' class='ftitle ftitle_ns' rows='3'></textarea><textarea id='TXT2_editor' class='ftitle ftitle_ns_editor' rows='3'></textarea></div></div><div id='ACC' class='ACC'><h3><a href='javascript:void(0)'>Основной тип</a></h3><div id='section_1_div' class='ACC_section ACC_section_1 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Прикладные настройки</a></h3><div id='section_2_div' class='ACC_section ACC_section_2 ACC_section_ns'><div class='load_acc_section'></div></div></div></div></div>";
var form_view_2 = "<div id='wrap_KNP' class='wrap_KNP wrap_KNP_ns'><div id='ceil' class='horizontal_block'><div id='ceil_left'><div id='label1'>text for label1</div><div id='label2'>text for label2</div></div><div id='ceil_right'><input id='TXT1' class='fname fname_ns' /><select id='PD' name='language_select' class='pd_language pd_language_ns'><option>Ru</option><option>En</option><option>De</option><option>NL</option></select></div></div><div id='ftitle_div'><div id='radio0_div' class='radio'><input id='ftitle_radio0' type='radio' name='ftitle_radio' value='ftitle_radio0' class='check_radio ftitle_radio0' checked='checked'/><label for='ftitle_radio0'>Text</label></div><div id='radio1_div' class='radio'><input id='ftitle_radio1' type='radio' name='ftitle_radio' value='ftitle_radio1' class='check_radio ftitle_radio1' /><label for='ftitle_radio1'>HTML</label></div><div id='TXT2_div'><textarea id='TXT2' class='ftitle ftitle_ns' rows='3'></textarea><textarea id='TXT2_editor' class='ftitle ftitle_ns_editor' rows='3'></textarea></div></div><div id='ACC' class='ACC'><h3><a href='javascript:void(0)'>Основной тип</a></h3><div id='section_1_div' class='ACC_section ACC_section_1 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Прикладные настройки</a></h3><div id='section_2_div' class='ACC_section ACC_section_2 ACC_section_ns'><div class='load_acc_section'></div></div> <h3><div class='header_panel'><a id='links' href='javascript:void(0)' class='acc_icon tooltip'><img src='img/link.png' /><span>Связи</span></a><a id='classification' href='javascript:void(0)' class='acc_icon tooltip'><img src='img/class.png' /><span>Классификация</span></a><a id='events' href='javascript:void(0)' class='acc_icon tooltip'><img src='img/clock.png' /><span>События</span></a><a id='tickets' href='javascript:void(0)' class='acc_icon tooltip'><img src='img/tick.png' /><span>Допуски</span></a><a id='filters' href='javascript:void(0)' class='acc_icon tooltip'><img src='img/filter.gif' /><span>Фильтры отображения</span></a><a id='attachments' href='javascript:void(0)' class='acc_icon tooltip'><img src='img/page_attach.png' /><span>Присоединённые документы и вложения</span></a></div></h3><div id='header_panel_acc_content' class='header_panel_ACC_section' ></div></div></div>";

$(document).ready
(
   function()
   {
      //window.resizeTo(1024, 600);
      resizeUi();
      setDomEvents();
      addField("header", 1);
   }
);

function setDomEvents() // задаёт события для статичных контролов приложения
{
   $('#post_json').click
   (
      function()
      {
         alert(gatherPatternData());
      }
   );
   
   $('#get_json').click
   (
      function()
      {
         receivePatternPrepare();
      }
   );

   $('#add_field').click
   (
      function()
      {  
         addField(counter, 1);
      }
   );   
}

function addField(selected_pattern_id, view_mode) // добавляет поле в шаблон
{
   lc_counter++;
   var id = selected_pattern_id + '_' + lc_counter;
   var cell = aSP.length;
   aSP.push(id);
   
   if (selected_pattern_id == "header")
   {
      $('#LC_UL').append("<li id='" + id + "' class='SP sp_header'><div id='" + id + "_content' class='SP_CONTENT'><div id='load_" + id + "' class='LOAD'></div></div><a id='resize_" + id + "' href='javascript:void(0)'><img src='img/arrow_in.png' style='float:right; margin:5px;' / ></a></li>");
      header_pattern_gui = 0;
   }
   else
   {
      $('#LC_UL').append("<li id='" + id + "' class='SP'><div id='" + id + "_content' class='SP_CONTENT'><div id='load_" + id + "' class='LOAD'></div></div><a id='close_" + id + "' href='javascript:void(0)'><img src='img/cross.png' style='float:right; margin:5px;' / ></a><a id='resize_" + id + "' href='javascript:void(0)'><img src='img/arrow_in.png' style='float:right; margin:5px;' / ></a></li>");
      $('#close_'+ id).click
      (
         function()
         {
            deleteKS($(this));
            $('#'+id).remove();
            aSP[cell] = 0;
         }
      );
   }
   
   $('#resize_'+ id).click
   (
      function()
      {
         if ($('#'+id+ '_content').height() > 57)
         {
            $('#'+id+ '_content').height(57);
            $(this).html("<img src='img/arrow_out.png' style='float:right; margin:5px;' / >");
         }
         else if ($('#'+id+ '_content').height() == 57)
         {
            $('#'+id+ '_content').css("height", "auto");
            $(this).html("<img src='img/arrow_in.png' style='float:right; margin:5px;' / >");
         }
      }
   );
      
   aInts[aInts.length] = window.setInterval("fieldPrepare('" + id + "', "+aInts.length+", "+view_mode+")", 1000);
   $('#LC').scrollTop($("#LC").get(0).scrollHeight);
}

function fieldPrepare(sp_id, int_array_cell, view_mode) // подготавливает поле шаблона к формированию
{
   clearInterval(aInts[int_array_cell]);
   initDataModel();
   var TMPjson;
   
   if (view_mode == 1)
   {
      TMPjson = 
      {
         form : form_view_1,
         formdata: 
         {
            fname : "", 
            ftitle : 
            {
               Ru: "",
               En: "",
               De: "",
               NL: ""
            }, 
            settings : 0
         }
      }
   }
   else if (view_mode == 2)
   {
      TMPjson = 
      {
         form : form_view_2,
         formdata: 
         {
            fname : "", 
            ftitle : 
            {
               Ru: "",
               En: "",
               De: "",
               NL: ""
            }, 
            settings : 0
         }
      }
   }

   $('#load_'+sp_id).remove();
   onFieldPrepared(TMPjson, sp_id);
}

function onFieldPrepared(json_obj, sp_id) // событие после подготовки
{
   $("#"+sp_id+"_content").html(json_obj.form);
   
   if ($('.header_panel').length != 0)
   {
      $('.header_panel').height($('.ui-accordion-header').height());
      
      $('.acc_icon').mouseover
      (
         function()
         {
            $('.ACC').accordion({collapsible:false});
         }
      );

      $('.acc_icon').mouseout
      (
         function()
         {
            $('.ACC').accordion({collapsible:true});
         }
      );
      
      setHeaderPanelEvents(sp_id);
   }
   
   PTNjson.fname = json_obj.formdata.fname;
   PTNjson.ftitle.Ru = json_obj.formdata.ftitle.Ru;
   PTNjson.ftitle.En = json_obj.formdata.ftitle.En;
   PTNjson.ftitle.De = json_obj.formdata.ftitle.De;
   PTNjson.ftitle.NL = json_obj.formdata.ftitle.NL;
   PTNjson.settings = json_obj.formdata.settings;
   resetKNPIids();
   setKNPEvents($("#"+sp_id+"_content").children(".wrap_KNP"));
}

function setHeaderPanelEvents(sp_id) // задаёт события для панели иконок третьей вкладки аккордеона второго вида
{
   $('#'+sp_id).children().children().children().children().children().children('#links').click
   (
      function()
      {
         $('#'+sp_id).children().children().children().children('.header_panel_ACC_section').load
         (
            'Links.html',
            function(ev)
            {
               
            }
         );
      }
   );
   
   $('#'+sp_id).children().children().children().children().children().children('#classification').click
   (
      function()
      {
         $('#'+sp_id).children().children().children().children('.header_panel_ACC_section').load
         (
            'Classification.html',
            function(ev)
            {
            
            }
         );
      }
   );
   
   $('#'+sp_id).children().children().children().children().children().children('#events').click
   (
      function()
      {
         $('#'+sp_id).children().children().children().children('.header_panel_ACC_section').load
         (
            'Events.html',
            function(ev)
            {
            
            }
         );
      }
   );
   
   $('#'+sp_id).children().children().children().children().children().children('#tickets').click
   (
      function()
      {
         $('#'+sp_id).children().children().children().children('.header_panel_ACC_section').load
         (
            'Tickets.html',
            function(ev)
            {
            
            }
         );
      }
   );
   
   $('#'+sp_id).children().children().children().children().children().children('#filters').click
   (
      function()
      {
         $('#'+sp_id).children().children().children().children('.header_panel_ACC_section').load
         (
            'Filters.html',
            function(ev)
            {
            
            }
         );
      }
   );
   
   $('#'+sp_id).children().children().children().children().children().children('#attachments').click
   (
      function()
      {
         $('#'+sp_id).children().children().children().children('.header_panel_ACC_section').load
         (
            'Attachments.html',
            function(ev)
            {
            
            }
         );
      }
   );
}

function gatherPatternData() // выполняет сборку всех данных в json и отправку на сервер
{
   if (getAssocArrayLength(aKS) )
   {
      str = "[";
      for (var i = 0; i < aGlobal.length; i++)
      {
         var ks = aGlobal[i];
         jQuery.each
         (
            ks, 
            function(key, val) 
            { 
               var ks_key = ks[key]; 
               str += "'patternid' : "+key+" ";
               for(var c in ks_key) 
               {
                  if (!ks_key.hasOwnProperty(c)) continue;
                  
                  str += "'"+c+"':[";
                  str += "'fname': '"+ks_key[c]["fname"]+"',";
                  str += "'ttype': '"+ks_key[c]["ttype"]+"',";
                  str += "'ftitle': ['Ru':'"+ks_key[c]["ftitle"]["Ru"]+"',";
                  str += "'En':'"+ks_key[c]["ftitle"]["En"]+"',";
                  str += "'De':'"+ks_key[c]["ftitle"]["De"]+"',";
                  str += "'NL':'"+ks_key[c]["ftitle"]["NL"]+"'], 'settings': [";
                  var m = 0;
                  jQuery.each
                  (
                     ks_key[c]["settings"], 
                     function(key, val) 
                     { 
                        if (m == 1)
                        {
                           str += (",'"+key+"': [");
                        }
                        else
                        {
                           str += ("'"+key+"': [");
                        }
                        var z = 0;
                        jQuery.each
                        (
                           ks_key[c]["settings"][key], 
                           function(key, val) 
                           { 
                              if (val != "")
                              {
                                 if (z == 0)
                                 {
                                    str += ("'"+key+"': '"+val+"'");
                                    z = 1;
                                 }
                                 else
                                 {
                                    str += (",'"+key+"': '"+val+"'");
                                 }
                              }
                           }
                        );
                        str += "]";  
                        m = 1; 
                     }
                  ); 
                  str += "]";               
               }
            }
         );       
      }
      return str; 
   }
   else
   {
      return "There are no opened patterns";
   }
}

function getAssocArrayLength(tempArray) // возвращает длину ассоциативного массива 
{
   var result = 0;
   for (tempValue in tempArray) 
   {
      result++;
   }
	
   return result;
}

function receivePatternPrepare() // подготовка к получению сохранённого шаблона с сервера
{
   var SP_count = 2;
   aGlobal = []; 
   counter = 0;
   
   if ($('li.SP').length != 0) 
   {
      $('li.SP').remove();
   }
   
   for (var i = 0; i < SP_count; i++)
   {
      if (i == 0)
      {
         addField("header", 2);
      }
      else
      {
         addField(i, 2);
      }
   }
   
   pattern_receiving_state = 3;
}
