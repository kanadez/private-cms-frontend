
// Panel contain focus
var select_panel = -1;

// Types community
var community = {
    type: ['l-type-1', 'l-type-2'],
    name: ['Associative', 'Straight']
};

// Add or Edit operation
var operation = 'add';

// Show Simple Message Dialog
function showMsg(title, msg) {
    if($("#message").length == 0 )
        $('body').append('<div id="message"></div>');

    $('#message').attr('title', title);
    $('#message').html(msg);
    $('#message').dialog({resizable: false, modal: true, 
        buttons: {
            "Ok": function() {
                    $(this).dialog("close");
                }
            }
    });
}

//Show Confirm dialog whith callback function
function confirmDialog(msg, callback) {
    if($("#confirm").length == 0 )
        $('body').append('<div id="confirm"></div>');

    $('#confirm').attr('title', 'Confirm');
    $('#confirm').html(msg);
    $('#confirm').dialog({
            modal: true,
            resizable: false,
            buttons: {
                "Yes": function() {
                    if(typeof callback == 'function')
                        callback();
                    $('#confirm').dialog('close');
                },
                "No": function() {
                    $(this).dialog("close");
                }
            }
    });
}

// Navigate object
var jsonNav = {};

// Selected Object
var soData = {
    id: -1,
    linktype: -1
};


// Document initialize
$(document).ready(function() {
    loadLinks(0);
    curTest++;
});


