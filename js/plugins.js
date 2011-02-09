
// remap jQuery to $
(function($){

	$(document).ready(function()
	  {

	    jQuery("#sidebar").find("li").each(function(){
	        var item = jQuery(this);
	        if ( item.has("ul").length ) {
	          var hide = item.has("a[href=\"" + document.location.pathname + "\"]").length == 0;

	            if ( hide ) {
	                item.addClass("collapsed");
	            } else {
	                item.addClass("expanded");
	            }

	            item.click(function(event){
	                if ( this == event.target ) {
	                    item1 = jQuery(this);
	                    var collapsed = item1.hasClass("collapsed");
	                    item1.removeClass("expanded collapsed")
	                        .addClass(collapsed ? "expanded" : "collapsed")
	                        .children("ul").toggle();
	                    return false;
	                }
	            });

	            if ( hide ) {
	                item.find("ul").hide();
	            }

	        }
	    });
	});

})(this.jQuery);



// usage: log('inside coolFunc',this,arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};



// catch all document.write() calls
(function(doc){
  var write = doc.write;
  doc.write = function(q){
    log('document.write(): ',arguments);
    if (/docwriteregexwhitelist/.test(q)) write.apply(doc,arguments);
  };
})(document);


