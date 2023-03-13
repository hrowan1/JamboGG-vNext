import styles from '@/styles/BoardToolBar.module.css'
import { useRouter } from 'next/router'

// This is the leaderbaord toolbar situated at the top of the page ///

export default function BoardToolBar(props) {
    const router = useRouter() //routing around my NextJS application

    const handleClick = (e) => {
        e.preventDefault()
        router.push(`../leaderboard/${e.target.innerText.toLowerCase()}`)
    }
    const handleHome = () => {
        router.push('../')
    }

    return(
        <div className={styles.toolBar}>
            <div className={styles.serverBar}>
                <div onClick={handleClick} className={styles.server}>EUW</div>
                <div onClick={handleClick} className={styles.server}>NA</div>
            </div>
        </div>
    )
}