// Load data (Emulation Server)
function loadLinks(id) {
    $('.load-panel').fadeIn('fast');
    
    jsonNav = testData[id];

    setTimeout(function() {
        $('.navigate-form .c1 .cont, .navigate-form .c3 .cont,\n\
           .navigate-form .gpl .cont, .navigate-form .gpr .cont').empty().hide().css('top', '0');

        $.each(jsonNav.aL, function(index, item){
            $('.navigate-form .c1 .cont').append('<div id="'+jsonNav.aIDL[index]+'" class="cl"><div class="c">'+item+'</div></div>');
            $('.navigate-form .gpl .cont').append('<div rel="'+jsonNav.aIDL[index]+'" class="'+jsonNav.aAL[index]+'"></div>');
        });

        $.each(jsonNav.aR, function(index, item){
            $('.navigate-form .c3 .cont').append('<div id="'+jsonNav.aIDR[index]+'" class="cl"><div class="c">'+item+'</div></div>');
            $('.navigate-form .gpr .cont').append('<div rel="'+jsonNav.aIDR[index]+'" class="'+jsonNav.aAR[index]+'"></div>');
        });

        $('.navigate-form .ln .all_page').text(Math.ceil(jsonNav.nLPT / jsonNav.NS));
        $('.navigate-form .rn .all_page').text(Math.ceil(jsonNav.nRPT / jsonNav.NS));

        $('.navigate-form .ln .all_items').val(jsonNav.nLPT);
        $('.navigate-form .rn .all_items').val(jsonNav.nRPT);

        InitActions();

        $('.load-panel').fadeOut('fast');
        $('.navigate-form .c1 .cont, .navigate-form .c2 .cont .c, .navigate-form .c3 .cont,\n\
           .navigate-form .gpl .cont, .navigate-form .gpr .cont').fadeIn('normal');

        $('.cur_page').val('1');


        ListenerSelectItem();

        $.simpledropdown("#community_combo");

        $('.buttons .save').button().unbind('click').click(function(){
            main.linktype = $("#community_combo li:first").attr('rel');

            $(".mask").animate({'opacity': 0}, 500, function(){
                $(this).css({top: 0, left: 0, height: 0, width: 0});
                var item = {
                    a: main.text,
                    aID: 'id'+main.id,
                    aA: main.linktype
                };

                if(operation == 'add')
                    AddItem(select_panel, item);

                else if(operation == 'edit') {
                    $('#'+soData.id+' .c').text($('.link-setting-form .cl .c').text());
                    $('#'+soData.id).attr('id', 'id'+main.id);
                    
                    if(select_panel == 'c1') {
                        $('div[rel*="'+soData.id+'"]', $('.gpl')).attr('class', main.linktype);

                        $(jsonNav.aIDL).each(function(index, item){
                            if(soData.id == item) {
                                jsonNav.aL[index] = $('.link-setting-form .cl .c').text();
                                jsonNav.aAL[index] = main.linktype;
                                
                                if(main.id) {
                                    jsonNav.aIDL[index] = 'id'+main.id;
                                    $('div[rel*="'+soData.id+'"]', $('.gpl')).attr('rel', 'id'+main.id);
                                }
                            }
                        });
                    }
                    else if(select_panel == 'c3') {
                        $('div[rel*="'+soData.id+'"]', $('.gpr')).attr('class', main.linktype);

                        $(jsonNav.aIDR).each(function(index, item){
                            if(soData.id == item) {
                                jsonNav.aR[index] = $('.link-setting-form .cl .c').text();
                                jsonNav.aAR[index] = main.linktype;

                                if(main.id) {
                                    jsonNav.aIDR[index] = 'id'+main.id;
                                    $('div[rel*="'+soData.id+'"]', $('.gpr')).attr('rel', 'id'+main.id);
                                }
                            }
                        });
                    }

                    $('.navigate-form .cl').removeClass("selected-item");
                    soData.id = -1;
                    soData.linktype = -1;
                }
            });
            $('.link-setting-form').fadeOut();

        });

        $('.buttons .cancel').button().unbind('click').click(function(){
            $(".mask").animate({'opacity': 0}, 500, function(){
                $(this).css({top: 0, left: 0, height: 0, width: 0});
            });
            $('.link-setting-form').fadeOut();
        });


        $('.link-setting-form .close').unbind('click').click(function() {
            $(".mask").animate({'opacity': 0}, 500, function(){
                $(this).css({top: 0, left: 0, height: 0, width: 0});
            });
            $('.link-setting-form').fadeOut();
        });

        $('#search_btn').unbind('click').click(function(){
            OpenSearchForm();
        });

         // Edit Button click
        $('.but_edit').unbind('click').click(function(){
            var panel = $(this).parent().attr('rel');
            if($('.selected-item', $("."+panel)).length <=0 ) {
                showMsg("Message", "Please select item to edit!");
                return;
            }

            operation = 'edit';

            var _self = this;
            select_panel = $(_self).parent().attr('rel');

            if (select_panel == 'c1') {
               $(jsonNav.aIDL).each(function(index, item){
                   if(soData.id == item) {
                        $(".mask").css({top: 0, left: 0, height: $(document).height() + 'px', width: '100%'}).animate({'opacity': 0.5}, 500);
                        $('.link-setting-form').css({left: $('.mask').width()/2-210 + 'px', top: $('.mask').height() / 2 - 120 + 'px' }).fadeIn();

                        $('.link-setting-form .cl .c').text(jsonNav.aL[index]);
                        
                        var type = $('div[rel*="'+soData.id+'"]', $('.gpl')).attr('class');

                        $(community.type).each(function(index, item){
                            if(item == type) {
                                $('#community_combo .selected').text(community.name[index]);
                                $('#community_combo .selected').attr('rel', type);
                            }
                        });


                   }
                });
            }
            else if (select_panel == 'c3') {
               $(jsonNav.aIDR).each(function(index, item){
                   if(soData.id == item) {
                        $(".mask").css({top: 0, left: 0, height: $(document).height() + 'px', width: '100%'}).animate({'opacity': 0.5}, 500);
                        $('.link-setting-form').css({left: $('.mask').width()/2-210 + 'px', top: $('.mask').height() / 2 - 120 + 'px' }).fadeIn();

                        $('.link-setting-form .cl .c').text(jsonNav.aR[index]);

                        var type = $('div[rel*="'+soData.id+'"]', $('.gpr')).attr('class');

                        $(community.type).each(function(index, item){
                            if(item == type) {
                                $('#community_combo .selected').text(community.name[index]);
                                $('#community_combo .selected').attr('rel', type);
                            }
                        });
                   }
                });
            }
        });


        // Remove Button click
        $('.but_del').unbind('click').click(function(){
            var panel = $(this).parent().attr('rel');
            if($('.selected-item', $("."+panel)).length <=0 ) {
                showMsg("Message", "Please select item to remove!");
                return;
            }
            confirmDialog("Are you sure?", function() {

               // For left panel
               if(panel == 'c1') {
                    var pos = $('#' + soData.id, $('.c1')).position() ;
                    //alert(pos.top);
                    $('.load-left').css({top: pos.top + 50 + 'px'}).fadeIn('fast');


                    setTimeout(function() {                   
                        $(jsonNav.aIDL).each(function(index, item){
                           $('.load-left').fadeOut('fast');
                           if(soData.id == item) {
                               delete jsonNav.aL[index];
                               delete jsonNav.aIDL[index];
                               delete jsonNav.aAL[index];
                               jsonNav.nLPT -- ;

                               $('#' + soData.id, $('.c1')).animate({opacity: 0}, 'normal',
                                    function() {
                                        $(this).remove();
                               });
                               $('div[rel*="'+soData.id+'"]', $('.gpl')).animate({opacity: 0}, 'normal',
                                    function() {
                                        $(this).remove();
                               });

                               $('.ln .all_items').val( parseInt($('.ln .all_items').val()) -1);

                               soData.id = -1;
                               soData.linktype = -1;
                           }
                        });                    
                    }, 1000);
              }

              // For right panel
              else if(panel == 'c3') {
                   var pos = $('#' + soData.id, $('.c3')).position();
                   $('.load-right').css({top: pos.top + 50 + 'px'}).fadeIn('fast');

                    setTimeout(function() {
                        $(jsonNav.aIDR).each(function(index, item){
                           $('.load-right').fadeOut('fast');
                           if(soData.id == item) {
                               delete jsonNav.aR[index];
                               delete jsonNav.aIDR[index];
                               delete jsonNav.aAR[index];
                               jsonNav.nRPT -- ;

//
                               $('#' + soData.id, $('.c3')).animate({opacity: 0}, 'normal',
                                    function() {
                                        $(this).remove();
                               });
                               $('div[rel*="'+soData.id+'"]', $('.gpr')).animate({opacity: 0}, 'normal',
                                    function() {
                                        $(this).remove();
                               });

                               $('.rn .all_items').val( parseInt($('.rn .all_items').val()) -1);

                               soData.id = -1;
                               soData.linktype = -1;
                               return;
                           }
                        });
                    }, 1000);
              }

              
            });
        });

        // Add Button
        $('.but_add').unbind('click').click(function(){
            select_panel = $(this).parent().attr('rel');
            $(".mask").css({top: 0, left: 0, height: '100%', width: '100%'}).animate({'opacity': 0.5}, 500);
            $('.link-setting-form').css({left: $('.mask').width()/2-210 + 'px'}).fadeIn();
            console.log($('.mask').width());
            $('.link-setting-form .cl .c').text('');

            operation = 'add';
        });
            
    }, 1500);
}

