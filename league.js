Leagues = new Meteor.Collection('leagues');
Teams = new Meteor.Collection('teams');


if (Meteor.isClient) {

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


Router.route('/league/:_id', {
    name: 'league',
    template: 'league',
    data: function(){
      var currentLeague = this.params._id;
      return Leagues.findOne({_id: currentLeague});
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
