var aCI = ["radio0", "radio1", "radio2", "check0", "check1", "check2", "slct", "txt", "multiple_slct", "number_txt1", "number_txt2"]; // èçíà÷àëüíûå ID êîíòðîëîâ ÏÒÍ, çàäàííûå ïðè ðàçìåòêå
var aKNPI = ["wrap_KNP", "TXT1", "PD", "TXT2", "section_1_div", "section_2_div", "section_3_div", "section_4_div", "section_5_div", "section_6_div", "section_7_div",]; // èçíà÷àëüíûå ID êîíòðîëîâ ÊÍÏ, çàäàííûå ïðè ðàçìåòêå
var PTNjson = 0; // ýêçåìïëÿð ÏÒÍ
var acc_load_int = 0; // èíòåðâàë äëÿ êðóòèëêè
var first_loaded = 0; // ïåðâàÿ çàãðóçêà ïðîøëà
var counter = 0; // ñ÷žò÷èê äëÿ èñêóññòâåííîãî çàäàíèÿ ID êîíòðîëîâ
var PTN_cntr = 0; // ñ÷žò÷èê êëàññîâîé îáðàáîòêè âêëàäîê àêêîðäèîíà
var cur_KS_id = 0; // ID òåêóùåãî ÊØ
var cur_PTN_id = 0; // ID òåêóùåãî ÏÒÍ
var cur_language = 'Ru'; // òåêóùèÿ ÿçûê

function setKNPEvents() // çàäàíèå ñîáûòèé äëÿ ñòàòè÷íûõ DOM-ýëåìåíòîâ
{
   $('.ACC').accordion
   (
      {
         active:false,
         collapsible: true,
         change:function(ev, ui)
         {         
            cur_PTN_id = $(ui.newContent).attr('id');
            ////////console.log(cur_PTN_id);            
            if (first_loaded == 0)
            {
               acc_load_int = window.setInterval("intF()", 1000);               
               first_loaded = 1;
            }else
            {
               intF();
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
         //console.log(aGlobal[0][cur_KS][cur_KNP].fname);
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
                  ////console.log(aKS[id].ftitle.En);
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
            //////console.log(PTNjson.ftitle.Ru);
         }
         else if (cur_language == "En")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.En = $(this).val();
            //////console.log(PTNjson.ftitle.En);
         }
         else if (cur_language == "De")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.De = $(this).val();
            //////console.log(PTNjson.ftitle.De);
         }
         else if (cur_language == "NL")
         {
            aGlobal[0][cur_KS][cur_KNP].ftitle.NL = $(this).val();
            //////console.log(PTNjson.ftitle.NL);
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

function intF()
{
   $('.ACC_section').load
   (
      'form.html',
      function()
      {
         //console.log("form.html loading exec");
         ////console.log("$");
         $(this).removeClass("ACC_section");
         onACCload($(this));
         PTN_cntr++;
      }
   );
}

function onACCload(acc) 
{
   //console.log("onACCload() exec");
   acc.css('height', '457px');
   cur_KNP = acc.parent().parent().attr("id");
   if (acc_load_int != 0)
   {
      clearInterval(acc_load_int);
      acc_load_int = 0;
   }
   
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
         //console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
         //console.log("aKS['"+cur_KNP+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));                
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
                  //console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
                  ////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
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
                  //console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
                  ////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
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
            //console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).parent().attr('id')]);
            ////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).parent().attr('id'));  
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
            //console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
            ////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));  
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
            //console.log(aGlobal[0][cur_KS][cur_KNP].settings[cur_PTN_id][$(this).attr('id')]);
            ////console.log("aKS['"+id+"'].settings."+cur_PTN_id+"."+$(this).attr('id'));
            
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
}

function resetKNPIids() // ïîëó÷åíèå ñ ñåðâåðà ID äëÿ ýêçåìïëÿðîâ ÏÒÍ. â äàííûé ìîìåíò çàäàþòñÿ èñêóññòâåííî
{   
   var str = "{";
   for (var i = 0; i < aKNPI.length; i++)
   {
      $('#'+aKNPI[i]).attr('id', 'a_'+counter);      
      if (i > 3)
      {
         str += '"a_'+counter+'":"",';
         ////console.log(str);
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

function resetCIids(AH_id) // ïîëó÷åíèå ñ ñåðâåðà ID äëÿ êîíòðëîâ êàæäîãî ýêçåìïëÿðà ÏÒÍ. â äàííûé ìîìåíò çàäàþòñÿ èñêóññòâåííî
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
      //console.log(obj);
      var title_id = c;
      //console.log(obj2);
      for(var c in obj2)
      {
         if (!obj2.hasOwnProperty(c)) continue;
         var obj3 = obj2[c];
         //console.log(obj3);
         
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
      console.log(c);
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
   console.log(pattern_receiving);
}

function deleteKS(close_button)
{
   var SP = close_button.parent().attr("id");
   var KNP = $('#'+SP+' > * > .wrap_KNP').attr("id");
   delete aGlobal[0][cur_KS][KNP];
}

function initDataModel() // ñîçäàíèå json-îáúåêòà ÊÍÏ, â èäåàëå îí ïðèõîäèò ñ ñåðâåðà â ïàðàìåòðà formdata
{
   var tmpPTNjson = {};
   tmpPTNjson.fname = ""; // çíà÷åíèå txt1
   tmpPTNjson.ftitle = 0; // json ëîêàëèçàöèè
   tmpPTNjson.settings = 0; // 7 ìàññèâîâ ñî çíà÷åíèÿìè êîíòðîëîâ ÏÒÍ
   
   var LOCALjson = {};
   LOCALjson.Ru = "";
   LOCALjson.En = "";
   LOCALjson.De = "";
   LOCALjson.NL = "";
   
   tmpPTNjson.ftitle = LOCALjson;
   
   PTNjson = tmpPTNjson;    
}
