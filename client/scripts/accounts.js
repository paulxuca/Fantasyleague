if (Meteor.isClient){


  Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();

      var options = {
    	email: t.find('#email').value,
    	password: t.find('#password').value,
    	profile: {
        leagueusername: t.find("#leagueusername").value
    	}
		};
		Accounts.createUser( options , function(err){
    	if( err ){
    		console.log('registration failed.', err);


    	}else{
    		console.log('success!');
    		 Meteor.call("registerLeague", Meteor.user().profile.leagueusername, function(error, results) {
    		});	
    		 Router.go('/');


    	}
		});
	}
});


  Template.login.events({
    'submit #login-form':function(e,t){
        e.preventDefault();
        Meteor.loginWithPassword(t.find('#email').value, t.find('#password').value);
        Router.go('/');
    }




  });
}
