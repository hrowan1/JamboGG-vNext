// Stats of the searched player for the amount of games that are saved to their profile in the database

import styles from '@/styles/FullStatList.module.css'

const patch = '13.5.1'
const championImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/champion/'

export default function FullStatList(props) {
    let base = props.data
    let data = SortChamps(props.data)
    let statList = []
    let keys = ['gamesPlayed', 'wins', 'losses', 'kills', 'deaths', 'assists', 'damageDealt', 'damageTaken', 'creeps', 'controlWards']
    for(let i in data) {
        let k = Math.round(base[data[i][0]].kills/data[i][1] * 10)/10
        let d = Math.round(base[data[i][0]].deaths/data[i][1] * 10)/10
        let a = Math.round(base[data[i][0]].assists/data[i][1] * 10)/10
        let avg = Math.round(((k+a)/d)*100)/100
        let winrate = Math.round((base[data[i][0]].wins / data[i][1])*100)
        let avgDD = Math.round((base[data[i][0]].damageDealt / data[i][1] * 10)/10)
        let avgCW = Math.round((base[data[i][0]].controlWards / data[i][1] * 10)/10)
        let avgCS = Math.round((base[data[i][0]].creeps / data[i][1] * 10)/10)
        statList.push(
            <li className={styles.listElement}>
                <div className={styles.statElement}>
                    <div className={styles.statDiv}>
                        <img className={styles.champStatImage} src={`${championImage}${data[i][0]}.png`}/>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{data[i][0]}</p>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{`${base[data[i][0]].gamesPlayed}
                        games`}</p>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{`${base[data[i][0]].wins}W / ${base[data[i][0]].losses}L
                        ${winrate}%`}</p>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{`${k} / ${d} / ${a}
                        (${avg})`}</p>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{`${avgDD}`}</p>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{avgCW}</p>
                    </div>
                    <div className={styles.statDiv}>
                        <p>{avgCS}</p>
                    </div>
                </div>
            </li>
        )
    }
    return(
        <ul className={styles.championDataList}>
            <ListTitleElement />
            {statList}
        </ul>
    )
}

// Sorts champions of a player in order of most played
function SortChamps(data) {
    let sortArray = []
    for(let i in data) {
        sortArray.push([i, data[i].gamesPlayed])
    }
    sortArray.sort(function(x, y) {
        return x[1] - y[1]
    })
    return sortArray.reverse()
}

function ListTitleElement(props) {
    return(
        <li className={[styles.listElement, styles.stick].join(" ")}>
                <div className={[styles.statElement, styles.titleElement].join(" ")}>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>Champion</p>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>Games Played</p>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>W / L</p>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>KDA</p>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>Damage Dealt</p>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>Pinks</p>
                    </div>
                    <div className={[styles.statDiv, styles.titles].join(" ")}>
                        <p>CS</p>
                    </div>
                </div>
            </li>
    )
}