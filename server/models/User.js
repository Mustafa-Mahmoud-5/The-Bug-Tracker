const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	jwt = require('jsonwebtoken'),
	sendError = require('../helpers/sendError'),
	bcrypt = require('bcryptjs'),
	cloudinary = require('../helpers/cloudinary'),
	fs = require('fs');

const Proj = require('./Project');
const Team = require('./Team');
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			lowercase: true
		},
		lastName: {
			type: String,
			required: true,
			lowercase: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		privateKey: {
			type: String,
			default: uuidv4()
		},
		image: {
			// will be object
			type: Schema.Types.Mixed,
			default: null
		},
		notifications: [
			{
				from: {
					type: Schema.Types.ObjectId,
					ref: 'User'
				},
				content: String,
				date: {
					type: Date,
					default: new Date()
				}
			}
		]
	},
	{ timestamps: true }
);

class UserClass {
	static publicProps() {
		return [ 'firstName', 'lastName', 'image' ];
	}

	static async signUp({ firstName, lastName, email, password }) {
		const user = await this.findOne({ email: email }).lean();

		if (user) sendError('This email is taken', 403);

		const hashedPassord = await bcrypt.hash(password, 12);

		return this.create({ firstName, lastName, email, password: hashedPassord });
	}

	static async signIn({ email, password }) {
		const user = await this.findOne({ email: email })
			.lean()
			.select(this.publicProps().join(' ') + ' password email');

		if (!user) sendError('Email is not found', 404);

		const verefiedPassword = await bcrypt.compare(password, user.password);

		if (!verefiedPassword) sendError('Invalid Password', 403);

		const token = jwt.sign(
			{ firstName: user.firstName, lastName: user.lastName, email: user.email, userId: user._id },
			`${process.env.TOKEN_SECRET}`,
			{
				expiresIn: '30d'
			}
		);

		return token;
	}

	static async editPersonalData(userId, file, { firstName, lastName, oldImagePublicKey }) {
		const user = await User.findById(userId).select(this.publicProps().join(' '));

		if (file) {
			if (user.image) {
				// the user has an image, remove the old one from cloudinary
				if (!oldImagePublicKey) {
					fs.unlink(file.path, err => console.log(err)); // remove the image that multer uploaded

					sendError('The user have selected a new file and you didn`t pass the oldImagePublicKey!', 403);
				}

				const result = await cloudinary.cloudinaryRemoval(oldImagePublicKey);

				console.log('editPersonalData -> result', result);
			}

			const filePath = file.path.replace('\\', '/');

			const { secure_url, public_id } = await cloudinary.cloudinaryUploader(filePath, 'bugTracker');

			const publicId = public_id.split('/')[1];

			const imgObj = { url: secure_url, publicId: publicId };

			user.image = imgObj;
		}

		user.firstName = firstName;
		user.lastName = lastName;

		return user.save();
	}
}

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
