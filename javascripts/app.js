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

  //Radio Toggle
  	$('.show').on('change',function() {
    	$(this).siblings('.toggle').slideToggle($(this).val());
	});






//////////////////////////////////////////////////////////////////////////////
//.......................
//	Table of Contents
//.......................
//	:: Set up routes
//	:: Retrieve initial data for app
//	:: Functions for retreiving data
//		:: getAllChildren
//		:: getAllGuardians
	// Need to add getAllAttendance

//	:: Check in a Child
//	:: Register a Child
	// Need to add
	//	- Register a guardian
	//	- Check out a child

//	:: Helper Functions
	//	:: clearForm
	//	:: checkInToJSON
	//	:: registerChildToJSON
//.......................
//////////////////////////////////////////////////////////////////////////////

  	//Set up checkin app routes
  	var childURL = "http://localhost/checkin/api/children";
  	var guardURL = "http://localhost/checkin/api/guardian";
  	var attendURL = "http://localhost/checkin/api/attendance";
  	var checkInURL = "http://localhost/checkin/api/checkin";
  	var checkOutURL = "http://localhost/checkin/api/checkout";


  	// Retrieve initial data
	  	//Retrieve Children when app is loaded
	  	getAllChildren();
	  	//Retrieve Guardians when app is loaded
	  	getAllGuardians();
	  	//Retrieve all checked in
	  	getAllAttendance();

  	function getAllChildren(){
  		$.ajax({
			url:childURL, 
			dataType: 'json',
			success: function(children){
				//For each child create an <option>
				$.each(children, function(i, child){
					var fullName = child.first_name +' ' + child.last_name;
					$('#childCheckInList').append('<option value="' + fullName + '|' + child.id + '">' + fullName + '</option>');
				});
			}
		});
  	}


  	function getAllGuardians(){
  		$.ajax({
			url:guardURL,
			dataType: 'json',
			success: function(guardians){
				
				//For each guardian create an <option>
				$.each(guardians, function(i, guardian){
					var fullName = guardian.first_name +' ' + guardian.last_name;
					$('#guardianCheckInList').append('<option value="' + fullName +'" >' + fullName + '</option>');
				});
				//Add an <option> that is other
				$('#guardianCheckInList').append('<option value="other">Other</option>');

			}
		});
  	}

  	function getAllAttendance(){
  		$.ajax({
			url:attendURL, 
			dataType: 'json',
			success: function(children){
				//alert(children);
				$('#childrenPresent').html('');
				//For each child create an <option>
				$.each(children, function(i, child){
					//console.log(child.child);
					$('#childrenPresent').append('<li><input type="radio" name="checkOutChild" value="' + child.child + '" data-checkOutChild="child">' + child.child + '</li>')
					//$('#childCheckInList').append('<option value="' + child.child + '">' + child.child + '</option>');
				});
			}
		});
  	}

  	function allowedGuardians(){

  	}

//	Check in a child 			
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

  	$('#checkInForm').on('submit', function(e){
  		e.preventDefault();
  		checkIn();
  	});

  	function checkIn(){
  		$.ajax({
			url: checkInURL,
			type: 'POST',
			data: checkInToJSON(),
			//dataType: 'json',
			success: function(data){
				$('#checkInConfirmChild').html(data);
				$('#checkInConfirm').reveal();
				clearForm();
				getAllAttendance();
			}
		});
	}

//Register a child
	$('#addChildForm').on('submit', function(e){
  		e.preventDefault();
  		registerChild();
  	});

	function registerChild(){
  		//var a = registerChildToJSON();
		//console.log(a);
		$.ajax({
			url: childURL,
			type: 'POST',
			data: registerChildToJSON(),
			//dataType: 'json',
			success: function(data){
				//alert(data)
				$('#registerConfirmChild').html(data);
				$('#registerConfirm').reveal();
				clearForm();
			}
		});
	}

// Check out a child
	$('#checkOutForm').on('submit', function(e){
  		e.preventDefault();
  		checkIn();
  	});

  	function checkOut()	{
  		$.ajax({
  			url: checkOutURL,
  			type: 'POST'
  		});

  	}

// Helper Functions
	function clearForm(){
		$('form').find(':input').each(function(){
			var type = this.type, tag = this.tagName.toLowerCase();
			if (type == 'text' || type == 'password' || tag == 'textarea')
				this.value = '';
			else if (type == 'checkbox' || type == 'radio')
				this.checked = false;
			else if (tag == 'select')
				this.selectedIndex = -1;
		})
	}


	function checkInToJSON() {
		var val = $('#childCheckInList').val(); //Get value of child option
		var array = val.split('|'); //This is a multiple parameter value. Split on '|'.
		var name = array[0]; //Set name
		var id = array[1];	//Set id
		
		return JSON.stringify({
			"child": name, 
			"child_id": id, 
			"guardian": $('#guardianCheckInList').val(),
			});
	}

	function registerChildToJSON(){
		return JSON.stringify({
			"first_name": $('#first-name-child').val(),
		    "last_name": $('#last-name-child').val(),
		    "active": $('#active').val(),
		    "category": "Child",
		    "birthday": $('#dobMonth').val() + '/' + $('#dobDay').val() + '/' + $('#dobYear').val(),
		    "allergies":$('#allergyNotes').val(),
		    "notes": $('#childNotes').val(),
		    "photo": $('#childPhoto').val(),
		    "guardian1": $('#guardian1').val(),
		    "guardian2": $('#guardian2').val(),
		    "guardian3": $('#guardian3').val(),
		    "guardian4": $('#guardian4').val()
		});
	}

});
