import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import { getOnlineModel, train, predict } from '../Frontend/TfApi'

import { avgPool } from '@tensorflow/tfjs'
const tf = require('@tensorflow/tfjs')
// let onlineModel = tf.loadLayersModel({modelTopology: await getOnlineModel()})

let states = []
let actions = []
let rewards = []
let done = []

export default function Agent(props) {

  function calcRockDist(piece, rocks, WIDTH){
    let minRockDist = WIDTH
    for(let i=0; i<rocks.length; i++){
        minRockDist = Math.min(minRockDist, piece.dist(rocks[i]))
    }
    return minRockDist
  }


  async function run(){
    // console.log(typeof(onlineModel))
    //State
    const rockDist = calcRockDist(props.piece, props.rocks, props.WIDTH)
    const inAir = props.checkInAir(props.piece, props.HEIGHT)
    // getPrediction([[rockDist, inAir]])

    const input = [rockDist, inAir]
    states.push(input)
    const prediction = await predict([input])
    console.log(prediction)
    //Action
    let curAction = prediction
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
    // console.log(states[states.length-1], actions[actions.length-1], rewards[rewards.length-1], done[done.length-1])
    //Training
    if(states.length >= 33){
      // for(let i=0; i<states.length; i++){
      //   console.log(states[i], actions[i], rewards[i], done[i])
      // }
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
  }
  useEffect(()=>{
    run()

  }, [props.piece, props.rocks])

  // useEffect(()=>{

  // }, [predictionBit])

  return (
    <div>

    </div>
  )
}

