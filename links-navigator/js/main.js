var NS = 5; // количество CL, вмещаемых в C
var aL = new Array(); // массив данных для компонентов CL левого контейнера С1
var aR = new Array(); // массив данных для компонентов CL правого контейнера С3
var aIDL = new Array();
var aIDR = new Array();
var aAL = new Array();
var aAR = new Array();
var nCPL = 0; // номер текущей страницы левой панели
var nCPR = 0; // номер текущей страницы правой панели
var nLPT; // общее кол-во страниц левой панели
var nLPR; // общее кол-во страниц правой панели
var jsonNav = new Object(); 
var jsonNav2 = new Object();
var jsonNav3 = new Object();

var currentStepL = 0; // текущий шаг скроллинга левой панели C1
var currentStepR = 0; // текущий шаг скроллинга правой панели C3
var stepForPageCounterL = 0; // счётчик страниц при постраничной прокрутке. левая панель
var stepForPageCounterR = 0; // счётчик страниц при постраничной прокрутке. правая панель
var currentJson = 1; // текущий обрабатываемый json-объект. всего 3.

$(document).ready(function()
{
   fill();
   setEvents();
   firstOut();
   calcPageCounter(currentJson, 1);
   calcPageCounter(currentJson, 3);
});

function fill() // заполнение массивов произвольными данными и создание json-объектов
{
   aL = ["Object 1", "Object 2", "Object 3", "Object 4", "Object 5", "Object 6", "Object 7", "Object 8"];
   aR = ["Object 9", "Object 10", "Object 11", "Object 12", "Object 13", "Object 14", "Object 15", "Object 16", "Object 17", "Object 18", "Object 19", "Object 20", "Object 21", "Object 22", "Object 23", "Object 24", "Object 25", "Object 26", "Object 27", "Object 28", "Object 29", "Object 30"];
   jsonNav.aL = aL;
   jsonNav.aR = aR;
   jsonNav.nCPL = nCPL;
   jsonNav.nCPR = nCPR;
   jsonNav.nLPT = Math.ceil(aL.length/NS);
   jsonNav.nLPR = Math.ceil(aR.length/NS);
   aL = ["apple 1", "apple 2", "apple 3", "apple 4", "apple 5", "apple 6", "apple 7", "apple 8"];
   aR = ["apple 9", "apple 10", "apple 11", "apple 12", "apple 13", "apple 14", "apple 15", "apple 16"];
   jsonNav2.aL = aL;
   jsonNav2.aR = aR;
   jsonNav2.nCPL = nCPL;
   jsonNav2.nCPR = nCPR;
   jsonNav2.nLPT = Math.ceil(aL.length/NS);
   jsonNav2.nLPR = Math.ceil(aR.length/NS);
   aL = ["book 1", "book 2", "book 3", "book 4", "book 5", "book 6", "book 7", "book 8"];
   aR = ["book 9", "book 10", "book 11", "book 12", "book 13", "book 14", "book 15", "book 16"];
   jsonNav3.aL = aL;
   jsonNav3.aR = aR;
   jsonNav3.nCPL = nCPL;
   jsonNav3.nCPR = nCPR;
   jsonNav3.nLPT = Math.ceil(aL.length/NS);
   jsonNav3.nLPR = Math.ceil(aR.length/NS);
}


function firstOut() // самый первый вывод данных экран
{
   for (var i = 0; i < NS; i++)
   {
      $('#CL' + i).html(jsonNav.aL[i]);
      $('#CL' + i).click(function()
      {
         $('#CL5').html($(this).html());
         loadLinks(2);
      });
      $('#CL' + (i+6)).html(jsonNav.aR[i]);
      $('#CL' + (i+6)).click(function()
      {
         $('#CL5').html($(this).html());
         loadLinks(3);
      });
   }
}

