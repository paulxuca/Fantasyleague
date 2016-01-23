if (Meteor.isClient){


  Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      leagueusername = t.find("#leagueusername").value;
      if(Meteor.users.findOne({'profile.leagueusername': leagueusername})){
        console.log('Username already exists.');

      }else{
        var options = {
      email: t.find('#email').value,
      password: t.find('#password').value,
      profile: {
        leagueusername: leagueusername,
        leagues: []
      }
      }

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
