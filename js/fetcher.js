/* 6/13/2012
 *
 * Author: Jochen Hartmann
 */

/**
 * Namespacing
 */
var gsappFetcher = {};

/**
 * @fileoverview Frontend app to to handle events and DOM manipulation for
 * revised GSAPP dashboard.
 */


/**
 * Whether to log to firebug console (wraps console.log)
 * @type Boolean
 */
gsappFetcher.enableLogging = true;

/**
 * Storing proper stings for month names since the native JS Date object
 * only contains abbreviations
 * @type Array
 */
gsappFetcher.month_names;

/**
 * Storing proper stings for day names since the native JS Date object
 * only contains abbreviations
 * @type Array
 */
gsappFetcher.day_names;

/**
 * How many posts to get from a tumblr feed. Default is 10
 * @type Number
 */
gsappFetcher.tumblr_posts = 10;

/**
 * Write to firebug console if logging enabled
 * @param {String,Object} data The item to log
 */
gsappFetcher.log = function(data) {
  if (gsappFetcher.enableLogging == true) {
    console.log(data);
  }
}

/**
 * Find CSS color class based off location
 * @param {String} The location string, i.e. New York
 * @return {String, Boolean} The css class, i.e. 'north-america' if found,
 * false otherwise
 */
gsappFetcher.findLocationClass = function(location_string) {
	// basic array that we can use to store future location code mappings
	locations = new Array();
	locations['Amman'] = 'middle-east';
	locations['Barcelona'] = 'europe';
	locations['Beijing'] = 'asia';
	locations['Moscow'] = 'europe';
	locations['Mumbai'] = 'south-asia';
	locations['New York'] = 'north-america';
	locations['Rio de Janiero'] = 'latin-america';
	locations['Sao Paulo'] = 'latin-america';
	locations['Toronto'] = 'north-america';
	
	
	test_location = locations[location_string];
	if ((test_location != null) && (test_location != undefined)) {
		return test_location;
	} else {
		return false;
	}
}

/**
 * Convert location array to CSS color array
 * @param {Array} An array of locations
 * @return {String} The CSS class found for the location
 */
gsappFetcher.getCSSColorClassForLocations = function(locations_array) {
	var color_location = '';
	for (var j=0;j<locations_array.length;j++) {
		var color_class = gsappFetcher.findLocationClass(locations_array[j]);
		if (color_class != false) {
			return color_class;
		}
	}
	return color_location;
}


/**
 * Parse location names from Drupal location HTML output
 * @param {String} The location string from Drupal view output
 * @return {Array} An arry of location strings
 */
gsappFetcher.getLocationsFromHTML = function(location_string) {
	var location_element = $(location_string);
	var locations = $("span.lineage-item", location_element);
	var locations_array = [];
	for (var i=0;i<locations.length;i++){
		locations_array.push($(locations[i]).text());
	}
	return locations_array;
}

/**
 * Get event types from Drupal HTML string
 * @param {String} The location string from Drupal view output
 * @return {Array} An arry of type strings
 */
gsappFetcher.getEventTypesFromHTML = function(types_string) {
	// TODO maybe abstract this more later
	return gsappFetcher.getLocationsFromHTML(types_string);
}			

/**
 * Parse event description from Drupal post body, extracting
 * all of the p tags
 * @param {String} The body string from Drupal view output
 * @return {Array} An array of paragraph tags
 */
gsappFetcher.parseEventBodyHTML = function(body_string) {
	var body_element = $(body_string);
	var p_tags = [];

	for(var p=0;p<body_element.length;p++) {
		var inner_element = body_element[p];
		if (inner_element === Object(inner_element)) {
			var html_data = inner_element.outerHTML;
			var inner_html = inner_element.innerHTML;
			// if inner_html len is < 6 then its probably just an nbsp tag
			if ((inner_html != undefined) && (inner_html.length > 6)) {
				p_tags.push(html_data);
			}
		}
	}
	return p_tags;
}


/**
 * Convert a date from drupal output to a proper JS Date object
 * @param {String} The date string from Drupal
 * @return {Date} JS Date object
 */
