const fs = require("fs");

async function wrapStreamWithPromise(customerPhotoPath, readableStream) {
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
      .on("error", error => {
        return reject(error);
      })
      .on("finish", () => {
        return resolve(customerPhotoPath);
      });
  });
}
function collectServerErrors({ errors }) {
  return errors.map(val => ({ [val.path]: val.message }));
}

export { wrapStreamWithPromise, collectServerErrors };
