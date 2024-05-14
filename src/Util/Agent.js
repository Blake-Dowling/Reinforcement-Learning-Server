import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import { train, predict } from '../Frontend/TfApi'

import { avgPool } from '@tensorflow/tfjs'

let states = []
let actions = []
let rewards = []
let done = []

export default function Agent(props) {

  const [prediction, setPrediction] = useState(null)
  const [predictionBit, setPredictionBit] = useState(false)

  function calcRockDist(piece, rocks, WIDTH){
    let minRockDist = WIDTH
    for(let i=0; i<rocks.length; i++){
        minRockDist = Math.min(minRockDist, piece.dist(rocks[i]))
    }
    return minRockDist
  }

  async function getPrediction(input){
    const newPrediction = await predict(input)
    setPrediction(prevPrediction => {
      return newPrediction
    })
    setPredictionBit(prevPredictionBit => {
      return !prevPredictionBit
    })
    return newPrediction
  }

  useEffect(()=>{
    //State
    const rockDist = calcRockDist(props.piece, props.rocks, props.WIDTH)
    const inAir = props.checkInAir(props.piece, props.HEIGHT)
    getPrediction([[rockDist, inAir]])
    states.push([rockDist, inAir])
  }, [props.piece, props.rocks])

  useEffect(()=>{
    //Action
    let curAction = prediction
    console.log(prediction)
    if(prediction > 0){
      props.jump()
    }
    if(Math.floor(Math.random()*3) == 0){
      props.jump()
      curAction = 1
    }
    actions.push(curAction)
    //Reward
    let reward = 1
    if(props.checkRockCollision(props.piece, props.rocks)){
      reward = -20
    }
    rewards.push(reward)
    //Done
    if(props.checkRockCollision(props.piece, props.rocks) || (props.score > 0 && props.score % 20 == 0) ){
      done.push(true)
    }
    else{
      done.push(false)
    }
    console.log(states[states.length-1], actions[actions.length-1], rewards[rewards.length-1], done[done.length-1])
    //Training
    if(states.length >= 1025){
      train({
        'states': states,
        'actions': actions,
        'rewards': rewards,
        'done': done
      })
      states = []
      actions = []
      rewards = []
      done = []
    }
  }, [predictionBit, prediction])

  return (
    <div>
      Prediction: {prediction}
    </div>
  )
}

