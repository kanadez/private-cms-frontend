var aCI = ["radio0", "radio1", "radio2", "check0", "check1", "check2", "slct", "txt", "multiple_slct", "number_txt1", "number_txt2"]; // массив дефолтных ID контролов ПТН для их динамического изменения на уникальные
var aKNPI = ["wrap_KNP", "TXT1", "PD", "TXT2", "section_1_div", "section_2_div", "section_3_div", "section_4_div", "section_5_div", "section_6_div", "section_7_div", "section_8_div"]; // массив дефолтных ID контролов КНП для их динамического изменения на уникальные. 
var PTNjson = 0; // json-объект ПТН
var acc_load_int = 0; // интервал для загрузки закладки аккордеона (имитация сервера)
var first_loaded = 0; // первая загрузка формы настроек (булева переменная)
var counter = 0; // инкрементируемый счётчик для присвоения уникальных id контролам
var cur_KS_id = 0; // ID текущего КШ
var cur_PTN_id = 0; // ID текущей ПТН
var cur_language = 'Ru'; // текущий язык

function setKNPEvents() // задаёт события для выбранного паттерна (КНП)
{
   $('.ACC').accordion
   (
      {
         active:false,
         collapsible: true,
         change:function(ev, ui)
         {
            cur_PTN_id = $(ui.newContent).attr('id');
            
            if (first_loaded == 0)
            {
               acc_load_int = window.setInterval("onACCchange()", 1000);               
               first_loaded = 1;
            }
            else
            {
               onACCchange();
            }
         }
      }
   );
   
   $('.fname_ns').bind
   (
      'keyup',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         aGlobal[0][cur_KS][cur_KNP].fname = $(this).val();
      }
   );
   
   $('.pd_language_ns').bind
   (
      'change',  
      function (ev) 
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         
         $("select[id="+$(this).attr('id')+"] option:selected").each
         (
            function () 
            {
               cur_language = $(this).text();
               if (cur_language == "Ru")
               {
                  $('#'+cur_KNP+' > textarea').val(aGlobal[0][cur_KS][cur_KNP].ftitle.Ru);
               }
               else if (cur_language == "En")
               {
                  $('#'+cur_KNP+' > textarea').val(aGlobal[0][cur_KS][cur_KNP].ftitle.En);
               }
               else if (cur_language == "De")
               {
                  $('#'+cur_KNP+' > textarea').val(aGlobal[0][cur_KS][cur_KNP].ftitle.De);
               }
               else if (cur_language == "NL")
               {
                  $('#'+cur_KNP+' > textarea').val(aGlobal[0][cur_KS][cur_KNP].ftitle.NL);
               }
            }
         );
      }
   );
   
   $('.ftitle_ns').bind
   (
      'keyup',  
      function(ev) 
      {
         cur_KNP = $(this).parent().attr("id");
         
         if (cur_language == "Ru")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.Ru = $(this).val();
         }
         else if (cur_language == "En")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.En = $(this).val();
         }
         else if (cur_language == "De")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.De = $(this).val();
         }
         else if (cur_language == "NL")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.NL = $(this).val();
         }
      }
   ); 
   
   $('.fname_ns').bind
   (
      'keyup',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         aGlobal[0][cur_KS][cur_KNP].fname = $(this).val();
      }
   ); 
   
   $('.fname_ns').removeClass("fname_ns");
   $('.ftitle_ns').removeClass("ftitle_ns");
   $('.pd_language_ns').removeClass("pd_language_ns");
         
}