function setEvents() // начальное присваивание событий DOM-элементам
{
   $('#l_bw_end').click(function()
   {
      bwEnd(currentJson, 1);
   });
   
   $('#l_bw_page').click(function()
   {
      pageBackward(currentJson, 1);
   });
   
   $('#l_bw_step').click(function()
   {
      stepBackward(currentJson, 1);
   });
   
   $('#l_step').click(function()
   {
      stepForward(currentJson, 1);
   });
   
   $('#l_page').click(function()
   {
      pageForward(currentJson, 1);
   });
   
   $('#l_end').click(function()
   {
      end(currentJson, 1);
   });
   
   $('#r_bw_end').click(function()
   {
      bwEnd(currentJson, 3);
   });
   
   $('#r_bw_page').click(function()
   {
      pageBackward(currentJson, 3);
   });
   
   $('#r_bw_step').click(function()
   {
      stepBackward(currentJson, 3);
   });
   
   $('#r_step').click(function()
   {
      stepForward(currentJson, 3);
   });
   
   $('#r_page').click(function()
   {
      pageForward(currentJson, 3);
   });
   
   $('#r_end').click(function()
   {
      end(currentJson, 3);
   });
   
   $('#current_page_l').keydown(function(event)
   {
      if (event.which == 13) 
      {
        pageCounterOnInput(1, $(this).val());
      };
   });
   
   $('#current_page_r').keydown(function(event)
   {
      if (event.which == 13) 
      {
         pageCounterOnInput(3, $(this).val());
      };
   });
}

function loadLinks(id)
{
   for (var i = 0; i < NS; i++)
   {
      if (id == 2)
      {
         $('#CL' + i).html(jsonNav2.aL[i]);
         $('#CL' +(i+6)).html(jsonNav2.aR[i]);
         currentJson = 2;
      }
      else if (id == 3)
      {
         $('#CL' + i).html(jsonNav3.aL[i]);
         $('#CL' +(i+6)).html(jsonNav3.aR[i]);
         currentJson = 3;
      }
   }
   
   calcPageCounter(currentJson, 1);
   calcPageCounter(currentJson, 3);
   
   currentStepL = 0;
   currentStepR = 0;
}

