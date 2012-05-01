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
    $("#guardianCheckInList").change(function(){
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






//////////////////////////////////////////////////////////////////////////////


  	//Set up checkin app routes
  	var childURL = "http://localhost/checkin/api/children";
  	var guardURL = "http://localhost/checkin/api/guardian";
  	var checkInURL = "http://localhost/checkin/api/checkin";
  	var checkOutURL = "http://localhost/checkin/api/checkout";


  	//Retrieve Children when app is loaded
  	getAllChildren();
  	//Retrieve Guardians when app is loaded
  	getAllGuardians();
  	//Retrieve all checked in
  	//getAllAttendance();

  	function getAllChildren(){
  		$.ajax({
			url:childURL, //Generic slim call
			dataType: 'json',
			success: function(children){
				$.each(children, function(i, child){
					var fullName = child.first_name +' ' + child.last_name;
					$('#childCheckInList').append('<option value="' + fullName + '">' + fullName + '</option>');
				});
			}
		});
  	}


  	function getAllGuardians(){
  		$.ajax({
			url:guardURL, //Generic slim call
			dataType: 'json',
			success: function(guardians){
				
				//For each person create li
				$.each(guardians, function(i, guardian){
					var fullName = guardian.first_name +' ' + guardian.last_name;
					$('#guardianCheckInList').append('<option value="' + fullName +'" >' + fullName + '</option>');
				});
				$('#guardianCheckInList').append('<option value="other">Other</option>');

			}
		});
  	}

  	$('#checkInForm').on('submit', function(e){
  		e.preventDefault();
  		checkIn();
  	});

  	function checkIn(){
  		//var a = checkInToJSON();
		//console.log(a);
		$.ajax({
			url: checkInURL,
			type: 'POST',
			data: checkInToJSON(),
			//dataType: 'json',
			success: function(data){
				alert(data);
			}
		});

		/*
			success: function(data){
				console.log("Checked In! " + data);
			},
			error: function(){
				console.log("Sorry that failed.");
			}
		
		});
*/
	}


	function checkInToJSON() {
		return JSON.stringify({
			"child": $('#childCheckInList').val(), 
			"guardian": $('#guardianCheckInList').val(),
			});
	}


});
