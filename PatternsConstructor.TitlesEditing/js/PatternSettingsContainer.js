var aCI = ["radio0", "radio1", "radio2", "check0", "check1", "check2", "slct", "txt", "multiple_slct", "number_txt1", "number_txt2"]; // массив дефолтных ID контролов ПТН для их динамического изменения на уникальные
var aKNPI = ["wrap_KNP", "TXT1", "PD", "ftitle_radio0", "ftitle_radio1", "TXT2", "TXT2_editor", "section_1_div", "section_2_div", "section_3_div", "section_4_div", "section_5_div", "section_6_div", "section_7_div", "section_8_div"]; // массив дефолтных ID контролов КНП для их динамического изменения на уникальные. 
var PTNjson = 0; // json-объект ПТН
var acc_load_int = 0; // интервал для загрузки закладки аккордеона (имитация сервера)
var first_loaded = 0; // первая загрузка формы настроек (булева переменная)
var counter = 0; // инкрементируемый счётчик для присвоения уникальных id контролам
var cur_KS_id = 0; // ID текущего КШ
var cur_PTN_id = 0; // ID текущей ПТН
var cur_language = 'Ru'; // текущий язык

function setKNPEvents(KNP) // задаёт события для выбранного паттерна (КНП)
{
   KNP.children('.ACC').accordion
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
   
   KNP.children().children().children('.fname').bind
   (
      'keyup',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         aGlobal[0][cur_KS][cur_KNP].fname = $(this).val();
      }
   );
   
   KNP.children().children().children('.pd_language').bind
   (
      'change',  
      function (ev) 
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         
         $('#'+cur_KNP+' > * > * > .ftitle').css("background", "white");
         
         $('#'+$(this).attr('id')+' option:selected').each
         (
            function () 
            {
               cur_language = $(this).text();
               $('#'+cur_KNP+' > * > * > .ftitle').val(aGlobal[0][cur_KS][cur_KNP].ftitle[cur_language]);
               $("body", $('#'+cur_KNP+' > * > * > * > #TXT2_editor').cleditor()[0].$frame[0].contentWindow.document).html(aGlobal[0][cur_KS][cur_KNP].ftitle[cur_language]);
            }
         );
      }
   );
   
   KNP.children().children().children('.ftitle').bind
   (
      'keyup',  
      function(ev) 
      {
         if ($(this).val().length > 255)
         {
            $(this).css("background", "red")
         }
         else
         {
            $(this).css("background", "white");
            cur_KNP = $(this).parent().parent().parent().attr("id");
            cur_language = $('#'+cur_KNP+' > * > * > .pd_language option:selected').val();
            aGlobal[0][cur_KS][cur_KNP].ftitle[cur_language] = $(this).val();
         }
      }
   ); 
   
   KNP.children().children().children('.ftitle_radio0').bind
   (
      "change", 
      {
         ftitle: KNP.children().children().children('.ftitle')
      },
      function(ev)
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         switchEditor(ev.data.ftitle, false);         
         cur_language = $('#'+cur_KNP+' > * > * > .pd_language option:selected').val();
         $('#'+cur_KNP+' > * > * > .ftitle').val(aGlobal[0][cur_KS][cur_KNP].ftitle[cur_language]);
      }
   );
   
   KNP.children().children().children('.ftitle_radio1').bind
   (
      "change", 
      {
         ftitle: KNP.children().children().children('.ftitle')
      },
      function(ev)
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         switchEditor(ev.data.ftitle, true);
         cur_language = $('#'+cur_KNP+' > * > * > .pd_language option:selected').val();
         $("body", $('#'+cur_KNP+' > * > * > * > #TXT2_editor').cleditor()[0].$frame[0].contentWindow.document).html(aGlobal[0][cur_KS][cur_KNP].ftitle[cur_language]);
      }
   );
   
   KNP.children().children().children('.fname').bind
   (
      'keyup',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().attr("id");
         aGlobal[0][cur_KS][cur_KNP].fname = $(this).val();
      }
   );       
}

