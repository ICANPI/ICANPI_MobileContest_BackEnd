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
swaggerSpec.definitions.ResponseChatbot = require('../Swagger/ResponseChatbot.model.json');
swaggerSpec.definitions.ResponseAddressList = require('../Swagger/ResponseAddressList.model.json');
swaggerSpec.definitions.ResponseChatList = require('../Swagger/ResponseChatList.model.json');

export { swaggerSpec };