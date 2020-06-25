import swaggerJsDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            version: 'v1',
            title: 'DanZam',
            description: 'DanZam API'
        },
        host: 'unitaemin.run.goorm.io/danzam',
        basePath: '/'
        // securityDefinitions: {
        //     type: 'apiKey',
        //     name: 'Authorization',
        //     scheme: 'Bearer',
        //     in: 'header'
        // },
    },
    apis: ['**/*.ts']
};

const swaggerSpec = swaggerJsDoc(options);
swaggerSpec.definitions.RequestSignin = require('../Swagger/RequestSignin.model.json');
swaggerSpec.definitions.RequestSignup = require('../Swagger/RequestSignup.model.json');
swaggerSpec.definitions.ResponseSignin = require('../Swagger/ResponseSignin.model.json');
swaggerSpec.definitions.ResponseSignup = require('../Swagger/ResponseSignup.model.json');


export { swaggerSpec };