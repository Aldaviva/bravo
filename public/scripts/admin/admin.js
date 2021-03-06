(function(scope){

	var Admin = scope.Admin = function(el){
		_.bindAll(this);
		this.el = el;

		this.initAccoladeList();
		// this.initDownloadReportButton();
		this.initPendingCount();

		this.initLogoutButton();
	};

	Admin.prototype.initAccoladeList = function(){
		this.accoladeCollection = new AccoladeCollection();
		var accoladeListView = new AdminAccoladeListView({
			collection: this.accoladeCollection,
			el: $('.accolades', this.el).get(0)
		});

		accoladeListView.render();
		this.accoladeCollection.fetch({ reset: true });
	};

	// Admin.prototype.initDownloadReportButton = function(){
	// 	$('.downloadReport', this.el).click(_.bind(function(event){
	// 		var minDate = new Moment().minus(2, 'weeks').valueOf();
	// 		var maxDate = new Moment().valueOf();
	// 		window.location = this.accoladeCollection.url+'/accolades.csv?min_date='+minDate+'&max_date='+maxDate;
	// 	}, this));
	// };

	Admin.prototype.initPendingCount = function(){
		this.accoladeCollection.on('add remove change reset', _.bind(function(){
			var pendingCount = this.accoladeCollection.where({ status: 'pending' }).length;
			var pendingCountEl = $('.pendingCount', this.el);

			pendingCountEl
				.text('('+pendingCount+')')
				.toggle(!!pendingCount);
		}, this));
	};

	Admin.prototype.initLogoutButton = function(){
		var peopleApiUrl = Accolades.config.floorplan.baseUrl + '/people';

		$.getJSON(peopleApiUrl, {
				email: Accolades.user.email.replace(/@.*$/, '')
			})
			.done(_.bind(function(floorplanPeople){
				var person = floorplanPeople[0];
				var photoUrl = peopleApiUrl + '/' + person._id + '/photo';
				$('.auth', this.el)
					.attr('title', "Logged in as " + person.fullname)
					.find('.userProfilePhoto')
						.attr('src', photoUrl);
			}, this));
	};

})(this);