/// Routing around JamboGG ///

import styles from '@/styles/RouterBar.module.css'
import { useRouter } from 'next/router'

export default function RouterBar(props) {
    const router = useRouter()

    const routeLeaderboard = () => {
        router.push('../leaderboard/euw')
    }
    const routeDrafting = () => {
        router.push('../draft')
    }

    return(
        <div className={styles.bar}>
            <div onClick={routeLeaderboard} className={styles.route}>Leaderboards</div>
            <div onClick={routeDrafting} className={styles.route}>Drafting Tool</div>
        </div>
    )
}