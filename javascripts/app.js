//Basic Pub/Sub via Jeffrey Way
(function($) {
	var o = $( {} );

	$.each({
		on: 'subscribe',
		trigger: 'publish',
		off: 'unsubscribe'
	}, function( key, api ) {
		$[api] = function() {
			o[key].apply( o, arguments );
		}
	});

})(jQuery);

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
//	:: Check out a Child
//	:: Register a Child
	// Need to add
	//	- Register a guardian

//	:: Helper Functions
	//	:: clearForm
	//	:: checkInToJSON
	//	:: registerChildToJSON
//.......................
//////////////////////////////////////////////////////////////////////////////
/*
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
					var child_id = child.id;
					var fullName = child.first_name +' ' + child.last_name;
					$('#childCheckInList').append('<option value="' + fullName + '|' + child_id + '">' + fullName + '</option>');
					//Don't really like this solution for allowed guardians but it does work
					//Would be better to render using a template rather than having all the html in the javascript
					$('#allowedGuardians').append('<select name="checkOutGuardian" id="' + child_id +'"><option value="' + child.guardian1 + '">' + child.guardian1 + '</option><option value="' + child.guardian2 + '">' + child.guardian2 + '</option><option value="' + child.guardian3 + '">' + child.guardian3 + '</option><option value="' + child.guardian4 + '">' + child.guardian4 + '</option></select>');
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
				
				//Clear attendance and insert one blank option
				$('#childrenPresent').html('<option value=""></option>');
				
				//For each child create an <option> and append to attendance dropdown
				$.each(children, function(i, child){
					//$('#childrenPresent').append('<li><input type="radio" class="childPresent" name="checkOutChild" value="' + child.child + '|' + child.child_id + '">' + child.child + '</li>')
					$('#childrenPresent').append('<option value="' + child.child + '|' + child.child_id + '">' + child.child + '</option>');
				});
			}
		});
  	}

//	Check in a child 			
	//Show other guardian input in check in area
    $("#guardianCheckInList").change(function(){
		//var gs = $(this).val();
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
  		//Add form check to make sure guardian is selected
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

// Check out a child
	// Grab guardians from selected child
	$('#childrenPresent').on('change' ,function(){
		var val = $('#childrenPresent').val(); //Get value of child option
		var array = val.split('|'); //This is a multiple parameter value. Split on '|'.
		var name = array[0]; //Set name
		var id = array[1];	//Set id
		//console.log(id);
		//locate the div with the same id as the child 
		//change display to block
		$('#allowedGuardians select').css('display', 'none');
		$('#allowedGuardians select#' + id).css('display', 'block');
		
	});

	//Submit the check out form
	$('#checkOutForm').on('submit', function(e){
  		e.preventDefault();
  		//Add form check to make sure guardian is selected
  		
  		checkOut();
  	});

  	function checkOut(){
		$.ajax({
			url:checkOutURL,
			type:'PUT',
			data:checkOutToJSON(),
			//dataType: 'json',
			success: function(data){
				//console.log('Yeah ' + data + ' worked');
				$('#checkOutConfirmChild').html(data);
				$('#checkOutConfirm').reveal();
				clearForm();
				getAllAttendance();
			},
			error: function(){
				console.log('Ummm, nope');
			}
		})

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
		
		var g = $('#guardianCheckInList').val();
		if (g === 'other'){
			var g = $('#guardianIn').val();
		}

		return JSON.stringify({
			"child": name, 
			"child_id": id, 
			"guardian": g,
			});
	}

/* Save for possible later use
	function allowedGuardiansToJSON() {
		var val = $('input[name="checkOutChild"]:checked').val() //Get value of child option
		var array = val.split('|'); //This is a multiple parameter value. Split on '|'.
		var name = array[0]; //Set name
		var id = array[1];	//Set id
		
		return JSON.stringify({
			"child": name, 
			"child_id": id
			});
	}
*/
/*
	function checkOutToJSON() {
		var val = $('#childrenPresent').val(); //Get value of child option
		var array = val.split('|'); //This is a multiple parameter value. Split on '|'.
		var name = array[0]; //Set name
		var id = array[1];	//Set id

		return JSON.stringify({
			"child": name, 
			"child_id": id, 
			"guardian": $('select#' + id).val()
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
*/
});
