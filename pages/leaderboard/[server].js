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
    const response = await fetch(`https://jambo-dfuntirci-hrowan1.vercel.app/api/getLeaderboard?server=${params.server}`)
    try {
        const topPlayers = await response.json()
    } catch(err) {
        console.log(err)
    }
    let time = new Date().toJSON().slice(12,19)
    let server = params.server

    return {
        props: {
            topPlayers,
            time,
            server,
        },
        revalidate: 10,
    }
}

export async function getStaticPaths() {
    return {
        paths: [{params: {server: 'euw'}}, {params: {server: 'na'}}],
        fallback: false,
    }
}