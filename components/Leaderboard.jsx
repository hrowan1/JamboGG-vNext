// TOP 100 players from either NA or EUW ///

import styles from '@/styles/Leaderboard.module.css'
const patch = '13.5.1'
const summonerIcon = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/profileicon/`

export default function Leaderboard(props) {
    let leaderboardElements = []
    for(let i = 3; i < Object.keys(props.data).length; i++) {
        let iconID = props.data[i].icon == undefined ? 23 : props.data[i].icon
        leaderboardElements.push(
            <div key={`${i}href`} className={styles.leaderboardElement}>
                <div className={styles.elementText}>
                    <img className={styles.leaderboardIcon} src={`${summonerIcon}${iconID}.png`} />
                </div>
                <div className={styles.elementText}>
                    {+i+1}
                </div>
                <div className={styles.elementText}>
                    <a className={styles.playerLink} href={`../summoners/${props.server}/${props.data[i].name}`}>{props.data[i].name}</a>
                </div>
                <div className={styles.elementText}>
                    {props.data[i].points}lp
                </div>
            </div>
        )
    }
    return (
        <>
            <div className={styles.podium}>
                <div className={styles.rankOne}>
                    <img className={styles.rankOneIcon} src={`${summonerIcon}${(props.data[0].icon == undefined ? 23 : props.data[0].icon)}.png`} />
                    <a className={[styles.rankOneText, styles.playerLink].join(' ')} href={`../summoners/${props.server}/${props.data[0].name}`}>{props.data[0].name}</a>
                    <p className={styles.rankOneText}>{props.data[0].points}lp</p>
                </div>
                <div className={styles.bottomPodium}>
                    <div className={styles.rankTwo}>
                        <div className={styles.podiumTextWrapper}>
                            <a className={[styles.podiumText, styles.playerLink].join(' ')} href={`../summoners/${props.server}/${props.data[1].name}`}>{props.data[1].name}</a>
                            <p className={styles.podiumText}>{props.data[1].points}lp</p>
                        </div>
                        <img className={styles.podiumIcon} src={`${summonerIcon}${(props.data[1].icon == undefined ? 23 : props.data[1].icon)}.png`} />
                    </div>
                    <div className={styles.rankThree}>
                        <img className={styles.podiumIcon} src={`${summonerIcon}${(props.data[2].icon == undefined ? 23 : props.data[2].icon)}.png`} />
                        <div className={styles.podiumTextWrapper}>
                            <a className={[styles.podiumText, styles.playerLink].join(' ')} href={`../summoners/${props.server}/${props.data[2].name}`}>{props.data[2].name}</a>
                            <p className={styles.podiumText}>{props.data[2].points}lp</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.leaderboard}>
                {leaderboardElements}
            </div>
        </>
    )
}