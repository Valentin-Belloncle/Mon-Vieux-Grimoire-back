const Book = require("../models/Book.js");
const fs = require("fs");
const path = require("path");

exports.getAllBooks = async (req, res, next) => {
	try {
		const books = await Book.find();
		res.status(200).json(books);
	} catch (error) {
		res.status(500).json({ error });
	}
};

exports.createOneBook = async (req, res, next) => {
	try {
		const bookData = JSON.parse(req.body.book);
		delete bookData._id;
		delete bookData._userId;

		const book = new Book({
			...bookData,
			userId: req.auth.userId,
			imageUrl: `${req.protocol}://${req.get("host")}/images/${
				req.file.filename
			}`,
		});
		await book.save();
		res.status(201).json({ message: "Livre enregistré !" });
	} catch (error) {
		res.status(500).json({ error });
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
		res.status(400).json({ error });
	}
};

exports.getOneBook = async (req, res, next) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		res.status(200).json(book);
	} catch (error) {
		res.status(500).json({ error });
	}
};

exports.modifyOneBook = async (req, res, next) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		if (!book) {
			return res.status(404).json({ error: "Livre non trouvé." });
		}

		// Suppression de l'ancienne image si une nouvelle est envoyée
		let bookData;
		if (req.file) {
			const oldImagePath = book.imageUrl.split("/images/")[1];
			fs.unlink(
				path.join(__dirname, "../images", oldImagePath),
				(err) => {
					if (err) {
						console.error(
							"Erreur lors de la suppression de l'image:",
							err
						);
					}
				}
			);

			// Mise à jour des données
			bookData = {
				...JSON.parse(req.body.book),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
			};
		} else {
			bookData = { ...req.body };
		}
		delete bookData._userId;

		await Book.updateOne({ _id: req.params.id }, { ...bookData });
		res.status(200).json({ message: "Livre mis à jour avec succès !" });
	} catch (error) {
		res.status(500).json({ error });
	}
};

exports.deleteOneBook = async (req, res, next) => {
	try {
		const book = await Book.findOne({ _id: req.params.id });
		if (!book) {
			return res.status(404).json({ error });
		}

		// Récupération du chemin de l'image
		const imagePath = path.join(
			__dirname,
			"../images",
			book.imageUrl.split("/images/")[1]
		);

		// Suppression de l'image du serveur
		fs.unlink(imagePath, async (err) => {
			if (err) {
				console.error(
					"Erreur lors de la suppression de l'image :",
					err
				);
				return res.status(500).json({ err });
			}

			// Suppression du livre de la base de données
			await Book.deleteOne({ _id: req.params.id });
			res.status(200).json({ message: "Livre supprimé !" });
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};

exports.rateOneBook = async (req, res, next) => {
	try {
		const bookId = req.params.id;
		const userId = req.auth.userId;
		const grade = req.body.rating;
		const rating = {
			userId: userId,
			grade: grade,
		};

		const updatedBook = await Book.findById(bookId);

		if (!updatedBook) {
			return res.status(404).json({ error: "Livre non trouvé." });
		}

		const existingRating = updatedBook.ratings.find(
			(r) => r.userId === userId
		);
		if (existingRating) {
			return res.status(403).json({
				error: "Vous avez déjà noté ce livre.",
			});
		}
		updatedBook.ratings.push(rating);

		// Recalcul de la note moyenne
		const ratingsValue = updatedBook.ratings.map((r) => r.grade);
		const newAverageRating =
			ratingsValue.reduce((acc, rating) => acc + rating, 0) /
			ratingsValue.length;

		updatedBook.averageRating = newAverageRating;
		await updatedBook.save();

		res.status(200).json(updatedBook);
	} catch (error) {
		res.status(500).json({ error });
	}
};
