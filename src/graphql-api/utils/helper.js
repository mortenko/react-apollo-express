import {
  asyncAccessFile,
  asyncCreateDir,
  asyncRemoveFile,
  asyncStat
} from "./promisify";

import path from "path";
import fs from "fs";

async function writeFileWithStream(customerPhotoPath, readableStream) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(customerPhotoPath);
    readableStream.on("data", data => {
      console.log("readableStream", data);
    });
    readableStream.on("end", () => {
      console.log("readableStream ended");
    });
    readableStream.pipe(wstream);
    wstream
      .on("error", readableStreamError => {
        return reject(readableStreamError);
      })
      .on("finish", () => {
        return resolve(customerPhotoPath);
      });
  });
}

function savePhoto(promiseFile, photoDir, previousPhotoPath = "") {
  return new Promise(async (resolve, reject) => {
    try {
      const { filename, stream } = await promiseFile;
      const isDirNoExist = await asyncStat(photoDir)
        .then(() => false)
        .catch(() => true);
      if (isDirNoExist) {
        try {
          // create dir with primary key name
          await asyncCreateDir(photoDir);
        } catch (createDirError) {
          reject(createDirError);
        }
      }
      try {
        //resolve path to file
        const photoPath = path.resolve(`${photoDir}/${filename}`);
        // check if this file exists
        const isExistFile = await asyncAccessFile(photoPath, fs.constants.F_OK)
          .then(() => false)
          .catch(() => true);
        if (isExistFile) {
          // create file if already not exist
          await writeFileWithStream(photoPath, stream);
        } else {
          // resolve path to previous photo you want to delete
          const resolvePreviousPhotoPath = path.resolve(
            `./public/${previousPhotoPath}`
          );
          // delete previous photoFile
          await asyncRemoveFile(resolvePreviousPhotoPath);
          // write new photo
          await writeFileWithStream(photoPath, stream);
        }
      } catch (FileError) {
        reject(FileError);
      }
      resolve(filename);
    } catch (photoFileError) {
      reject(photoFileError);
    }
  });
}

export {
  savePhoto
};