gsappFetcher.createDateObject = function(date_string) {
	var year = date_string.substr(0,4);
	var month = date_string.substr(5,2) - 1;
	var day = date_string.substr(8,2);
	var hour = date_string.substr(11,2);	
	var min = date_string.substr(14,2);
	var sec = date_string.substr(17,2);
	return new Date(year,month,day,hour,min,sec);
}


/**
 * Formate a Date object into a custom date string
 * @param {Date} JS Date object
 * @return {String} String in the format:
 * Tuesday, May 8, 2012 7:00pm
 */
gsappFetcher.formatDate = function(date) {

	// append 0 to minutes if < 10
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	var end_string = 'am';
	var hours = date.getHours();
	if (hours > 12) {
		hours = hours - 12;
		end_string = 'pm';
	}
	
	date_string_a = [
		day_names[date.getDay()], ', ',
		month_names[date.getMonth()], ' ',
		date.getDate(), ', ', date.getFullYear(), ' ',
		hours, ':', minutes, end_string];
	
	return date_string_a.join('');
}

/**
 * Formate a Date object into a custom date string for the date box
 * @param {Date} JS Date object
 * @return {String} HTML string in the format:
 * May<br/>8
 */

gsappFetcher.formatDateForBox = function(date) {
	var month_name = month_names[date.getMonth()];
	return [month_name.substr(0,3), '<br/>',
		date.getDate()].join('');
}


/**
 * Function to start various other calls
 * @return void
 */
gsappFetcher.start = function() {
	// initialize internal data
	month_names = new Array ( );
	month_names[month_names.length] = "January";
	month_names[month_names.length] = "February";
	month_names[month_names.length] = "March";
	month_names[month_names.length] = "April";
	month_names[month_names.length] = "May";
	month_names[month_names.length] = "June";
	month_names[month_names.length] = "July";
	month_names[month_names.length] = "August";
	month_names[month_names.length] = "September";
	month_names[month_names.length] = "October";
	month_names[month_names.length] = "November";
	month_names[month_names.length] = "December";
	day_names = new Array ( );
	day_names[day_names.length] = "Sunday";
	day_names[day_names.length] = "Monday";
	day_names[day_names.length] = "Tuesday";
	day_names[day_names.length] = "Wednesday";
	day_names[day_names.length] = "Thursday";
	day_names[day_names.length] = "Friday";
	day_names[day_names.length] = "Saturday";

	gsappFetcher.log('start called in fetcher');
/*
	commenting this out since this is now being called in the nodequeue based preview page
gsappFetcher.getFlickrWidget(
		"http://dashboard.postfog.org/node/30?callback=?", "#item-1");
		
		
	gsappFetcher.getFlickrWidget(
		"http://dashboard.postfog.org/node/29?callback=?", "#item-2");

*/

}




/**
 * Change the number of posts being read from a tumblr blog
 * @return void
 */
gsappFetcher.setTumblrPosts = function(number) {
	if ((number != undefined) && (isNaN(number) == false)) {
		gsappFetcher.tumblr_posts = number;
	}
}

