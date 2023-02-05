/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = require("fs");

const getFiles = (dir: string, exclude?: string): any => {
	const output: any = {};
	fs.readdirSync(dir).forEach((path: string) => {
		if (fs.lstatSync(dir + "/" + path).isDirectory()) {
			output[path] = getFiles(dir + "/" + path, exclude);
		} else {
			if (!path.endsWith(".js") && !path.endsWith(".ts")) return;
			let func = require(`.${dir}/${path}`);
			// count number of functions in func
			let count = 0;
			for (const key in func) {
				if (Object.prototype.hasOwnProperty.call(func, key)) {
					count++;
				}
			}
			// if ONLY default export exists, set func to that
			if (func.default && count === 1) func = func.default;
			output[path.replace(".js", "").replace(".ts", "")] = func;
		}
	});
	return output;
};

export default getFiles;
