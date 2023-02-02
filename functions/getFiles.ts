const fs = require("fs");

const getFiles = (dir: string, exclude = null) => {
	const output: any = {};
	fs.readdirSync(dir).forEach((path: string) => {
		if (fs.lstatSync(dir + "/" + path).isDirectory()) {
			output[path] = getFiles(dir + "/" + path, exclude);
		} else {
			if (!path.endsWith(".js") && !path.endsWith(".ts")) return;
			const func = require(`.${dir}/${path}`);
			output[path.replace(".js", "").replace(".ts", "")] = func;
		}
	});
	return output;
}

module.exports = getFiles;