function stepForward(current_json, c)
{
   if (c == 1)
   {
      stepForPageCounterL++;
   }
   else if (c == 3)
   {
      stepForPageCounterR++;
   }
   
   if (current_json == 1)
   {
      if (c == 1 && (currentStepL+NS) < jsonNav.aL.length)
      {
         currentStepL++;
         
         if (stepForPageCounterL == 5 && jsonNav.nCPL <= jsonNav.nLPT)
         {
            stepForPageCounterL = 0;
            pageCounterInc(currentJson, 1);
         }
      }
      else if (c == 3 && (currentStepR+NS) < jsonNav.aR.length)
      {
         currentStepR++;
         
         if (stepForPageCounterR == 5 && jsonNav.nCPR <= jsonNav.nLPR)
         {
            stepForPageCounterR = 0;
            pageCounterInc(currentJson, 3);
         }
      }
      else if (c == 1 && (currentStepL+NS) == jsonNav.aL.length)
      {
         alert("List end!");
         return;
      }
      else if (c == 3 && (currentStepR+NS) == jsonNav.aR.length)
      {
         alert("List end!");
         return;
      }
   }
   else if (current_json == 2)
   {
      if (c == 1 && (currentStepL+NS) < jsonNav2.aL.length)
      {
         currentStepL++;
         
         if (stepForPageCounterL == 5 && jsonNav2.nCPL <= jsonNav2.nLPT)
         {
            stepForPageCounterL = 0;
            pageCounterInc(currentJson, 1);
         }
      }
      else if (c == 3 && (currentStepR+NS) < jsonNav2.aR.length)
      {
         currentStepR++;
         
         if (stepForPageCounterR == 5 && jsonNav2.nCPR <= jsonNav2.nLPR)
         {
            stepForPageCounterR = 0;
            pageCounterInc(currentJson, 3);
         }
      }
      else if (c == 1 && (currentStepL+NS) == jsonNav2.aL.length)
      {
         alert("List end!");
         return;
      }
      else if (c == 3 && (currentStepR+NS) == jsonNav2.aR.length)
      {
         alert("List end!");
         return;
      }
   }
   else if (current_json == 3)
   {
      if (c == 1 && (currentStepL+NS) < jsonNav3.aL.length)
      {
         currentStepL++;
         
         if (stepForPageCounterL == 5 && jsonNav3.nCPL <= jsonNav3.nLPT)
         {
            stepForPageCounterL = 0;
            pageCounterInc(currentJson, 1);
         }
      }
      else if (c == 3 && (currentStepR+NS) < jsonNav3.aR.length)
      {
         currentStepR++;
         
         if (stepForPageCounterR == 5 && jsonNav3.nCPR <= jsonNav3.nLPR)
         {
            stepForPageCounterR = 0;
            pageCounterInc(currentJson, 3);
         }
      }
      else if (c == 1 && (currentStepL+NS) == jsonNav3.aL.length)
      {
         alert("List end!");
         return;
      }
      else if (c == 3 && (currentStepR+NS) == jsonNav3.aR.length)
      {
         alert("List end!");
         return;
      }
   }
   
   for (var i = 0; i < NS; i++)
   {
      if (current_json == 1)
      {
         if (c == 1 && (currentStepL+NS) <= jsonNav.aL.length)
         {
            $('#CL' + i).html(jsonNav.aL[i+currentStepL]);
         }
         else if (c == 3 && (currentStepR+NS) <= jsonNav.aR.length)
         {
            $('#CL' +(i+6)).html(jsonNav.aR[i+currentStepR]);  
         }
      }
      else if (current_json == 2)
      {
         if (c == 1 && (currentStepL+NS) <= jsonNav2.aL.length)
         {
            $('#CL' + i).html(jsonNav2.aL[i+currentStepL]);
         }
         else if (c == 3 && (currentStepR+NS) <= jsonNav2.aR.length)
         {
           $('#CL' +(i+6)).html(jsonNav2.aR[i+currentStepR]);
         }
      }
      else if (current_json == 3)
      {
         if (c == 1 && (currentStepL+NS) <= jsonNav3.aL.length)
         {
            $('#CL' + i).html(jsonNav3.aL[i+currentStepL]);
         }
         else if (c == 3 && (currentStepR+NS) <= jsonNav3.aR.length)
         {
            $('#CL' +(i+6)).html(jsonNav3.aR[i+currentStepR]);
         }
      }
   }
}

function stepBackward(current_json, c)
{
   
   if (c == 1 && currentStepL > 0)
   {
      currentStepL--;
      
      stepForPageCounterL++;
      
      if (current_json == 1)
      {
         if (stepForPageCounterL == 5 && jsonNav.nCPL <= jsonNav.nLPT)
         {
            stepForPageCounterL = 0;
            pageCounterDec(currentJson, 1);
         }
      }
      else if (current_json == 2)
      {
         if (stepForPageCounterL == 5 && jsonNav2.nCPL <= jsonNav2.nLPT)
         {
            stepForPageCounterL = 0;
            pageCounterDec(currentJson, 1);
         }
      }
      else if (current_json == 3)
      {
         if (stepForPageCounterL == 5 && jsonNav3.nCPL <= jsonNav3.nLPT)
         {
            stepForPageCounterL = 0;
            pageCounterDec(currentJson, 1);
         }
      }
   }
   
   if (c == 3 && currentStepR > 0)
   {
      currentStepR--;
      
      stepForPageCounterR++;
      
      if (current_json == 1)
      {
         if (stepForPageCounterR == 5 && jsonNav.nCPR <= jsonNav.nLPR)
         {
            stepForPageCounterR = 0;
            pageCounterDec(currentJson, 3);
         }
      }
      else if (current_json == 2)
      {
         if (stepForPageCounterR == 5 && jsonNav2.nCPR <= jsonNav2.nLPR)
         {
            stepForPageCounterR = 0;
            pageCounterDec(currentJson, 3);
         }
      }
      else if (current_json == 3)
      {
         if (stepForPageCounterR == 5 && jsonNav3.nCPR <= jsonNav3.nLPR)
         {
            stepForPageCounterR = 0;
            pageCounterDec(currentJson, 3);
         }
      }
   }
   
   for (var i = 0; i < NS; i++)
   {
      if (current_json == 1)
      {
         if (c == 1 && currentStepL >= 0)
         {
            $('#CL' + i).html(jsonNav.aL[i+currentStepL]);
         }
         else if (c == 3 && currentStepR >= 0)
         {
            $('#CL' +(i+6)).html(jsonNav.aR[i+currentStepR]);
         }
      }
      else if (current_json == 2)
      {
         if (c == 1 && currentStepL >= 0)
         {
            $('#CL' + i).html(jsonNav2.aL[i+currentStepL]);
         }
         else if (c == 3 && currentStepR >= 0)
         {
            $('#CL' +(i+6)).html(jsonNav2.aR[i+currentStepR]);
         }
      }
      else if (current_json == 3)
      {
         if (c == 1 && currentStepL >= 0)
         {
            $('#CL' + i).html(jsonNav3.aL[i+currentStepL]);
         }
         else if (c == 3 && currentStepR >= 0)
         {
            $('#CL' +(i+6)).html(jsonNav3.aR[i+currentStepR]);
         }
      }
   }  
}

