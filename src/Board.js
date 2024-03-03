import React, {useState, useEffect} from 'react'
import './Style/Main.css'

const CELL_SIZE = 20


export default function Board(props) {
    const [board, setBoard] = useState([[]])
    function initializeBoard(){
        const array = []
        for(let r=0; r<props.HEIGHT; r++){

            const row = []
            for(let c=0; c<props.WIDTH; c++){
                row.push(0)
            }
            array.push(row)
        }
        setBoard(array)
    }
    useEffect(() => {    
        initializeBoard()
    }, [])

    function cellColor(rowIndex, columnIndex){
        if(board[rowIndex][columnIndex] === 1){
            return 'black'
        }
        else if(board[rowIndex][columnIndex] === 0){
            return 'white'
        }
        return 'black'
    }

    return (
        <div className='board'>
            {board?.map((row, rowIndex) => {
                return(<div className='row'>
                    r
                    {row?.map((square, columnIndex) => {
                        return (<div className='cell' style={{
                            width: `${CELL_SIZE*1}px`,
                            height: `${CELL_SIZE*1}px`,
                            background: `${cellColor(rowIndex, columnIndex)}`
                            }}
                        >

                        </div>)
                    })}
                </div>)
            })}
        </div>
    )
}
