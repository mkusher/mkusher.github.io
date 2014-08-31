$(document).ready(function(){
	var topbutton = $("#top-button a");
	var welcomeSection = $("#welcome-section");
	var navbar = $(".navbar-default");
	var className = "minified";
	var topButtonShowHeight = welcomeSection.height.bind(welcomeSection);
	var navbarShowHeight = welcomeSection.height.bind(welcomeSection);
	
	topbutton.click(function(){
		$("html, body").animate({scrollTop:0},"slow");
		return false;
	});
	$(window).scroll(function(){
		
		if($(document).scrollTop()>navbarShowHeight() * 0.7 && !navbar.hasClass(className)) {
			navbar.addClass(className);
		}
		else if(navbar.hasClass(className) && $(document).scrollTop()<navbarShowHeight() * 0.7){
			navbar.removeClass(className);
		}
		
		if($(document).scrollTop()>topButtonShowHeight()){
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