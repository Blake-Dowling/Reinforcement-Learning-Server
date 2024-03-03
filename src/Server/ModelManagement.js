const tf = require('@tensorflow/tfjs')

class tfModel{
    constructor(inputShape, outputShape){
        this.inputShape = inputShape
        this.outputShape = outputShape
        this.model = this.initModel(inputShape, outputShape)
    }

    initModel(inputShape, outputShape){
        // ****************** X model ******************
        //Input Layer
        const inputLayer = tf.input({shape: [inputShape]})
        //Hidden Layers
        const dense1 = tf.layers.dense({units: 64, activation: 'relu'})
        const dense2 = tf.layers.dense({units: 64, activation: 'relu'})
        //Output Layer
        const outputLayer = tf.layers.dense({units: outputShape, activation: 'softmax', name: 'output'})

        //Apply Layers
        let x = dense1.apply(inputLayer)
        x = dense2.apply(x)
        const output = outputLayer.apply(x)

        const model = tf.model({inputs: inputLayer, outputs:output})
        console.log(model.summary())
        model.compile({optimizer: tf.train.adam(0.001), loss: {'output': 'sparseCategoricalCrossentropy'}, metrics: ['accuracy']})
        return model
    }

    async trainModel(input, output){
        output = {'output': output}
        let history = await this.model.fit(input, output, {epochs: 3})
        return new Promise((resolve, reject) => {
            resolve(history)
        })
    }

    async predictModel(input){
        let output = this.model.predict(input).dataSync()
        output = Array.from(output)
        output = output.indexOf(Math.max(...output))
        output = {
            'output': output
        }
        return new Promise((resolve, reject) => {
            resolve(output)
        })
    }

}

module.exports = tfModel