function switchEditor(textarea, state)
{            
   if (state == true)
   {               
      textarea.css("display", "none");
      $('#'+textarea.attr("id")+'.cleditorMain').css("display", "block");
      aGlobal[0][cur_KS][cur_KNP].ttype = "html";
   }
   else
   {
      textarea.css("display", "block");
      $('#'+textarea.attr("id")+'.cleditorMain').css("display", "none");
      aGlobal[0][cur_KS][cur_KNP].ttype = "text";
   }
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

function checkControlCell(val, comma, sub)
{
   if (comma == false)
   {
      if (val == undefined)
      {
         return '"c_'+counter+'":""';
      }
      else
      {
         return '"c_'+counter+'":"'+val+'"';
      }
   }
   else
   {
      if (val == undefined)
      {
         return ',"c_'+counter+'":""';
      }
      else
      {
         return ',"c_'+counter+'":"'+val+'"';
      }
   }
}

function onHeaderKNPmainTypeSectionLoad(acc_section) // формирование содержания вкладки Основной тип для головного шаблона
{
   cur_KNP = $('#'+acc_section+'.ACC_section_1').parent().parent().attr("id");
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
      var control_value = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+counter];
      console.log(control_value);
      if (i == 0)
      {
         json_str += checkControlCell(control_value, false);
      }
      else
      {
         json_str += checkControlCell(control_value, true);
      }
      fb.append(radio);
      counter++;
   }
   json_str += "}";
   aGlobal[0][cur_KS][cur_KNP].settings[acc_section] = $.parseJSON(json_str);
   assignControlsValues();
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.check_radio').bind
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
   
   $('#'+acc_section+'.ACC_section_1').removeClass("ACC_section_1");
}

var aMainTypeLinkChecked = [];

