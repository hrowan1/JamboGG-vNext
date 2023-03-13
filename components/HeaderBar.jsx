// Headerbar for the search bar and omnipresent "home" button in the format of a logo ///

import styles from '@/styles/HeaderBar.module.css'
import searchStyle from '@/styles/SearchBar.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function HeaderBar(props) {
    const [serverSelectValue, setServerSelectValue] = useState("euw")
    const router = useRouter()

    const handleKeyDown = (e) => {
        if(e.code == "Enter") {
            e.preventDefault()
            router.push(`/summoners/${serverSelectValue}/${e.target.value}`)
        }
    }
    const handleChange = (e) => {
        setServerSelectValue(e.target.value)
    }

    const handleHome = (e) => {
        router.push('../../') //home page return
    }

    return(
        <div className={styles.headerDiv}>
            <Image onClick={handleHome} className={styles.headerImage} src="/img/jambogg.png" width="300" height="112" />
            <div className={[searchStyle.headerBar, styles.headerSearch].join(" ")}>
                <form className={searchStyle.searchBar}>
                    <input onKeyDown={handleKeyDown} type="text" className={searchStyle.search} placeholder="Type Summoner Name..."></input>
                    <select onChange={handleChange} className={searchStyle.serverSelect}>
                        <option value="euw">EUW</option>
                        <option value="na">NA</option>
                    </select>
                </form>
            </div>
        </div>
    )
}