import styles from '@/styles/SearchBar.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SearchBar(props) {
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
            <div className={styles.headerBar}>
                <form className={styles.searchBar}>
                    <input onKeyDown={handleKeyDown} type="text" className={styles.search} placeholder="Type Summoner Name..."></input>
                    <select onChange={handleChange} className={styles.serverSelect}>
                        <option value="euw">EUW</option>
                        <option value="na">NA</option>
                    </select>
                </form>
            </div>
    )
}