function onMainTypeSectionLoad(acc_section) // формирование содержания вкладки Основной тип для остальных шаблонов
{
   cur_KNP = $('#'+acc_section+'.ACC_section_1').parent().parent().attr("id");
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
      var radio;
      var control_value = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+counter];
      var control_value1 = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+counter+'_sub'];
      var control_value2 = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+(counter+1)+'_sub'];
      ////console.log("control_value:"+control_value);
      ////console.log("control_value1:"+control_value1);
      ////console.log("control_value2:"+control_value2);
      if (aRadioLabels[i] == "текст")
      {
         radio = "<div id='radio"+counter+"_div' class='radio'><input id='c_"+counter+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+i+"' class='check_radio check_radio_text' / ><label for='radio"+i+"'>"+aRadioLabels[i]+"</label><div id='radio"+counter+"_div_sub' class='radio radio_text_text' style='margin:10px 0 0 20px; display:none;'><input id='c_"+counter+"_sub' type='radio' name='radio_"+cur_PTN_id+"_sub' value='radio"+i+"' class='check_radio check_radio_ns_sub' / ><label for='radio"+i+"'>Text</label></div><input id='html_input_legth_"+counter+"_sub' class='ftitle_input_length' maxlength='3' / ><div id='radio"+counter+2+"_div_sub' class='radio radio_text_html' style='margin:10px 0 0 20px; display:none;'><input id='c_"+counter+2+"_sub' type='radio' name='radio_"+cur_PTN_id+"_sub' value='radio"+i+2+"' class='check_radio check_radio_ns_sub' / ><label for='radio"+i+2+"'>HTML</label></div></div>";         
         json_str += checkControlCell(control_value, false);
         if (control_value1 == undefined)
         {
            json_str += ',"c_'+counter+'_sub":""';
         }
         else
         {
            $('#'+acc_section+'.ACC_section_1').children().children().children().children('.radio_text_text').css("display", "block");
            $('#'+acc_section+'.ACC_section_1').children().children().children().children('.radio_text_html').css("display", "block");
            json_str += ',"c_'+counter+'_sub":"'+control_value1+'"';
         }
         if (control_value2 == undefined)
         {
            json_str += ',"c_'+counter+1+'_sub":""';
         }
         else
         {
            $('#'+acc_section+'.ACC_section_1').children().children().children().children('.radio_text_text').css("display", "block");
            $('#'+acc_section+'.ACC_section_1').children().children().children().children('.radio_text_html').css("display", "block");
            json_str += ',"c_'+counter+1+'_sub":"'+control_value2+'"';
         }
      }
      else if (aRadioLabels[i] == "ссылка")
      {
         radio = "<div id='radio"+counter+"_div' class='radio'><input id='c_"+counter+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+i+"' class='check_radio check_radio_type_link' / ><label for='radio"+i+"'>ссылка</label></div>";      
         if (control_value == undefined)
         {
            json_str += ',"c_'+counter+'":""';
         }
         else
         {
            json_str += ',"c_'+counter+'":"'+control_value+'"';
            aMainTypeLinkChecked[cur_KNP] = 1;
         }
      }
      else
      {
         radio = "<div id='radio"+counter+"_div' class='radio'><input id='c_"+counter+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+i+"' class='check_radio check_radio_ns' / ><label for='radio"+i+"'>"+aRadioLabels[i]+"</label></div>";
      
         json_str += checkControlCell(control_value, true);
      }      
      fb.append(radio);
      counter++;
   }
   json_str += ',"size":""}';
   aGlobal[0][cur_KS][cur_KNP].settings[acc_section] = $.parseJSON(json_str);
   assignControlsValues();
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.check_radio').bind
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
   
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.check_radio_text').bind
   (
      'change',
      {
         acc:$('#'+acc_section+'.ACC_section_1')
      },
      function(ev) 
      {
         ev.data.acc.children().children().children().children('.radio_text_text').css("display", "block");
         ev.data.acc.children().children().children().children('.radio_text_html').css("display", "block");
      }
   );
   
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.radio_text_text').bind
   (
      'change',
      {
         acc:$('#'+acc_section+'.ACC_section_1')
      },
      function(ev)
      {
         ev.data.acc.children().children().children().children('.ftitle_input_length').css("display", "block");
      }
   );
   
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.radio_text_html').bind
   (
      'change',
      {
         acc:$('#'+acc_section+'.ACC_section_1')
      },
      function(ev) 
      {
         ev.data.acc.children().children().children().children('.ftitle_input_length').css("display", "none");
      }
   );
   
   $('#'+acc_section+'.ACC_section_1').children().children().children().children().children('.check_radio').bind
   (
      'change',  
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().parent().parent().attr("id");
         $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > * > input[name=radio_'+cur_PTN_id+'_sub]').each
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
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.ftitle_input_length').bind
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
         
         if ($(this).val() > 255)
         {
            $(this).val(255);
         }
         cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
         aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id].size = $(this).val();
      }
   );
   
   $('#'+acc_section+'.ACC_section_1').children().children().children().children('.check_radio_type_link').bind
   (
      'change',
      function(ev) 
      {
         cur_KNP = $(this).parent().parent().parent().parent().parent().parent().attr("id");
         cur_PTN_id = $(this).parent().parent().parent().parent().attr("id");
         if (aMainTypeLinkChecked[cur_KNP] == 1)
         {
            aMainTypeLinkChecked[cur_KNP] = 0;
         }
         else if (aMainTypeLinkChecked[cur_KNP] == undefined || aMainTypeLinkChecked[cur_KNP] == 0)
         {
            aMainTypeLinkChecked[cur_KNP] = 1;
         }
         $('#'+cur_KNP+' > * > #'+cur_PTN_id+' > * > * > * > * > input[name=radio_'+cur_PTN_id+'_sub]').each
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
   $('#'+acc_section+'.ACC_section_1').removeClass("ACC_section_1");
}

function onAppSettingsSectionLoad(acc_section) // формирование содержания вкладки Прикладные настройки
{
   cur_KNP = $('#'+acc_section+'.ACC_section_2').parent().parent().attr("id");
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
      //console.log(counter);
      var check;
      var control_value = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+counter];
      var control_value1 = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+(counter+1)];
      var control_value2 = aGlobal[0][cur_KS][cur_KNP].settings[acc_section]['c_'+(counter+2)];
      var linkvisio_value = aGlobal[0][cur_KS][cur_KNP].settings[acc_section].linkvisio;
      ////console.log("control_value:"+control_value);
      if ((i == aCheckLabels.length-1) && (aMainTypeLinkChecked[cur_KNP] == 1))
      {
         check = "<div id='check"+counter+"_div' class='radio'><input id='c_"+counter+"' type='checkbox' name='box_"+cur_PTN_id+"' value='check"+i+"' class='check_box check_box_ns' /><label for='check"+i+"'>"+aCheckLabels[i]+"</label></div><p>Отображение в деталях документа</p><div id='radio"+(counter+1)+"_div' class='radio'><input id='c_"+(counter+1)+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+(i+1)+"' class='check_radio check_radio_app_settings_first' / ><label for='radio"+(i+1)+"'>По названию конечного документа цепочки</label></div><div id='radio"+(counter+2)+"_div' class='radio'><input id='c_"+(counter+2)+"' type='radio' name='radio_"+cur_PTN_id+"' value='radio"+(i+2)+"' class='check_radio check_radio_app_settings_second' / ><label for='radio"+(i+2)+"'>Полнотекстная вставка конечного документа цепочки</label></div>";
         
         if (linkvisio_value == undefined)
         {
            json_str += ',"linkvisio":""';
         }
         else
         {
            json_str += ',"linkvisio":"'+linkvisio_value+'"';
         }
         
         /*if (control_value1 == undefined)
         {
            json_str += ',"c_'+(counter+1)+'":""';
         }
         else
         {
            json_str += ',"c_'+(counter+1)+'":"'+control_value1+'"';
         }
         
         if (control_value2 == undefined)
         {
            json_str += ',"c_'+(counter+2)+'":""';
         }
         else
         {
            json_str += ',"c_'+(counter+2)+'":"'+control_value2+'"';
         }*/
      }
      else if ((i == aCheckLabels.length-1) && (aMainTypeLinkChecked[cur_KNP] != 1))
      {
         check = "<div id='check"+counter+"_div' class='radio'><input id='c_"+counter+"' type='checkbox' name='box_"+cur_PTN_id+"' value='check"+i+"' class='check_box check_box_ns' /><label for='check"+i+"'>"+aCheckLabels[i]+"</label></div>";
      
         json_str += checkControlCell(control_value, true);
      }
      else
      {
         check = "<div id='check"+counter+"_div' class='radio'><input id='c_"+counter+"' type='checkbox' name='box_"+cur_PTN_id+"' value='check"+i+"' class='check_box check_box_ns' /><label for='check"+i+"'>"+aCheckLabels[i]+"</label></div>";
      
         if (i == 0)
         {
            json_str += checkControlCell(control_value, false);
         }
         else
         {
            json_str += checkControlCell(control_value, true);
         }
      }
      if (i == 3 || i == 7 || i == 8 || i == 9 || i == 11)
      {
         fb.append("<hr />");
      }
      fb.append(check);
      counter++;      
   }
   json_str += "}";
   cur_KNP = $('#'+acc_section+'.ACC_section_2').parent().parent().attr("id");
   aGlobal[0][cur_KS][cur_KNP].settings[acc_section] = $.parseJSON(json_str);
   assignControlsValues();
   $('#'+acc_section+'.ACC_section_2').children().children().children().children('.check_box').bind
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
   $('#'+acc_section+'.ACC_section_2').children().children().children().children('.check_radio_app_settings_first').bind
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
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id].linkvisio = "name";
               }
            }
         );        
      }
   );
   $('#'+acc_section+'.ACC_section_2').children().children().children().children('.check_radio_app_settings_second').bind
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
                  aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id].linkvisio = "full";
               }
            }
         );        
      }
   );
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
   ////////console.log("onACCload() exec");
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
         ////////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
         ////////console.log("aKS['"+cur_KNP+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));                
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
                  ////////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
                  //////////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
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
                  ////////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
                  //////////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
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
            ////////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).parent().attr('id')]);
            //////////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).parent().attr('id'));  
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
            ////////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
            //////////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
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
            ////////console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
            //////////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));
            
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

