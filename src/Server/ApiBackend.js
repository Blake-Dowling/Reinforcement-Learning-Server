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
let model1 = new tfModel(1, 2)

app.post('/trainModel', async (req, res) => {
    let input = req.body.input
    let output = req.body.output

    input = JSON.parse(input)
    input = tf.tensor2d(input)
    output = JSON.parse(output)
    output = tf.tensor2d(output)

    try{
        const result = await model1.trainModel(input, output)
        res.json({response: result})
    } catch(error){
        console.error('Error:', error.message)
        res.status(500).json({error: 'Internal Server Error.'})
    }
})

app.post('/predictModel', async (req, res) => {
    try{
        const input = req.body.input
        const prediction = await model1.predictModel(input)
        res.json({response: prediction})
    }catch(error){
        console.error('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    console.log(`Node.js server is running at http://localhost:${port}`)
})