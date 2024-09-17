const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
module.exports.create = async (req, res) => {
  res.status(200).json({ message: 'Image uploaded successfully', url: req.file.path });
};

module.exports.video = async (req, res) => {
  const filePath = req.file.path;
  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: 'video',
    });
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Video uploaded successfully', url: result.secure_url });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
};


module.exports.delete = async (req, res) => {
  const { publicId, type } = req.body;
  let response;
  if (type == "video") {
    response = cloudinary.uploader.destroy(`${type}/${publicId}`, { resource_type: 'video' });
  } else {
    response = cloudinary.uploader.destroy(`${type}/${publicId}`);
  }
  res.status(200).json({ response })
};