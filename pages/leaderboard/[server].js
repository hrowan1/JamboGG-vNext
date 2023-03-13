import Leaderboard from "@/components/Leaderboard"
import styles from "@/styles/LeaderboardHome.module.css"
import { Inter } from '@next/font/google'
import Head from "next/head"
import HeaderBar from "@/components/HeaderBar"
import FooterBar from "@/components/FooterBar"
import BoardToolBar from "@/components/BoardToolBar"

const inter = Inter({ subsets: ['latin'] })

export default function LeaderboardPage({topPlayers, time, server}) {
    return (
        <>
            <Head>
                <title>Top Players</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={[inter.className].join(" ")}>
                <HeaderBar />
                <BoardToolBar />
                <Leaderboard server={server} data={topPlayers} />
                <div className={styles.timeLabel}>Last updated at {time}</div>
                <FooterBar />
            </main>
        </>
    )
}

export async function getStaticProps({params}) {
    const topPlayers = await getLeaderboard(params.server)
    let time = new Date().toJSON().slice(12,19)
    let server = params.server

    return {
        props: {
            topPlayers,
            time,
            server,
        },
        revalidate: 600,
    }
}

export async function getStaticPaths() {
    return {
        paths: [{params: {server: 'euw'}}, {params: {server: 'na'}}],
        fallback: false,
    }
}

async function getLeaderboard(region) {

    const {MongoClient, ServerApiVersion} = require('mongodb')
    const databaseUri = process.env.DATABASEURI

    const client = new MongoClient(databaseUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    })

    const collection = client.db("JamboGG").collection(`Leaderboard-${region}`)
    let leaderboardData = await collection.find({}).toArray()
    let leaderboard = []
    for(let i = 0; i < 100; i++) {
        leaderboard.push([leaderboardData[i]['_id'], leaderboardData[i]['points'], leaderboardData[i]['iconId']])
        /*leaderboard[i] = {
            'name' : leaderboardData[i]['_id'], 
            'points': leaderboardData[i]['points'],
            'icon': leaderboardData[i]['iconId'],
        }*/
    }

    let sortedLeaderboard = leaderboard.sort(function(x, y) {
        return x[1] - y[1]
    })

    let returnBoard = {}
    for(let i in sortedLeaderboard.reverse()) {
        returnBoard[i] = {
            'name' : sortedLeaderboard[i][0], 
            'points': sortedLeaderboard[i][1],
            'icon': sortedLeaderboard[i][2],
        }
    }
    return returnBoard
}