import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import CarTable from './CarTable';
import AddCarButton from './AddCarButton';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CallMergeOutlinedIcon from '@mui/icons-material/CallMergeOutlined';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import Settings from './Settings';
import Pipeline from './Pipeline';
import InventoryTable from './InventoryTable';
import SoldTable from './SoldTable';
import VinField from './VinField';
import InvoiceModal from './InvoiceModal';
import ViewModal from './ViewModal';
import { fetchCarsFromBackend } from './pipelineThunks.jsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser,
    useSession
} from "@clerk/clerk-react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function TabbedTable({ rows, setRows, columns, handleOpen }) {
    const [value, setValue] = useState(0);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewCar, setViewCar] = useState(null);
    const dispatch = useDispatch();
    const { isSignedIn, user } = useUser();
    const hasActiveSubscription = user?.publicMetadata?.subscriptionStatus === 'active';
    const shouldDisableTabs = !isSignedIn || !hasActiveSubscription;
    const navigate = useNavigate();
    const { session } = useSession();

    // Temporarily add this to your frontend to decode the token
    useEffect(() => {
        if (isSignedIn && session) {
            const debugToken = async () => {
                try {
                    const token = await session.getToken({ template: "backend-api" });
                    console.log("JWT Token:", token);

                    // Decode the token to see its contents (without verification)
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log("Token payload:", payload);

                    // Check if the audience is correct
                    console.log("Audience (should be 'backend-api'):", payload.aud);
                    console.log("Issuer:", payload.iss);
                    console.log("User ID:", payload.user_id);

                } catch (error) {
                    console.error("Token debug failed:", error);
                }
            };
            debugToken();
        }
    }, [isSignedIn, session]);

    useEffect(() => {
        if (isSignedIn && session) {
            const fetchCars = async () => {
                try {
                    // ADD the template name exactly as you created it
                    const token = await session.getToken({ template: "backend-api" });
                    console.log("JWT Token:", token);
                    dispatch(fetchCarsFromBackend({ token }));
                } catch (error) {
                    console.error("Failed to get JWT token:", error);
                }
            };
            fetchCars();
        }
    }, [dispatch, isSignedIn, session]);

    const handleChange = (event, newValue) => setValue(newValue);

    const handleViewCar = (car) => {
        setViewCar(car);
        setIsViewModalOpen(true);
    };

    const handleEditCar = (car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleSave = (updatedCar) => {
        // Save logic would go here
        handleModalClose();
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                sx={{
                    // borderBottom: '2px solid #778899'
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#778899',
                        height: '3px',
                    },
                }}
            >
                <Tab icon={<HomeIcon />} label="HOME" sx={styledTab} />
                <Tab icon={<RemoveRedEyeOutlinedIcon />} label="WATCHLIST" sx={styledTab} disabled={shouldDisableTabs} />
                <Tab icon={<CallMergeOutlinedIcon />} label="PIPELINE" sx={styledTab} disabled={shouldDisableTabs} />
                <Tab icon={<DirectionsCarFilledIcon />} label="INVENTORY" sx={styledTab} disabled={shouldDisableTabs} />
                <Tab icon={<AttachMoneyIcon />} label="SOLD" sx={styledTab} disabled={shouldDisableTabs} />
                <Tab icon={<LeaderboardIcon />} label="REPORTS" sx={styledTab} disabled={shouldDisableTabs} />
                <Tab icon={<SettingsIcon />} label="SETTINGS" sx={styledTab} disabled={shouldDisableTabs} />
            </Tabs>


            <TabPanel value={value} index={0}>
                <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', px: 2, py: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold', color: '#778899', mb: 2 }}
                        gutterBottom
                    >
                        WELCOME TO CARVINTORY
                    </Typography>

                    <SignedOut>
                        <Typography
                            variant="body1"
                            sx={{ mb: 3, color: '#555' }}
                        >
                            Please sign in to access your vehicle inventory management system.
                        </Typography>

                        <SignInButton mode="modal" asChild>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#778899',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { backgroundColor: '#5f6f7f' },
                                }}
                            >
                                SIGN IN
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        {!hasActiveSubscription && (
                            <Box sx={{ mt: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ color: '#444', fontWeight: 600, mb: 1 }}
                                    gutterBottom
                                >
                                    UPGRADE TO UNLOCK ALL FEATURES
                                </Typography>

                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#778899',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        px: 5,
                                        py: 1.5,
                                        '&:hover': { backgroundColor: '#5f6f7f' },
                                    }}
                                    onClick={() => navigate('/subscribe')}
                                >
                                    SUBSCRIBE NOW
                                </Button>
                            </Box>
                        )}
                    </SignedIn>
                </Box>
            </TabPanel>
            <SignedIn>
                {hasActiveSubscription ? (
                    <>
                        <TabPanel value={value} index={1}>
                            <Box sx={tabContentStyle}>
                                <AddCarButton handleOpen={handleOpen} />
                                <CarTable data={rows} columns={columns} />
                            </Box>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <VinField />
                            <Pipeline onViewCar={handleViewCar} onEditCar={handleEditCar} />
                        </TabPanel>

                        <TabPanel value={value} index={3}>
                            <InventoryTable onViewCar={handleViewCar} onEditCar={handleEditCar} />
                        </TabPanel>

                        <TabPanel value={value} index={4}>
                            <SoldTable onViewCar={handleViewCar} onEditCar={handleEditCar} />
                        </TabPanel>

                        <TabPanel value={value} index={5}>
                            <Typography>Coming Soon...</Typography>
                        </TabPanel>

                        <TabPanel value={value} index={6}>
                            <Settings />
                        </TabPanel>
                    </>
                ) : (
                    value !== 0 && (
                        <TabPanel value={value} index={value}>
                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Subscription Required
                                </Typography>
                                <Typography paragraph>
                                    Upgrade your account to access this feature
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => window.location.href = "/subscribe"}
                                >
                                    Upgrade Account
                                </Button>
                            </Box>
                        </TabPanel>
                    )
                )}
            </SignedIn>

            <InvoiceModal
                open={isModalOpen}
                onClose={handleModalClose}
                car={selectedCar}
                onSave={handleSave}
            />

            <ViewModal
                open={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                car={viewCar}
            />
        </Box>
    );
}

const styledTab = {
    color: '#778899',
    fontWeight: 500,
    fontSize: '0.75rem',               // Smaller font size
    textTransform: 'none',             // No all-caps
    minHeight: '36px',                 // Reduced tab height
    paddingX: 1.5,                     // Narrow horizontal padding
    paddingY: 0.5,                     // Narrow vertical padding
    '& .MuiTab-iconWrapper': {
        fontSize: '1.5rem',               // Smaller icons
        marginBottom: '0px !important', // Align icon and text
    },
    '&.Mui-selected': {
        color: '#778899',
        fontWeight: 'bold',
    },
    '&:hover': {
        backgroundColor: '#f0f0f0',
        borderRadius: '6px 6px 0 0',
    },
};



const tabContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
};

export default TabbedTable;