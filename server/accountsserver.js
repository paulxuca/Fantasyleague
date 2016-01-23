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

            for(var i = 0; i< 37;i++){
            	constructarray.push(0);
            }
           
            var accountbuilderapicall = 'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/ranked?api_key=' + Meteor.settings.private.leaguekey;
            var accountbuildercall = JSON.parse(HTTP.get(accountbuilderapicall, {})['content']);
            var accountbuild = accountbuildercall['champions'];
            console.log(accountbuild[accountbuild.length - 1]);
            var counter = 0;
            for(var key in accountbuild[accountbuild.length - 1]){
                if(key === 'stats'){
                    for (var key2 in accountbuild[accountbuild.length - 1][key]){
                        constructarray[counter] += (accountbuild[accountbuild.length - 1][key][key2]);
                        counter++

                    }
                    
                }

            }



            Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.rawData': constructarray, 'profile.leagues': []}} );

        },
        calculateScore:function(account){



        }
    });
}