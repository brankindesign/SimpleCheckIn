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
	  		this.templateChildOption = '<option value="{{child}}|{{id}}">{{child}}</option>';
	  		this.children = [];

			//Run on loading app
			this.subscriptions();
			this.getAllChildren();
			this.getAllGuardians();
			this.getAllAttendance();
			//this.tests();

			return this;

		},

		subscriptions: function(){
			var self = CheckIn;
			//$.subscribe( 'checkin/getAllChildren',self.populateCheckIn);
			$.subscribe( 'checkin/getAllChildren', self.populateCheckIn);
			
			//$.subscribe( 'checkin/getAllGuardians', self.populateCheckIn);
		},

		cache: function(){
			this.checkInChildContainer = $('select#childCheckInList');
			
		},

		tests: function() {
			
		},

		//Get data
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
			$.publish( 'checkin/getAllGuardians');
	  	},

	  	getAllAttendance: function(){
	  		$.publish( 'checkin/getAllAttendance');
	  	},

	  	// Populate fields
	  	populateCheckIn: function(){
	  		var self = CheckIn;
			//console.log(CheckIn.children);
			//Populate list of children

			console.log(self.children);

			self.checkInChildContainer.append(
				$.map( self.children, function( i ) {
					var id = i.id;
					var name = 
						i.first_name +' ' + i.last_name;
					return self.templateChildOption.replace(/{{child}}/g, name)
						.replace(/{{id}}/g, id);
				}).join('')

			);

			//Populate list of adults
	  	},

	  	populateCheckOut: function(){

	  	},

	  	//Check In and Check Out
	  	
	  	checkIn: function(){
	  		var self = CheckIn;

	  		
	  		//Clear the form and reload data
	  		self.clearForm();
	  		self.getAllAttendance();
	  	},

	  	checkOut: function(){
	  		var self = CheckIn;

	  		
	  		//Clear the form and reload data
	  		self.clearForm();
	  		self.getAllAttendance();
	  	},

	  	//Register Child and Guardian
	  	registerChild:  function(){
	  		var self = CheckIn;


	  		//Clear the form and reload data
	  		self.clearForm();
	  		self.getAllChildren();
	  	},
	  	
	  	registerGuardian: function(){
	  		var self = CheckIn;

	  		
	  		//Clear the form and reload data
	  		self.clearForm();
	  		self.getAllGuardians();
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

	  	},
		
		checkInToJSON: function(){

		},
		
		registerChildToJSON: function(){

		},
		
		registerGuardianToJSON: function(){

		}

	};

	//Get it rolling
	window.CheckIn = CheckIn.init();

})();