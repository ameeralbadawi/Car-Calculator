import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close, ArrowBack, ArrowForward } from '@mui/icons-material';

const ViewModal = ({ open, onClose, car }) => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert('You can only upload up to 10 images.');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (selectedImageIndex === indexToRemove) {
      setSelectedImageIndex(null);
    }
  };

  const openFullScreen = (index) => {
    setSelectedImageIndex(index);
  };

  const closeFullScreen = () => {
    setSelectedImageIndex(null);
  };

  const showPrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const showNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      {/* Main View Modal */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          View Vehicle Photos
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {car?.year} {car?.make} {car?.model} - {car?.vin}
          </Typography>

          <Button variant="outlined" component="label">
            Upload Images
            <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
          </Button>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 150,
                  height: 100,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => openFullScreen(index)}
              >
                <img
                  src={img.url}
                  alt={`upload-${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening fullscreen on delete
                    removeImage(index);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Full-Screen Image Viewer */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={closeFullScreen}
        fullScreen
        PaperProps={{
          sx: { backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        }}
      >
        {selectedImageIndex !== null && (
          <>
            <IconButton
              onClick={closeFullScreen}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                color: 'white',
                zIndex: 2,
              }}
            >
              <Close />
            </IconButton>

            <IconButton
              onClick={showPrevImage}
              sx={{
                position: 'absolute',
                left: 20,
                color: 'white',
                zIndex: 2,
              }}
            >
              <ArrowBack fontSize="large" />
            </IconButton>

            <Box
              component="img"
              src={images[selectedImageIndex].url}
              alt={`fullscreen-${selectedImageIndex}`}
              sx={{ maxHeight: '90%', maxWidth: '90%', borderRadius: 2 }}
            />

            <IconButton
              onClick={showNextImage}
              sx={{
                position: 'absolute',
                right: 20,
                color: 'white',
                zIndex: 2,
              }}
            >
              <ArrowForward fontSize="large" />
            </IconButton>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ViewModal;
