import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import { train, predict } from '../Frontend/DataManagement'

import { avgPool } from '@tensorflow/tfjs'




export default function Agent(props) {


  const [rockDistArray, setRockDistArray] = useState([]) //Input
  const [jumpedArray, setJumpedArray] = useState([]) //Output
  const [prediction, setPrediction] = useState(null)




  function calcRockDist(piece, rocks, WIDTH){
    let minRockDist = WIDTH
    for(let i=0; i<rocks.length; i++){
        minRockDist = Math.min(minRockDist, piece.dist(rocks[i]))
    }
    return minRockDist
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
  async function getPrediction(rockDist){
    let newPrediction = await predict([rockDist])
    setPrediction(prevPrediction => {
      return newPrediction
    })
  }
  function resetData(){
    setRockDistArray([])
    setJumpedArray([])
  }
  useEffect(() => {
    if(props.score <= -1){
      resetData()
    }
    if(props.score >= 20){
      train(rockDistArray, jumpedArray)
      resetData()
    }
  }, [props.score])
  useEffect(()=>{

    let input = calcRockDist(props.piece, props.rocks, props.WIDTH)
    //Training
    if(Math.floor(Math.random()*3) == 0){
      props.jump()
    }
    //Testing
    getPrediction(input)
    console.log(prediction)
    // console.log("---")
    // console.log(input)
    // console.log(props.jumpRequested)
    collectDataPoint(input, props.jumpRequested)


  }, [props.ticks])

  return (
    <div>

    </div>
  )
}

