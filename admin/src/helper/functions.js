export const getFileExtension = (url) => {
	// Get the last part of the URL after the last '/'
	const filename = url.substring(url.lastIndexOf('/') + 1);

	// Get the file extension by getting the last part of the filename after the last '.'
	const extension = filename.substring(filename.lastIndexOf('.') + 1);

	return extension;
};

export const isObjectEmpty = (obj) => {
	for (const key in obj) {
		if (obj[key]) {
			if (obj[key] === '{"min":0,"max":20000000}') {
			} else {
				return false;
			}
		}
	}
	return true;
};
