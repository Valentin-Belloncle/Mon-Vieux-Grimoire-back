const Book = require("../models/book");

exports.getAllBooks = async (req, res, next) => {
	try {
		const books = await Book.find();
		res.status(200).json(books);
	} catch (error) {
		res.status(400).json({
			message: "Données non valides.",
			error: error.message,
		});
	}
};

exports.createOneBook = async (req, res, next) => {
	delete req.body._id;
	const book = new Book({
		...req.body,
	});
	try {
		await book.save();
		res.status(201).json({ message: "Livre enregistré !" });
	} catch (error) {
		res.status(400).json({
			message: "Données non valides.",
			error: error.message,
		});
	}
};

exports.getBestBooks = async (req, res, next) => {
	try {
		const bestBooks = await Book.find()
			.sort({ averageRating: -1 })
			.limit(3)
			.exec();
		res.status(200).json(bestBooks);
	} catch (error) {
		res.status(400).json({
			message: "Données non valides.",
			error: error.message,
		});
	}
};

exports.getOneBook = async (req, res, next) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		res.status(200).json(book);
	} catch (error) {
		res.status(400).json({
			message: "Données non valides.",
			error: error.message,
		});
	}
};

exports.modifyOneBook = async (req, res, next) => {
	try {
		const book = await Book.updateOne(
			{ _id: req.params.id },
			{ ...req.body, _id: req.params.id }
		);
		res.status(200).json({ message: "Livre modifié !" });
	} catch (error) {
		res.status(400).json({
			message: "Données non valides.",
			error: error.message,
		});
	}
};

exports.deleteOneBook = async (req, res, next) => {
	try {
		const book = await Book.deleteOne({ _id: req.params.id });
		res.status(200).json({ message: "Livre supprimé !" });
	} catch (error) {
		res.status(400).json({
			message: "Données non valides.",
			error: error.message,
		});
	}
};
