/**
 * Namespacing
 */
var gsappFetcher = {};


/* 6/13/2012
 *
 * Author: Jochen Hartmann
 */

/**
 * @fileoverview Frontend app to to handle events and DOM manipulation for
 * revised GSAPP dashboard.
 */


/**
 * Whether to log to firebug console (wraps console.log)
 * @type Boolean
 */
gsappFetcher.enableLogging = false;

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
 * Function to start various other calls
 * @return void
 */
gsappFetcher.start = function() {
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
 * Get featured event HTML
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