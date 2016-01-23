if (Meteor.isClient){
	Template.navbar.events({
		'click #logout': function(e){
			Meteor.logout();
			Router.go('login');
		}
	});
}