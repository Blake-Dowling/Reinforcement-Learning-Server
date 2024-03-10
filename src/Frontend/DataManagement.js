import { trainModel, predictModel } from './TfApi'
const tf = require('@tensorflow/tfjs')


const IN_MIN = 0
const IN_MAX = 4

function minMaxScale(input){
    return input.sub(IN_MIN).div(IN_MAX - IN_MIN)
}
function balanceClasses(input, output){
    let samples = {}
    //Add inputs to map
    for(let i=0; i<input.length; i++){
        samples[input[i][0]] = output[i][0]
    }
    input = Object.keys(samples).map(e=>[parseFloat(e)])
    output = []
    for(let i=0; i<input.length; i++){
        output.push([samples[input[i]]])
    }
    return [input, output]
}

//MUST be 2d arrays
export async function train(input, output){
    let balanced = balanceClasses(input, output)
    input = balanced[0]
    output = balanced[1]
    input = tf.tensor2d(input)
    input = minMaxScale(input)
    input = input.arraySync()
    input = JSON.stringify(input)
    output = tf.tensor2d(output)
    output = output.arraySync()
    output = JSON.stringify(output)
    console.log(input)
    console.log(output)
    return await trainModel(input, output)
}
export async function predict(input){
    input = tf.tensor2d([input])
    input = minMaxScale(input)
    input = input.arraySync()
    input = JSON.stringify(input)
    let prediction = await predictModel(input)
    return prediction
}