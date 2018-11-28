import {
  asyncAccessFile,
  asyncCreateDir,
  asyncReadDir,
  asyncRemoveDir,
  asyncRemoveFile,
  asyncStat
} from "./promisify";
import path from "path";
import fs from "fs";

async function writeFileWithStream(photoPath, readableStream) {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(photoPath);
    readableStream
      .on("data", data => {
        console.log("readableStream Data", data);
      })
      .on("error", error => {
        console.log("errorStream", error);
      })
      .on("end", () => {
        console.log("readableStream ended");
      });
    readableStream.pipe(wstream);
    wstream
      .on("error", readableStreamError => {
        return reject(readableStreamError);
      })
      .on("finish", () => {
        return resolve(photoPath);
      });
  });
}

function savePhoto(file, destinationPhotoDir, previousPhotoPath = "") {
  return new Promise(async (resolve, reject) => {
    // check if dir exists
    const isDirNoExist = await asyncStat(destinationPhotoDir)
      .then(() => false)
      .catch(() => true);
    if (isDirNoExist) {
      try {
        // create dir with name as primary key
        await asyncCreateDir(destinationPhotoDir);
      } catch (createDirError) {
        reject(createDirError);
      }
    }
    // create new copy of product and new photo is not uploaded
    if (typeof file === "string") {
      const defaultPhotoPath = path.join(path.resolve("./public"), file);
      const newPhotoPath = `${destinationPhotoDir}/${path.basename(file)}`;
      // create photo readstream
      const readableStream = fs.createReadStream(defaultPhotoPath);
      try {
        // returned absolute path
        const filename = await writeFileWithStream(
          newPhotoPath,
          readableStream
        );
        // I need just name of the photo like photo.png
        resolve(path.basename(filename));
      } catch (streamError) {
        reject(streamError);
      }
    } else {
      // handle new uploaded photo
      try {
        const { filename, stream } = await file;
        try {
          //resolve path to photo file
          const photoPath = path.resolve(`${destinationPhotoDir}/${filename}`);
          // check if photo exists (use case  updating new photo)
          const isExistFile = await asyncAccessFile(
            photoPath,
            fs.constants.F_OK
          )
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
          resolve(filename);
        } catch (FileError) {
          reject(FileError);
        }
      } catch (photoFileError) {
        reject(photoFileError);
      }
    }
  });
}
// recursively remove all files in given folder and then folder when customer/product is removed
function recursivelyRemoveFiles(resolvePathToDir) {
  return new Promise(async (resolve, reject) => {
    try {
      const files = await asyncReadDir(resolvePathToDir);
      for (let file = 0; file < files.length; file++) {
        try {
          const resolvePathToFile = path.join(resolvePathToDir, files[file]);
          await asyncRemoveFile(resolvePathToFile);
        } catch (removeFileError) {
          reject(removeFileError);
        }
      }
      try {
        await asyncRemoveDir(resolvePathToDir);
      } catch (removeDirError) {
        reject(removeDirError);
      }
    } catch (readDirError) {
      reject(readDirError);
    }
    resolve(true);
  });
}

export { recursivelyRemoveFiles, savePhoto };
