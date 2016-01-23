if (Meteor.isClient){
	Template.navbar.events({
		'click #logout': function(e){
			Router.go('login');
			Meteor.logout();
		}
	});
}