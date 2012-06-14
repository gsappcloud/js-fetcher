var head = document.getElementsByTagName('head')[0];
script = document.createElement('script');
script.src = "http://postfog.org/assets/js/jquery.masonry.min.js";
script.type = 'text/javascript';
head.appendChild(script);

script = document.createElement('script');
script.src = "http://postfog.org/assets/js/fetcher.js";
script.type = 'text/javascript';
head.appendChild(script);


$(document).ready(function () {
	
	
    /* menu */
    if ($(".not-front #one_col_lt").size()) {
      $(".not-front #one_col_lt div.block-menu_block:first").addClass("first");
    }
    
 	

$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",

        function(data){
          $.each(data.items, function(i,item){
            $("<img/>").attr("src", item.media.m).appendTo("#item-" + i);
            console.log('item added: ' + i + ' / 10');
            if ( i == 10 ) {
            return false;
            }
          });




});
    
    /* events column redesign for abstract */
    var htmlForEvents = '<h2 class="title" style="text-align:left;">Announcements</h2><div class="border"><p style="margin-top:10px; text-align:left;"><a href="http://www.arch.columbia.edu/announcement/abstract-2010-11-here" style="font-size: 15px; font-weight: bold;">ABSTRACT 2011-10 IS HERE!</a></p><p style="text-align:left"><strong>GSAPP Alumni–</strong> <br />To receive your copy of Abstract, <a href="http://www.arch.columbia.edu/announcement/abstract-2010-11-here">click</a> through for more information</p><a href="http://www.arch.columbia.edu/announcement/abstract-2010-11-here"><img src="http://www.arch.columbia.edu/files/gsapp/imceshared/lld2117/Abstract_cover_resize.png" /></a></div><div class="border"><a target="_blank" id="cc-sprite" href="http://www.arch.columbia.edu/sign-weekly-event-listing-email-cc">Subscribe</a></div><style type="text/css">#two_col_rt #one_col_lt{text-align:center;}#cc-sprite {display:block; margin-top:20px; width:217px; height:217px; background:url("http://www.arch.columbia.edu/files/gsapp/imceshared/lld2117/120608_CC_Subscribe_sprite.png") no-repeat 0 0; text-indent:-9999px; }#cc-sprite:hover {background:url("http://www.arch.columbia.edu/files/gsapp/imceshared/lld2117/120608_CC_Subscribe_sprite.png") no-repeat 0 -217px; }.border {border-bottom: 1px solid #EFEFEF;padding-bottom: 30px;}</style>';
	
	$("#two_col_rt #one_col_lt").html(htmlForEvents);
    
    


    /* sundial item edit form */    
    if ($(".node-type-aggregation-item #content").length) {
      $(".node-type-aggregation-item #content #node-form fieldset legend a:contains('Vocabularies')") .parent() .parent() .after("<div class='sundial-edit-message'>Please make all other changes to this item directly in Sundial.</div>");
      $(".node-type-aggregation-item #content #node-form fieldset legend a:contains('Vocabularies')") .parent() .parent() .show().find(".form-item") .show();
      $(".node-type-aggregation-item #content #node-form #edit-taxonomy-7-wrapper") .hide();
    }
    
    if ($("#block-views-calendar-calendar_block").length) {
      $("#block-views-calendar-calendar_block .mini-day-off a") .attr('href', '#').attr('onclick', 'return false');
    }
    if ($("#edit-taxonomy-4").length) {
      $("#edit-taxonomy-4 option:contains('All')") .hide();
    }
    
    if ($(".node-type-overview-page").length) {
      $(".node-type-overview-page #content .left-overview-content .entry").after($(".node-type-overview-page #comments"));
      $(".node-type-overview-page #comments").before($(".node-type-overview-page #comments-title"));
    }
    
    if ($(".menu-item-form").length) {
      $(".menu-item-form").removeClass('collapsed');
    }
    
    if ($(".section-node-add .faculty, .section-node-edit .faculty").length) {
      $(".section-node-add .faculty fieldset").addClass('collapsible');
      $(".section-node-add .faculty fieldset").addClass('collapsed');
      $(".section-node-add .faculty .menu-item-form").removeClass('collapsed');
      $(".section-node-add .faculty fieldset legend:contains('Content')").parent().removeClass('collapsed');
      
      $(".section-node-edit .faculty fieldset").addClass('collapsible');
      $(".section-node-edit .faculty fieldset").addClass('collapsed'); 
      $(".section-node-edit .faculty .menu-item-form").removeClass('collapsed');
      $(".section-node-edit .faculty fieldset legend:contains('Content')").parent().removeClass('collapsed');
    }
    
    if ($(".section-my-site").length) {
      $(".section-my-site .more-link a").text("Read More");
      $(".section-my-site .views-field-edit-node .field-content:contains('')").parent().hide();
    }

    if ($("fieldset legend").length) {
      $("fieldset legend a:contains('Vocabularies')").text('Classification');
    }
    if ($("#guestbook-form-entry-form").length) {
      $("#guestbook-form-entry-form #edit-submit").val('Save');
    }
    if ($(".imce #simplemenu").length) {
      $(".imce #simplemenu").hide();
    }
    
    
});