/**
* Function to return tumblr data from tumblr API v1
*
* @param {String} url The URL for the JSON feed
* @param {String} elementName The name of the DOM container to write into. 
* Optional. If not provided, the default div#tumblr-results will be used, if 
* found.
* @return void
*/
gsappFetcher.getTumblr = function(url, element_name) {
	var final_url = null;
	// clean the URL in case / at last char
	if (url.charAt(url.length-1) == '/') {
		url = url.substr(0, url.length-1);
	}
	final_url = url + "/api/read/json?callback=?";
	
	$.getJSON(final_url, function(data) {
    $.each(data.posts.slice(0,gsappFetcher.tumblr_posts), function(i,posts){
      var type = this.type;
			var url = this.url;
			var multi_content_flag = false; 
		
      // format the date
      var date_ts = this["unix-timestamp"];
      var date = new Date(date_ts*1000); // must multiply by 1000 (js specific)
      var date_string = gsappFetcher.formatDate(date);

			// process tags if any
      var tags = this.tags || null;
			var tag_string = '';      
      if (this.tags != null) {
      	tag_string = this.tags.join(', ');
      }
			
			// does the post body contain multiple photos?
			if ((this.type == 'photo') && (this["photos"].length > 0)) {
				multi_content_flag = true;
			}
			
			// TODO image aspect resizing for proper IMG tags

			var tumblr_title = null;
			var tumblr_content = null;
			var tumblr_caption = null;
			var multi_content = new Array();
			var multi_caption = new Array();
			
			switch(type) {
				
				case 'link':
					tumblr_content_a = new Array();
					if (this["link-text"] != null) {
						tumblr_content_a= ['<h2><a href="', this["link_url"], '" target="_blank">', this["link-text"], '</a></h2>'];
					} else {
						// no title
						tumblr_content_a = ['<h2><a href="', this["link_url"], '" target="_blank">', this["link-url"], '</a></h2>'];
					}					
					if (this["link-description"].length > 0) {
						tumblr_content_a.push('<div class="embedded-tumblr-link-description">');
						tumblr_content_a.push(this["link-description"]);
						tumblr_content_a.push('</div>');
					}
					tumblr_content = tumblr_content_a.join('');
					break;					
				case 'quote':
					tumblr_content = [this["quote-text"], "<br/>&mdash; ", this["quote-source"]].join('');
					break;
				case 'video':
					tumblr_content = this["video-player-500"];
					tumblr_caption = this["video-caption"] || null;
					break;
				case 'audio':
					tumblr_content = this["audio-player"];
					tumblr_caption = this["id3-title"] || null;
					break;
				case 'conversation':
					
				//TODO break up into structured inner divs
					var temp_content = new Array();
					for(var c=0; c< this["conversation"].length;c++) {
						var conversation_part = this["conversation"][c];
						var inner_convo_string = [
							'<div class="embed-tumblr-conversation-segment">',
							'<div class="embed-tumblr-conversation-speaker">',
							conversation_part["name"], ': </div>',
							'<div class="embed-tumblr-conversation-phrase">',
							conversation_part["phrase"], '</div>', '</div>'].join('');
						temp_content.push(inner_convo_string);
					}
					tumblr_title = this["conversation-title"] || null;
					tumblr_content = temp_content.join('');
					break;
				case 'regular':
					tumblr_title = this["regular-title"] || null;
					tumblr_content = this["regular-body"] || null;
					break;
				case 'photo': // consider multi, if yes, then make arrays
					if (multi_content_flag == true) {
						for(var c=0;c<this["photos"].length;c++) {
							var photo_item = this["photos"][c];
							if(c == 0){
								var content = ['<img src="', photo_item["photo-url-500"],
							'" class="tmpltzr-image" alt="tumblr image" />'].join('');
							}else{
								var content = ['<img src="', photo_item["photo-url-250"],
							'" class="tmpltzr-image-small" alt="tumblr image" />'].join('');
							}
							multi_content.push(content);
							multi_caption.push(photo_item["caption"]);
						}
					
					} else { // single photo only
						tumblr_content = ['<img src="', this["photo-url-500"],
							'" class="tmpltzr-image" alt="tumblr image" />'].join('');
						tumblr_caption = this["photo-caption"] || null;
					}
					break;
			}
			
			var tumblr_div = [
				'<div class="embedded-tumblr">',
				'<div class="tumblr-post-date">',
				date_string, '</div>'];
			
			// is there a title
			if (tumblr_title != null) {
				tumblr_div.push('<h2>');
				tumblr_div.push(tumblr_title);
				tumblr_div.push('</h2>');
			}
			
			// main content: is there one more items (i.e. photos)
			if (multi_content == false) {
				var content_string = [
					'<div class="tmpltzr-body ',
					type, '">', tumblr_content];
				if (tumblr_caption != null) {
					content_string.push('<div class="tmpltzr-caption">');
					content_string.push(tumblr_caption);
					content_string.push('</div>');
				}
				tumblr_div.push(content_string.join(''));
			} else {
				// build multi-content div
				var multi_content_string = new Array();
				var first = ' first';
				var even = '';
				for(var c=0;c<multi_content.length;c++) {
					var temp_string = [
						'<div class="tmpltzr-body ', type, first, even, '">',
						multi_content[c], '<br/>'];
					if ((multi_caption[c] != undefined) && (multi_caption[c].length > 0)) {
						temp_string.push('<div class="tmpltzr-caption">');
						temp_string.push(multi_caption[c]);
						temp_string.push('</div>');
					}
						
					temp_string.push('</div>');
					var temp_string_final = temp_string.join('');
					first = ' photoset';
					if(c%2 == 1){
						even = ' odd';
					}else{
						even = ' even';
					}
					multi_content_string.push(temp_string_final);
				}
				tumblr_div.push(multi_content_string.join(''));
			}
			tumblr_div.push('<div class="embedded-tumblr-permalink"><a href="');
			tumblr_div.push(url);
			tumblr_div.push('" target="_blank">Visit this post</a></div>');
			if(this.tags != null){
				tumblr_div.push('<div class="tmpltzr-tags">Tags: ');
				tumblr_div.push(tag_string);
				tumblr_div.push('</div>');
			}
			
			var tumblr_div_string = tumblr_div.join('');
			
			if ((element_name != undefined) && (element_name.length > 0)) {
				$(elementName).append(tumblr_div_string);
			} else {
				$('#tumblr-results').append(tumblr_div_string);
			}
      
    });
 });
	
	
	
	
}