// Binding of client events
var hItem = 102; //Height + margin + border item
function InitActions() {
    $('.navigate-form .cur_page').unbind('keypress').keypress(function(e){
        if(e.keyCode != 13)
            return;

        var self = this;

        var page = parseInt( $('.cur_page', $(this).parent()).val() ) || 1;
        var all = $('.all_items', $(this).parent()).val();
        var maxPages = Math.ceil(all / jsonNav.NS);

        if(page > maxPages)
            page = maxPages;
        else if(page < 1)
            page = 1;

        if(page>=1 && page <= maxPages) {
            var panel = $('.'+ $('.panel', $(this).parent()).val() + ' .cont');
            var arrows = $('.'+ $('.panel', $(this).parent()).attr('rel') + ' .cont');

            var newTop = -((page-1)*hItem*jsonNav.NS);

            if(newTop < -hItem*(all - jsonNav.NS))
                newTop = -hItem*(all - jsonNav.NS);
            
            panel.animate({'top': newTop + 'px'}, 500, "swing");
            arrows .animate({'top': newTop + 'px'}, 500, "swing", function(){                
                $('.cur_page', $(self).parent()).val(page);
                InitActions();
            });

        }
    });

 
    // Paginator
    $('.navigate-form .pager .next, .navigate-form .pager .prev, \n\
       .navigate-form .pager .fastnext, .navigate-form .pager .fastprev,\n\
       .navigate-form .pager .forward, .navigate-form .pager .rewind').unbind('click').click(function(){

        $(this).unbind('click');

        var panel = $('.'+ $('.panel', $(this).parent()).val() + ' .cont');
        var arrows = $('.'+ $('.panel', $(this).parent()).attr('rel') + ' .cont');

        var all = $('.all_items',$(this).parent()).val();

        if(all < jsonNav.NS)
            return;

        var top = parseInt(panel.css('top'));
        var newTop = 0;

        if($(this).is('.next')) {
            newTop = top - hItem;
        }
        else if($(this).is('.prev')) {
            newTop = top + hItem;
        }
        else if($(this).is('.fastnext')) {
            
            newTop = (top - hItem*jsonNav.NS);
            var cur = Math.ceil(newTop / (hItem*jsonNav.NS));
            newTop = cur*hItem*jsonNav.NS;
        }
        else if($(this).is('.fastprev')) {
            newTop = (top + hItem*jsonNav.NS);
        }
        else if($(this).is('.forward')) {            
            newTop = (top - hItem * (all - jsonNav.NS));
        }
        else if($(this).is('.rewind')) {
            newTop = 0;
        }
        
        if(newTop > 0) {
            newTop = 0;
            panel.animate({'top': newTop + 'px'}, 500, "swing");
            arrows .animate({'top': newTop + 'px'}, 500, "swing", function(){               
                showMsg('Message', '<br/>Start list!');
                InitActions();
            });
        }
        else if(newTop < -hItem*(all - jsonNav.NS)) {
            newTop = -hItem*(all - jsonNav.NS);
            panel.animate({'top': newTop + 'px'}, 500, "swing");
            arrows .animate({'top': newTop + 'px'}, 500, "swing", function(){

                showMsg('Message', '<br/>End list!');
                InitActions();
            });
        }
        else {
            panel.animate({'top': newTop + 'px'}, 500, "swing");
            arrows .animate({'top': newTop + 'px'}, 500, "swing", function(){
                InitActions();
            });
        }

        var cur = - Math.floor(newTop / (hItem*jsonNav.NS)) + 1;
        if(cur<=0) cur = 1;
        $('.cur_page', $(this).parent()).val(cur);
        
    });

}


