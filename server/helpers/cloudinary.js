const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});

exports.cloudinaryUploader = async (file, folder) => {
	await cloudinary.uploader.upload(file, { folder: folder, type: 'upload' }, (err, result) => {
		if (err) throw 'File have not been uploaded';

		return result;
	});
};

exports.cloudinaryRemoval = async publicId => {
	await cloudinary.uploader.destroy(`bugTracker/${publicId}`, {}, (err, result) => {
		if (err) throw 'file haven`t been removed from cloudinary';
	});
};