/**
 * Function to return event data from JSON formatted views
 * coming from the GSAPP events site
 *
 * @param {String} url The URL for the JSON feed
 * @param {String} elementName The name of the DOM container to write into
 * @return void
 */
gsappFetcher.getEventData = function(url, elementName) {
	gsappFetcher.log("getting data from " + url + " into " + elementName);
	$.getJSON(url, function(data) {
		var nodes = data.nodes;
		for (var i=0; i<nodes.length;i++) {
			var event = nodes[i].node;
			// convert date and offset it
			var date = gsappFetcher.createDateObject(event.field_event_date_value);

			// each date has different offsets			
			var date_offset = 60000 * date.getTimezoneOffset();
			new_date = new Date(date - date_offset);
			var date_string = gsappFetcher.formatDate(new_date);

			var date_string_for_box = gsappFetcher.formatDateForBox(date);

			// parse locations and assign css classes for color
			var locations_array = gsappFetcher.getLocationsFromHTML(
				event.field_event_location_value);

			var css_class_for_location = 
				gsappFetcher.getCSSColorClassForLocations(
					locations_array);
			
			// parse event types
			var types_array = gsappFetcher.getEventTypesFromHTML(event.field_event_taxonomy_type_value);
			
			// get the path to the node
			// TODO UPDATE path to prod
			var path = ['http://events.postfog.org/node/', event.nid].join('');
			
			// parse the body tag
			var event_description = gsappFetcher.parseEventBodyHTML(event.body);
			
			// for now we only care about the first 2 paragraphs if they are not empty
			var event_description_string = [
				event_description[0], event_description[1]].join(''); 
			
			// build the div
			var event_div = ['<div class="embedded-event">',
				'<a target="_blank" class="region" href="', path, '">', 
				'<div class="embedded-event-top-area">',
				'<div class="embedded-event-date-box ',
				css_class_for_location, '"><div>',
				date_string_for_box, '</div></div>',
				'<div class="embedded-event-title">', event.title, '</div>',
				'</div></a>', // end top area
				'<div class="embedded-event-body-area">',
				'<div class="embedded-event-type">', types_array[0], '</div>',
				'<div class="embedded-event-date">', date_string, '</div>',
				'<div class="embedded-event-location ',
				css_class_for_location, '">',
				locations_array[1], '</div>',
				'<div class="embedded-event-description">', event_description_string,
				'</div>',
				'<div class="embedded-event-description-more"><a href="', path, 
				'" target="_blank" alt="More information">...</a></div>',
				'<div class="embedded-event-image">', event.field_event_poster_fid,
				'</div>',
				'</div>', '</div>'].join('');
			$(elementName).append(event_div);
		}
		
		$("#tmpltzr .content #event-output .embedded-event-top-area").hover(function() {
			$(this).children(".embedded-event-date-box").addClass('filled');
		}, 
		function() {
			$(this).children(".embedded-event-date-box").removeClass('filled');
		});

		
		
		
	}); // end getJSON
	
}



