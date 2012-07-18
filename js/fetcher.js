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

	test_location = locations[location_string];
	if ((test_location != null) && (test_location != undefined)) {
		return test_location;
	} else {
		return false;
	}
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
 * Convert a date from drupal output to a proper JS Date object
 * @param {String} The date string from Drupal
 * @return {Date} JS Date object
 */
gsappFetcher.createDateObject = function(date_string) {
	var year = date_string.substr(0,4);
	var month = date_string.substr(5,2);
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
	date_string_a = [
		day_names[date.getDay()], ', ',
		month_names[date.getMonth()], ' ',
		date.getDate(), ', ', date.getFullYear(), ' ',
		date.getHours(), ':', date.getMinutes()];
	// add am pm
	if (date.getHours() > 12) {
		date_string_a.push('pm');
	} else {
		date_string_a.push('am');
	}
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

gsappFetcher.getEventData = function(url, elementName) {
	gsappFetcher.log("getting data from " + url + " into " + elementName);
	$.getJSON(url, function(data) {
		var nodes = data.nodes;
		for (var i=0; i<nodes.length;i++) {
			var event = nodes[i].node;
			console.log(event);
			// convert date and offset it
			var date = gsappFetcher.createDateObject(event.field_event_date_value);
			var five_hour_offset = 60000 * 300;
			date = new Date(date-five_hour_offset);
			var date_string = gsappFetcher.formatDate(date);
			var date_string_for_box = gsappFetcher.formatDateForBox(date);

			// parse locations and assign css classes for color
			var locations_array = gsappFetcher.getLocationsFromHTML(
				event.field_event_location_value);
			var color_locations = [];
			// TODO move to function: get css classes
			for (var j=0;j<locations_array.length;j++) {
				var color_class = gsappFetcher.findLocationClass(locations_array[j]);
				if (color_class != false) {
					color_locations.push(color_class);
				}
			}
			
			// parse event types
			var types_array = gsappFetcher.getEventTypesFromHTML(event.field_event_taxonomy_type_value);
			console.log(types_array);
			
			// get the path to the node
			// TODO UPDATE path to prod
			var path = ['http://events.postfog.org/node/', event.nid].join('');
			
			// build the div
			var event_div = ['<div class="embedded-event">',
				'<a href="', path, '">', 
				'<div class="embedded-event-top-area">',
				'<div class="embedded-event-date-box">',
				date_string_for_box, '</div>',
				'<div class="embedded-event-title">', event.title, '</div>',
				'</div></a>', // end top area
				'<div class="embedded-event-body-area">',
				'<div class="embedded-event-type"></div>',
				'<div class="embedded-event-date"></div>',
				'<div class="embedded-event-location"></div>',
				'<div class="embedded-event-description"></div>',
				'</div>', '</div>'].join('');
				
			$(elementName).append(event_div);
		}
		
		
		
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
		//console.log(widget_params);
		
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