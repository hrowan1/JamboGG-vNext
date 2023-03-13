// Renders the entire game when a user wants it //

import {useSession, useState, useEffect} from 'react' //React states and effects to allow data to change without the entire DOM being reloaded
// useEffect refires everytime the state is refreshed

import styles from '@/styles/FullGameRender.module.css'
import PlayerData from '../components/PlayerData.jsx'
import PlayerStatistics from './PlayerStats.jsx'
import BuildHistory from './BuildHistory.jsx'
import MatchTimeLine from './MatchTimeLine.jsx'

export default function FullGameRender(props) {
    const [focusedTab, setFocusedTab] = useState(0)
    const [timelineData, setTimelineData] = useState(0)
    const data = props.data.metadata
    const statTotals = props.data.statTotals
    const participants = props.data.participants
    const getTimeline = async() => {
        const response = await fetch(`/api/getTimelineData?matchId=${props.data.metadata.matchId}&region=${props.region}&puuid=${props.puuid}`)
        const data = await response.json()
        setTimelineData(data)
    }
    useEffect(() => {
        if(timelineData == 0) {
            getTimeline()
        }
    })
    
    let dateCreated = new Date(data.timeCreated).toLocaleString()
    let totalGold = statTotals.totalGoldB + statTotals.totalGoldR
    let bluePerGold = Math.round((statTotals.totalGoldB/totalGold)*10000)/100
	let redPerGold = 100-bluePerGold

    return(
        <div className={styles.fullGame}>
            <div className={styles.selector}>
                <button className={styles.tabButton} onClick={() => {setFocusedTab(0)}} style={focusedTab==0 ? {backgroundColor:'#4C4C54'} : {}} type="button">Scoreboard</button>
                <button className={styles.tabButton} onClick={() => {setFocusedTab(1)}} style={focusedTab==1 ? {backgroundColor:'#4C4C54'} : {}} type="button">Statistics</button>
                <button className={styles.tabButton} onClick={() => {setFocusedTab(2)}} style={focusedTab==2 ? {backgroundColor:'#4C4C54'} : {}} type="button">Player Build</button>
                <button className={styles.tabButton} onClick={() => {setFocusedTab(3)}} style={focusedTab==3 ? {backgroundColor:'#4C4C54'} : {}} type="button">Match Timeline</button>
            </div>
            <div className={styles.metaData}>
                <p className={styles.dataLabel}>Winner: {data.winningTeam}&emsp;&emsp;
                Game Length: {data.gameLength}&emsp;&emsp;
                Match ID: {data.matchId}&emsp;&emsp;
                Created on {dateCreated}</p>
            </div>
            {focusedTab==0 ?<PlayerData data={participants}/> : (focusedTab==1 ?<PlayerStatistics data={participants} /> : (focusedTab==2 ?<BuildHistory data={timelineData.itemData} /> : (focusedTab==3 ?<MatchTimeLine data={timelineData.gameEvents} /> : <div />)))}
            <div className={styles.damageData}>
                <div className={styles.blueTeamGold} style={{width: bluePerGold+'%'}}>
                    <p className={styles.goldText}>{statTotals.totalGoldB} gold</p>
                </div>
                <div className={styles.redTeamGold} style={{width: redPerGold+'%'}}>
                    <p className={styles.goldText}>{statTotals.totalGoldR} gold</p>
                </div>
            </div>
        </div>
    )
}