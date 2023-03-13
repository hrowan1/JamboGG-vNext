// Block which loads the ranked data of a given player when searched. This updates each time the player is searched, not saved to a database ///

import styles from '@/styles/RankBlock.module.css'
import Link from 'next/link'

let emblemLink = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-"

const patch = '13.5.1'
const championImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/champion/'


export default function RankBlock(props) {

    let champData = props.data[0]
    let rankData = props.data[1]
    let unranked = false
    if(!rankData.tier) {
        rankData.tier = 'bronze'
        unranked = true
    }
    let background = `${emblemLink}${(rankData.tier).toLowerCase()}.png`
    
    let fullChampData = getTopChamps(champData)
    let championList = []
    for(let i in fullChampData) {
        let k = Math.round(champData[fullChampData[i][0]].kills/fullChampData[i][1] * 10)/10
        let d = Math.round(champData[fullChampData[i][0]].deaths/fullChampData[i][1] * 10)/10
        let a = Math.round(champData[fullChampData[i][0]].assists/fullChampData[i][1] * 10)/10
        let avg = Math.round(((k+a)/d)*100)/100
        let winrate = Math.round((champData[fullChampData[i][0]].wins / fullChampData[i][1])*100)
        championList.push(
            <li key={`ChampList${i}`} className={styles.championList}>
                <div className={styles.champStatData}>
                    <img className={styles.champStatImage} src={`${championImage}${fullChampData[i][0]}.png`}/>
                </div>
                <div className={styles.champStatData}>
                    <p>{fullChampData[i][0]}</p>
                </div>
                <div className={styles.champStatData}>
                    <p>{`${fullChampData[i][1]}
                        games`}</p>
                </div>
                <div className={styles.champStatData}>
                    <p>{`${k} / ${d} / ${a}
                       (${avg})`}</p>
                </div>
                <div className={styles.champStatData}>
                    <p>{`${champData[fullChampData[i][0]].wins}W / ${champData[fullChampData[i][0]].losses}L
                         ${winrate}%`}</p>
                </div>
            </li>
        )
    }
    return(
        <>
            <div className={styles.wrBox}>
                <div className={styles.rankImageBox}>
                    <div className={styles.rankImageMain} style={{backgroundImage: `url(${background})`}} />
                </div>
                {
                    !unranked ? 
                        <div className={styles.rankInfoBox}>
                            <p className={styles.rankText}>{`${rankData.tier} ${rankData.rank}
                                ${rankData.lp}lp
                                ${rankData.wins}W / ${rankData.losses}L`}
                            </p>
                        </div> : 
                        <div className={styles.rankInfoBox}>
                            <p className={styles.rankText}>UNRANKED</p>
                        </div> 
                }
            </div>
            <div className={styles.statBox}>
                {championList}
            </div>
        </>
    )
}

function getTopChamps(data) {
    let sortArray = []
    for(let i in data) {
        sortArray.push([i, data[i].gamesPlayed])
    }
    sortArray.sort(function(x, y) {
        return x[1] - y[1]
    })
    return sortArray.reverse().slice(0,5)
}