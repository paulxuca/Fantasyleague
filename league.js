Leagues = new Meteor.Collection('leagues');
Teams = new Meteor.Collection('teams');

var buildregex = function(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

if (Meteor.isClient) {

  Session.setDefault('pulled', null);
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

  SearchSource.defineSource('Meteor.users', function(searchText, options) {
  var options = {limit: 10, sort: {dateCreated: -1}};

  if(searchText) {
    var regExp = buildregex(searchText);
    var selector = {'profile.leagueusername': regExp};
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({}, options).fetch();
  }
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
  /*,
  onRun:function(){
    Meteor.call("pullstats", Meteor.user().profile.rawId, function(error, results){
        if(error){
          console.log(error);
        }else{
        Session.set('pulled', results);
        Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.rawData': Session.get('pulled')[0],'profile.score': Session.get('pulled')[1], 'profile.historicalStats': Session.get('pulled')[2]}});
        }
      });
  }*/
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

Router.route('/team', {
  name: 'team',
  template: 'team',
  onBeforeAction: function(){
    if(!Meteor.user()){
      this.render('login');
    }else{
      this.next();
    }
  }
});

Router.route('/createteam', {
  name: 'createTeam',
  template: 'createTeam',
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



Router.route('/profile', {
  name: 'profile',
  template: 'profile',
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

Router.route('/teams/:_id',{
  name:'myteam',
  template: 'myteam',
  data:function(){
    var currentTeam = this.params._id;
      return Teams.findOne({_id: currentTeam});
  },
  onBeforeAction:function () {
    Session.set('message', null);
      if (Teams.findOne({_id: this.params._id})){
        this.next();

    } else{
        this.render('home');
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