function pageForward(current_json, c)
{
   var clNum = 0;
   
   if (current_json == 1)
   {
      if (c == 1 && jsonNav.nCPL < jsonNav.nLPT - 1)
      {
         pageCounterInc(currentJson, 1);
         
         if (jsonNav.nCPL < jsonNav.nLPT)
         {
            for (var i = NS * jsonNav.nCPL; i < NS * jsonNav.nCPL + NS; i++)
            {
               if (i < jsonNav.aL.length)
               {
                  $('#CL' + clNum).html(jsonNav.aL[i]);
                  clNum++;
               }
               else
               {
                  $('#CL' + clNum).html("");
                  clNum++;
               }
            }
         }
      
         if (currentStepL + NS <= jsonNav.aL.length)
         {
            currentStepL = currentStepL + NS;
         }
      }
      else if (c == 3 && jsonNav.nCPR < jsonNav.nLPR - 1)
      {
         pageCounterInc(currentJson, 3);
         
         if (jsonNav.nCPR < jsonNav.nLPR)
         {
            for (var i = NS * jsonNav.nCPR; i < NS * jsonNav.nCPR + NS; i++)
            {
               if (i < jsonNav.aR.length)
               {
                  $('#CL' + (clNum+6)).html(jsonNav.aR[i]);
                  clNum++;
               }
               else
               {
                  $('#CL' + (clNum+6)).html("");
                  clNum++;
               }
            }   
         }
         if (currentStepR + NS <= jsonNav.aR.length)
         {
            currentStepR = currentStepR + NS;
         }
      }
   }
   else if (current_json == 2)
   {
      if (c == 1 && jsonNav2.nCPL < jsonNav2.nLPT - 1)
      {
         pageCounterInc(currentJson, 1);
         
         if (jsonNav2.nCPL < jsonNav2.nLPT)
         {
            for (var i = NS * jsonNav2.nCPL; i < NS * jsonNav2.nCPL + NS; i++)
            {
               if (i < jsonNav2.aL.length)
               {
                  $('#CL' + clNum).html(jsonNav2.aL[i]);
                  clNum++;
               }
               else
               {
                  $('#CL' + clNum).html("");
                  clNum++;
               }
            }
         }
         
         if (currentStepL + NS <= jsonNav2.aL.length)
         {
            currentStepL = currentStepL + NS;
         }
      }
      else if (c == 3 && jsonNav2.nCPR < jsonNav2.nLPR - 1)
      {
         pageCounterInc(currentJson, 3);
         
         if (jsonNav2.nCPR < jsonNav2.nLPR)
         {
            for (var i = NS * jsonNav2.nCPR; i < NS * jsonNav2.nCPR + NS; i++)
            {
               if (i < jsonNav2.aR.length)
               {
                  $('#CL' + (clNum+6)).html(jsonNav2.aR[i]);
                  clNum++;
               }
               else
               {
                  $('#CL' + (clNum+6)).html("");
                  clNum++;
               }
            }   
         }
         
         if (currentStepR + NS <= jsonNav2.aR.length)
         {
            currentStepR = currentStepR + NS;
         }
      }
   }
   else if (current_json == 3)
   {
      if (c == 1 && jsonNav3.nCPL < jsonNav3.nLPT - 1)
      {
         pageCounterInc(currentJson, 1);
         
         if (jsonNav3.nCPL < jsonNav3.nLPT)
         {
            for (var i = NS * jsonNav3.nCPL; i < NS * jsonNav3.nCPL + NS; i++)
            {
               if (i < jsonNav3.aL.length)
               {
                  $('#CL' + clNum).html(jsonNav3.aL[i]);
                  clNum++;
               }
               else
               {
                  $('#CL' + clNum).html("");
                  clNum++;
               }
            }
         }
         
         if (currentStepL + NS <= jsonNav3.aL.length)
         {
            currentStepL = currentStepL + NS;
         }
      }
      else if (c == 3 && jsonNav3.nCPR < jsonNav3.nLPR - 1)
      {
         pageCounterInc(currentJson, 3);
         
         if (jsonNav3.nCPR < jsonNav3.nLPR)
         {
            for (var i = NS * jsonNav3.nCPR; i < NS * jsonNav3.nCPR + NS; i++)
            {
               if (i < jsonNav3.aR.length)
               {
                  $('#CL' + (clNum+6)).html(jsonNav3.aR[i]);
                  clNum++;
               }
               else
               {
                  $('#CL' + (clNum+6)).html("");
                  clNum++;
               }
            }   
         }
         
         if (currentStepR + NS <= jsonNav3.aR.length)
         {
            currentStepR = currentStepR + NS;
         }
      }
   }
}

