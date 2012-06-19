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

gsappFetcher.start = function() {
	// dummy function to trigger various behaviors
	console.log('start called in fetcher calling getfeaturedevent');
	
	gsappFetcher.getFeaturedEvent();
	
	
}

/**
 * Get featured event HTML
 * @return void
 */
gsappFetcher.getFeaturedEvent = function() {
	gsappFetcher.log('getting featured event');
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=dog&tagmode=any&per_page=10&format=json&jsoncallback=?",
		function(data){
    	$.each(data.items, function(i,item){
      	$("<img/>").attr("src", item.media.m).appendTo("#item-" + i);
        gsappFetcher.log('inside item added: ' + i + ' / 10');
            if ( i == 10 ) {
            	//return false;
            	console.log('10 returned');
            	
            }
          });



});


		
		
	gsappFetcher.log('done getting featured event');
}


/* notes


must grab html ajax call and then know where to put it


must also grab jquery cycle params and then write them into the page also
*/


		

