const APIKEY = process.env.APIKEY
const {MongoClient, ServerApiVersion} = require('mongodb')
const databaseUri = process.env.DATABASEURI

const client = new MongoClient(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})

export default async function handler(req, res) {
    const region = req.query.server
    let data = await getLeaderboardData(region)    
    res.send(data)
}

async function getLeaderboardData(region) {

    const collection = client.db("JamboGG").collection(`Leaderboard-${region}`)
    let leaderboardData = await collection.find({}).toArray()
    let leaderboard = []
    for(let i = 0; i < 100; i++) {
        leaderboard.push([leaderboardData[i]['_id'], leaderboardData[i]['points'], leaderboardData[i]['iconId']])
        /*leaderboard[i] = {
            'name' : leaderboardData[i]['_id'], 
            'points': leaderboardData[i]['points'],
            'icon': leaderboardData[i]['iconId'],
        }*/
    }

    let sortedLeaderboard = leaderboard.sort(function(x, y) {
        return x[1] - y[1]
    })

    let returnBoard = {}
    for(let i in sortedLeaderboard.reverse()) {
        returnBoard[i] = {
            'name' : sortedLeaderboard[i][0], 
            'points': sortedLeaderboard[i][1],
            'icon': sortedLeaderboard[i][2],
        }
    }

    return returnBoard
}