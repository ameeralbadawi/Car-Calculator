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
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const ViewModal = ({ open, onClose, car }) => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert('You can only upload up to 10 images.');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      if (combined.length === 1) setSelectedImageIndex(0);
      return combined;
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      if (selectedImageIndex >= updated.length) {
        setSelectedImageIndex(updated.length - 1);
      }
      return updated;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: '#f0f2f5',
          color: '#333',
          px: 3,
          py: 2,
          fontWeight: 600,
          fontSize: '1.25rem',
          borderBottom: '1px solid #ddd',
        }}
      >
        View Vehicle Photos
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#778899',
            '&:hover': { backgroundColor: 'rgba(119,136,153,0.1)' },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography variant="subtitle1" gutterBottom color="#555">
          {car?.year} {car?.make} {car?.model} — {car?.vin}
        </Typography>

        <Button
          variant="outlined"
          component="label"
          sx={{
            borderColor: '#778899',
            color: '#778899',
            textTransform: 'none',
            mb: 2,
            '&:hover': {
              backgroundColor: 'rgba(119,136,153,0.1)',
              borderColor: '#778899',
            },
          }}
        >
          UPLOAD IMAGES
          <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
        </Button>

        <Grid container spacing={2}>
          {/* Left: File name list */}
          <Grid item xs={4}>
            <Box
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: 2,
              }}
            >
              <List dense>
                {images.map((img, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={selectedImageIndex === index}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(119,136,153,0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(119,136,153,0.3)',
                        },
                      },
                    }}
                  >
                    <ListItemText primary={img.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{
                          color: '#778899',
                          '&:hover': {
                            backgroundColor: 'rgba(119,136,153,0.1)',
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Right: Selected image */}
          <Grid item xs={8}>
            {images[selectedImageIndex] ? (
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: 2,
                  border: '2px solid #ccc',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={images[selectedImageIndex].url}
                  alt={`preview-${selectedImageIndex}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ) : (
              <Typography color="text.secondary">No image selected.</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#778899',
            color: '#778899',
            textTransform: 'none',
            mb: 2,
            '&:hover': {
              backgroundColor: 'rgba(119,136,153,0.1)',
              borderColor: '#778899',
            },
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewModal;
