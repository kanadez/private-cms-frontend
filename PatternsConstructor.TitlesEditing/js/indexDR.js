var aSP = []; 
var int1 = []; 
var aKS = []; 
var aGlobal = []; 
var cur_KS = "ks_0";
var cur_KNP = "";
var lc_counter = 0; 
var pattern_receiving = 0;
var switch_pattern_dialog;

$(document).ready(function()
{
   resizeUi();
   //window.resizeTo(1024,600);
   setDomEvents();
   buildLP();
   addPattern("header");
   /*switchPattern("ks_0");*/
   //resetAHIids();
   
});

function setDomEvents()
{
   //buildDialogs();
   
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
   
   /*$('#switch_pattern').click
   (
      function()
      {
         if (aGlobal.length != 0)
         {
            switch_pattern_dialog.dialog('open');
         }
         else
         {
            alert("There are no patterns for select");
         }
      }
   );*/
}

/*function buildDialogs() 
{
   switch_pattern_dialog = $('<div></div>').html("Please select pattern:<p><select id='switch_pattern_dialog_select'></select>")
   .dialog(
   {
	   autoOpen: false,
	   title: "Switching pattern",  
	   resizable: false,
	   width: 324,
		modal: true,
		buttons: 
	   {
		   "OK": function() 
			{
			   switchPattern(selected_pattern);
			   $(this).dialog("close");
			},
			"Cancel": function() 
			{
			   $(this).dialog("close");
			}
		}
   });
   var selected_pattern = "";
   
   $('#switch_pattern_dialog_select').change
   (
      function()
      {
         selected_pattern = $(this).val();
      }
   );
   
   for (var i = 0; i < aGlobal.length; i++)
   {
      $('#switch_pattern_dialog_select').append("<option value='"+aGlobal[i]+"'>"+aGlobal[i]+"</option>");
   }
   
   for(var c in aGlobal)
   {
      if (!aGlobal.hasOwnProperty(c)) continue;
      $('#switch_pattern_dialog_select').html("<option value='"+aGlobal[c]+"'>"+aGlobal[c]+"</option>");
   }
}*/

function buildLP()
{
   $('#LP').append("<div id='1' class='P'><div id='img_1' class='P_IMG'></div><div id='comment_1' class='P_COM'>comment 1</div></div>");
   $('#1').click(function()
   {
      addPattern(counter);
   });
}

function addPattern(selected_pattern_id)
{
   lc_counter++;
   
   var cell = aSP.length;
      
   aSP[cell] = selected_pattern_id + '_' + lc_counter;
   if (selected_pattern_id == "header")
   {
      $('#LC_UL').append("<li id='" + aSP[cell] + "' class='SP sp_header'><div id='" + aSP[cell] + "_content' class='SP_CONTENT'><div id='load_" + aSP[cell] + "' class='LOAD'></div></div><a id='resize_" + aSP[cell] + "' href='javascript:void(0)'><img src='img/arrow_in.png' style='float:right; margin:5px;' / ></a></li>");
      header_pattern_gui = 0;
   }
   else
   {
      $('#LC_UL').append("<li id='" + aSP[cell] + "' class='SP'><div id='" + aSP[cell] + "_content' class='SP_CONTENT'><div id='load_" + aSP[cell] + "' class='LOAD'></div></div><a id='close_" + aSP[cell] + "' href='javascript:void(0)'><img src='img/cross.png' style='float:right; margin:5px;' / ></a><a id='resize_" + aSP[cell] + "' href='javascript:void(0)'><img src='img/arrow_in.png' style='float:right; margin:5px;' / ></a></li>");
      $('#close_'+ aSP[cell]).click(function()
      {
         deleteKS($(this));
         $('#'+aSP[cell]).remove();
         aSP[cell] = 0;
      });
   }
   
   $('#resize_'+ aSP[cell]).click(function()
   {
      if ($('#'+aSP[cell] + "_content").height() > 57)
      {
         $('#'+aSP[cell] + "_content").height(57);
         $(this).html("<img src='img/arrow_out.png' style='float:right; margin:5px;' / >");
      }
      else if ($('#'+aSP[cell] + "_content").height() == 57)
      {
         $('#'+aSP[cell] + "_content").css("height", "auto");
         $(this).html("<img src='img/arrow_in.png' style='float:right; margin:5px;' / >");
      }
   });
      
   int1[int1.length] = window.setInterval("onSPselect('" + aSP[cell] + "', "+int1.length+")", 1000);
   
   $('#LC').scrollTop($("#LC").get(0).scrollHeight);

}

