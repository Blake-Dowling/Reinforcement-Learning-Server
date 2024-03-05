import { trainModel, predictModel } from './TfApi'
const tf = require('@tensorflow/tfjs')


const IN_MIN = 0
const IN_MAX = 10

function minMaxScale(input){
    return input.sub(IN_MIN).div(IN_MAX - IN_MIN)
}
async function balanceClasses(input, output){
    let samples = []
    for(let i=0; i<input.length; i++){
        samples.push([input[i][0], output[i][0]])
    }
    // console.log(samples.shape[0])

    // samples = samples.arraySync()
    console.log(samples)
    samples = tf.data.array(samples)
    samples = samples.shuffle(3).shuffle(3).shuffle(3).shuffle(3)
    samples = await samples.toArray()

    let balancedSamples = []
    for(let i=samples.length-1; i>=0; i--){
        if(samples[i][0] === 0){
            balancedSamples.push(samples[i])
        }
    }
    console.log(samples)
        // samples = tf.util.shuffle(samples)
}

//MUST be 2d arrays
export async function train(input, output){
    // balanceClasses(input, output)
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
    input = tf.tensor2d([input])
    input = minMaxScale(input)
    input = input.arraySync()
    input = JSON.stringify(input)
    let prediction = await predictModel(input)
    return prediction
}