function pageBackward(current_json, c)
{
   var clNum = 0;
  
   if (current_json == 1)
   {
      if (c == 1 && jsonNav.nCPL >= 1)
      {
         pageCounterDec(currentJson, 1);
         for (var i = NS * jsonNav.nCPL; i < NS * jsonNav.nCPL + NS; i++)
         {
            if (i < jsonNav.aL.length)
            {
               $('#CL' + clNum).html(jsonNav.aL[i]);
               clNum++;
            }
            else
            {
               $('#CL' + clNum).html("");
               clNum++;
            }
         }
         
         if (currentStepL - NS >= 0)
         {
            currentStepL = currentStepL - NS;         
         }
      }
      else if (c == 3 && jsonNav.nCPR >= 1)
      {
         pageCounterDec(currentJson, 3);
         for (var i = NS * jsonNav.nCPR; i < NS * jsonNav.nCPR + NS; i++)
         {
            if (i < jsonNav.aR.length)
            {
               $('#CL' + (clNum+6)).html(jsonNav.aR[i]);
               clNum++;
            }
            else
            {
               $('#CL' + (clNum+6)).html("");
               clNum++;
            }
         }
         if (currentStepR - NS >= 0)
         {
            currentStepR = currentStepR - NS;
         }
      }
      else if (c == 1 && jsonNav.nCPL < 1)
      {
         bwEnd(currentJson, 1);
      }
      else if (c == 3 && jsonNav.nCPR < 1)
      {
         bwEnd(currentJson, 3);
      }
   }
   else if (current_json == 2)
   {
      if (c == 1 && jsonNav2.nCPL >= 1)
      {
         pageCounterDec(currentJson, 1);
         for (var i = NS * jsonNav2.nCPL; i < NS * jsonNav2.nCPL + NS; i++)
         {
            if (i < jsonNav2.aL.length)
            {
               $('#CL' + clNum).html(jsonNav2.aL[i]);
               clNum++;
            }
            else
            {
               $('#CL' + clNum).html("");
               clNum++;
            }
         }
         if (currentStepL - NS >= 0)
         {
            currentStepL = currentStepL - NS;
         }         
      }
      else if (c == 3 && jsonNav2.nCPR >= 1)
      {
         pageCounterDec(currentJson, 3);
         for (var i = NS * jsonNav2.nCPR; i < NS * jsonNav2.nCPR + NS; i++)
         {
            if (i < jsonNav2.aR.length)
            {
               $('#CL' + (clNum+6)).html(jsonNav2.aR[i]);
               clNum++;
            }
            else
            {
               $('#CL' + (clNum+6)).html("");
               clNum++;
            }
         }
         
         if (currentStepR - NS >= 0)
         {
            currentStepR = currentStepR - NS;
         }
      }
      else if (c == 1 && jsonNav2.nCPL < 1)
      {
         bwEnd(currentJson, 1);
      }
      else if (c == 3 && jsonNav2.nCPR < 1)
      {
         bwEnd(currentJson, 3);
      }
   }
   else if (current_json == 3)
   {
      if (c == 1 && jsonNav3.nCPL >= 1)
      {
         pageCounterDec(currentJson, 1);
         for (var i = NS * jsonNav3.nCPL; i < NS * jsonNav3.nCPL + NS; i++)
         {
            if (i < jsonNav3.aL.length)
            {
               $('#CL' + clNum).html(jsonNav3.aL[i]);
               clNum++;
            }
            else
            {
               $('#CL' + clNum).html("");
               clNum++;
            }
         }
         
         if (currentStepL - NS >= 0)
         {
            currentStepL = currentStepL - NS;         
         }
      }
      else if (c == 3 && jsonNav3.nCPR >= 1)
      {
         pageCounterDec(currentJson, 3);
         for (var i = NS * jsonNav3.nCPR; i < NS * jsonNav3.nCPR + NS; i++)
         {
            if (i < jsonNav3.aR.length)
            {
               $('#CL' + (clNum+6)).html(jsonNav3.aR[i]);
               clNum++;
            }
            else
            {
               $('#CL' + (clNum+6)).html("");
               clNum++;
            }
         }
         
         if (currentStepR - NS >= 0)
         {
            currentStepR = currentStepR - NS;
         }
      }
      else if (c == 1 && jsonNav3.nCPL < 1)
      {
         bwEnd(currentJson, 1);
      }
      else if (c == 3 && jsonNav3.nCPR < 1)
      {
         bwEnd(currentJson, 3);
      }
   }
}

