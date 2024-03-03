import React, {useState, useEffect} from 'react'
import '../Style/Main.css'
import DataManagement from '../Frontend/DataManagement'
import Board from './Board'
import Timer from '../Util/Timer'

import Piece from './Piece'
import { spawnRockRandom, moveAllRocks, jump, gravity, checkRockCollision } from './GameMechanics'
import KeyPress from '../Util/KeyPress'

const WIDTH = 10
const HEIGHT = 5

export default function Game() {
    const [ticks, setTicks] = useState(0)
    function resetGame(){
      setPiece(new Piece(1,4,1))
      setRocks([])
    }
    const [piece, setPiece] = useState(new Piece(1,4,1))
    const [rocks, setRocks] = useState([])
    const [jumpRequested, setJumpRequested] = useState(false)
    //Event loop
    useEffect(() => {

      gravity(setPiece, HEIGHT)
      spawnRockRandom(ticks, setRocks)
      moveAllRocks(setRocks)

      if(checkRockCollision(piece, rocks)){
        resetGame()
      }
      if(jumpRequested === true){
        jump(piece, setPiece, HEIGHT)
        setJumpRequested(false)
      }
  
    }, [ticks])
  
  
    return (
      <div>
        <Timer
          ticks={ticks}
          setTicks={setTicks}
          speed={1000}
        />
        <Board
          ticks={ticks}
          WIDTH={WIDTH}
          HEIGHT={HEIGHT}
          piece={piece}
          rocks={rocks}
        />
        <KeyPress gameJumpHandler={() => {setJumpRequested(true)}}/>
      </div>
    )
  }
