import React, {useState, useEffect} from 'react'
import './Style/Main.css'
import DataManagement from './DataManagement'
import Board from './Board'
import Timer from './Timer'

import Piece from './Piece'

const WIDTH = 10
const HEIGHT = 5

export default function Main() {
  const [ticks, setTicks] = useState(0)
  const [piece, setPiece] = useState(new Piece(0,4,1))

  const [rocks, setRocks] = useState([])
  useEffect(() => {
    //New Rock
    console.log(Math.floor(Math.random()*2))
    if(ticks % 5 === Math.floor(Math.random())*2){
      setRocks(prevRocks => {
        const newRocks = JSON.parse(JSON.stringify(prevRocks))
        newRocks.push(new Piece(9, 4, 1))
        return newRocks
      })
    }
    //Move All Rocks
    setRocks(prevRocks => {
      const newRocks = []
      for(let i=0; i<prevRocks.length; i++){
        const newRock = JSON.parse(JSON.stringify(prevRocks[i]))
        newRock.x -= 1
        if(newRock.x >= 0){
          newRocks.push(newRock)
        }
      }
      return newRocks
    })

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
    </div>
  )
}
