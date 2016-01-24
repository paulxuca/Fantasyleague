var zip = function(arrays) {
        return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
        });
}

var calculateScore = function(stats){
        var score = 0;
        if (stats[0]===0)
                {
                    return 0;
                }

        score = (stats[2]/stats[0]) * 75 + 
            (stats[3]/stats[0]) * 5 + 
            (stats[5]/stats[0]) * 0.0005 + 
            stats [9] *2 + stats[10] *5 + stats[11]* 20 + stats[12]*50 +
            stats[13] * Math.pow(10,4) + 
            stats [14]/stats[0] * -8 + 
            stats[17] /stats[0] * 10 + 
            stats[21] * 5 + 
            stats [22]/stats[0] * 3;
        return (Math.round(score*100))/100;
        }

if (Meteor.isServer) {
    Meteor.methods({
        registerLeague: function (leagueusername) {
            this.unblock();
            var constructarray = [];
            var strippedusername = leagueusername.replace(/\s/g, "");
            var construct = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + strippedusername + '?api_key=' + Meteor.settings.private.leaguekey;
            var mainreturn = HTTP.get(construct, {})['data'][strippedusername];
            var id = mainreturn['id'];
            var level = mainreturn['summonerLevel'];

            if (level != 30 || id === undefined ){
            	throw new Meteor.Error( 500, 'There was an error processing your request' );
                stop();
            }

            //initarray

            for(var i = 0; i< 37;i++){
            	constructarray.push(0);
            }
           
            var accountbuilderapicall = 'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/ranked?api_key=' + Meteor.settings.private.leaguekey;            
            var accountbuildercall = JSON.parse(HTTP.get(accountbuilderapicall, {})['content']);
            var accountbuild = accountbuildercall['champions'];
            var counter = 0;
            for(var key in accountbuild){
                if(accountbuild[key]['id'] === 0){
                    for (var key2 in accountbuild[key]['stats']){
                        constructarray[counter] += (accountbuild[key]['stats'][key2]);
                        counter++;
                    }
                }
                /*
                if(key === 'stats'){
                    for (var key2 in accountbuild[accountbuild.length - 1][key]){
                        constructarray[counter] += (accountbuild[accountbuild.length - 1][key][key2]);
                        counter++
                    }   
                }*/
            }
            var setScore = calculateScore(constructarray);
            Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.rawData': constructarray, 'profile.score': setScore, 'profile.leagues': [], 'profile.rawId': id, 'profile.team': null, 'profile.historicalStats': [setScore]}} );

        },
        pullstats:function(leagueid){// Need to figure out a way to push current score into the backburner
            var constructarray = [];
            for(var i = 0; i< 37;i++){
                constructarray.push(0);
            }
            var accountbuilderapicall = 'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + leagueid + '/ranked?api_key=' + Meteor.settings.private.leaguekey;
            var accountbuildercall = JSON.parse(HTTP.get(accountbuilderapicall, {})['content']);
            var accountbuild = accountbuildercall['champions'];
            var counter = 0;
            for(var key in accountbuild[accountbuild.length - 1]){
                if(key === 'stats'){
                    for (var key2 in accountbuild[accountbuild.length - 1][key]){
                        constructarray[counter] += (accountbuild[accountbuild.length - 1][key][key2]);
                        counter++
                    }   
                }
            }
            var setScore = calculateScore(constructarray);
            var historical = Meteor.user().profile.score;
            var historicalArray = Meteor.user().profile.historicalStats;
            historicalArray.push(historical);
            return [constructarray, setScore, historicalArray];

        },
        createSchedule:function(players){

        var currentPlayers = players;

        if (currentPlayers.length % 2 ==1){
            currentPlayers.push("BYE");
        }

        var schedule = []

        for (i=0; i<currentPlayers.length-1; i++)
        {
            var mid = currentPlayers.length /2;
            var l1 = currentPlayers.slice(0, mid);
            var l2 = currentPlayers.slice(mid);

            if (i % 2 ==1)
            {
                schedule.push(zip([l1,l2]))
            }
            else
            {
                schedule.push(zip([l2,l1]))
            }

            var spliced = currentPlayers.splice(-1,1);
            currentPlayers.splice(1, 0, spliced);
        }
        console.log(schedule[0]);
        return schedule;

        }
    });
}    