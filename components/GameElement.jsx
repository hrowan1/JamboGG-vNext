import {useSession, useState, useEffect} from 'react'
import styles from '@/styles/GameElement.module.css'
import Image from 'next/image'
import Tippy from '@tippyjs/react';

import FullGameRender from "../components/FullGameRender";

const patch = '13.1.1'
const championImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/champion/'
const runeImage = '/img/perk-images/Styles/'
const statImage = '/img/perk-images/StatMods/'
const itemImage = 'http://ddragon.leagueoflegends.com/cdn/'+patch+'/img/item/'
const summonerImage = '/img/summoners/'

export default function GameElement(props) {
    const data = props.gameData

    const [dropDownToggle, setDropDownToggle] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const toggleDropDown = async (matchId) => {
        if(dataLoaded==false) {
            const response = await fetch(`/api/getExtendedData?matchId=${matchId}&region=${props.server}`)
            const data = await response.json()
            setDataLoaded(data)
        }
        setDropDownToggle(!dropDownToggle)
    }

    return(
        <li className={styles.matchList}>
            <div className={`${data.outcome == 'LOSS' ? [styles.gameLi, styles.gameLoss].join(" ") : data.outcome == 'WIN' ? [styles.gameLi, styles.gameWin].join(" ") : [styles.gameLi, styles.gameRemake].join(" ")}`}>
                <div className={styles.champSection}>
                    <div className={styles.summonerWrapper}>
                        <div className={styles.summonerSpells}>
                            <Image alt={data.summoners[0]} src={summonerImage+data.summoners[0]+'.png'} className={styles.summonersPic} width='100' height='100'/>
                            <Image alt={data.summoners[1]} src={summonerImage+data.summoners[1]+'.png'} className={styles.summonersPic} width='100' height='100'/>
                        </div>
                    </div>
                    <img alt={data.champion} src={championImage+data.champion+'.png'} className={styles.champPlayed} />
                    <label className={styles.vsLbl}>vs</label>
                    <img alt={data.enemyChampion} src={championImage+data.enemyChampion+'.png'} className={styles.champAgainst} />
                    <div className={styles.itemSection}>
                        <div className={styles.itemsDiv}>
                            <img alt={`${data.items[0]!=0 ? data.items[0] : ''}`} src={`${data.items[0]!=0 ? itemImage+data.items[0]+'.png' : ''}`} className={styles.itemPic} />
                            <img alt={`${data.items[1]!=0 ? data.items[0] : ''}`} src={`${data.items[1]!=0 ? itemImage+data.items[1]+'.png' : ''}`} className={styles.itemPic} />
                            <img alt={`${data.items[2]!=0 ? data.items[0] : ''}`} src={`${data.items[2]!=0 ? itemImage+data.items[2]+'.png' : ''}`} className={styles.itemPic} />
                            <img alt={`${data.items[3]!=0 ? data.items[0] : ''}`} src={`${data.items[3]!=0 ? itemImage+data.items[3]+'.png' : ''}`} className={styles.itemPic} />
                            <img alt={`${data.items[4]!=0 ? data.items[0] : ''}`} src={`${data.items[4]!=0 ? itemImage+data.items[4]+'.png' : ''}`} className={styles.itemPic} />
                            <img alt={`${data.items[5]!=0 ? data.items[0] : ''}`} src={`${data.items[5]!=0 ? itemImage+data.items[5]+'.png' : ''}`} className={styles.itemPic} />
                        </div>
                    </div>
                </div>
                <div className={styles.scoreSection}>
                    <p className={styles.kdalbl}>{data.kda}</p>
                    <p className={styles.dkda}>{data.dkda}</p>
                    <label className={styles.hoverLabel}>
                        <Image alt={data.keystone} src={`${runeImage}${data.priTree}/${data.keystone}/${data.keystone}.png`} className={styles.runeImage} width="100" height="100" />
                    </label>
                    <div className={styles.runeOverlay}>
                        <div className={styles.titleDiv}>
                            <p>Runes</p>
                        </div>
                        <div className={styles.runesDiv}>
                            <Image alt={data.runes[0]} src={`${runeImage}${data.priTree}/${data.runes[0]}/${data.runes[0]}.png`} className={styles.runeImg} height="100" width="100" />
                            <Image alt={data.runes[1]} src={`${runeImage}${data.priTree}/${data.runes[1]}/${data.runes[1]}.png`} className={styles.runeImg} height="100" width="100" />
                            <Image alt={data.runes[2]} src={`${runeImage}${data.priTree}/${data.runes[2]}/${data.runes[2]}.png`} className={styles.runeImg} height="100" width="100" />
                        </div>
                        <div className={styles.runesDiv}>
                            <Image alt={data.runes[3]} src={`${runeImage}${data.secTree}/${data.runes[3]}/${data.runes[3]}.png`} className={styles.runeImg} height="100" width="100" />
                            <Image alt={data.runes[4]} src={`${runeImage}${data.secTree}/${data.runes[4]}/${data.runes[4]}.png`} className={styles.runeImg} height="100" width="100" />
                            <div className={styles.shardsDiv}>
                                <Image alt={data.runes[7]} src={`${statImage}${data.runes[7]}.png`} className={styles.statImg} width="100" height="100"/>
                                <Image alt={data.runes[6]} src={`${statImage}${data.runes[6]}.png`} className={styles.statImg} width="100" height="100"/>
                                <Image alt={data.runes[5]} src={`${statImage}${data.runes[5]}.png`} className={styles.statImg} width="100" height="100"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.vl} />
                <div className={styles.gameStats}>
                    <p className={styles.statLabel}>{`KP ${data.killPar}`}</p>
                    <p className={styles.statLabel}>{`Control wards ${data.controlWards}`}</p>
                    <p className={styles.statLabel}>{`Vision score ${data.wardScore}`}</p>
                    <p className={styles.statLabel}>{`DMG ${data.damage} (${data.dpm})`}</p>
                    <p className={styles.statLabel}>{`CS ${data.creeps} (${data.csm})`}</p>
                </div>
                <div className={styles.vl} />

                <div className={styles.dataSection}>
                    <p className={styles.gameText}>{data.duration}</p>
                    <p className={styles.gameText}>{data.queue}</p>
                </div>
                <div className={styles.dropDown} onClick={() => {toggleDropDown(data.matchId)}}></div>
            </div>
            {dropDownToggle && (
                    <FullGameRender data={dataLoaded} region={props.server} puuid={props.puuid}/>
                )}
        </li>
    )
}