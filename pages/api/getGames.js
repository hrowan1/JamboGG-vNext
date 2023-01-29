const {MongoClient, ServerApiVersion} = require('mongodb')
const databaseUri = process.env.DATABASEURI
const APIKEY = process.env.APIKEY

const client = new MongoClient(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
const collection = client.db("JamboGG").collection("GameData")

//servers sometimes have different end points
const serverSelect = {'euw': 'europe', 'na': 'americas'}
const queueData = {'440': '5x5 Flex Queue', '420': '5x5 Solo Queue'}
const {runeTrees, runes} = require('.//runesData')

export default async function handler(req, res) {
    const puuid = req.query.puuid
    const region = req.query.region
	const eId = req.query.eid

    let data = await checkDatabaseForSummoner(puuid, region, eId)
    res.send(data)
}

//function that checks a serverless database in MongoDB, and checks if the summoner is in the database already. If not, it will be searched in.
async function checkDatabaseForSummoner(puuid, region, eId) {
	let statisticRes = await fetch(`https://${region}1.api.riotgames.com/lol/league/v4/entries/by-summoner/${eId}?api_key=${APIKEY}`)
	let statisticData = await statisticRes.json()
	let blockData = {}
	for(let i in statisticData)
	{
		if(statisticData[i].queueType == 'RANKED_SOLO_5x5') {
			blockData['wins'] = statisticData[i].wins
			blockData['losses'] = statisticData[i].losses
			blockData['tier'] = statisticData[i].tier
			blockData['rank'] = statisticData[i].rank
			blockData['lp'] = statisticData[i].leaguePoints
		}
	}

    let playerData = await collection.find({_id: puuid}).toArray()
    if(typeof playerData[0] === 'undefined') {
        let matchData = await getMatchData(puuid, region)
		let newRankData = await collection.find({_id: puuid}).toArray()
		let rankData = await newRankData[0].championStats
        return [matchData, [rankData, blockData]]
    }
    else {
        return [playerData[0].games.slice(0,10),[playerData[0].championStats, blockData]]
    }
}

async function getMatchData(puuid, region) {

	let epochDate = 1673431200
	let response = await fetch('https://'+serverSelect[region]+'.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puuid+'/ids?start=0&startTime='+epochDate+'&type=ranked&count=50&api_key='+APIKEY)
	let data = await response.json()
	let gamesToSave = data.length
	return parseAndAddToDB(data, region, puuid, gamesToSave, 'write')

}

async function parseAndAddToDB(data, region, puuid, gameAmount, mode) {

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

		if(mode == 'write') {

			await collection.updateOne(
				{_id : puuid},
				{
					$push: {
							'games' : {
								$each : [gameData[matchId]],
							},
					},
					$set : {
						'region': region,
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
				},
				{upsert: true,}
			)
		}
		else if(mode == 'update') {
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

	let returnArr = []
	for(let ij = 0; ij<10; ij++) {
		returnArr.push(gameData[Object.keys(gameData)[ij]])
	}

	return returnArr
}