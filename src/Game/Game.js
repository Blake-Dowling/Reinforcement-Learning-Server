import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import DataManagement from '../Frontend/DataManagement'
import Board from './Board'
import Timer from '../Util/Timer'

import Agent from '../Util/Agent'
import Piece from './Piece'
import { spawnRockRandom, moveAllRocks, jump, gravity, checkRockCollision, calcRockDist } from './GameMechanics'
import KeyPress from '../Util/KeyPress'
import {run_train, run_predict} from '../Util/Test'

const WIDTH = 4
const HEIGHT = 5
const TICK_REWARD = 1
const COLLISION_PENALTY = 20

export default function Game(props) {
    const [score, setScore] = useState(0)
    const [ticks, setTicks] = useState(0)

    const [piece, setPiece] = useState(new Piece(0,4,1))
    const [rocks, setRocks] = useState([])
    const [jumpRequested, setJumpRequested] = useState(0)

    function resetGame(){
      setPiece(new Piece(0,4,1))
      setRocks([])
      setScore(0)
    }
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



      //Testing
      // setJumpRequested(props.prediction)

      if(jumpRequested === 1){
        jump(piece, setPiece, HEIGHT)
        setJumpRequested(0)
      }




      tickReward()

      if(checkRockCollision(piece, rocks)){
        collisionPenalty()
        resetGame()
      }
      if(score > 20){
        resetGame()
      }
    }, [ticks])



    return (
      <div>
        Score: {score}
        <Timer
          ticks={ticks}
          setTicks={setTicks}
          speed={2000}
        />
        <Board
          ticks={ticks}
          WIDTH={WIDTH}
          HEIGHT={HEIGHT}
          piece={piece}
          rocks={rocks}
        />
        <KeyPress gameJumpHandler={() => {setJumpRequested(1)}}/>
        <Agent
          ticks={ticks}
          score={score}
          jump={() => {setJumpRequested(1)}}
          piece={piece}
          rocks={rocks}
          WIDTH={WIDTH}
          jumpRequested={jumpRequested}
        />
      </div>
    )
  }