// Navigate test data (3 object)
//-----------------------------------------------------------------------------
var curTest=0;
var testData = [];
testData[0] = {
    //Count visible items
    NS: 5,

    // Left Panel
    nCPL: 1,
    nLPT: 3,

    aL:   ['Object #1','Object #2','Object #3'],

    aIDL: ['id1', 'id2','id3'],

    aAL:  ['l-type-1','l-type-2','l-type-2'],


   //Right Panel
    nCPR: 1,
    nRPT: 1,

    aR:   ['Object #11'],

    aIDR: ['id11'],

    aAR:  ['l-type-2']
};


function ListenerSelectItem() {
// Selected Item in left or right block
    $('.navigate-form .c1 .cl, .navigate-form .c3 .cl').unbind('click').click(function(){

        $('.navigate-form .cl').removeClass("selected-item");
        $(this).addClass('selected-item');

        soData.id = $(this).attr('id');
        soData.linktype = $('div[rel*="'+soData.id+'"]', $('.'+$(this).parent().attr('rel'))).attr('rel');
    });
}

function DeleteObject() {
 //   alert(1);
}

function AddItem(panel, item) {
    if(panel == 'c1') {        
        if( $.inArray(item.aID, jsonNav.aIDL) != -1   ) {
            showMsg('Message', 'Element exist!');
            return;
        }

        $('<div style="display: none" rel="'+item.aID+'" class="'+item.aA+'"></div>').prependTo('.navigate-form .gpl .cont')
            .fadeIn();

        $('<div style="height: 0" id="'+item.aID+'" class="cl"><div class="c">'+item.a+'</div></div>').prependTo('.navigate-form .c1 .cont')
            .animate({height: '90px'}, 'normal',
                function() {

        });


        jsonNav.aL.push(item.a);
        jsonNav.aIDL.push(item.aID);
        jsonNav.aAL.push(item.aA);
        jsonNav.nLPT ++ ;

        $('.navigate-form .ln .all_items').val( jsonNav.nLPT );
        $('.navigate-form .ln .all_page').text(Math.ceil(jsonNav.nLPT / jsonNav.NS));
    }

    else if(panel == 'c3') {
        if( $.inArray(item.aID, jsonNav.aIDR) != -1  ) {
            showMsg('Message', 'Element exist!');
            return;
        }

        $('<div style="height: 0" id="'+item.aID+'" class="cl"><div class="c">'+item.a+'</div></div>').prependTo('.navigate-form .c3 .cont')
            .animate({height: '90px'}, 'normal',
                function() {

           });
        $('<div style="display: none" rel="'+item.aID+'" class="'+item.aA+'"></div>').prependTo('.navigate-form .gpr .cont')
            .fadeIn();

        jsonNav.aR.push(item.a);
        jsonNav.aIDR.push(item.aID);
        jsonNav.aAR.push(item.aA);
        jsonNav.nRPT ++ ;

        $('.navigate-form .rn .all_items').val( jsonNav.nRPT );
        $('.navigate-form .rn .all_page').text(Math.ceil(jsonNav.nRPT / jsonNav.NS));
    }

    ListenerSelectItem();
}


function EditItem(panel, item) {
}

var main = {
  id: -1,
  linktype: -1,
  text: ""
};

function SetCentralItem(id, data) {
    main.id = id;
    main.text = data;

    $('.link-setting-form .cl .c').text(data);
}
