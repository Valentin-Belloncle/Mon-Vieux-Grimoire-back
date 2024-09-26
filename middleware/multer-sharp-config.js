const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage }).single("image");

const compressAndSaveImage = async (req, res, next) => {
	if (req.method === "POST" && !req.file) {
		return res.status(400).json({ message: "Aucun fichier image trouvé" });
	}
	if (req.method === "PUT" && !req.file) {
		next();
		return
	}
	
	req.file.filename = path.parse(req.file.originalname.split(" ").join("_")).name + Date.now() + ".webp";
	const outputPath = path.join("images", req.file.filename);

	try {
		await sharp(req.file.buffer)
			.resize(800)
			.webp({ quality: 20 })
			.toFile(outputPath);

		req.file.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

		next();
	} catch (error) {
		return res.status(500).json({ message: "Erreur lors du traitement de l'image" });
	}
};

module.exports = { upload, compressAndSaveImage };