function end(current_json, c)
{
   var clNum = 0;
   
   if (current_json == 1)
   {
      if (c == 1)
      {
         for (var i = jsonNav.aL.length - NS; i < jsonNav.aL.length; i++)
         {
            $('#CL' + clNum).html(jsonNav.aL[i]);
            clNum++;
         }
         currentStepL = jsonNav.aL.length - NS;
         pageCounterEnd(currentJson, 1);
      }
      else if (c == 3)
      {
         for (var i = jsonNav.aR.length - NS; i < jsonNav.aR.length; i++)
         {
            $('#CL' + (clNum+6)).html(jsonNav.aR[i]);
            clNum++;
         }   
         currentStepR = jsonNav.aR.length - NS;
         pageCounterEnd(currentJson, 3);
      }
   }
   else if (current_json == 2)
   {
      if (c == 1)
      {
         for (var i = jsonNav2.aL.length - NS; i < jsonNav2.aL.length; i++)
         {
            $('#CL' + clNum).html(jsonNav2.aL[i]);
            clNum++;
         }
         currentStepL = jsonNav2.aL.length - NS;
         pageCounterEnd(currentJson, 1);
      }
      else if (c == 3)
      {
         for (var i = jsonNav2.aR.length - NS; i < jsonNav2.aR.length; i++)
         {
            $('#CL' + (clNum+6)).html(jsonNav2.aR[i]);
            clNum++;
         }   
         currentStepR = jsonNav2.aR.length - NS;
         pageCounterEnd(currentJson, 3);
      } 
   }
   else if (current_json == 3)
   {
      if (c == 1)
      {
         for (var i = jsonNav3.aL.length - NS; i < jsonNav3.aL.length; i++)
         {
            $('#CL' + clNum).html(jsonNav3.aL[i]);
            clNum++;
         }
         currentStepL = jsonNav3.aL.length - NS;
         pageCounterEnd(currentJson, 1);
      }
      else if (c == 3)
      {
         for (var i = jsonNav3.aR.length - NS; i < jsonNav3.aR.length; i++)
         {
            $('#CL' + (clNum+6)).html(jsonNav3.aR[i]);
            clNum++;
         }   
         currentStepR = jsonNav3.aR.length - NS;
         pageCounterEnd(currentJson, 3);
      } 
   }   
}

