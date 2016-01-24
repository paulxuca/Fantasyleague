if (Meteor.isClient){
var options = {
  localSearch: true
};

var fields = ['profile.leagueusername']; //Options for the Search engine
PlayerSearch = new SearchSource('Meteor.users', fields, options);

Template.myteam.helpers({
	incomplete: function () {
		if(Teams.findOne({_id: Router.current().params._id}).complete === false){
		return true;
		}
		return false;
	}
});

Template.createTeam.helpers({
	userCanEdit : function() {
  		return Teams.findOne({_id: Router.current().params._id}).owner === Meteor.userId();
},
	userCanEditTeam : function() {
  		return Teams.findOne({_id: Router.current().params._id}).owner === Meteor.userId() && Teams.findOne({_id: Router.current().params._id}).players.length < 5;
},
	owner:function(){
		var owner = Teams.findOne({_id: Router.current().params._id}).owner;
		return Meteor.users.findOne({_id: owner}).profile.leagueusername;
	},
	showMessage:function(){
		return Session.get('message');
	}
});


Template.team.helpers({
	teamCreated: function () {
		if(Teams.findOne({owner: Meteor.userId()})){
			return true;
		}
		return false
	},
	playerinteam:function(){
		return Teams.findOne({owner: Meteor.userId()}).players;
	},
	leagueusername:function(){

		return Meteor.users.findOne({'profile.rawId': parseInt(this.valueOf())}).profile.leagueusername;
	},
	leaguescore:function(){
		return Meteor.users.findOne({'profile.rawId': parseInt(this.valueOf())}).profile.score;

	}
});

Template.searchPlayers.helpers({
  getPlayers: function() {
    return PlayerSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      }});
  },
  isLoading: function() {
    return PlayerSearch.getStatus().loading;
  }
});

Template.searchPlayers.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PlayerSearch.search(text);
  }, 50)
});

Template.createTeam.events({
	'click #createTeam': function () {
		var currentTeam = Router.current().params._id;
		var currentTeamRoster = Teams.findOne({_id: currentTeam}).players;
		if(currentTeamRoster.length < 5){
			Session.set('message', "You don't have enough players! You need 5.");
			stop();
		}else{
			for(var i = 0; i< 5; i++){
				if (Meteor.users.findOne({_id: currentTeamRoster[i]})){

				}else{
					stop();
					Session.set('message', 'Invalid Id for player' + (i+1) + '!');
				}

			}

			Teams.update({_id: currentTeam}, {$set:{'complete':true}});
			Router.go('/team');
			
		}

	}
});

Template.team.events({
	'click #createteam': function () {
		if(Teams.findOne({owner: Meteor.userId()})){
			Router.go('myteam', {_id: Teams.findOne({owner: Meteor.userId()})._id});
		}else{
		  var createdTeam = Teams.insert({
          teamname: 'Team ' + Meteor.user().profile.leagueusername,
          owner: Meteor.userId(),
          dateCreated: moment().format('MM/DD/YYYY'),
          players: [],
          complete: false
		});
		 Meteor.users.update({_id: Meteor.userId()}, {$set:{'profile.team': createdTeam}});
		 Router.go('myteam', {_id: createdTeam});
		}
	}
});


}


