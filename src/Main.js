import React, {useState, useEffect} from 'react'
import './Style/Main.css'
import DataManagement from './DataManagement'
import Board from './Board'
import Timer from './Timer'

const WIDTH = 10
const HEIGHT = 5

export default function Main() {
  const [ticks, setTicks] = useState(0)




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
      />
    </div>
  )
}
