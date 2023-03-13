import Head from "next/head"
import HeaderBar from "@/components/HeaderBar"
import FooterBar from "@/components/FooterBar"
import { Inter } from '@next/font/google'
import styles from '@/styles/Draft.module.css'
import {useEffect, useState } from "react"
import Image from "next/image"

const inter = Inter({ subsets: ['latin'] })
const patch = '13.5.1'
const champImageLink = `http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/`

export default function Draft(data) {
    const [selected, setSelected] = useState('')
    const [champions, setChampions] = useState([])
    const [query, setQuery] = useState('')

    let keys = Object.keys(data['data']['data'])
    useEffect(() => {
        let cChamps = []
        for(let i in keys) {
            if(keys[i].toLowerCase().includes(query)) {
                cChamps.push(keys[i])
            }
        }
        setChampions(cChamps)
    }, [query])

    const setSelectedChampion = (e) => {
        if(selected) {
            e.target.style.backgroundImage = `url(${selected.src})`
        }
        setSelected('')
    }

    const clearChampion = (e) => {
        e.preventDefault()
        e.target.style.backgroundImage = ``
    }

    return (
        <>
            <Head>
                <title>Drafting Tool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={[inter.className].join(" ")}>
                <HeaderBar />
                <div className={styles.imageContainer}>
                    <Image className={styles.jamboLogo} src="/img/jambogg.png" width="500" height="188" />
                </div>
                <div className={styles.draftContainer}>
                    <div className={[styles.draft, styles.blue].join(" ")}>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                    </div>
                    <div className={styles.fullContainer}>
                        <div className={styles.searching}>
                            <input onChange={e => setQuery(e.target.value)} className={styles.searchBar} placeholder={'Search Champion...'} />
                        </div>
                        <div className={styles.championContainer}>
                            {
                                champions.map(champion => (
                                    <img alt={champion} key={`image${champion}`} onClick={e => {setSelected(e.target)}} className={styles.championImage} src={`${champImageLink}${champion}.png`} ></img>
                                ))
                            }
                        </div>
                    </div>
                    <div className={[styles.draft, styles.red].join(" ")}>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                        <div onContextMenu={e => {clearChampion(e)}} onClick={e => setSelectedChampion(e)} className={styles.champSelect}></div>
                    </div>
                </div>
                <FooterBar />
            </main>
        </>
    )
}

export async function getStaticProps() {
    let response = await fetch('http://ddragon.leagueoflegends.com/cdn/13.5.1/data/en_US/champion.json')
    let data = await response.json()
    return {
        props: {
            data,
        },
        revalidate: 10,
    }
}