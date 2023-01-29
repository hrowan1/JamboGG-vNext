import styles from '@/styles/FullGameRender.module.css'

const patch = '13.1.1'
const itemImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/item/'

export default function BuildHistory(props) {
    let data = props.data
    if(typeof data != 'undefined') {
        let gameTime = data.length
        let itemsBuilt = []
        let itemTimers = {}
        for(let i=0; i<gameTime; i++) {
            itemTimers[data[i][1]] = []
        }
        for(let i = 0; i<gameTime; i++) {
            itemTimers[data[i][1]].push(<img key={'builtitem'+i} className={styles.itemPic} src={`${itemImage+data[i][0]}.png`} alt={data[i][0]}/>)
        }
        for(let [k,v] of Object.entries(itemTimers)) {
            let currentItems = []
            for(let i in v) {
                currentItems.push(v[i])
            }
            itemsBuilt.push(
                <div key={`itembuild${k}${v}`} className={styles.itemWrapper}>
                    <div className={styles.itemGrid}>
                        <div className={styles.builtItemHolder} key={'currentItems'+k}>
                            {currentItems}
                        </div>
                        <span className={styles.itemTextSpan}>{`Min ${k}`}</span>
                    </div>
                </div>
            )
        }
        return (
                    <div className='itemBuildOrder'>
                        {itemsBuilt}   
                    </div>
        )
    } else {
        return (
            <div />
        )
    }
}