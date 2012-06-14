(function(){
	$(function(){
		var widgeturl = "http://ccgsapp.org/widgets/header#";
		
		var styles = "background:black;display:block;position:relative;width:100%;height:245px;border:none;overflow:hidden";
		styles += "box-shadow:0px 0px 10px #666;-webkit-box-shadow:0px 0px 10px #666;-moz-box-shadow:0px 0px 10px #666;"
		
		$container = $("<div id='ccwidget-wrapper'></div>")
			.css({position:"relative", margin:"0 auto", width:"1006px"})
			.prependTo($("body"));
		
		$ifr = $("<iframe></iframe>")
			.attr({ id: "cciframe", src: widgeturl, style: styles })
			.appendTo($container);
		
		$closebtn = $("<a href='javascript:'></a>")
			.css({
				display:"block", position:"absolute",
				bottom:"15px", left:"50%",
				width:"200px", height:"11px",
				marginLeft: "-100px",
				background: "url('http://ccgsapp.org/sites/all/themes/gsapp/images/cc_widget_ce_btn.png') no-repeat top center"
			})
			.click(function(){
				if ($closebtn.hasClass("collapsed")) {
					$closebtn.removeClass("collapsed");
					$closebtn.css("background-position","center 0");
					$ifr[0].src = widgeturl;
					$ifr.animate({height:"245px"},400);
				}else{
					$closebtn.addClass("collapsed");
					$closebtn.css("background-position","center -18px");
					$ifr[0].src = widgeturl+"collapse";
					$ifr.animate({height:"45px"},400);
				}
			})
			.appendTo($container);
	})
})();