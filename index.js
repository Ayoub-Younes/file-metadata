const express = require('express');
const cors = require('cors');
const path = require('path');
const multer  = require('multer');
const fs = require('fs');
require('dotenv').config()
const app = express();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Create upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir ); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize Multer with file size limit (e.g., 10MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    const isSuspiciousFileType = /exe|zip|rar/
    const mimetype = isSuspiciousFileType.test(file.mimetype);

    if (!mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed.'), false);
    }
  }
});

// Single file upload route
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res, next) {
  // Handle missing file error
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Respond with file details
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

app.post('/api/fileanalyse/multiple', upload.array('upfile[]', 5), function (req, res, next) {
  // Handle no files error
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  console.log(req.files)
  // Respond with an array of file details
  const fileDetails = req.files.map(file => ({
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  }));

  res.json(fileDetails);
});

// Error handling middleware for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      // Check if the error is due to file size limit exceeded
      if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Maximun file size is 10MB' });
      }
      // Other Multer errors can also be handled here
      return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
      // An unknown error occurred.
      return res.status(500).json({ error: 'An unknown error occurred' });
  }
  next();
});


// listen for requests
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});