$(document).ready(function(){
	var topbutton = $("#top-button a");
	$(".navbar").sticky({topSpacing:0});
	topbutton.click(function(){
		$("html, body").animate({scrollTop:0},"slow");
		return false;
	});
	$(window).scroll(function(){
		var navbar = $(".navbar-default");
		var className = "minified";
		if($(document).scrollTop()>0 && !navbar.hasClass(className)) {
			navbar.addClass(className);
		}
		else if(navbar.hasClass(className) && $(document).scrollTop()==0){
			navbar.removeClass(className);
		}
		
		if($(document).scrollTop()>100){
			if(!topbutton.hasClass('fading'))
				topbutton.addClass('fading').fadeIn(300, function(){
					topbutton.removeClass('fading');
				});
		}
		else {
			if(!topbutton.hasClass('fading'))
				topbutton.css({top: '70px'}).addClass('fading').fadeOut(300, function(){
					topbutton.css({top: ''}).removeClass('fading');
				});
		}
	});
});