/**
 * Create HTML from JSON feed
 *
 * @param {String} url The URL for the JSON feed
 * @param {String} elementName The name of the DOM container to write into
 * @return void
 */
gsappFetcher.getFlickrWidget = function(url, elementName) {
	gsappFetcher.log('getFlickrWidget called in fetcher');

	$.getJSON(url, function(data){
		gsappFetcher.log('getFlickrWidget: received data');

		var cycle_param = data.cycle;
		var photoset = data.photoset;
		var widget_params = data.widget;
		
		// create inner div for the slides
		var inner_slideshow = $('<div class="slideshow"/>').appendTo(elementName);

		// write the photo divs into the .slideshow div
		for (i=0; i<photoset.photo.length; i++)
		{
			// check aspect and set either margin-top or margin-left
			if (photoset.photo[i].aspect > 1) {
				var inner_div = ['<div class="flickr-image ',
					widget_params.node_type, ' ', widget_params.size, 
					' ', widget_params.node_id, ' ', widget_params.group, 
					'" ><img src="', photoset.photo[i].url_o,
					'" alt="flickr-image" width="', photoset.photo[i].target_w, 
					'" height="', photoset.photo[i].target_h,
					'" style="margin-top: -', photoset.photo[i].cropdist, 'px;"', 
					'" /></div>'].join('');
			} else {
				var inner_div = ['<div class="flickr-image ',
					widget_params.node_type, ' ', widget_params.size, 
					' ', widget_params.node_id, ' ', widget_params.group, 
					'" ><img src="', photoset.photo[i].url_o,
					'" alt="flickr-image" width="', photoset.photo[i].target_w, 
					'" height="', photoset.photo[i].target_h,
					'" style="margin-left: -', photoset.photo[i].cropdist, 'px;"', 
					'" /></div>'].join('');
  		}
			var inner = [elementName, ' .slideshow'].join('');
			$(inner).append(inner_div);
			
		}
		
	var unique_tag_name = [widget_params.node_type, '-', widget_params.size, 
			'-', widget_params.node_id, '-', widget_params.group].join('');

	var next = ['<div id="next-button" class="button">',
		'<a href="#" id="', unique_tag_name, '-next',
		'">&nbsp;</a></div>'].join('');
	var prev = ['<div id="prev-button" class="button">',
		'<a href="#" id="', unique_tag_name, '-prev', '">&nbsp;</a></div>'].join('');
	$(elementName).append(next);
	$(elementName).append(prev);
	
	// append data from drupal node
	var widget_data = ['<div class="widget-data">', '<div class="widget-data-title">',
			widget_params.node_title, '</div><div class="widget-data-description">',
			widget_params.node_description, '</div></div>'].join('');
			$(elementName).append(widget_data);
	
	// build the jquery cycle script tag inline
	var cycle_tag = null;
	if (cycle_param.autostart == "1") { // autostart it (no nav)
		cycle_tag = ['<script type="text/javascript">',
			'$(document).ready(function() {', '$("', elementName, ' .slideshow").cycle({',
			'fx: "fade",', 'speed: ', cycle_param.duration, ',', 
			'slideResize: 0, containerResize: 0,',
			'});',
			'});', '</script>'].join('');
	} else { // display prev and next
		cycle_tag = ['<script type="text/javascript">',
			'$(document).ready(function() {', '$("', elementName, 
			' .slideshow").cycle({',
			'fx: "scrollLeft",', 'speed: ', cycle_param.duration, ',', 
			'slideResize: 0, containerResize: 0,',
			'timeout: 0,',
			'next: \'#', unique_tag_name,'-next\',',
			'prev: \'#', unique_tag_name, '-prev\',',
			'});',
			'});', '</script>'].join('');
	}
	
	// append script tag to DOM
	$(elementName).append(cycle_tag);
	}); // end json call

}