function bwEnd(current_json, c)
{
   var clNum = 0;
   
   if (current_json == 1)
   {
      if (c == 1)
      {
         for (var i = 0; i < NS; i++)
         {
            $('#CL' + clNum).html(jsonNav.aL[i]);
            clNum++;
         }
         currentStepL = 0;
      }
      else if (c == 3)
      {
         for (var i = 0; i < NS; i++)
         {
            $('#CL' + (clNum+6)).html(jsonNav.aR[i]);
            clNum++;
         }   
         currentStepR = 0;
      }
   }
   else if (current_json == 2)
   {
      if (c == 1)
      {
         for (var i = 0; i < NS; i++)
         {
            $('#CL' + clNum).html(jsonNav2.aL[i]);
            clNum++;
         }
         currentStepL = 0;
      }
      else if (c == 3)
      {
         for (var i = 0; i < NS; i++)
         {
            $('#CL' + (clNum+6)).html(jsonNav2.aR[i]);
            clNum++;
         }   
         currentStepR = 0;
      } 
   }
   else if (current_json == 3)
   {
      if (c == 1)
      {
         for (var i = 0; i < NS; i++)
         {
            $('#CL' + clNum).html(jsonNav3.aL[i]);
            clNum++;
         }
         currentStepL = 0;
      }
      else if (c == 3)
      {
         for (var i = 0; i < NS; i++)
         {
            $('#CL' + (clNum+6)).html(jsonNav3.aR[i]);
            clNum++;
         }   
         currentStepR = 0;
      } 
   }   
   
   pageCounterBwEnd(c);
}

function calcPageCounter(current_json, c)
{
   if (current_json == 1)
   {
      if (c == 1)
      {
         $('#current_page_l').val(jsonNav.nCPL+1);
         $('#page_count_l').html("/"+jsonNav.nLPT);
      }
      else if (c == 3)
      {
         $('#current_page_r').val(jsonNav.nCPR+1);
         $('#page_count_r').html("/"+jsonNav.nLPR);
      }
   }
   else if (current_json == 2)
   {
      if (c == 1)
      {
         $('#current_page_l').val(jsonNav2.nCPL+1);
         $('#page_count_l').html("/"+jsonNav2.nLPT);
      }
      else if (c == 3)
      {
         $('#current_page_r').val(jsonNav2.nCPR+1);
         $('#page_count_r').html("/"+jsonNav2.nLPR);
      }
   }
   else if (current_json == 3)
   {
      if (c == 1)
      {
         $('#current_page_l').val(jsonNav3.nCPL+1);
         $('#page_count_l').html("/"+jsonNav3.nLPT);
      }
      else if (c == 3)
      {
         $('#current_page_r').val(jsonNav3.nCPR+1);
         $('#page_count_r').html("/"+jsonNav3.nLPR);
      }
   }
}

function pageCounterInc(current_json, c)
{
   if (current_json == 1)
   {
      if (c == 1)
      {
         jsonNav.nCPL++;
      }
      else if (c == 3)
      {
         jsonNav.nCPR++;
      }
   }
   else if (current_json == 2)
   {
      if (c == 1)
      {
         jsonNav2.nCPL++;
      }
      else if (c == 3)
      {
         jsonNav2.nCPR++;
      }
   }
   else if (current_json == 3)
   {
      if (c == 1)
      {
         jsonNav3.nCPL++;
      }
      else if (c == 3)
      {
         jsonNav3.nCPR++;
      }
   }
   
   calcPageCounter(current_json, c);
}

