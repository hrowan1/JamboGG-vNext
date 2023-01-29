import styles from '@/styles/FullGameRender.module.css'

export default function MatchTimeLine(props) {
    let events = []
    for(let i in props.data) {
        events.push(<TimeLineEvent key={`timeline${i}`} data={props.data[i]} timestamp={`${Math.floor((props.data[i].timeStamp)/60000)}:${(Math.floor((props.data[i].timeStamp)/1000)%60).toString().length==1 ? '0'+Math.floor((props.data[i].timeStamp)/1000)%60 : Math.floor((props.data[i].timeStamp)/1000)%60}`} />)
    }
    return(
        <div className={styles.timelineWrapper}>
            {events}
        </div>
    )
}

function TimeLineEvent(props) {
    let data = props.data
    let time = props.timestamp
    let eventText = data.event == 'champion_kill' ? 'Champion Kill' : (data.event == `elite_monster_kill` ? `${data.monsterType.replace('_',' ')} slain` : (data.event == 'building_kill' ? `${data.type == 'TOWER_BUILDING' ? data.towerType.replace('_', ' ') : 'INHIBITOR'} destroyed` : (data.event == 'game_end' ? `Game ended by ${data.winningTeam}` : 0)))
    let team = data.team == 'BLUE' ? styles.blueEvent : (data.team=='RED' ? styles.redEvent : styles.endEvent)
    return(
        <div className={styles.timelineEvent}>
            <p className={[styles.timelineText, team].join(" ")}>{eventText} at {time}</p>
        </div>
    )
}