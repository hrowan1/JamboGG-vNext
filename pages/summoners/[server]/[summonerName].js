import GameElement from "../../../components/GameElement"
import RankBlock from "@/components/RankBlock"
import HeaderBar from "@/components/HeaderBar"
import FooterBar from "@/components/FooterBar"
import ToolMenu from "@/components/ToolMenu"
import FullStatList from "@/components/FullStatList"
import { Inter } from '@next/font/google'
import styles from '@/styles/SummonerPage.module.css'
import {useSession, useState, useEffect} from 'react'
import { useRouter } from "next/router"
import Head from "next/head"

const inter = Inter({ subsets: ['latin'] })

const summonerIcon = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/'

export default function Page({ summonerName, server }) {
  const [summonerData, setSummonerData] = useState('')
  const [gameData, setGameData] = useState(<Loader />)
  const [rankData, setRankData] = useState([])
  const [dataShown, setDataShown] = useState(false)
  const [buttonText, setButtonText] = useState('View Champion Stats')

  const router = useRouter()

  //toggles stats/game history
  const toggleStatChamp = () => {
    setDataShown(!dataShown)
    if(!dataShown) {
      setButtonText('View Match History')
    }
    else {
      setButtonText('View Champion Stats')
    }
  }
  //connects with /getSummoner in API to get the IDs and data from a summoner name and server
  const getSummonerData = async() => {
    const response = await fetch(`/api/getSummoner?summonerName=${summonerName}&region=${server}`)
    const data = await response.json()
    if(data == 404) {
      router.push(`/error`)
    }
    else {
      setSummonerData(data)
      await getGameData(data.puuid, data.id)
    }
  }

  //connects with /getGames in API. This fetches all data necessary from either the database or the RiotAPI
  const getGameData = async(puuid, eId) => {
    const response = await fetch(`/api/getGames?puuid=${puuid}&region=${server}&eid=${eId}`)
    const data = await response.json()
    const gameCount = 10
    let tempGameArray = []
    for(let i = 0; i < gameCount; i++) {
      let game = buildGameElementClass(data[0][i])
      tempGameArray.push(<GameElement key={`GameElement${i}`}gameData={game} server={server} puuid={puuid}/>)
    }
    setGameData(tempGameArray)
    setRankData(data[1])
  }
  // useEffect runs when this function is run (on page load..)
  useEffect(() => {
    getSummonerData()
  }, [])

  return (
    <>
      <Head>
        <title>{summonerData.name} {server.toUpperCase()}</title>
      </Head>
      <main className={inter.className}>
        <HeaderBar />
        <div className={styles.summonerIconWrapper}>
          <img src={`${summonerIcon}${summonerData.profileIconId}.png`} className={styles.summonerIcon}/>
          <p className={styles.summonerName}>{summonerData.name}</p>
        </div>
        <ToolMenu />
        <div className={styles.generalBlock}>
          <div className={styles.statList}>
            {rankData.length != 2 ? <div /> : <RankBlock data={rankData} />}
            {rankData.length != 2 ? <div /> : <div className={styles.dataSelector}>
              <button className={styles.toggleDataButton} onClick={toggleStatChamp} type='button'>{buttonText}</button>
            </div>}
          </div>
          {!dataShown ? <ul className={styles.historyList}>{gameData}</ul> : <FullStatList data={rankData[0]}/>}
        </div>
        <FooterBar />
      </main>
    </>
  );
}

export async function getStaticProps({ params: { server, summonerName } }) {
  return {
    props: { server, summonerName },
  };
}
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function buildGameElementClass(gameData) {
  let game = new Game(gameData.info,
							gameData.metadata,
							gameData.stats,
							gameData.runes,
							gameData.items,
							gameData.summoners)
  return game
}

class Game {
	constructor(info, meta, stats, runes, items, summoners)
	{
		this.champion = info.champion
		this.enemyChampion = info.enemyChamp
		this.outcome = meta.outcome
		this.duration = meta.duration
		this.queue = meta.queue
		this.kills = stats.kills
		this.deaths = stats.deaths
		this.assists = stats.assists
		this.kda = this.kills+' / '+this.deaths+' / '+this.assists
		this.decKda = `${isNaN(Math.round(((this.kills+this.assists)/this.deaths)*100)/100) ? 'Perfect' : Math.round(((this.kills+this.assists)/this.deaths)*100)/100}`
		this.decKda = `${this.decKda == 'Infinity' ? 'Perfect' : this.decKda}`
		this.priTree = runes.primaryTree
		this.secTree = runes.secondaryTree
		this.keystone = runes.keystone
		this.runes = runes.primarySel.concat(runes.secondarySel)
		this.items = items.items
		this.killPar = `${stats.killParticipation=='NaN%' ? '0%' : stats.killParticipation}`
		this.controlWards = stats.controlWards
		this.wardScore = stats.wardScore
		this.damage = stats.damageDealt
		this.creeps = stats.creeps
		this.gameTime = meta.gameTime
		this.dpm = (Math.round(this.damage/this.gameTime)*60)
		this.csm = Math.round((this.creeps/this.gameTime)*600)/10
		this.summoners = summoners
		this.matchId = meta.matchId
	}
}

function Loader() {
  return(
    <div className={styles.preloadPage}>
      <div className={styles.gridLoad}>
        <p>
          We are loading in your data. This may take a while...
        </p>
        <div className={styles.loaderDiv}>
          <div className={styles.loadWheel} />
        </div>
      </div>
    </div>
  )
}