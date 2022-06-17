var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var path = require('path');
require('dotenv').config();

var data = new FormData();
data.append('operations', '{"operationName":null,"variables":{"projectId":"chitchat-YsTb2tdVB","files":[null,null,null,null,null,null,null,null,null,null,null,null,null,null],"wipeInvolvedCollections":false,"wipeProject":true,"fallbackLang":"en"},"query":"mutation ($projectId: String!, $files: [Upload]!, $onlyValidate: Boolean, $wipeInvolvedCollections: Boolean, $wipeProject: Boolean, $fallbackLang: String!) {\\n  import(projectId: $projectId, files: $files, onlyValidate: $onlyValidate, wipeInvolvedCollections: $wipeInvolvedCollections, fallbackLang: $fallbackLang, wipeProject: $wipeProject) {\\n    fileMessages {\\n      errors {\\n        text\\n        longText\\n        __typename\\n      }\\n      warnings {\\n        text\\n        longText\\n        __typename\\n      }\\n      info {\\n        text\\n        longText\\n        __typename\\n      }\\n      conflicts\\n      filename\\n      __typename\\n    }\\n    summary {\\n      text\\n      longText\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}', {contentType: 'application/json'});
data.append('map', '{"1":["variables.files.0"],"2":["variables.files.1"],"3":["variables.files.2"],"4":["variables.files.3"],"5":["variables.files.4"],"6":["variables.files.5"],"7":["variables.files.6"],"8":["variables.files.7"],"9":["variables.files.8"],"10":["variables.files.9"],"11":["variables.files.10"],"12":["variables.files.11"],"13":["variables.files.12"],"14":["variables.files.13"]}', {contentType: 'application/json'});
data.append('1', fs.createReadStream(path.join(__dirname, 'files', 'data', 'stories.yml')), {contentType: 'application/octet-stream'});
data.append('2', fs.createReadStream(path.join(__dirname, 'files', 'config-en.yml')), {contentType: 'application/octet-stream'});
data.append('3', fs.createReadStream(path.join(__dirname, 'files', 'config-fr.yml')), {contentType: 'application/octet-stream'});
data.append('4', fs.createReadStream(path.join(__dirname, 'files','data', 'nlu', 'en.yml')), {contentType: 'application/octet-stream'});
data.append('5', fs.createReadStream(path.join(__dirname, 'files','data', 'nlu', 'fr.yml')), {contentType: 'application/octet-stream'});
data.append('6', fs.createReadStream(path.join(__dirname, 'files', 'endpoints.yml')), {contentType: 'application/octet-stream'});
data.append('7', fs.createReadStream(path.join(__dirname, 'files', 'credentials.yml')), {contentType: 'application/octet-stream'});
data.append('8', fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'conversations.json')), {contentType: 'application/octet-stream'});
data.append('9', fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'incoming.json')), {contentType: 'application/octet-stream'});
data.append('10', fs.createReadStream(path.join(__dirname, 'files', 'domain.yml')), {contentType: 'application/octet-stream'});
data.append('11', fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'bfconfig.yml')), {contentType: 'application/octet-stream'});
data.append('12', fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'default-domain.yml')), {contentType: 'application/octet-stream'});
data.append('13', fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'analyticsconfig.yml')), {contentType: 'application/octet-stream'});
data.append('14', fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'widgetsettings.yml')), {contentType: 'application/octet-stream'});

var config = {
  method: 'post',
  url: `${process.env.SERVER_ENDPOINT}/graphql`,
  headers: { 
    'authorization': `${process.env.AUTHENTICATION_TOKEN}`, 
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryaetTKSDfdFlHHxmp'
  },
  data : data
};


axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
