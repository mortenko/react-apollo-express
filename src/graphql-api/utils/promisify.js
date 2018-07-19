import util from "util";
import fs from "fs";

// convert callback-based function to Promise based
export const asyncCreateDir = util.promisify(fs.mkdir);
export const asyncAccessFile = util.promisify(fs.access);
export const asyncRemoveFile = util.promisify(fs.unlink);