const Appointment = require('../models/Appointment');
const path = require('path');

const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create file URL for local storage
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { 
        $push: { 
          reports: { 
            name: req.file.originalname, 
            url: fileUrl, 
            uploadedAt: new Date(),
            size: req.file.size,
            type: req.file.mimetype
          } 
        } 
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ 
      message: 'Report uploaded successfully', 
      appointment,
      file: {
        name: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) { 
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message }); 
  }
};

module.exports = { uploadReport };
