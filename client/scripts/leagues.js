if (Meteor.isClient){
	Template.leaguesCreate.events({
		'submit #createleague': function (e,t) {
			e.preventDefault();
			var public = $('input:radio[name="inlineRadioOptions"]:checked').val()

			if (public === 'true'){
				public = true
			}else{
				public = false
			}
			var leaguename = t.find('#leaguename').value;
			var password = t.find('#leaguepassword').value;
			if(leaguename != ""){
				if (public === true){
					var created = Leagues.insert({
	            	leaguename: t.find('#leaguename').value,
	            	players: [Meteor.userId()],
	            	public: public,
	            	dateCreated: moment().format('MM/DD/YYYY'),
	            	creator: Meteor.userId(),
	            	password: t.find('#leaguepassword').value
		            });
				}else{
					if(password != ""){
						var created = Leagues.insert({
		            	leaguename: t.find('#leaguename').value,
		            	players: [Meteor.userId()],
		            	public: public,
		            	dateCreated: moment().format('MM/DD/YYYY'),
		            	creator: Meteor.userId(),
		            	password: t.find('#leaguepassword').value
			            });	
						}	
				}

			}else{
				Session.set('message', 'Missing League name or Password if private game.');
			}

			if (leaguename != ""){
			var currentPlayer = Meteor.user().profile.leagues
            currentPlayer.push(created);
            Meteor.users.update({_id: Meteor.userId()}, {$set:  {'profile.leagues': currentPlayer}});

            Router.go('/leagues');
			}


            
            
		 }

	});


	Template.leagues.helpers({
		publicleagues:function(){
			return Leagues.find({public: true},{
				limit:6,
				sort: {dateCreated: -1}
			});
		},

		myleagues:function(){
			return Leagues.find({ players: { "$in" : [Meteor.userId()]} });
		}
	});

	Template.leagues.events({
		'click #publicleagues': function () {
			Router.go('/league/' + this._id);
		},
		'click #myleagues': function () {
			Router.go('/league/' + this._id);
		}


	});

	Template.league.helpers({
		isOwner:function(){ 
			return Leagues.findOne({_id: Router.current().params._id}).creator === Meteor.userId();
		},
		leaguemember:function(){
			return Meteor.users.find({'profile.leagues': {"$in": [this._id]}});
		},
		isInLeague:function(){
			return ($.inArray(Meteor.userId(), Leagues.findOne({_id: Router.current().params._id}).players) === -1 && Leagues.findOne({_id: Router.current().params._id}).players.length <= 8);
		}


	});

	Template.league.events({
		'click #deleteLeague': function () {
			if (confirm('Are you sure you want to delete ' + this.leaguename) == true) {
			    Leagues.remove(Router.current().params._id);
			    Router.go('/leagues');
			  } else {
			    return false;
			  }

		},
		'click #joinLeague': function () {
			  var currentList = Leagues.findOne({_id: Router.current().params._id}).players;
			  currentList.push(Meteor.userId());
			  var currentLeagues = Meteor.user().profile.leagues
			  currentLeagues.push(Router.current().params._id);
			  Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.leagues': currentLeagues}});
			  Leagues.update({_id: Router.current().params._id}, {$set:{players: currentList}});
		}
	});

	Template.joinleague.events({
		'submit #joinLeagueId': function (e,t) {
			e.preventDefault();
			var submittedId = t.find('#leagueid').value;
			if (Leagues.findOne({_id: submittedId})){
				Router.go('/league/'+submittedId);
			}else{
               Session.set('message', "That's an incorrect league ID! Try again.");
			}
		}
	});

}