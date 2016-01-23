if (Meteor.isClient){
	Template.leaguesCreate.events({
		'submit #createleague': function (e,t) {
			e.preventDefault();
            var created = Leagues.insert({
            	leaguename: t.find('#leaguename').value,
            	players: [Meteor.userId()],
            	public: true
            });

		 }
	});


	Template.leagues.helpers({
		publicleagues:function(){
			return Leagues.find({public: true},{
				limit:6

			});
		}



	});

	Template.leagues.events({
		'click #publicleagues': function () {
			console.log('console.');
			Router.go('/league/' + this._id);
		}
	});




}