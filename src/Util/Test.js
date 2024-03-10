import React, {useState, useEffect} from 'react'

import {train, predict} from '../Frontend/DataManagement'

export async function run_train(){
    let input = [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]]
    let output = [[0.0], [0.0], [0.0], [0.0], [0.0], [0.0], [0.0], [0.0], [0.0], [1.0], [0.0]]
    input = [[4], [3], [2.0], [1.0], [0]]
    output = [[0.0], [0], [0.0], [1.0], [0]]
    let hist = await train(input, output)
    console.log(hist)
}

export async function run_predict(){
    let input = [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]]
    input = [[4], [3], [2], [1], [0]]
    for(let i=0; i<input.length; i++){
        let pred = await predict(input[i])
        // console.log(pred)
    }

}