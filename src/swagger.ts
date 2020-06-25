import swaggerJsDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            version: 'v1',
            title: 'SafeCall',
            description: 'SafeCall API'
        },
        host: 'unitaemin.run.goorm.io/safecall',
        basePath: '/',
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
swaggerSpec.definitions.ResponseSingup = require('../Swagger/ResponseSingin.model.json');
swaggerSpec.definitions.ResponseSingin = require('../Swagger/ResponseSingin.model.json');
swaggerSpec.definitions.RequestSignin = require('../Swagger/RequestSignin.model.json');
swaggerSpec.definitions.RequestSignup = require('../Swagger/RequestSignup.model.json');

export { swaggerSpec };