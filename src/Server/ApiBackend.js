const express = require('express')
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')
const tf = require('@tensorflow/tfjs')
const tfModel = require('./ModelManagement')

const app = express()
const port = 3001
app.use(cors())
app.use(bodyParser.json())

//input: distance
//output: 0: no react, 1: react
let model1 = new tfModel(2, 2)
//JSON -> passes tensor
app.get('/getOnlineModel', async (req, res) => {
    try{
        const result = model1.model.save({saveFormat: 'json'})
        res.json({response: result})
    } catch(error){
        console.error('Error:', error.message)
        res.status(500).json({error: 'Internal Server Error.'})
    }
})
app.post('/trainModel', async (req, res) => {
    const input = {
        'states': req.body.input.states,
        'actions': req.body.input.actions,
        'rewards': req.body.input.rewards,
        'done': req.body.input.done
    }
    try{
        const result = await model1.trainModel(input)
        res.json({response: result})
    } catch(error){
        console.error('Error:', error.message)
        res.status(500).json({error: 'Internal Server Error.'})
    }
})
app.post('/predictModel', async (req, res) => {
    try{
        let input = req.body.input
        let output = (await model1.predictModel(input)).output[0]
        const prediction = tf.argMax(output).dataSync()[0]

        res.json({response: prediction})
    }catch(error){
        console.error('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    console.log(`Node.js server is running at http://localhost:${port}`)
})