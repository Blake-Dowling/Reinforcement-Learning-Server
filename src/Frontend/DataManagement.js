import { trainModel, predictModel } from './TfApi'
const tf = require('@tensorflow/tfjs')


const IN_MIN = 0
const IN_MAX = 4
export let samples = 0


export async function train(input){
    return await trainModel(input)
}
export async function predict(input){
    let prediction = await predictModel(input)
    return prediction
}