function onSPselect(sp_id, int_array_cell) 
{

   initDataModel();

   var TMPjson = 
   {
      form : "<div id='wrap_KNP' class='wrap_KNP wrap_KNP_ns'><div id='ceil' class='horizontal_block'><div id='ceil_left'><div id='label1'>text for label1</div><div id='label2'>text for label2</div></div><div id='ceil_right'><input id='TXT1' class='fname fname_ns' /><select id='PD' name='language_select' class='pd_language pd_language_ns'><option>Ru</option><option>En</option><option>De</option><option>NL</option></select></div></div><div id='ftitle_div'><div id='radio0_div' class='radio'><input id='ftitle_radio0' type='radio' name='ftitle_radio' value='ftitle_radio0' class='check_radio ftitle_radio0' checked='checked'/><label for='ftitle_radio0'>Text</label></div><div id='radio1_div' class='radio'><input id='ftitle_radio1' type='radio' name='ftitle_radio' value='ftitle_radio1' class='check_radio ftitle_radio1' /><label for='ftitle_radio1'>HTML</label></div><div id='TXT2_div'><textarea id='TXT2' class='ftitle ftitle_ns' rows='3'></textarea><textarea id='TXT2_editor' class='ftitle ftitle_ns_editor' rows='3'></textarea></div></div><div id='ACC' class='ACC'><h3><a href='javascript:void(0)'>Основной тип</a></h3><div id='section_1_div' class='ACC_section ACC_section_1 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Прикладные настройки</a></h3><div id='section_2_div' class='ACC_section ACC_section_2 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Связи</a></h3><div id='section_3_div' class='ACC_section ACC_section_3 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Классификация</a></h3><div id='section_4_div' class='ACC_section ACC_section_4 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>События</a></h3><div id='section_5_div' class='ACC_section ACC_section_5 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Допуски</a></h3><div id='section_6_div' class='ACC_section ACC_section_6 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Фильтры отображения</a></h3><div id='section_7_div' class='ACC_section ACC_section_7 ACC_section_ns'><div class='load_acc_section'></div></div><h3><a href='javascript:void(0)'>Присоединенные документы и вложения</a></h3><div id='section_8_div' class='ACC_section ACC_section_8 ACC_section_ns'><div class='load_acc_section'></div></div></div></div>",
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
   
   $('#load_'+sp_id).remove();
   clearInterval(int1[int_array_cell]);
   onSPdataLoad(TMPjson, sp_id);
}

function onSPdataLoad(json_obj, sp_id) 
{
   $("#"+sp_id+"_content").html(json_obj.form);
   PTNjson.fname = json_obj.formdata.fname;
   PTNjson.ftitle.Ru = json_obj.formdata.ftitle.Ru;
   PTNjson.ftitle.En = json_obj.formdata.ftitle.En;
   PTNjson.ftitle.De = json_obj.formdata.ftitle.De;
   PTNjson.ftitle.NL = json_obj.formdata.ftitle.NL;
   PTNjson.settings = json_obj.formdata.settings;
   //aKS[$('.wrap_KNP').attr("id")] = PTNjson; 
   resetKNPIids();
   setKNPEvents($("#"+sp_id+"_content").children(".wrap_KNP"));
}

function gatherPatternData() 
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

/*function switchPattern(pattern) 
{
   cur_KS = pattern;
   //console.log(cur_KS);
   if ($('li.SP').length != 0)
   {
      $('li.SP').remove();
   }
}*/

function getAssocArrayLength(tempArray) 
{
   var result = 0;
   for (tempValue in tempArray) 
   {
      result++;
   }
	
   return result;
}

var receiving_patterns_count = 0;

function receivePatternPrepare()
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
         addPattern("header");
      }
      else
      {
         addPattern(i);
      }
   }
   receiving_patterns_count = SP_count;
   pattern_receiving = 3;
}
