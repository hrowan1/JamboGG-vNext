const APIKEY = process.env.APIKEY
const {MongoClient, ServerApiVersion} = require('mongodb')
const databaseUri = process.env.DATABASEURI

const client = new MongoClient(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
const collection = client.db("JamboGG").collection("Leaderboard-euw")

export default async function handler(req, res) {
    
    let data = await getLeaderboardData()    
    res.send(data)
}

async function getLeaderboardData() {
    let response = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${APIKEY}`)
    let data = await response.json()
    let leaderboardData = []
    for(let i in data.entries) {
        let response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${data.entries[i].summonerName}?api_key=${APIKEY}`)
        let summonerData = await response.json()
        leaderboardData.push([data.entries[i].summonerName, data.entries[i].leaguePoints, summonerData.profileIconId])
    }
    let sortedLeaderboard = leaderboardData.sort(function(x, y) {
        return x[1] - y[1]
    })

    let leaderboard = {}
    for(let i in sortedLeaderboard.reverse()) {
        leaderboard[sortedLeaderboard[i][0]] = sortedLeaderboard[i][1]
        await collection.updateOne (
            {_id : sortedLeaderboard[i][0]},
            {$set: {
            points: sortedLeaderboard[i][1],
            iconId: sortedLeaderboard[i][2],
            }},
            {upsert: true,}
        )
    }

    return leaderboard
}