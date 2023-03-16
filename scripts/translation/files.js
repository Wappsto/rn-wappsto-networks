const fs = require('fs');

module.exports = {
  projectNameSplitter: '^',

  createDirectory(name) {
    if (!this.directoryExists(name)) {
      fs.mkdirSync(name);
    }
  },

  directoryExists(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  fileExists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  loadFile(file, encoding = 'utf8') {
    try {
      return fs.readFileSync(file, encoding);
    } catch (err) {
      return false;
    }
  },

  loadJsonFile(file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      return {};
    }
  },

  saveFile(file, data) {
    fs.writeFileSync(file, data);
  },

  saveJsonFile(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
  },

  getAllFiles(dir, filter) {
    let files = [];
    try {
      if (fs.statSync(dir).isDirectory()) {
        fs.readdirSync(dir).forEach((f) => {
          const filePath = `${dir}/${f}`;
          if (fs.statSync(filePath).isFile()) {
            if (!filter || filter(filePath)) {
              files.push(filePath);
            }
          } else {
            files = files.concat(module.exports.getAllFiles(filePath, filter));
          }
        });
      }
    } catch (err) {
      return [];
    }
    return files;
  },

  getAllFolders(dir, filter) {
    let folders = [];
    try {
      if (fs.statSync(dir).isDirectory()) {
        fs.readdirSync(dir).forEach((f) => {
          const folderPath = `${dir}/${f}`;
          if (fs.statSync(folderPath).isDirectory()) {
            folders.push(folderPath);
          }
        });
      }
    } catch (err) {
      return [];
    }
    return folders;
  },
};
