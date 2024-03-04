import { trainModel, predictModel } from './TfApi'
const tf = require('@tensorflow/tfjs')


const IN_MIN = 0
const IN_MAX = 10

function minMaxScale(input){
    return input.sub(IN_MIN).div(IN_MAX - IN_MIN)
}

//MUST be 2d arrays
export async function train(input, output){
    input = tf.tensor2d(input)
    input = minMaxScale(input)
    input = input.arraySync()
    input = JSON.stringify(input)
    output = tf.tensor2d(output)
    output = output.arraySync()
    output = JSON.stringify(output)
    return await trainModel(input, output)
}
export async function predict(input){
    input = tf.tensor(input)
    input = minMaxScale(input)
    input = input.arraySync()
    input = JSON.stringify(input)
    let prediction = await predictModel(input)
    return prediction
}