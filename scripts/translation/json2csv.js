const Path = require('path');
const Files = require('./files');
const { parse } = require('json2csv');
const paths = process.argv.slice(2);

const result = {};
paths.forEach(path => {
  let projectName = '';
  if(paths.length > 1){
    projectName = path.replace(/src.*$/, '');
    projectName = '^' + Path.basename(projectName) + '^';
  }
  const folders = Files.getAllFolders(path);
  folders.forEach(folderPath => {
    let language = folderPath.split('/');
    language = language[language.length - 1];
    const files = Files.getAllFiles(folderPath, (p) => p.endsWith('.json'));
    files.forEach(filePath => {
      const name = Path.basename(filePath, '.json');
      const content = Files.loadJsonFile(filePath);
      addJSON(language, content, projectName + name + ':');
    });
  });
});
const csv = parse(Object.values(result));
Files.saveFile('result.csv', csv);

function addJSON(language, json, prefix){
  for(let key in json){
    if(typeof json[key] === 'string'){
      const k = prefix + key;
      const v = json[key];
      if(!result[k]){
        result[k] = { key: k };
      }
      result[k][language] = v;
    } else {
      addJSON(language, json[key], prefix + key + '.');
    }
  }
}
