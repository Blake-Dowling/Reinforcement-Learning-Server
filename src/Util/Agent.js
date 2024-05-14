import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import { train, predict } from '../Frontend/TfApi'

import { avgPool } from '@tensorflow/tfjs'

//State:
//[distance, in_air]
//actions[4]
//


export default function Agent(props) {

  const [states, setStates] = useState([])
  const [actions, setActions] = useState([])
  const [rewards, setRewards] = useState([])
  const [done, setDone] = useState([])

  const [prediction, setPrediction] = useState(null)

  function addElement(element, setFunction){
    setFunction(prevArray => {
      const newArray = JSON.parse(JSON.stringify(prevArray))
      newArray.push(element)
      return newArray
    })
  }

  function calcRockDist(piece, rocks, WIDTH){
    let minRockDist = WIDTH
    for(let i=0; i<rocks.length; i++){
        minRockDist = Math.min(minRockDist, piece.dist(rocks[i]))
    }
    return minRockDist
  }
  function collectTuple(){

    //State
    const rockDist = calcRockDist(props.piece, props.rocks, props.WIDTH)
    const inAir = props.checkInAir(props.piece, props.HEIGHT)
    addElement([rockDist, inAir], setStates)
    //Action
    const action = props.jumpRequested
    addElement(action, setActions)
    let reward = 1
    if(props.checkRockCollision(props.piece, props.rocks)){
      reward = -20
    }
    addElement(reward, setRewards)
    //Done
    if(props.checkRockCollision(props.piece, props.rocks) || (props.score > 0 && props.score % 10 == 0) ){
      addElement(true, setDone)
    }
    else{
      addElement(false, setDone)
    }
  }

  async function getPrediction(input){
    const newPrediction = await predict(input)
    setPrediction(prevPrediction => {
      return newPrediction
    })
  }
  useEffect(()=>{
    const rockDist = calcRockDist(props.piece, props.rocks, props.WIDTH)
    const inAir = props.checkInAir(props.piece, props.HEIGHT)

    getPrediction([[rockDist, inAir]])
    //Training

  }, [props.ticks])
  useEffect(() => {
    console.log(prediction)
    console.log(states[states.length-1], actions[actions.length-1], rewards[rewards.length-1], done[done.length-1])
    collectTuple()
    if(states.length >= 9){
      const curStates = JSON.parse(JSON.stringify(states))
      curStates.pop()
      const trainRewards = JSON.parse(JSON.stringify(rewards))
      trainRewards.splice(0, 1)
      train({
        'states': states,
        'actions': actions,
        'rewards': rewards,
        'done': done
      })
      setStates([])
      setActions([])
      setRewards([])
      setDone([])
    }
    if(prediction > 0){
      props.jump()
    }
    if(Math.floor(Math.random()*3) == 0){
      props.jump()
    }
  }, [prediction])

  return (
    <div>

    </div>
  )
}

