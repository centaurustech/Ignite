(function() {
	
	$(".fade-in-message-1").fadeOut(0);
	$(".fade-in-message-2").fadeOut(0);
	$(".login-button").fadeOut(0);
	$(".register-button").fadeOut(0);
	$(".or").fadeOut(0);
	$("#login").fadeOut(0);
	$("#register").fadeOut(0);
	$("#footer").fadeOut(0);
	
	setTimeout(function(){ 
		$(".fade-in-message-1").fadeIn(2000);
		$(".fade-in-message-2").fadeIn(2000);
		$(".login-button").fadeIn(2000);
		$(".or").fadeIn(2000);
		$(".register-button").fadeIn(2000);
		$("#footer").fadeIn(2000);
	}, 250);	
	
	$('.login-button').click(function() {
		$('#login').fadeIn(1000);
	});
	
	$('.register-button').click(function() {
		$('#register').fadeIn(1000);
	});
	
	$('#login-submit').click(function() {
		$('#login input.ng-invalid').css("border-bottom", "1px solid red");
	})
	
	$('#register-submit').click(function() {
		$('#register input.ng-invalid').css("border-bottom", "1px solid red");
	});
	
	
	
})();