function pageCounterDec(current_json, c)
{
   if (current_json == 1)
   {
      if (c == 1)
      {
         jsonNav.nCPL--;
      }
      else if (c == 3)
      {
         jsonNav.nCPR--;
      }
   }
   else if (current_json == 2)
   {
      if (c == 1)
      {
         jsonNav2.nCPL--;
      }
      else if (c == 3)
      {
         jsonNav2.nCPR--;
      }
   }
   else if (current_json == 3)
   {
      if (c == 1)
      {
         jsonNav3.nCPL--;
      }
      else if (c == 3)
      {
         jsonNav3.nCPR--;
      }
   }
   
   calcPageCounter(current_json, c);
}

function pageCounterEnd(current_json, c)
{
   if (current_json == 1)
   {
      if (c == 1)
      {
         jsonNav.nCPL = jsonNav.nLPT-1;
      }
      else if (c == 3)
      {
         jsonNav.nCPR = jsonNav.nLPR-1;
      }
   }
   else if (current_json == 2)
   {
      if (c == 1)
      {
         jsonNav2.nCPL = jsonNav2.nLPT-1;
      }
      else if (c == 3)
      {
         jsonNav2.nCPR = jsonNav2.nLPR-1;
      }
   }
   else if (current_json == 3)
   {
      if (c == 1)
      {
         jsonNav3.nCPL = jsonNav3.nLPT-1;
      }
      else if (c == 3)
      {
         jsonNav3.nCPR = jsonNav3.nLPR-1;
      }
   }
   
   calcPageCounter(current_json, c);
}

function pageCounterBwEnd(c)
{
   if (currentJson == 1)
   {
      if (c == 1)
      {
         jsonNav.nCPL = 0;
      }
      else if (c == 3)
      {
         jsonNav.nCPR = 0;
      }
   }
   else if (currentJson == 2)
   {
      if (c == 1)
      {
         jsonNav2.nCPL = 0;
      }
      else if (c == 3)
      {
         jsonNav2.nCPR = 0;
      }
   }
   else if (currentJson == 3)
   {
      if (c == 1)
      {
         jsonNav3.nCPL = 0;

      }
      else if (c == 3)
      {
         jsonNav3.nCPR = 0;
      }
   }
   
   calcPageCounter(currentJson, c);
}

function pageCounterOnInput(c, inputed_value)
{
   /*if (currentJson == 1)
   {
      if (c == 1)
      {
         if (inputed_value <= jsonNav.nLPT)
         {
            jsonNav.nCPL = inputed_value;
         }
         else
         {
            jsonNav.nCPL = jsonNav.nLPT-1;
         }
      }
      else if (c == 3)
      {
         if (inputed_value <= jsonNav.nLPR)
         {
            jsonNav.nCPR = inputed_value;
         }
         else
         {
            jsonNav.nCPR = jsonNav.nLPR-1;
         }
      }
   }
   else if (currentJson == 2)
   {
      if (c == 1)
      {
         if (inputed_value <= jsonNav2.nLPT)
         {
            jsonNav2.nCPL = inputed_value;
         }
         else
         {
            jsonNav2.nCPL = jsonNav2.nLPT-1;
         }
      }
      else if (c == 3)
      {
         if (inputed_value <= jsonNav2.nLPR)
         {
            jsonNav2.nCPR = inputed_value;
         }
         else
         {
            jsonNav2.nCPR = jsonNav.nLPR-1;
         }
      }
   }
   else if (currentJson == 3)
   {
      if (c == 1)
      {
         if (inputed_value <= jsonNav3.nLPT)
         {
            jsonNav3.nCPL = inputed_value;
         }
         else
         {
            jsonNav3.nCPL = jsonNav3.nLPT-1;
         }

      }
      else if (c == 3)
      {
         if (inputed_value <= jsonNav3.nLPR)
         {
            jsonNav3.nCPR = inputed_value;
         }
         else
         {
            jsonNav3.nCPR = jsonNav3.nLPR-1;
         }
      }
   }*/
   jsonNav.nCPR = inputed_value;
   
   calcPageCounter(currentJson, c);
   alert(jsonNav.nCPR);
}
