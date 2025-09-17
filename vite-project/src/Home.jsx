import React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import RenderedImage from './assets/RenderedImage.jpeg';

function Home() {
    return (
        <>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Experiencing issues? Contact our support team at support@carvintory.com and we’ll help you out.
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" mt={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        width: "80vw",       // 80% of the viewport width
                        maxWidth: "1200px",  // prevent it from being huge on big screens
                    }}
                >
                    <img
                        src={RenderedImage}
                        alt="Mobile App Coming Soon"
                        style={{
                            width: "100%",   // Image fills the Paper
                            height: "auto",  // Keep aspect ratio
                            display: "block",
                            borderRadius: 10,
                        }}
                    />
                </Paper>
            </Box>


        </>
    )
}

export default Home