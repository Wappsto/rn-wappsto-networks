const fs = require('fs');
const { exec } = require("child_process");

try{
  exec("./node_modules/.bin/rn-nodeify --install \"crypto,stream,events,vm,process\" --hack", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(stdout);
  });
} catch(e){
  console.log(e);
}
