
import axios from 'axios'


export async function train(input){
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3001/trainModel', {
            input: input
        })
        .then(response => {
            const loss = response.data.response.history.loss[2]
            console.log('loss: ', loss)
            resolve(loss)
        })
        .catch(error => console.error('Error:', error))
    })
}
export async function predict(input){
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3001/predictModel', {
            input: input
        })
        .then(response => {
            let output = response.data.response
            resolve(output)
        })
        .catch(error => {
            console.error('Error:', error)
            reject(error)
        })
    })
}


