import swaggerJsDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      version: "v1",
      title: "DanZam",
      description: "DanZam API",
    },
    host: "localhost:4040",
    // host: "unitaemin.run.goorm.io/danzam",
    basePath: "/",
  },
  apis: ["**/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);
swaggerSpec.definitions.RequestSignin = require("../Swagger/RequestSignin.model.json");
swaggerSpec.definitions.RequestSignup = require("../Swagger/RequestSignup.model.json");
swaggerSpec.definitions.ResponseSignin = require("../Swagger/ResponseSignin.model.json");
swaggerSpec.definitions.ResponseSignup = require("../Swagger/ResponseSignup.model.json");
swaggerSpec.definitions.RequestSleepUpdate = require("../Swagger/RequestSleepUpdate.model.json");
swaggerSpec.definitions.ResponseSleepUpdate = require("../Swagger/ResponseSleepUpdate.model.json");
swaggerSpec.definitions.RequestInfo = require("../Swagger/RequestInfo.model.json");
swaggerSpec.definitions.ResponseInfo = require("../Swagger/ResponseInfo.model.json");
swaggerSpec.definitions.RequestUpdateInfo = require("../Swagger/RequestUpdateInfo.model.json");
swaggerSpec.definitions.ResponseUpdateInfo = require("../Swagger/ResponseUpdateInfo.model.json");
swaggerSpec.definitions.ResponseRefresh = require("../Swagger/ResponseRefresh.model.json");
swaggerSpec.definitions.RequestGetSleepTime = require("../Swagger/RequestGetSleepTime.model.json");
swaggerSpec.definitions.ResponseGetSleepTime = require("../Swagger/ResponseGetSleepTime.model.json");
swaggerSpec.definitions.ResponseGetAchievements = require("../Swagger/ResponseGetAchievements.model.json");
swaggerSpec.definitions.Token = require("../Swagger/Token.model.json");

export { swaggerSpec };
