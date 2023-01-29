import styles from '@/styles/FooterBar.module.css'

export default function FooterBar(props) {
    return(
        <div className={styles.footer}>
            <p>JamboGG isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially 
                <br />involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks 
                <br />or registered trademarks of Riot Games, Inc.</p>
        </div>
    )
}