function onACCchange() // срабатывает при открытии закладки аккордиона
{
   $('#'+cur_PTN_id+'.ACC_section_ns').load
   (
      'form.html',
      function(ev)
      {
         if (acc_load_int != 0)
         {
            clearInterval(acc_load_int);
            acc_load_int = 0;
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_1').length != 0)
         {
            if ($(this).parent().parent().parent().parent(".sp_header").length != 0)
            {
               onHeaderKNPmainTypeSectionLoad(cur_PTN_id);
            }
            else
            {
               onMainTypeSectionLoad(cur_PTN_id);
            }
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_2').length != 0)
         {
            onAppSettingsSectionLoad(cur_PTN_id);
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_3').length != 0)
         {
            onLinksSectionLoad(cur_PTN_id);
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_4').length != 0)
         {
            onClassificationSectionLoad(cur_PTN_id);
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_5').length != 0)
         {
            onEventsSectionLoad(cur_PTN_id);
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_6').length != 0)
         {
            onAdmissionsSectionLoad(cur_PTN_id);
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_7').length != 0)
         {
            onFiltersSectionLoad(cur_PTN_id);
         }
         
         if ($('#'+cur_PTN_id+'.ACC_section_8').length != 0)
         {
            onAttachmentsSectionLoad(cur_PTN_id);
         }
         //onACCload($(this));
            
         $('#'+cur_PTN_id+'.ACC_section_ns').removeClass("ACC_section_ns");
      }
   );
}

function onHeaderKNPmainTypeSectionLoad(acc_section) // формирование содержания вкладки Основной тип для головного шаблона
{
   $('#'+acc_section+'.ACC_section_1').children().children('#form_block2').remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block3").remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block4").remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block5").remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block6").remove();

   $('#'+acc_section+'.ACC_section_1').children().children("#form_block1").attr("id", "fb_"+counter);
   var fb =  $('#'+acc_section+'.ACC_section_1').children().children('#fb_'+counter);
   fb.html("");
   var aRadioLabels = ["шаблон","документ","подшивка однотипных документов","список одиночного выбора","список множественного выбора","классификатор","обзор","подборка","досье"];
   
   var json_str = "{";
   
   for (var i = 0; i < aRadioLabels.length; i++)
   {
      var radio = "<div id='radio"+counter+"_div' class='radio'><input id='c_"+counter+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+i+"' class='check_radio check_radio_ns' /><label for='radio"+i+"'>"+aRadioLabels[i]+"</label></div>";
      counter++;
      fb.append(radio);
      if (i == 0)
      {
         json_str += '"c_'+counter+'":""';
      }
      else
      {
         json_str += ',"c_'+counter+'":""'
      }
   }
   
   json_str += "}";
   cur_KNP = $('#'+acc_section+'.ACC_section_1').parent().parent().attr("id");
   aGlobal[0][cur_KS][cur_KNP].settings[acc_section] = $.parseJSON(json_str);
   
   $('.check_radio_ns').bind
   (
      'change',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
         $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > input[name=radio_'+cur_PTN_id+']').each
         (
            function()
            {
               if ($(this).attr('checked'))
               {
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
               }
               else
               {
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = "";
               }
            }
         );               
      }
   );
   
   $('#'+acc_section+'.ACC_section_1').children().children().children('.check_radio_ns').removeClass("check_radio_ns"); 
   $('#'+acc_section+'.ACC_section_1').removeClass("ACC_section_1");
}

function onMainTypeSectionLoad(acc_section) // формирование содержания вкладки Основной тип для остальных шаблонов
{
   $('#'+acc_section+'.ACC_section_1').children().children('#form_block2').remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block3").remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block4").remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block5").remove();
   $('#'+acc_section+'.ACC_section_1').children().children("#form_block6").remove();

   $('#'+acc_section+'.ACC_section_1').children().children("#form_block1").attr("id", "fb_"+counter);
   var fb =  $('#'+acc_section+'.ACC_section_1').children().children('#fb_'+counter);
   fb.html("");
   var aRadioLabels = ["текст", "длинный текст", "целое число", "дробное число", "дата", "дата-время", "время", "ссылка"];
   
   var json_str = "{";
   
   for (var i = 0; i < aRadioLabels.length; i++)
   {
      var radio = "<div id='radio"+counter+"_div' class='radio'><input id='c_"+counter+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+i+"' class='check_radio check_radio_ns' /><label for='radio"+i+"'>"+aRadioLabels[i]+"</label></div>";
      counter++;
      fb.append(radio);
      if (i == 0)
      {
         json_str += '"c_'+counter+'":""';
      }
      else
      {
         json_str += ',"c_'+counter+'":""'
      }
   }
   json_str += "}";
   cur_KNP = $('#'+acc_section+'.ACC_section_1').parent().parent().attr("id");
   aGlobal[0][cur_KS][cur_KNP].settings[acc_section] = $.parseJSON(json_str);
   
   $('.check_radio_ns').bind
   (
      'change',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
         $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > input[name=radio_'+cur_PTN_id+']').each
         (
            function()
            {
               if ($(this).attr('checked'))
               {
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
               }
               else
               {
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = "";
               }
            }
         );               
      }
   );
   
   $('#'+acc_section+'.ACC_section_1').children().children().children('.check_radio_ns').removeClass("check_radio_ns"); 
   $('#'+acc_section+'.ACC_section_1').removeClass("ACC_section_1");
}

function onAppSettingsSectionLoad(acc_section) // формирование содержания вкладки Прикладные настройки
{
   $('#'+acc_section+'.ACC_section_2').children().children('#form_block1').remove();
   $('#'+acc_section+'.ACC_section_2').children().children("#form_block3").remove();
   $('#'+acc_section+'.ACC_section_2').children().children("#form_block4").remove();
   $('#'+acc_section+'.ACC_section_2').children().children("#form_block5").remove();
   $('#'+acc_section+'.ACC_section_2').children().children("#form_block6").remove();

   $('#'+acc_section+'.ACC_section_2').children().children("#form_block2").attr("id", "fb_"+counter);
   var fb =  $('#'+acc_section+'.ACC_section_2').children().children('#fb_'+counter);
   fb.html("");
   
   var json_str = "{";
   
   var aCheckLabels = ["Заголовок и текст", "Только заголовок", "Только текст", "показывать в результатах поиска", "показывать в карточке", "показывать в сокращенном представлении документа", "никогда не показывать", "авторский признак", "вычисляемое поле", "Относится к базовой структуре", "Относится к прикладной базовой структуре"];
   
   for (var i = 0; i < aCheckLabels.length; i++)
   {
      var check = "<div id='check"+counter+"_div' class='radio'><input id='c_"+counter+"' type='checkbox' name='box_"+cur_PTN_id+"' value='check"+i+"' class='check_box check_box_ns' /><label for='check"+i+"'>"+aCheckLabels[i]+"</label></div>";
      
      if (i == 3 || i == 7 || i == 8 || i == 9 || i == 11)
      {
         fb.append("<hr />");
      }
      counter++;
      fb.append(check);
      if (i == 0)
      {
         json_str += '"c_'+counter+'":""';
      }
      else
      {
         json_str += ',"c_'+counter+'":""'
      }
   }
   json_str += "}";
   cur_KNP = $('#'+acc_section+'.ACC_section_2').parent().parent().attr("id");
   aGlobal[0][cur_KS][cur_KNP].settings[acc_section] = $.parseJSON(json_str);
   $('.check_box_ns').bind
   (  
      'change',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
         $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > input[name=box_'+cur_PTN_id+']').each
         (
            function()
            {
               if ($(this).attr('checked'))
               {                     
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
               }
               else
               {
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = "";
               }
            }
         );        
      }
   );
   
   $('#'+acc_section+'.ACC_section_2').children().children().children('.check_box_ns').removeClass("check_box_ns"); 
   $('#'+acc_section+'.ACC_section_2').removeClass("ACC_section_2");
}

function onLinksSectionLoad(acc_section) // формирование содержания вкладки Связи
{
   $('#'+acc_section+'.ACC_section_3').html("");
   $('#'+acc_section+'.ACC_section_3').load
   (
      'LinksBuilder.html',
      function()
      {
         // сделать что-нибудь с Конструктором связей
      }
   );
}

function onClassificationSectionLoad(acc_section)
{
   $('#'+acc_section+'.ACC_section_4').html("");
}

function onEventsSectionLoad(acc_section)
{
   $('#'+acc_section+'.ACC_section_5').html("");
}

function onAdmissionsSectionLoad(acc_section)
{
   $('#'+acc_section+'.ACC_section_6').html("");
}

function onFiltersSectionLoad(acc_section)
{
   $('#'+acc_section+'.ACC_section_7').html("");
}

function onAttachmentsSectionLoad(acc_section)
{
   $('#'+acc_section+'.ACC_section_8').html("");
}

/*function onACCload(acc) 
{
   ////console.log("onACCload() exec");
   acc.css('height', '457px');
   cur_KNP = acc.parent().parent().attr("id");
   
   
   resetCIids(acc.attr('id'));

   $('#'+acc.attr("id")+'> * > * > .form_txt').val(aGlobal[0][cur_KS][acc.parent().parent().attr("id")].settings[acc.attr("id")][$('#'+acc.attr("id")+'> * > * > .form_txt').attr('id')]);
   
   $('.form_txt_ns').bind
   (
      'keyup',  
      function(ev) 
      {  
         cur_KNP = $(this).parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().attr("id");
         aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
         ////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
         ////console.log("aKS['"+cur_KNP+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));                
      }
   );
      
      $('.check_radio_ns').bind
      (
         'change',  
         function(ev) 
         {
            cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
            cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
            $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > input[name=radio]').each
            (
               function()
               {
                  if ($(this).attr('checked'))
                  {
                     aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
                  }
                  else
                  {
                     aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = "";
                  }
                  ////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
                  //////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
               }
            );               
         }
      ); 
      
      $('.check_box_ns').bind
      (  
         'change',  
         function(ev) 
         {
            cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
            cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
            $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > input[name=box]').each
            (
               function()
               {
                  if ($(this).attr('checked'))
                  {                     
                     aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
                  }
                  else
                  {
                     aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = "";
                  }
                  ////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
                  //////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
               }
            );        
         }
      );

      $('.form_option_ns').bind
      (
         'click',  
         function(ev) 
         {
            cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
            cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
            aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).parent().attr('id')] = $(this).val();
            ////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).parent().attr('id')]);
            //////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).parent().attr('id'));  
         }
      ); 
      
      $('.multiple_slct_ns').change
      (
         function () 
         {
            var str = "";
            $("select[id="+$(this).attr('id')+"] option:selected").each
            (
               function () 
               {
                  if (str.length == 0)
                  {
                     str = $(this).val();
                  }
                  else
                  {
                     str += '|'+$(this).val();
                  };
               }
            );
            cur_KNP = $(this).parent().parent().parent().parent().parent().attr("id");
            cur_PTN_id = $(this).parent().parent().parent().attr("id");
            aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = str;
            str = "";
            ////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
            //////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
         }
      ); 
            
      $('.number_txt_ns').bind
      (
         'keyup',  
         function(ev) 
         { 
            var value = $(this).val(); 
            var rep = /[-/?><|.;~`!@#$%^&*()_+=":\{\}\[\] \\¹'a-zA-Zà-ÿÀ-ß]/; 
            if (rep.test(value)) 
            { 
               value = value.replace(rep, ''); 
               $(this).val(value); 
            } 
            
            cur_KNP = $(this).parent().parent().parent().parent().parent().attr("id");
            cur_PTN_id = $(this).parent().parent().parent().attr("id");
            aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')] = $(this).val();
            ////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
            //////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));
            
            if (ev.keyCode == 13)
            {
               $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > input[name=number_txt_2]').focus();
            }
         }
      );      

      $('.check_radio_ns').removeClass("check_radio_ns");
      $('.check_box_ns').removeClass("check_box_ns");
      $('.form_option_ns').removeClass("form_option_ns");
      $('.multiple_slct_ns').removeClass("multiple_slct_ns");
      $('.number_txt_ns').removeClass("number_txt_ns");
      $('.form_txt_ns').removeClass("form_txt_ns");
}*/

function resetKNPIids() // задаёт уникальные ID контролам КНП
{   
   var str = "{";
   for (var i = 0; i < aKNPI.length; i++)
   {
      $('#'+aKNPI[i]).attr('id', 'a_'+counter);      
      if (i > 3)
      {
         str += '"a_'+counter+'":"",';
      }
      counter++;
   }
   str = str.substr(0, str.length-1);
   str += "}";
   var obj = jQuery.parseJSON(str);
   PTNjson.settings = obj;
   cur_KNP = $('.wrap_KNP_ns').attr("id");
   $('.wrap_KNP_ns').toggleClass("wrap_KNP_ns");
   aKS[cur_KNP] = PTNjson;
   
   var str= '{"'+cur_KS+'" : ""}';
   var obj = jQuery.parseJSON(str);
   obj[cur_KS] = aKS;
   aGlobal[0] = obj;
   if (pattern_receiving > 0)
   {
      receivePatternFromServer();
      assignTitleValues();
   }
}

/*function resetCIids(AH_id) // ïîëó÷åíèå ñ ñåðâåðà ID äëÿ êîíòðëîâ êàæäîãî ýêçåìïëÿðà ÏÒÍ. â äàííûé ìîìåíò çàäàþòñÿ èñêóññòâåííî
{
   
   var str = "{";
   for (var i = 0; i < aCI.length; i++)
   {
      $('#'+aCI[i]).attr('id', "c_"+counter);
      str += '"c_'+counter+'":"",';
      counter++;
   }
   str = str.substr(0, str.length-1);
   str += "}";
   
   var obj = jQuery.parseJSON(str);
   
   aGlobal[0][cur_KS][cur_KNP].settings[AH_id] = obj;
   var recv_counter_def = 11 * receiving_patterns_count * 8;
   
   if ((pattern_receiving > 0) && (recv_counter_def == counter))
   {
      receivePatternFromServer();
      assignControlsValues();
   }
}

function assignTitleValues()
{
   var obj = aGlobal[0][cur_KS];
   for(var c in obj)
   {
      if (!obj.hasOwnProperty(c)) continue;
      var obj2 = obj[c];
      ////console.log(obj);
      var title_id = c;
      ////console.log(obj2);
      for(var c in obj2)
      {
         if (!obj2.hasOwnProperty(c)) continue;
         var obj3 = obj2[c];
         ////console.log(obj3);
         
         var aStr = title_id.split("_");
         var fname_id = aStr[0]+"_"+(Number(aStr[1])+1);
         var ftitle_id = aStr[0]+"_"+(Number(aStr[1])+3);
         $('#'+fname_id+'.fname').val(obj2.fname);
         $('#'+ftitle_id+'.ftitle').val(obj2.ftitle.Ru);
         
      }
   }
}

function assignControlsValues() // расставляет присланные в готовом шаблоне значения контролов по контролам
{
   var obj = aGlobal[0][cur_KS];
   for(var c in obj)
   {
      if (!obj.hasOwnProperty(c)) continue;
      var obj2 = obj[c];
      //console.log(c);
      for(var c in obj2)
      {
         
         if (!obj2.hasOwnProperty(c)) continue;
         
         var settings = obj2.settings;
         
         for(var c in settings)
         {
            if (!settings.hasOwnProperty(c)) continue;
            var obj3 = settings[c];
            for(var c in obj3)
            {
               if (!obj3.hasOwnProperty(c)) continue;
               var control_id = c;
               var control_val = obj3[c];
               $('#'+control_id+'.form_txt').val(control_val);
               if ($('#'+control_id+'.check_radio').val() == control_val)
               {
                  $('#'+control_id+'.check_radio').attr("checked", "checked");
               }
               if ($('#'+control_id+'.check_box').val() == control_val)
               {
                  $('#'+control_id+'.check_box').attr("checked", "checked");
               }
               
               if ($('#'+control_id+'.form_slct option:selected').val() != control_val)
               {
                  $("#"+control_id+".form_slct option:contains('"+control_val+"')").attr("selected", "selected");
               }
               
               if (($('#'+control_id).attr("class") == "multiple_slct") && (control_val != ""))
               {
                  var aStr = control_val.split("|");
                  for (var i = 0; i < aStr.length; i++)
                  {
                     $("#"+control_id+".multiple_slct option:contains('"+aStr[i]+"')").attr("selected", "selected");
                  }
               }
               
               $('#'+control_id+'.number_txt').val(control_val);               
            }  
         }
      }
   }
}

function receivePatternFromServer() // загружает готовый шаблон с сервера и сводит его с имеющейся моделю данных
{
   var json_from_server = '{"patternid":"ks_0", "a_0":{"fname": "rvfgrgtvrg","ftitle": {"Ru":"dfvfvbgfgbgbhrb","En":"rbggbr","De":"","NL":""}, "settings": {"a_4": {"c_29":"5765656hh", "c_23":"radio1", "c_26":"check1", "c_28":"option 2", "c_30":"option 2|option 3", "c_31":"4545467", "c_32":"67"}}}, "a_11":{"fname": "r55","ftitle": {"Ru":"dfvf5g54fhrb","En":"rbggbr","De":"","NL":""}, "settings": {"a_15":{"c_106":"576", "c_105":"option 3"}}}}';

   var obj = jQuery.parseJSON(json_from_server);
   var aTmp = [];

   for(var c in obj) 
   {
      if (!obj.hasOwnProperty(c)) continue;
      if (c != "patternid")
      {         
         aTmp[c] = obj[c];               
      }
   }
   
   var str= '{"'+obj.patternid+'" : ""}';
   var KS_json = jQuery.parseJSON(str);
   KS_json[obj.patternid] = aTmp;

   $.extend(true, aGlobal[0], KS_json); 
         
   pattern_receiving--;
   //console.log(pattern_receiving);
}*/

function deleteKS(close_button) // удаляет КШ
{
   var SP = close_button.parent().attr("id");
   var KNP = $('#'+SP+' > * > .wrap_KNP').attr("id");
   delete aGlobal[0][cur_KS][KNP];
}

function initDataModel() // инициализирует модель данных
{
   var tmpPTNjson = {};
   tmpPTNjson.fname = ""; 
   tmpPTNjson.ftitle = 0; 
   tmpPTNjson.settings = 0;
   
   var LOCALjson = {};
   LOCALjson.Ru = "";
   LOCALjson.En = "";
   LOCALjson.De = "";
   LOCALjson.NL = "";
   
   tmpPTNjson.ftitle = LOCALjson;
   
   PTNjson = tmpPTNjson;    
}
