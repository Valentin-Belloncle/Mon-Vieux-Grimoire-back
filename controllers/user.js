const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
	try {
		const hash = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			email: req.body.email,
			password: hash,
		});
		await user.save();
		res.status(201).json({ message: "Utilisateur créé !" });
	} catch (error) {
		error.name === "ValidationError"
			? res.status(400).json({ error })
			: res.status(500).json({ error });
	}
};

exports.login = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(401).json({ error: "Identifiants incorrects !" });
		}
		const valid = await bcrypt.compare(req.body.password, user.password);
		if (!valid) {
			return res.status(401).json({ error: "Identifiants incorrects !" });
		}
		res.status(200).json({
			userId: user._id,
			token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET"),
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};
