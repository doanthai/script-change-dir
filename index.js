const fs = require('fs');
const path = require('path');

const rootPath = "/Users/doanthai/workspace/nodejs/sale-project/s-backend";

const ignoreDir = ['.git','.idea','.run','.fleet', '.github','node_modules'];
//['node_modules','dist','build','.dart_tool']
const removeDir = [];

// list dir name need for chage
/**
* @example
* changeDir = ['log','test'];
* changeInfo = { "log": "logs", "test": "e2e" }
*/
const changeDir = ['abc'];
const changeInfo = {'abc': 'abc'};

const renameSync = (oldName, newName) => {
  return new Promise((resolve) => {
    fs.rename(oldName,newName, () => {
      resolve();
    });
  })
}

const removeNodeModule = async (p) => {
  let files = await fs.readdirSync(p, { withFileTypes: true });
  files = files.filter(f => f.isDirectory());
  for (let i = 0; i < files.length; i++){
    const file = files[i];
    let fullPath = path.resolve(p,file.name);
    if (ignoreDir.includes(file.name)) continue;
    if (file.isDirectory()) {
      if (removeDir.includes(file.name)) {
        await fs.rmSync(fullPath, { recursive: true, force: true });
        continue;
      }
    }
    let nameChange;
    console.log(fullPath);
    if (changeDir.some(c => {
      if (file.name.includes(c)) {
        nameChange = changeInfo[c];
        return true;
      }
      return false;
    })) {
      const newName = file.name.replaceAll(file.name, nameChange);
      const newFullPath = path.resolve(p, newName);
      console.log("ChangeName");
      await renameSync(fullPath, newFullPath);
      fullPath = newFullPath;
    }
    await removeNodeModule(fullPath);
  }
};

removeNodeModule(rootPath).then(() => console.log("done")).catch(e => console.log(e));
