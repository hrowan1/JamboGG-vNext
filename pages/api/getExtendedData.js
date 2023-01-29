const APIKEY = process.env.APIKEY
const serverSelect = {'euw': 'europe', 'na': 'americas'}

export default async function handler(req, res) {
    const matchId = req.query.matchId
    const region = req.query.region

    let response = await fetch('https://'+serverSelect[region]+'.api.riotgames.com/lol/match/v5/matches/'+matchId+'?api_key='+APIKEY)
    let data = await response.json()
    res.send(dataParsing(data))
}

function dataParsing(p) {

	let gameData = {'participants' : [], 'metadata' : {}, 'statTotals' : {}}
	let totalGoldB = 0
	let totalGoldR = 0 
	let totalFarmB = 0
	let totalFarmR = 0
	for(let i = 0; i < 10; i++) {
		let playerInfo = {}
		let loc = p['info']['participants'][i]

		let tK = loc['kills']
		let tD = loc['deaths']
		let tA = loc['deaths']
		let kdRatio = `${isNaN(Math.round(((tK+tA)/tD)*100)/100) ? 'Perfect' : Math.round(((tK+tA)/tD)*100)/100}`
		kdRatio = `${kdRatio == 'Infinity' ? 'Perfect' : kdRatio}`

		playerInfo.name = loc['summonerName']
		playerInfo.champion = loc['championName']
		playerInfo.champion = `${playerInfo.champion == 'FiddleSticks' ? 'Fiddlesticks' : playerInfo.champion}`
		playerInfo.summoners = [loc['summoner1Id'], loc['summoner2Id']]
		playerInfo.kda = `${tK} / ${tD} / ${tA}`
		playerInfo.kdRatio = kdRatio
		playerInfo.level = loc['champLevel']
		playerInfo.items = [loc['item0'],loc['item1'],loc['item2'],loc['item3'],loc['item4'],loc['item5']]

		if(i < 5) {
			totalGoldB += loc['goldEarned']
			totalFarmB += (loc['totalMinionsKilled'] + loc['neutralMinionsKilled'])
		} else {
			totalGoldR += loc['goldEarned']
			totalFarmR += (loc['totalMinionsKilled'] + loc['neutralMinionsKilled'])
		}

		playerInfo.damageDealtToObjectives = loc['damageDealthToObjectives']
		playerInfo.pinksPlaced = loc['detectorWardsPlaced']
		playerInfo.goldEarned = loc['goldEarned']
		playerInfo.totalDamageDealtToChampions = loc['totalDamageDealtToChampions']
		playerInfo.totalDamageTaken = loc['totalDamageTaken']
		playerInfo.totalHeal = loc['totalHeal']
		playerInfo.turretTakedowns = loc['turretTakedowns']
		playerInfo.visionScore = loc['visionScore']
		playerInfo.wardsPlaced = loc['wardsPlaced']
		playerInfo.farm = loc['totalMinionsKilled'] + loc['neutralMinionsKilled']
		playerInfo.kills = tK
		playerInfo.deaths = tD
		playerInfo.assists = tA

		gameData['participants'].push(playerInfo)
	}

	gameData['statTotals'].totalGoldB = totalGoldB
	gameData['statTotals'].totalGoldR = totalGoldR
	gameData['statTotals'].totalFarmB = totalFarmB
	gameData['statTotals'].totalFarmR = totalFarmR

	let dat = p['info']
	gameData['metadata'].matchId = p['metadata']['matchId']
	gameData['metadata'].timeCreated = dat['gameCreation']
	let minutes = Math.floor(dat['gameDuration']/60)
	let seconds = `${(dat['gameDuration']%60).toString().length == 2 ? dat['gameDuration']%60 : '0'+dat['gameDuration']%60}`
	gameData['metadata'].gameLength = `${minutes}:${seconds}`
	gameData['metadata'].winningTeam = `${dat['teams'][0]['win'] == true ? 'Blue Team' : 'Red Team'}`

	return gameData
}