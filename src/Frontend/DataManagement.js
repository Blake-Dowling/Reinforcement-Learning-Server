import TfApi from './TfApi'
const tf = require('@tensorflow/tfjs')


const IN_MIN = 0
const IN_MAX = 5

function minMaxScale(input){
    return input.sub(IN_MIN).div(IN_MAX - IN_MIN)
}

//MUST be 2d arrays
function train(input, output){
    input = tf.tensor2d(input)
    input = minMaxScale(input)
    output = tf.tensor2d(output)
    TfApi.trainModel(input, output)
}
function predict(input){
    input = tf.tensor2d(input)
    input = minMaxScale(input)
    return TfApi.predictModel(input)
}