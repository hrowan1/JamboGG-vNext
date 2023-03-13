/// NOTE FOR PROJECT MANAGER ///
/// THIS IS RUNNING IN A CRON JOB IN SOME OTHER AREA ///
/// USE THIS IF YOU WANT BUT IT IS A LONG OPERATION THAT IS SET TO CRON JOB EVERY 1 HOUR ///
/// THE SIZE OF THIS WILL SCALE EXPONENTIALLY THE MORE PEOPLE ARE ADDED TO THE DATABASE ///


const {MongoClient, ServerApiVersion} = require('mongodb')
const databaseUri = process.env.DATABASEURI
const APIKEY = process.env.APIKEY

const serverSelect = {'euw': 'europe', 'na': 'americas'}
const queueData = {'440': '5x5 Flex Queue', '420': '5x5 Solo Queue'}
const {runeTrees, runes} = require('.//runesData')

const client = new MongoClient(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
const collection = client.db("JamboGG").collection("GameData")

export default async function handler(req, res) {
    let players = await collection.find({}).toArray()

    for(let i2 in players) {
        let playerId = players[i2]['_id']
        let playerMatch = players[i2].games[0].metadata.matchId

        let response = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${playerId}/ids?api_key=${APIKEY}&type=ranked`)
        let data = await response.json()

        let newGames = 0
        for(let i in data) {
            if(data[i] == playerMatch) {
                newGames = i
            }
        }
        let dataUpdated = data.slice(0,newGames).reverse()
        await updateDB(dataUpdated, 'euw', playerId, newGames)
    }

    res.status(200)
    res.send('Data updated!')
}

async function updateDB(data, region, puuid, gameAmount) {

	var gameData = {}

	/* individual data*/
	var participantChamp
	var participantRole
	var participantId
	var enemyChampion
	var kills
	var deaths
	var assists

	var killPar
	var controlWards
	var wardScore
	var damage
	var creepScore

	var win

	for(let i = 0; i < gameAmount; i++) {

		var priRune = {'tree':'','keystone':'','selection': []}
		var secRune = {'tree':'','selection': []}

		/* json to be returned from API call */
		var returnData = {'metadata':{}, 'info': {}, 'stats': {}, 'runes':{}, 'items':{}, 'summoners': {}}

		let matchResponse = await fetch('https://'+serverSelect[region]+'.api.riotgames.com/lol/match/v5/matches/'+data[i]+'?api_key='+APIKEY)
		//console.log(matchResponse.status)
		while(matchResponse.status != 200)
		{
			//console.log(matchResponse.status)
			matchResponse = await fetch('https://'+serverSelect[region]+'.api.riotgames.com/lol/match/v5/matches/'+data[i]+'?api_key='+APIKEY)
			await new Promise(resolve => setTimeout(resolve, 500))
		}
		let matchData = await matchResponse.json()

		/* game data */

		let matchId = matchData['metadata']['matchId']
		let gameTime = matchData['info']['gameDuration']
		var minutes = Math.floor(gameTime/60)
		var seconds = (gameTime-minutes * 60).toString()
		
		if (seconds.length == 1) {
			seconds = '0'+seconds.toString()
		}

		let queueNum = matchData['info']['queueId']
        console.log(queueNum, queueData[queueNum])
		let queueType = queueData[queueNum]

		var totalKills = {'true':0, 'false':0}
		var items = []
		var summoners = []
		for(let i = 0; i < 10; i++) {
			totalKills[matchData['info']['participants'][i]['win']] = totalKills[matchData['info']['participants'][i]['win']] + matchData['info']['participants'][i]['kills']
			if (matchData['metadata']['participants'][i] == puuid) {
				participantId = i
				participantChamp = matchData['info']['participants'][i]['championName']
				participantRole = matchData['info']['participants'][i]['individualPosition']
				win = matchData['info']['participants'][i]['win']

				kills = matchData['info']['participants'][i]['kills']
				deaths = matchData['info']['participants'][i]['deaths']
				assists = matchData['info']['participants'][i]['assists']

				priRune.tree = runeTrees[matchData['info']['participants'][i]['perks']['styles'][0]['style']]
				priRune.keystone = runes[matchData['info']['participants'][i]['perks']['styles'][0]['selections'][0]['perk']]

				secRune.tree = runeTrees[matchData['info']['participants'][i]['perks']['styles'][1]['style']]

				items.push(matchData['info']['participants'][i]['item0'])
				items.push(matchData['info']['participants'][i]['item1'])
				items.push(matchData['info']['participants'][i]['item2'])
				items.push(matchData['info']['participants'][i]['item3'])
				items.push(matchData['info']['participants'][i]['item4'])
				items.push(matchData['info']['participants'][i]['item5'])

				controlWards = matchData['info']['participants'][i]['visionWardsBoughtInGame']
				wardScore = matchData['info']['participants'][i]['visionScore']
				damage = matchData['info']['participants'][i]['totalDamageDealtToChampions']
				creepScore = matchData['info']['participants'][i]['totalMinionsKilled'] + matchData['info']['participants'][i]['neutralMinionsKilled']

				summoners.push(matchData['info']['participants'][i]['summoner1Id'])
				summoners.push(matchData['info']['participants'][i]['summoner2Id'])				
			} 
		}

		totalKills = `${win == true ? totalKills['true'] : totalKills['false']}`

		for(let i = 1; i < 4; i++) {
			priRune.selection.push(runes[matchData['info']['participants'][participantId]['perks']['styles'][0]['selections'][i]['perk']])
		}
		for(let i = 0; i < 2; i++) {
			secRune.selection.push(runes[matchData['info']['participants'][participantId]['perks']['styles'][1]['selections'][i]['perk']])
		}

		secRune.selection.push(runes[matchData['info']['participants'][participantId]['perks']['statPerks']['defense']])
		secRune.selection.push(runes[matchData['info']['participants'][participantId]['perks']['statPerks']['flex']])
		secRune.selection.push(runes[matchData['info']['participants'][participantId]['perks']['statPerks']['offense']])

		for(let i = 0; i < 10; i++) {
			if(participantRole == matchData['info']['participants'][i]['individualPosition'] && i!=participantId) {
				enemyChampion = matchData['info']['participants'][i]['championName']
			}
		}

		if (win == true) {
			win = 'WIN'
		}
		else {
			win = 'LOSS'
		}

		participantChamp = `${participantChamp == 'FiddleSticks' ? 'Fiddlesticks' : participantChamp}`
		enemyChampion = `${enemyChampion == 'FiddleSticks' ? 'Fiddlesticks' : enemyChampion}`
		win = `${gameTime < 300 ? 'REMAKE' : win}`

		var duration = minutes+':'+seconds

		killPar = Math.round(((kills+assists)/totalKills)*100) + '%'

		returnData['metadata'].outcome = win
		returnData['metadata'].duration = duration
		returnData['metadata'].gameTime = gameTime
		returnData['metadata'].queue = queueType
		returnData['metadata'].matchId = matchId
		returnData['info'].champion = participantChamp
		returnData['info'].role = participantRole
		returnData['info'].enemyChamp = enemyChampion
		returnData['stats'].kills = kills
		returnData['stats'].deaths = deaths
		returnData['stats'].assists = assists
		returnData['stats'].killParticipation = killPar
		returnData['stats'].controlWards = controlWards
		returnData['stats'].wardScore = wardScore
		returnData['stats'].damageDealt = damage
		returnData['stats'].creeps = creepScore
		returnData['runes'].primaryTree = priRune.tree
		returnData['runes'].keystone = priRune.keystone
		returnData['runes'].secondaryTree = secRune.tree
		returnData['runes'].primarySel = priRune.selection
		returnData['runes'].secondarySel = secRune.selection
		returnData['items'].items = items
		returnData['summoners'] = summoners

		gameData[matchId] = (returnData)

		let dbPath = `championStats.${gameData[matchId].info.champion}`
		let isWin = gameData[matchId].metadata.outcome == 'WIN' ? 1 : 0
		let isLoss = gameData[matchId].metadata.outcome == 'LOSS' ? 1 : 0
		let killInc = gameData[matchId].stats.kills
		let deathInc = gameData[matchId].stats.deaths
		let assistInc = gameData[matchId].stats.assists
		let damageDealtInc = gameData[matchId].stats.damageDealt
		let creepsInc = gameData[matchId].stats.creeps
		let controlWardsInc = gameData[matchId].stats.controlWards

        await collection.updateOne(
            {_id : puuid},
            {
                $push: {
                    'games' : {
                        $each : [gameData[matchId]],
                        $position: 0,
                    },
                },
                $inc: {
                    [`${dbPath}.gamesPlayed`] : 1,
                    [`${dbPath}.wins`] : isWin,
                    [`${dbPath}.losses`] : isLoss,
                    [`${dbPath}.kills`] : killInc,
                    [`${dbPath}.deaths`] : deathInc,
                    [`${dbPath}.assists`] : assistInc,
                    [`${dbPath}.damageDealt`] : damageDealtInc ,
                    [`${dbPath}.creeps`] : creepsInc ,
                    [`${dbPath}.controlWards`] : controlWardsInc,
                }
            }
        )
    }
}