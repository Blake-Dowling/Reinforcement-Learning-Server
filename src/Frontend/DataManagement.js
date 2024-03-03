import { trainModel, predictModel } from './TfApi'
const tf = require('@tensorflow/tfjs')


const IN_MIN = 0
const IN_MAX = 9

function minMaxScale(input){
    return input.sub(IN_MIN).div(IN_MAX - IN_MIN)
}

//MUST be 2d arrays
export function train(input, output){
    input = tf.tensor2d(input)
    input = minMaxScale(input)
    input = input.arraySync()
    input = JSON.stringify(input)
    output = tf.tensor2d(output)
    output = output.arraySync()
    output = JSON.stringify(output)
    trainModel(input, output)
}
export function predict(input){
    input = tf.tensor2d(input)
    input = minMaxScale(input)
    return predictModel(input)
}