import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
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
import { fetchCarsFromBackend } from './pipelineThunks';
import { useDispatch } from 'react-redux';

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

    useEffect(() => {
        dispatch(fetchCarsFromBackend());
      }, [dispatch]);

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
                <Tab icon={<RemoveRedEyeOutlinedIcon />} label="WATCHLIST" sx={styledTab} />
                <Tab icon={<CallMergeOutlinedIcon />} label="PIPELINE" sx={styledTab} />
                <Tab icon={<DirectionsCarFilledIcon />} label="INVENTORY" sx={styledTab} />
                <Tab icon={<AttachMoneyIcon />} label="SOLD" sx={styledTab} />
                <Tab icon={<LeaderboardIcon />} label="REPORTS" sx={styledTab} />
                <Tab icon={<SettingsIcon />} label="SETTINGS" sx={styledTab} />
            </Tabs>


            <TabPanel value={value} index={0}>
                <Typography>Coming Soon...</Typography>
            </TabPanel>

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