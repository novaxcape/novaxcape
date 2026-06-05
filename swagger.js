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
                url:"https://novaxcape.onrender.com",
                description: "The hosted route"
            },
        {

                url:"http://localhost:9955",
                description: 'hosted URL'
        }
        ],
        components:{
        securitySchemes:{
            bearerAuth:{
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    }
    },
    apis: [
      "./docs/client.yaml",
      "./docs/package.yaml",
      "./docs/vendor.yaml",
      "./docs/tourist.yaml",
      "./docs/kyc.yaml"
    ]
}

module.exports =swagger(options)
