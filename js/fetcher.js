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
		//console.log(cycle_param);
		//console.log(photoset);
		
		// write into a div
		for (i=0; i<photoset.photo.length; i++)
		{
  		$('#item-2').append('<div class="flickr-image" style="width: 300px; height: 150px; overflow: hidden"><img src="' +
  			photoset.photo[i].url_o + '" width="300" height="150" /></div>');
		}
		

		// this works
		$('body').append('<script type="text/javascript">'  + 
			'$(document).ready(function() {' + '$("#item-2").css("color", "red");' + '});' + 
		'</script>');


		$('body').append('<script type="text/javascript">'  + 
		'$(document).ready(function() {' +
	    '$("#item-2").cycle({' +
			'fx: "fade" });' + 
			'});' + 
		'</script>');


	}); // end json call

}