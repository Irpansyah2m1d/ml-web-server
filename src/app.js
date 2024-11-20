const Hapi = require('@hapi/hapi');
const { loadModel, predict } = require('./inference');

(async () => {
    const model = await loadModel();
    console.log('model loaded!');

    const server = Hapi.server({
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: 3000
    })

    server.route({
        method: 'POST',
        path: '/predicts',
        handler: async (request) => {

            // get image
            const { image } = request.payload;

            // do and get prediction
            const predictions = await predict(model, image);

            // get predict result
            const [paper, rock] = predictions;
            

            if(paper){
                return {result: 'paper'};
            }
            
            if(rock){
                return {result: 'rock'};
            }
            // if(scissors){
            //     return {result: 'scissors'};
            // }

            return { result: 'scissors' };
        },
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
            }
        }
    });


    await server.start();

    console.log(`Server start at: ${server.info.uri}`);
})();

