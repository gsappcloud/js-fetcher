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
	gsappFetcher.getFlickrWidget();
}

/**
 * Get featured event HTML
 *
 * Note: in some cases the json may need to be parsed. TODO w JSON.parse(data); 
 * @return void
 */
gsappFetcher.getFlickrWidget = function() {
	gsappFetcher.log('getFlickrWidget called in fetcher');

	$.getJSON("http://dashboard.postfog.org/node/29?callback=?", function(data){
		gsappFetcher.log('getFlickrWidget: received data');
		var cycle_param = data.cycle;
		var photoset = data.photoset;
		var widget_params = data.widget;
		
		//console.log(cycle_param);
		//console.log(widget_params);
		//console.log(photoset);
		
		// write into a div
		for (i=0; i<photoset.photo.length; i++)
		{
			// check aspect
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
  		$('#item-2').append(inner_div);
		}
		
		// TODO switch fx to fade
	var cycle_tag = ['<script type="text/javascript">',
			'$(document).ready(function() {', '$("#item-2").cycle({',
			'fx: "scrollDown",', 'speed: ', cycle_param.duration, ',', 
			'slideResize: 0, containerResize: 0,',
			'});',
			'});', '</script>'].join('');
		$('#item-2').append(cycle_tag);
	}); // end json call

}