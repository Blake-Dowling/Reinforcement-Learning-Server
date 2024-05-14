import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import { train, predict, samples } from '../Frontend/DataManagement'

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
    if(props.checkRockCollision(props.piece, props.rocks) || props.score % 10 == 0){
      addElement(true, setDone)
    }
    else{
      addElement(false, setDone)
    }


    //
  }
  // async function getPrediction(rockDist){
  //   let newPrediction = await predict([rockDist])
  //   setPrediction(prevPrediction => {
  //     return newPrediction
  //   })
  // }
  // function resetData(){
  //   setRockDistArray([])
  //   setJumpedArray([])
  // }
  // useEffect(() => {
  //   if(props.score <= -1){
  //     resetData()
  //   }
  //   if(props.score >= 10){
  //     train(rockDistArray, jumpedArray)
  //     resetData()
  //   }
  // }, [props.score])


  useEffect(()=>{
    async function getPrediction(input){
      setPrediction(await predict(input))
    }
    //if sample legth == batch
        //props.resetgame
        //props.resetticks
    
    //Training
    // console.log(states[states.length-1], actions[actions.length-1], rewards[rewards.length-1], done[done.length-1])
    collectTuple()
    if(states.length >= 25){
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

    const rockDist = calcRockDist(props.piece, props.rocks, props.WIDTH)
    const inAir = props.checkInAir(props.piece, props.HEIGHT)

    getPrediction([[rockDist, inAir]])
    if(Math.floor(Math.random()*3) == 0){
      props.jump()
    }

    //Testing
    // getPrediction(input)
    // console.log(prediction)
    // console.log("---")
    // console.log(input)
    // console.log(props.jumpRequested)
    // collectDataPoint(input, props.jumpRequested)


  }, [props.ticks])
  useEffect(() => {
    console.log(prediction)
    if(prediction > 0){
      props.jump()
    }
  }, [prediction])

  return (
    <div>
      Samples: {samples}
    </div>
  )
}

