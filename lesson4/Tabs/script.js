$(document).ready(function() {
	$(".tabs__menu li").click(function() {
		if (!$(this).hasClass("active")) {
			var i = $(this).index();
			$(".tabs__menu li.active").removeClass("active");
			$(".tabs__content .active").hide().removeClass("active");
			$(this).addClass("active");
			$($(".tabs__content").children(".info")[i]).fadeIn(1000).addClass("active");
		}
	});
});