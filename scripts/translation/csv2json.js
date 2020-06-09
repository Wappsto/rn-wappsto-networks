const Path = require('path');
const Files = require('./files');
const csv2json = require("csvtojson");
const paths = process.argv.slice(2);
const del = require('del');

const result = {};
const csvPath = paths.shift();

csv2json()
.fromFile(csvPath)
.then((json)=>{
  json.forEach((input) => {
    const key = input.key;
    let projectName = '.';
    let str = key;
    if(key.startsWith('^')){
      const split = key.split('^');
      projectName = split[1];
      str = split[2];
    }
    const strSplit = str.split(':');
    const namespace = strSplit[0];
    let tKey = strSplit[1];
    if(!result[projectName]){
      result[projectName] = {};
    }
    tKey = tKey.split('.');
    for(let language in input){
      if(language !== 'key'){
        const value = input[language];
        if(!result[projectName][language]){
          result[projectName][language] = {};
        }
        if(!result[projectName][language][namespace]){
          result[projectName][language][namespace] = {};
        }
        if(tKey.length > 1){
          const lastObj = tKey.reduce((obj, k, index) => {
            if(!obj[k]){
              obj[k] = {};
            }
            if(index === tKey.length - 1){
              obj[k] = value;
            }
            return obj[k];
          }, result[projectName][language][namespace]);
        } else {
          result[projectName][language][namespace][tKey[0]] = value;
        }
      }
    }
  });
  createFiles();
});

function createFiles(){
  const baseDir = './result';
  del.sync(baseDir);
  Files.createDirectory(baseDir);
  for(let project in result){
    const projectDir = baseDir + '/' + project;
    Files.createDirectory(projectDir);
    for(let language in result[project]){
      const languageDir = projectDir + '/' + language;
      Files.createDirectory(languageDir);
      for(let namespace in result[project][language]){
        Files.saveJsonFile(languageDir + '/' + namespace + '.json', result[project][language][namespace]);
      }
    }
  }
}
