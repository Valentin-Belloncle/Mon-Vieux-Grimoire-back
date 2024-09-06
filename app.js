const express = require("express");
const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://will:1234@cluster0.8xde9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.get("/api/books", (req, res, next) => {
	const books = [
		{
			id: "oeihfzeoi",
			userId: "1235",
			title: "Mon premier livre",
			author: "auteur",
			year: 2015,
			imageUrl:
				"https://www.cfpp-colmar.fr/wp-content/uploads/2020/10/banque-d-images-gratuites-libres-de-droits46-1560x1040-1.jpg",
			genre: "genre",
			ratings: 0,
			averageRating: 4,
		},
		{
			id: "oeihfzeomoihi",
			userId: "1234",
			title: "Mon deuxième livre",
			author: "auteur",
			year: 2010,
			imageUrl:
				"https://www.cfpp-colmar.fr/wp-content/uploads/2020/10/banque-d-images-gratuites-libres-de-droits46-1560x1040-1.jpg",
			genre: "genre",
			ratings: 0,
			averageRating: 1,
		},
	];
	res.status(200).json(books);
});

app.post("/api/stuff", (req, res, next) => {
	console.log(req.body);
	res.status(201).json({
		message: "Livre créé !",
	});
});

module.exports = app;