function setftitle(content)
{
   if (cur_language == "Ru")
   {
      aGlobal[0][cur_KS][cur_KNP].ftitle.Ru = content;
   }
   else if (cur_language == "En")
   {
      aGlobal[0][cur_KS][cur_KNP].ftitle.En = content;
   }
   else if (cur_language == "De")
   {
      aGlobal[0][cur_KS][cur_KNP].ftitle.De = content;
   }
   else if (cur_language == "NL")
   {
      aGlobal[0][cur_KS][cur_KNP].ftitle.NL = content;
   }
}

var editor = [];
var iframes = [];
function resetKNPIids() // задаёт уникальные ID контролам КНП
{
   var TXT2_id = 0;
   var wrap_KNP_id = 0;
   var str = "{";
   for (var i = 0; i < aKNPI.length; i++)
   {
      if (aKNPI[i] == "TXT2_editor") //создаём html-редактор для текущего КНП
      {
         $('#'+wrap_KNP_id+' > * > * > #TXT2_editor').cleditor({width:$('#TXT2_div').width(), height:151})[0].change
         (
            function()
            {
               var area = $(this)[0].$area[0];
               cur_KNP = area.parentNode.parentNode.parentNode.parentNode.getAttribute("id");//.parent().parent().parent().parent());
               setftitle($(this)[0].$frame[0].contentWindow.document.body.innerHTML);
            }
         );
         //editor.push(ce);
         $('#'+wrap_KNP_id+' > * > * > .cleditorMain').attr("id", TXT2_id);
         //iframes.push($('#'+wrap_KNP_id+' > * > * > .cleditorMain').children('iframe')[0].contentWindow.document);
         //var iframe = $('#'+wrap_KNP_id+' > * > * > .cleditorMain').children('iframe')[0].contentWindow.document;
         //cur_editor.change(function(){setftitle($("body", iframes.pop()).html())});
         
         $('#'+wrap_KNP_id+' > * > * > .cleditorMain').css({"display": "none", "margin": "20px 0 20px 0"});
         $('#'+wrap_KNP_id+' > * > * > .ftitle_radio0').attr("name", "ftitle_radio_"+counter);
         $('#'+wrap_KNP_id+' > * > * > .ftitle_radio1').attr("name", "ftitle_radio_"+counter);
      }
      else
      {
         if (aKNPI[i] == "wrap_KNP") // берём id текущего КНП
         {
            $('#'+aKNPI[i]).attr('id', 'a_'+counter);
            wrap_KNP_id = 'a_'+counter;
         }
         else if (aKNPI[i] == "TXT2") // берём id текущей textarea для присоения текущему html-редактору
         {
            $('#'+aKNPI[i]).attr('id', 'a_'+counter);      
            str += '"a_'+counter+'":"",';
            TXT2_id = 'a_'+counter;
         }
         else
         {
            $('#'+aKNPI[i]).attr('id', 'a_'+counter);      
            if (i > 2)
            {
               str += '"a_'+counter+'":"",';
            }
         }
      }
      counter++;
   }
   str = str.substr(0, str.length-1);
   str += "}";
   var obj = jQuery.parseJSON(str);
   PTNjson.settings = obj;
   cur_KNP = $('.wrap_KNP_ns').attr("id");
   $('.wrap_KNP_ns').removeClass("wrap_KNP_ns");
   aKS[cur_KNP] = PTNjson;
   var str= '{"'+cur_KS+'" : ""}';
   var obj = jQuery.parseJSON(str);
   obj[cur_KS] = aKS;
   aGlobal[0] = obj;
   if (pattern_receiving > 0)
   {
      receivePatternFromServer();
      assignTitleValues();
      assignControlsValues();
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
*/
function assignTitleValues()
{
   var obj = aGlobal[0][cur_KS];
   for(var c in obj)
   {
      if (!obj.hasOwnProperty(c)) continue;
      var obj2 = obj[c];
      var KNP = $('#'+c);
      cur_KNP = c;
      if (obj2.ttype == "html")
      {
         KNP.children().children().children('.ftitle_radio1').attr("checked", "checked");
         switchEditor(KNP.children().children().children('.ftitle'), true);
      }
      else if (obj2.ttype == "text")
      {
         KNP.children().children().children('.ftitle_radio0').attr("checked", "checked");
         switchEditor(KNP.children().children().children('.ftitle'), false);
      }
      KNP.children().children().children('.fname').val(obj2.fname);
      KNP.children().children().children('.ftitle').val(obj2.ftitle.Ru);
      if (KNP.children().children().children().children('#TXT2_editor').cleditor()[0] != undefined)
      {
         $("body", KNP.children().children().children().children('#TXT2_editor').cleditor()[0].$frame[0].contentWindow.document).html(aGlobal[0][cur_KS][c].ftitle.Ru);
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
      var cur_KNP = c;
      var KNP = $('#'+c);
      for(var c in obj2)
      {
         if (!obj2.hasOwnProperty(c)) continue;  
         var settings = obj2.settings;
         for (var c in settings)
         {
            if (!settings.hasOwnProperty(c)) continue;
            var obj3 = settings[c];
            var PTN = $('#'+c);
            for(var c in obj3)
            {
               if (!obj3.hasOwnProperty(c)) continue;
               var control_id = c;
               var control_val = obj3[c];
               if (obj3.linkvisio == "name")
               {
                  aMainTypeLinkChecked[cur_KNP] = 1;
                  PTN.children().children().children().children(".check_radio_app_settings_first").attr("checked", "checked");

               }
               else if (obj3.linkvisio == "full")
               {
                  aMainTypeLinkChecked[cur_KNP] = 1;
                  PTN.children().children().children().children(".check_radio_app_settings_second").attr("checked", "checked");
               }
               //$('#'+control_id+'.form_txt').val(control_val);
               if ($('#'+control_id+'.check_radio').val() == obj3[c])
               {
                  $('#'+control_id+'.check_radio').attr("checked", "checked");
               }
               if ($('#'+control_id+'.check_box').val() == obj3[c])
               {
                  $('#'+control_id+'.check_box').attr("checked", "checked");
               }
               /*if ($('#'+control_id+'.form_slct option:selected').val() != control_val)
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
               */
            }  
         }
      }
   }
}

function receivePatternFromServer() // загружает готовый шаблон с сервера и сводит его с имеющейся моделю данных
{
   var json_from_server = '{"patternid":"ks_0","a_0":{"fname": "eyeyeyeye","ttype":"html","ftitle":{"Ru":"gfgfgfgfgfgfg","En":"rrr","De":"","NL":""},"settings":{"a_7":{"c_36":"radio6"},"a_8":{"c_41":"check2"}}},"a_15":{"fname": "44","ttype":"text","ftitle":{"Ru":"gf55","En":"r45","De":"","NL":""},"settings":{"a_22":{"c_57":"radio7"},"a_23":{"linkvisio":"name"}}}}';
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
}

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
   tmpPTNjson.ttype = "text";
   tmpPTNjson.settings = 0;
   
   var LOCALjson = {};
   LOCALjson.Ru = "";
   LOCALjson.En = "";
   LOCALjson.De = "";
   LOCALjson.NL = "";
   
   tmpPTNjson.ftitle = LOCALjson;
   
   PTNjson = tmpPTNjson;    
}


