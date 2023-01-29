import styles from '@/styles/HeaderBar.module.css'
import searchStyle from '@/styles/SearchBar.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'

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

    return(
        <div className={styles.headerDiv}>
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