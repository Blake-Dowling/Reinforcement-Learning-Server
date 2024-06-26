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
        const dense3 = tf.layers.dense({units: 1, activation: 'linear', })//kernelRegularizer: tf.regularizers.l2({l2: 0.1})})
        const dense2 = tf.layers.dense({units: 64, activation: 'relu', })//kernelRegularizer: tf.regularizers.l2({l2: 0.1})})
        const dense1 = tf.layers.dense({units: 64, activation: 'relu', })//kernelRegularizer: tf.regularizers.l2({l2: 0.1})})
        //Output Layer
        const outputLayer = tf.layers.dense({units: outputShape, activation: 'linear', name: 'output'})

        //Apply Layers
        let x = dense1.apply(inputLayer)
        x = dense2.apply(x)
        // x = dense3.apply(x)
        const output = outputLayer.apply(x)

        const model = tf.model({inputs: inputLayer, outputs:output})
        console.log(model.summary())
        model.compile({optimizer: tf.train.adam(0.001), loss: {'output': 'meanSquaredError'}, metrics: ['accuracy']})
        return model
    }
    // ob<array> -> tensor
    async trainModel(input){
        
        //existing q values to fill in output tensor aside from newly trained actions
        const onlineOutput = (await this.predictModel(input.states)).output
        //Current highest q value for each (next) state

        const maxOnlineQValues = await tf.max(tf.tensor(onlineOutput), 1).array()
        // console.log(onlineOutput)

        for(let i=0; i<input.states.length-1; i++){
            console.log(input.states[i], input.actions[i], input.rewards[i], input.done[i], onlineOutput[i])
            if(input.done[i] !== true){
                onlineOutput[i][input.actions[i]] = input.rewards[i] + maxOnlineQValues[i+1]
            }
            else if(input.done[i] === true){
                for(let j=0; j<onlineOutput[i].length; j++){
                    onlineOutput[i][j] = input.rewards[i]
                }
            }
            
        }

        const tfInput = tf.tensor(input.states)
        const targetOutput = {'output': tf.tensor(onlineOutput)}

        let history = await this.model.fit(tfInput, targetOutput, {epochs: 3, shuffle: true})
        return new Promise((resolve, reject) => {
            resolve(history)
        })
    }
    //array -> tensor -> array
    async predictModel(input){
        let output = await this.model.predict(tf.tensor(input)).array()
        output = {
            'output': output
        }
        return new Promise((resolve, reject) => {
            resolve(output)
        })
    }

}

module.exports = tfModel