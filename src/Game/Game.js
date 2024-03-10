import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import DataManagement from '../Frontend/DataManagement'
import Board from './Board'
import Timer from '../Util/Timer'

import Piece from './Piece'
import { spawnRockRandom, moveAllRocks, jump, gravity, checkRockCollision, calcRockDist } from './GameMechanics'
import KeyPress from '../Util/KeyPress'
import {run_train, run_predict} from '../Util/Test'

const WIDTH = 4
const HEIGHT = 5

export default function Game(props) {
    const [ticks, setTicks] = useState(0)
    function resetGame(){
      setPiece(new Piece(0,4,1))
      setRocks([])
    }
    const [piece, setPiece] = useState(new Piece(0,4,1))
    const [rocks, setRocks] = useState([])
    const [jumpRequested, setJumpRequested] = useState(0)


    useEffect(()=>{

    },[])
  //   useEffect(() => {
  //     run_train()
  //     run_predict()
  // }, [ticks])



    //Event loop
    useEffect(() => {

      gravity(setPiece, HEIGHT)
      moveAllRocks(setRocks)
      spawnRockRandom(setRocks)

      let input = calcRockDist(piece, rocks, WIDTH)
      props.getPrediction(input)
      console.log(props.prediction)
      //Training
      if(Math.floor(Math.random()*3) == 0){
        setJumpRequested(1)
      }
      //Testing
      // setJumpRequested(props.prediction)

      if(jumpRequested === 1){
        jump(piece, setPiece, HEIGHT)
        setJumpRequested(0)
      }


      props.collectDataPoint(input, jumpRequested)

      props.tickReward()

      if(checkRockCollision(piece, rocks)){
        props.collisionPenalty()
        resetGame()
      }
    }, [ticks])
  
  
    return (
      <div>
        <Timer
          ticks={ticks}
          setTicks={setTicks}
          speed={50}
        />
        <Board
          ticks={ticks}
          WIDTH={WIDTH}
          HEIGHT={HEIGHT}
          piece={piece}
          rocks={rocks}
        />
        <KeyPress gameJumpHandler={() => {setJumpRequested(1)}}/>
      </div>
    )
  }
