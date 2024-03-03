import React, {useState, useEffect} from 'react'
import './Style/Main.css'
import { train, predict } from './Frontend/DataManagement'
import Game from './Game/Game'
import { avgPool } from '@tensorflow/tfjs'

const TICK_REWARD = 1
const COLLISION_PENALTY = 20

export default function Main() {

  const [score, setScore] = useState(0)
  const [rockDistArray, setRockDistArray] = useState([]) //Input
  const [jumpedArray, setJumpedArray] = useState([]) //Output


  useEffect(() => {
    if(score <= -50){
      resetData()
    }
    if(score >= 50){
      train(rockDistArray, jumpedArray)
      resetData()
    }
  }, [score])
  function tickReward(){
    setScore(prevScore => {
      return prevScore + TICK_REWARD
    })
  }
  function collisionPenalty(){
    setScore(prevScore => {
      return prevScore - COLLISION_PENALTY
    })
  }
  function collectDataPoint(rockDist, jumped){
    setRockDistArray(prevRockDistArray => {
      const newRockDistArray = JSON.parse(JSON.stringify(prevRockDistArray))
      newRockDistArray.push([rockDist])
      return newRockDistArray
    })
    setJumpedArray(prevJumpedArray => {
      const newJumpedArray = JSON.parse(JSON.stringify(prevJumpedArray))
      newJumpedArray.push([jumped])
      return newJumpedArray
    })
  }
  function resetData(){
    setRockDistArray([])
    setJumpedArray([])
  }
  return (
    <div>
      Score: {score}
      <Game 
        tickReward={tickReward}
        collisionPenalty={collisionPenalty}
        collectDataPoint={collectDataPoint}
      />
    </div>
  )
}

