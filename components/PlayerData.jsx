import styles from '@/styles/FullGameRender.module.css'
import Image from 'next/image'

const patch = "13.1.1"
const championImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/champion/'
const itemImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/item/'
const summonerImage = '/img/summoners/'

export default function PlayerData(props) {
    let data = props.data

    let blueData = []
    let redData = []
    for(let i = 0; i < 5; i++) {
        blueData.push(<Players team='blueTeam' data={data[i]} key={`Player${i}`}/>)
    }
    for(let i = 5; i < 10; i++) {
        redData.push(<Players team='redTeam' data={data[i]} key={`Player${i}`}/>)
    }

    return (
        <div className={styles.playerData}>
            <div className={styles.teamDiv}>{blueData}</div>
            <div className={styles.teamDiv}>{redData}</div>
        </div>
    )
}

function Players(props) {
    const data = props.data
    let reverse = `${props.team == 'redTeam' ? styles.rvr : ''}`
    let team = `${props.team == 'redTeam' ? styles.redTeam : styles.blueTeam}`

    return (
        <div className={[styles.extendPlayer, team, reverse].join(" ")}>
            <div className={styles.champDiv}>
                <label className={[styles.level, reverse].join(" ")}>{data.level}</label>
                <img className={[styles.champLevel, reverse].join(" ")} src={championImage+data.champion+'.png'} />
            </div>
            <div className={[styles.summonersDiv, reverse].join(" ")}>
                <Image alt={data.summoners[0]} className={styles.summonerSpellTaken} src={summonerImage+data.summoners[0]+'.png'} width="100" height="100" />
                <Image alt={data.summoners[1]} className={styles.summonerSpellTaken} src={summonerImage+data.summoners[1]+'.png'} width="100" height="100" />
            </div>
            <div className={[styles.killInfo, reverse].join(" ")}>
                <p className={styles.kdaLabel}>{data.kda}</p>
                <p className={styles.kdrLabel}>{data.kdRatio}</p>
            </div>
            <div className={[styles.itemNameSection, reverse].join(" ")}>
                <div className={styles.summonerNameSection}>
                    <label className={styles.summonerNameLabel}>{data.name}</label>
                </div>
                <div className={styles.itemsSection}>
                    <img alt={`${data.items[0]!=0 ? data.items[0] : ''}`} src={`${data.items[0]!=0 ? itemImage+data.items[0]+'.png' : ''}`} className={styles.itemPic} />
                    <img alt={`${data.items[1]!=0 ? data.items[0] : ''}`} src={`${data.items[1]!=0 ? itemImage+data.items[1]+'.png' : ''}`} className={styles.itemPic} />
                    <img alt={`${data.items[2]!=0 ? data.items[0] : ''}`} src={`${data.items[2]!=0 ? itemImage+data.items[2]+'.png' : ''}`} className={styles.itemPic} />
                    <img alt={`${data.items[3]!=0 ? data.items[0] : ''}`} src={`${data.items[3]!=0 ? itemImage+data.items[3]+'.png' : ''}`} className={styles.itemPic} />
                    <img alt={`${data.items[4]!=0 ? data.items[0] : ''}`} src={`${data.items[4]!=0 ? itemImage+data.items[4]+'.png' : ''}`} className={styles.itemPic} />
                    <img alt={`${data.items[5]!=0 ? data.items[0] : ''}`} src={`${data.items[5]!=0 ? itemImage+data.items[5]+'.png' : ''}`} className={styles.itemPic} />
                </div>
            </div>
        </div>
    )
}