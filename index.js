import fs from "fs";
 import readline from "readline";
 import path from "path";

 const folderPath = path.join(__dirname, 'files');
 const filenameListPath = path.join(__dirname, 'fileList.txt');


 async function createNewFile() {
     try {
         if (!fs.existsSync(folderPath)) {
             await fs.mkdir(folderPath);
         }

         let existingFileList = [];
         if (await fs.access(fileNameListPath).catch(() => false)) {
             const data = await fs.readFile(fileNameListPath, 'utf-8');
             existingFileList = data.split('\n');
         }

         const rl = readline.createInterface({
             input: process.stdin,
             output: process.stdout
         });

         const filename = await promptForFilename(rl, existingFileList);
         rl.close();

         const filePath = path.join(folderPath, `${filename}.txt`);
         await fs.writeFile(filePath, 'You are awesome', 'utf-8');
         await fs.appendFile(fileNameListPath, `${filename}\n`, 'utf-8');
         console.log(`File '${filename}.txt' created.`);
     } catch (error) {
         console.error('An error occurred:', error);
     }
 }

 async function promptForFilename(rl, existingFileList) {
     return new Promise((resolve) => {
         rl.question('Enter a filename: ', async(filename) => {
             if (existingFileList.includes(filename)) {
                 console.log('File already exists. Please choose a different filename.');
                 resolve(await promptForFilename(rl, existingFileList));
             } else {
                 resolve(filename);
             }
         });
     });
 }

 createNewFile();
