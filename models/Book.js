const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
	userId: { type: String, required: false },
	title: { type: String, required: true },
	author: { type: String, required: true },
	year: { type: Number, required: false },
	imageUrl: { type: String, required: true },
	genre: { type: String, required: false },
	ratings: [
		{
			userId: { type: String, required: false },
			grade: { type: Number, require: false },
		},
	],
	averageRating: { type: Number, required: false },
});

module.exports = mongoose.model("Book", bookSchema);
