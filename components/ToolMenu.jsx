// Tool menu which links all the tools together

import styles from '@/styles/ToolMenu.module.css'
import { useRouter } from 'next/router'

export default function ToolMenu(props) {
    const router = useRouter()

    const handleLeaderboard = (e) => {
        router.push('../../leaderboard/euw')
    }
    const handleDraft = (e) => {
        router.push('../../draft')
    }
    return (
        <div className={styles.toolMenu}>
            <div onClick={handleLeaderboard} className={[styles.generalButton, styles.leaderboardButton].join(' ')}>Leaderboards</div>
            <div onClick={handleDraft} className={[styles.generalButton, styles.draftButton].join(' ')}>Drafting Tool</div>
        </div>
    )
}