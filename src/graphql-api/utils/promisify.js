import util from "util";
import fs from "fs";

// convert callback-based function to Promise based
export const asyncCreateDir = util.promisify(fs.mkdir);
export const asyncRemoveDir = util.promisify(fs.rmdir);
export const asyncReadDir = util.promisify(fs.readdir);
export const asyncAccessFile = util.promisify(fs.access);
export const asyncRemoveFile = util.promisify(fs.unlink);