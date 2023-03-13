/// Player stat table in extended data tab ///

import styles from '@/styles/FullGameRender.module.css'
const patch = '13.5.1'
const championImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/champion/'

export default function PlayerStatistics(props) {
    let tableData = []
    for(let i = 0; i < 10; i++) {
        tableData.push(<PlayerTableRow key={`Table${i}`} data={props.data[i]} />)
    }
    return(
        <div>
            <table className='statisticTable'>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Kills</th>
                        <th>Deaths</th>
                        <th>Assists</th>
                        <th>Farm</th>
                        <th>Gold Earned</th>
                        <th>Damage Dealt</th>
                        <th>Damage Taken</th>
                        <th>Healing Done</th>
                        <th>Turret Takedowns</th>
                        <th>Vision Score</th>
                        <th>Pinks Placed</th>
                        <th>Wards Placed</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData} 
                </tbody>
            </table>
        </div>
    )
}

function PlayerTableRow(props) {
    let data = props.data
    return (
        <tr>
            <td><img className={styles.tableChamp} src={championImage+data.champion+'.png'} alt={data.champion}></img></td>
            <td>{data.kills}</td>
            <td>{data.deaths}</td>
            <td>{data.assists}</td>
            <td>{data.farm}</td>
            <td>{data.goldEarned}</td>
            <td>{data.totalDamageDealtToChampions}</td>
            <td>{data.totalDamageTaken}</td>
            <td>{data.totalHeal}</td>
            <td>{data.turretTakedowns}</td>
            <td>{data.visionScore}</td>
            <td>{data.pinksPlaced}</td>
            <td>{data.wardsPlaced}</td>
        </tr>
    )
}