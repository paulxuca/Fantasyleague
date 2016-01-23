if (Meteor.isServer) {
    Meteor.methods({
        registerLeague: function (leagueusername) {
            this.unblock();
            var constructarray = [];
            var construct = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + leagueusername + '?api_key=' + Meteor.settings.private.leaguekey;
            var mainreturn = HTTP.get(construct, {})['data'][leagueusername];
            var id = mainreturn['id'];
            var level = mainreturn['summonerLevel'];

            if (level != 30 ){
            	throw RangeError('level not enough');
            }

            //initarray

            for(var i = 0; i< 23;i++){
            	constructarray.push(0);
            }
           
            var accountbuilderapicall = 'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/ranked?api_key=' + Meteor.settings.private.leaguekey;
            var accountbuildercall = JSON.parse(HTTP.get(accountbuilderapicall, {})['content']);
            var accountbuild = accountbuildercall['champions'];
            for (var key in accountbuild){
            	var counter = 0;
            	for(var key2 in accountbuild[key]){
            		if(key2 == 'stats'){
            			for(var key3 in accountbuild[key][key2]){
            					constructarray[counter] += (accountbuild[key][key2][key3]);
            					counter++
            			}
            	}
            		}
            }
            Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.rawData': constructarray, 'profile.leagues': []}} );

        },
        calculateScore:function(account){



        }
    });
}