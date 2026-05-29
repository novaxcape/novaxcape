const swagger = require('swagger-jsdoc');

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title: "Novaxcape",
            version: "1.0.0",
            description: "swagger documentation"
        },
        servers:[
        {

                url:"http://localhost:9865",
                description: 'hosted URL'

        }
               
           
        ]
    },
    apis: [
      "./docs/client.yaml",
    ]
}

module.exports =swagger(options)