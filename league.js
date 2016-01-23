Leagues = new Meteor.Collection('leagues');
Teams = new Meteor.Collection('teams');


if (Meteor.isClient) {
  Session.setDefault('message', '');

  Template.registerHelper('message',function(input){
  return Session.get("message");
  });

  Template.joinleague.destroyed = function(){
  Session.set('message', null);
}

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.route('/', {
  name: 'home',
  template: 'home',
  onBeforeAction: function(){
  	if(!Meteor.user()){
  		this.render('login');
  	}else{
  		this.next();
  	}
  }
});


Router.route('/leagues', {
  name: 'leagues',
  template: 'leagues',
  onBeforeAction: function(){
    if(!Meteor.user()){
      this.render('login');
    }else{
      this.next();
    }
  }
});

Router.route('/leaguesCreate', {
  name: 'leaguesCreate',
  template: 'leaguesCreate',
  onBeforeAction: function(){
    if(!Meteor.user()){
      this.render('login');
    }else{
      this.next();
    }
  }
});


Router.route('/joinleague', {
  name: 'joinleague',
  template: 'joinleague',
  onBeforeAction: function(){
    if(!Meteor.user()){
      this.render('login');
    }else{
      this.next();
    }
  }
});

Router.route('/league/:_id', {
    name: 'league',
    template: 'league',
    data: function(){
      var currentLeague = this.params._id;
      return Leagues.findOne({_id: currentLeague});
    },
    onBeforeAction:function(){
      
       if(isInArray(Meteor.userId(), Leagues.findOne({_id: this.params._id}).players) === false && Leagues.findOne({_id: this.params._id}).public === false){
          var passwordentered = prompt('Enter the secret password for this League!');
          if (Leagues.findOne({_id: this.params._id}).password === passwordentered){
            currentPlayers = Leagues.findOne({_id: this.params._id}).players;
            this.next();
          }else{
            this.render('/leagues');
          }
       }else{
        this.next();
         
       }
       }
    
});




Router.route('/login', {
  name: 'login',
  template: 'login'
});



Router.route('/register', {
  name: 'register',
  template: 'register'
});




