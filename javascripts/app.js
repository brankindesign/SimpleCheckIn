/* Foundation v2.2 http://foundation.zurb.com */
jQuery(document).ready(function ($) {

	/* Use this js doc for all application specific JS */

	/* TABS --------------------------------- */
	/* Remove if you don't need :) */

	function activateTab($tab) {
		var $activeTab = $tab.closest('dl').find('a.active'),
				contentLocation = $tab.attr("href") + 'Tab';

		//Make Tab Active
		$activeTab.removeClass('active');
		$tab.addClass('active');

    	//Show Tab Content
		$(contentLocation).closest('.tabs-content').children('li').hide();
		$(contentLocation).css('display', 'block');
	}

	$('dl.tabs').each(function () {
		//Get all tabs
		var tabs = $(this).children('dd').children('a');
		tabs.click(function (e) {
			activateTab($(this));
		});
	});

	if (window.location.hash) {
		activateTab($('a[href="' + window.location.hash + '"]'));
	}

	/* ALERT BOXES ------------ */
	$(".alert-box").delegate("a.close", "click", function(event) {
    event.preventDefault();
	  $(this).closest(".alert-box").fadeOut(function(event){
	    $(this).remove();
	  });
	});


	/* TOOLTIPS ------------ */
	$(this).tooltips();



  //Scrolling to location
  $(".scroll").click(function(event){		
  	event.preventDefault();
  	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 600);
  });	 

  //Show other guardian input in check in area
    $("#guardianSelect").change(function(){
		var gs = $(this).val();
		if (gs === 'other'){
			$('#otherGuardian').slideToggle();
		}
		else{
			$('#otherGuardian').slideUp();
		}
  	});

  //Radio Toggle
  	$('.show').on('change',function() {
    	$(this).siblings('.toggle').slideToggle($(this).val());
	});

  	//Set up checkin app
  	var childURL = "http://checkin/api/children";
  	var guardURL = "http://checkin/api/guardian";
  	var attURL = "http://checkin/api/attendance";

  	var currentChild;

  	//Retrieve Children when app is loaded
  	findAllChildren();
  	//Retrieve Guardians when app is loaded
  	//findAllGuardians();
  	//Retrieve all checked in
  	//findAllAttendance();

  	function findAllChildren(){
  		console.log('findAll');
  			$.ajax({
			type: 'GET',
			url: childURL,
			dataType: "json", // data type of response
			success: renderListChild
		});
  	}

  	function renderListChild(data) {
		// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
		var list = data == null ? [] : (data.children instanceof Array ? data.children : [data.children]);

		//$('#wineList li').remove();
		$.each(list, function(index, children) {
			$('ul#children').append('<li><a href="#" data-identity="' + children.id + '">'+children.first_name+'</a></li>');
		});
	}

});
