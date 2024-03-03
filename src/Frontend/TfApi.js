
import axios from 'axios'


export function trainModel(input, output){
    axios.post('http://localhost:3001/trainModel', {
        input: input,
        output: output
    })
    .then(response => {
        const loss = response.data.response.history.loss[2]
        console.log('loss: ', loss)
    })
    .catch(error => console.error('Error:', error))
    }
export function predictModel(input){
    axios.post('http://localhost:3001/predictModel', {
        input: input
    })
    .then(response => {
        const output = response.data.response.output
    })
    .catch(error => {
        console.error('Error:', error)
    })
}


