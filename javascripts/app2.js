(function(){
	var CheckIn = {
		init: function() {
			//Route URL's
			this.apiURL = 'http://localhost/checkin/api/';
			this.childURL = this.apiURL + 'children';
	  		this.guardURL = this.apiURL + 'guardian';
	  		this.attendURL = this.apiURL +'attendance';
	  		this.checkInURL = this.apiURL + 'checkin';
	  		this.checkOutURL = this.apiURL + 'checkout';
				  		
	  		//Settings
	  		this.orgName = 'St. Paul UMC';
	  		this.cache();
	  		this.children = [];
	  		
	  		
	  		//Templates //move out later?//
	  		this.templateChildOption = '<option value="{{child}}|{{id}}">{{child}}</option>';
	  		this.templateGuardianOption = '<option value="{{guardian}}">{{guardian}}</option>';
	  		this.templateGuardianCheckOut = '<select name="checkOutGuardian" id="{{child_id}}"><option value="{{g1}}">{{g1}}</option><option value="{{g2}}">{{g2}}</option><option value="{{g3}}">{{g3}}</option><option value="{{g4}}">{{g4}}</option></select>';

			this.blankOption = '<option value=""></option>'
			this.otherOption = '<option value="other">Other</option>'


			//Run on loading app
			this.subscriptions();
			this.getAllChildren();
			this.getAllGuardians();
			this.getAllAttendance();
			this.bindEvents();
			//this.tests();

			return this;

		},

		subscriptions: function(){
			var self = CheckIn;
			//$.subscribe( 'checkin/getAllChildren',self.populateCheckIn);
			$.subscribe( 'checkin/getAllChildren', self.populateChildCheckIn);
			$.subscribe( 'checkin/getAllChildren', self.populateGuardianCheckOut);
			$.subscribe( 'checkin/getAllGuardians', self.populateGuardianCheckIn);
			$.subscribe( 'checkin/getAllAttendance', self.populateChildCheckOut);
		},

		cache: function(){
			this.checkInChildContainer = $('select#childCheckInList');
			this.checkInGuardianContainer = $('select#guardianCheckInList');
			this.checkOutChildContainer = $('select#childrenPresent');
			this.checkOutGuardianContainer = $('#allowedGuardians');

		},

		bindEvents: function(){
		//Bind the following actions so that if one of them happens then the corresponding function will be called
	  		$("#guardianCheckInList").on('change', this.showOtherGuardian);
	  		$('#checkInForm').on('submit', this.checkIn);
	  		$('#checkOutForm').on('submit', this.checkOut);
	  		this.checkOutChildContainer.on('change', this.showApprovedGuardians);
	  		$('#addChildForm').on('submit', this.registerChild);
	  		$('#addGuardianForm').on('submit', this.registerGuardian);
	  	},

		tests: function() {
			//just here for testing 			
		},

//////////Get data
		getAllChildren: function(){
			var self = CheckIn;
		
			return $.ajax({
				url: self.childURL,
				dataType: 'json',
				success: function(data){
					CheckIn.children = data;
					$.publish( 'checkin/getAllChildren' );
				}
			});
		},

	  	getAllGuardians: function(){
	  		var self = CheckIn;

			return $.ajax({
				url: self.guardURL,
				dataType: 'json',
				success: function(data){
					CheckIn.guardians = data;
					$.publish( 'checkin/getAllGuardians' );
				}
			});
	  	},

	  	getAllAttendance: function(){
	  		var self = CheckIn;

	  		return $.ajax({
	  			url: self.attendURL,
	  			dataType: 'json',
	  			success:function(data){
	  				CheckIn.attendance = data;
	  				$.publish('checkin/getAllAttendance');
	  			}
	  		});
	  	},

////////// Populate fields
	  	populateChildCheckIn: function(){
	  		var self = CheckIn;
			//Populate list of children
			self.checkInChildContainer.html('').append(self.blankOption).append(
				$.map( self.children, function( i ) {
					var id = i.id;
					var name = 
						i.first_name +' ' + i.last_name;
					return self.templateChildOption.replace(/{{child}}/g, name)
						.replace(/{{id}}/g, id);
				}).join('')
			);
	  	},

	  	populateGuardianCheckIn: function(){
	  		var self = CheckIn;
			//Populate list of Guardians
			self.checkInGuardianContainer.html('').append(self.blankOption).append(
				$.map( self.guardians, function( i ) {
					var id = i.id;
					var name = 
						i.first_name +' ' + i.last_name;
					return self.templateGuardianOption.replace(/{{guardian}}/g, name);
				}).join('')
			).append(self.otherOption);
	  	},


	  	populateChildCheckOut: function(){
	  		var self = CheckIn;

	  		//Populate list of Guardians
			self.checkOutChildContainer.html('').append(self.blankOption).append(
				$.map( self.attendance, function( i ) {
					var id = i.child_id;
					var name = i.child;
					return self.templateChildOption.replace(/{{child}}/g, name)
						.replace(/{{id}}/g, id);;
				}).join('')
			);
	  	},

	  	populateGuardianCheckOut: function(){
	  		var self = CheckIn;
			//Populate list of children
			self.checkOutGuardianContainer.html('').append(
				$.map( self.children, function( i ) {
					var id = i.id;
					var g1 = i.guardian1;
					var g2 = i.guardian2;
					var g3 = i.guardian3;
					var g4 = i.guardian4;
					return self.templateGuardianCheckOut.replace(/{{child_id}}/g, id)
														.replace(/{{g1}}/g, g1)
														.replace(/{{g2}}/g, g2)
														.replace(/{{g3}}/g, g3)
														.replace(/{{g4}}/g, g4);
				}).join('')
			);
	  	},

//////////Check In and Check Out
	  	showOtherGuardian: function() {
		  	var gs = $(this).val();
			if (gs === 'other'){
				$('#otherGuardian').slideToggle();
			}
			else{
				$('#otherGuardian').slideUp();
			}
		},

		showApprovedGuardians: function(){
			console.log('hello from show approved');
			var val = $('#childrenPresent').val(); //Get value of child option
			console.log(val);
			var array = val.split('|'); //This is a multiple parameter value. Split on '|'.
			var name = array[0]; //Set name
			var id = array[1];	//Set id
			console.log(id);
			//locate the div with the same id as the child 
			//change display to block
			$('#allowedGuardians select').css('display', 'none');
			$('#allowedGuardians select#' + id).css('display', 'block');
		},
	  	
	  	checkIn: function(e){
	  		e.preventDefault();
	  		var self = CheckIn;

	  		$.ajax({
				url: self.checkInURL,
				type: 'POST',
				data: self.checkInToJSON(),
				//dataType: 'json',
				success: function(data){
					$('#checkInConfirmChild').html(data);
					$('#checkInConfirm').reveal();
					//Clear the form and reload data
					self.clearForm();
			  		self.getAllAttendance();
	  			}
			});	  		
	  	},

	  	checkOut: function(e){
	  		e.preventDefault();
	  		var self = CheckIn;

	  		$.ajax({
				url:self.checkOutURL,
				type:'PUT',
				data:self.checkOutToJSON(),
				//dataType: 'json',
				success: function(data){
					//console.log('Yeah ' + data + ' worked');
					$('#checkOutConfirmChild').html(data);
					$('#checkOutConfirm').reveal();
					//Clear the form and reload data
			  		self.clearForm();
			  		self.getAllAttendance();
				},
				error: function(){
					console.log('Ummm, nope');
				}
			})
	  	},

	  	//Register Child and Guardian
	  	registerChild:  function(e){
	  		e.preventDefault();
	  		var self = CheckIn;

	  		$.ajax({
				url: self.childURL,
				type: 'POST',
				data: self.registerChildToJSON(),
				//dataType: 'json',
				success: function(data){
					//alert(data)
					$('#registerConfirmChild').html(data);
					$('#registerConfirm').reveal();
					//Clear the form and reload data
			  		self.clearForm();
			  		self.getAllChildren();
				}
			});
	  		
	  	},
	  	
	  	registerGuardian: function(e){
	  		e.preventDefault();
	  		var self = CheckIn;
	  		$.ajax({
				url: self.guardURL,
				type: 'POST',
				data: self.registerGuardianToJSON(),
				//dataType: 'json',
				success: function(data){
					//alert(data)
					$('#registerConfirmGuardian').html(data);
					$('#registerConfirm').reveal();
					//Clear the form and reload data
			  		//self.clearForm();
			  		//self.getAllGuardians();
				}
			});
	  	},


	  	//Helpers
	  	clearForm: function(){
		  	$('form').find(':input').each(function(){
				var type = this.type, tag = this.tagName.toLowerCase();
				if (type == 'text' || type == 'password' || tag == 'textarea')
					this.value = '';
				else if (type == 'checkbox' || type == 'radio')
					this.checked = false;
				else if (tag == 'select')
					this.selectedIndex = -1;
			});
	  	},

	  	checkInToJSON: function(){
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
	  	},
		
		checkOutToJSON: function(){
			var val = $('#childrenPresent').val(); //Get value of child option
			var array = val.split('|'); //This is a multiple parameter value. Split on '|'.
			var name = array[0]; //Set name
			var id = array[1];	//Set id

			return JSON.stringify({
				"child": name, 
				"child_id": id, 
				"guardian": $('select#' + id).val()
			});

		},
		
		registerChildToJSON: function(){
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
		},
		
		registerGuardianToJSON: function(){
			return JSON.stringify({
				"first_name": $('#first-name-guardian').val(),
			    "last_name": $('#last-name-guardian').val(),
			    "active": $('#active').val(),
			    "phone": $('#guardian-phone').val(),
			    "sms": $('input[name=sms]:radio:checked').val(),
			    "carrier": $('#carrier').val(),
			    "email": $('#guardian-email').val(),
			    "child1": $('#child1').val(),
			    "child2": $('#child2').val(),
			    "child3": $('#child3').val(),
			    "child4": $('#child4').val()
			});
		}
	};

	//Get it rolling
	window.CheckIn = CheckIn.init();

})();