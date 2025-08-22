// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import carvintory_logo from './assets/carvintory_logo.png';

const Header = () => {
    const { user } = useUser();

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: '#778899',
                boxShadow: "none",
                width: "100%",
                margin: 0,
                padding: 0,
            }}
        >
            <Toolbar disableGutters sx={{ minHeight: 64, px: 2, display: 'flex', justifyContent: 'space-between', }}

            >
                {/* Left side: Logo */}
                <Box>
                    <img
                        src={carvintory_logo}
                        alt="Carvintory Logo"
                        style={{
                            height: '100px', // Adjust height as needed
                            width: 'auto', // Maintain aspect ratio
                            cursor: 'pointer' // Optional: if you want it to be clickable
                        }} />
                </Box>

                {/* Right side: Auth buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SignedIn>
                        {user && (
                            <Typography variant="body1" sx={{ mr: 1 }}>
                                Hi, {user.firstName || user.username || 'there'} 👋
                            </Typography>
                        )}
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: {
                                        border: '2px solid #778899',
                                    },
                                    userButtonPopover: {
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    },
                                    userButtonPopoverActionButton: {
                                        color: '#333',
                                        fontWeight: '500',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            backgroundColor: '#f0f2f5',
                                        },
                                    },
                                    userButtonPopoverActionButtonIcon: {
                                        color: '#778899',
                                    },
                                    userButtonPopoverFooter: {
                                        borderTop: '1px solid #e0e0e0',
                                        paddingTop: '6px',
                                    },
                                },
                                variables: {
                                    colorPrimary: '#778899',
                                    colorText: '#333333',
                                    colorBackground: '#ffffff',
                                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                },
                            }}
                        />


                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal" asChild appearance={{
                            elements: {
                                card: {
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                },
                                headerTitle: {
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                    color: '#333',
                                },
                                headerSubtitle: {
                                    fontSize: '0.95rem',
                                    color: '#666',
                                },
                                formButtonPrimary: {
                                    backgroundColor: '#778899',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#5f6f7f' },
                                },
                                formFieldInput: {
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    '&:focus': { borderColor: '#778899', boxShadow: '0 0 0 2px rgba(119,136,153,0.2)' },
                                },
                                footerActionLink: {
                                    color: '#778899',
                                    fontWeight: '500',
                                    '&:hover': { textDecoration: 'underline' },
                                },
                            },
                            variables: {
                                colorPrimary: '#778899',
                                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            }
                        }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#fff',   // white background
                                    color: '#778899',          // text color
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    border: '1px solid #778899', // optional: adds a border for contrast
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0', // light gray hover
                                    },
                                }}
                            >
                                SIGN IN
                            </Button>
                        </SignInButton>

                    </SignedOut>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
