var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var path = require('path');
const core = require('@actions/core');
const yaml = require('js-yaml');
require('dotenv').config();

var filepath = path.join(__dirname, 'files')
var mapsObj = Object()
var fileCount = 0

var files = fs.readdirSync(filepath, {withFileTypes: true})
.filter(item => !item.isDirectory() && item.name.startsWith('config'))
.map(item => item.name)

var total_files = 10 + (2* files.length)


function createMapObject() {
for (let itr= 0; itr < total_files; itr++) {
    mapsObj[itr+1] = [`variables.files.${itr}`]
  }

return JSON.stringify(mapsObj)  
}

function updateCredentialYml() {
    console.log(process.env.SERVER_ENDPOINT.split(':')[0] + process.env.SERVER_ENDPOINT.split(':')[1] + ':5005')
    let doc = yaml.load(fs.readFileSync(path.join(__dirname, 'files', 'credentials.yml'), 'utf8'));
    doc['rasa_addons.core.channels.webchat.WebchatInput'].base_url =  `${process.env.SERVER_ENDPOINT}:5005`;
    fs.writeFile(path.join(__dirname, 'files', 'credentials.yml'), yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

updateCredentialYml();

let nullArray = new Array(total_files).fill(null)

var data = new FormData();
data.append('operations', `{"operationName":null,"variables":{"projectId":"${process.env.PROJECT_ID}","files":${JSON.stringify(nullArray)},"wipeInvolvedCollections":false,"wipeProject":true,"fallbackLang":"en"},"query":"mutation ($projectId: String!, $files: [Upload]!, $onlyValidate: Boolean, $wipeInvolvedCollections: Boolean, $wipeProject: Boolean, $fallbackLang: String!) {\\n  import(projectId: $projectId, files: $files, onlyValidate: $onlyValidate, wipeInvolvedCollections: $wipeInvolvedCollections, fallbackLang: $fallbackLang, wipeProject: $wipeProject) {\\n    fileMessages {\\n      errors {\\n        text\\n        longText\\n        __typename\\n      }\\n      warnings {\\n        text\\n        longText\\n        __typename\\n      }\\n      info {\\n        text\\n        longText\\n        __typename\\n      }\\n      conflicts\\n      filename\\n      __typename\\n    }\\n    summary {\\n      text\\n      longText\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`, {contentType: 'application/json'});
data.append('map', createMapObject(), {contentType: 'application/json'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'data', 'stories.yml')), {contentType: 'application/octet-stream'});

for (const filename of files){
    data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', filename)), {contentType: 'application/octet-stream'});
}

for (const name of files){
    data.append(`${++ fileCount }`, fs.createReadStream(path.join(__dirname, 'files','data', 'nlu',  name.split('-')[1])), {contentType: 'application/octet-stream'});
}

data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'endpoints.yml')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'credentials.yml')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'conversations.json')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'incoming.json')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'domain.yml')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'bfconfig.yml')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'default-domain.yml')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'analyticsconfig.yml')), {contentType: 'application/octet-stream'});
data.append(`${++ fileCount}`, fs.createReadStream(path.join(__dirname, 'files', 'botfront', 'widgetsettings.yml')), {contentType: 'application/octet-stream'});

var config = {
  method: 'post',
  url: `${process.env.SERVER_ENDPOINT}:8888/graphql`,
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
    core.setFailed(error.message);
});
