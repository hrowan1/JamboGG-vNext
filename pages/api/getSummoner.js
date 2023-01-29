const APIKEY = process.env.APIKEY

export default async function handler(req, res) {
    const summonerName = req.query.summonerName
    const region = req.query.region

    let data = await getSummonerDataFromAPI(summonerName, region)    
    res.send(data)
}

// function to call the RiotAPI and return the user data, including IDs and names.
async function getSummonerDataFromAPI(name, region) {
    let response = await fetch(`https://${region}1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${APIKEY}`)
    if(response.status == 200) {
        let data = await response.json()
        return data
    }
    else {
        return response.status
    }
}