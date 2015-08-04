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
	}, 0);
	// 3 seconds after
	setTimeout(function(){ 
		$(".fade-in-message-2").fadeIn(2000);
	}, 0);
	// 2.5 after
	setTimeout(function(){ 
		$(".login-button").fadeIn(2000);
	}, 4000);
	// 1.5 after
	setTimeout(function(){ 
		$(".or").fadeIn(2000);
		$(".register-button").fadeIn(2000);
	}, 5500);
	// 0.5 after
	setTimeout(function(){ 
		$("#footer").fadeIn(8000);
	}, 6500);
	
	
	
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