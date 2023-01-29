const APIKEY = process.env.APIKEY

const serverSelect = {'euw': 'europe', 'na': 'americas'}

export default async function handler(req, res) {
    const matchId = req.query.matchId
    const region = req.query.region
    const summID = req.query.puuid
    let response = await fetch('https://'+serverSelect[region]+'.api.riotgames.com/lol/match/v5/matches/'+matchId+'/timeline?api_key='+APIKEY)
	let matchData = await response.json()
	for(let i in matchData.metadata.participants) {
		if(summID == matchData.metadata.participants[i]) {
			var currentPlayerID = i
			currentPlayerID++
		}
	}
	let events = {}
	let itemBuildData = []
	let jsonCounter = 0
	for(let i in matchData.info.frames) {
		for(let j in matchData.info.frames[i].events) {
			if(matchData.info.frames[i].events[j].participantId == currentPlayerID) {
				if(matchData.info.frames[i].events[j].type == "ITEM_PURCHASED") {
					itemBuildData.push([matchData.info.frames[i].events[j].itemId, i-1])
				}
			}
			switch (matchData.info.frames[i].events[j].type) {
				case "CHAMPION_KILL":
					events[jsonCounter] = {
						event: 'champion_kill',
						timeStamp: matchData.info.frames[i].events[j].timestamp,
						team: matchData.info.frames[i].events[j].killerId < 6 ? 'BLUE' : 'RED'
					}
					jsonCounter++
					break

				case "ELITE_MONSTER_KILL":
					events[jsonCounter] = {
						event: 'elite_monster_kill',
						team: matchData.info.frames[i].events[j].killerTeamId == 100 ? 'BLUE' : 'RED',
						monsterType: matchData.info.frames[i].events[j].monsterType,
						timeStamp: matchData.info.frames[i].events[j].timestamp,
					}
					jsonCounter++
					break

				case "BUILDING_KILL":
					events[jsonCounter] = {
						event: 'building_kill',
						type: matchData.info.frames[i].events[j].buildingType,
						team: matchData.info.frames[i].events[j].teamId == 100 ? 'BLUE' : 'RED',
						lane: matchData.info.frames[i].events[j].laneType,
						timeStamp: matchData.info.frames[i].events[j].timestamp,
						towerType: matchData.info.frames[i].events[j].towerType,
					}
					jsonCounter++
					break

				case "GAME_END":
					events[jsonCounter] = {
						event: 'game_end',
						timeStamp: matchData.info.frames[i].events[j].timestamp,
						winningTeam: matchData.info.frames[i].events[j].winningTeam == 100 ? 'BLUE' : 'RED',
					}
					jsonCounter++
					break
			}
		}
	}
	res.send({itemData: itemBuildData, gameEvents: events})
}