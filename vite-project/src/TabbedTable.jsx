import React, { useState } from 'react';
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
            <Tabs value={value} onChange={handleChange} sx={{
                '& .MuiTabs-indicator': { backgroundColor: 'black' },
                borderBottom: '2px solid black',
            }}>
                {/* Tab definitions remain the same */}
                <Tab icon={<HomeIcon />} label="Home" sx={tabStyle('black')} />
                <Tab icon={<RemoveRedEyeOutlinedIcon />} label="Watchlist" sx={watchlistTabStyle} />
                <Tab icon={<CallMergeOutlinedIcon />} label="Pipeline" sx={tabStyle('black')} />
                <Tab icon={<DirectionsCarFilledIcon />} label="Inventory" sx={tabStyle('red')} />
                <Tab icon={<AttachMoneyIcon />} label="Sold" sx={tabStyle('green')} />
                <Tab icon={<LeaderboardIcon />} label="Reports" sx={tabStyle('grey')} />
                <Tab icon={<SettingsIcon />} label="Settings" sx={tabStyle('black')} />
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
                <SoldTable onViewCar={handleViewCar} onEditCar={handleEditCar}/>
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

// Style helper functions
const tabStyle = (color) => ({
    color,
    '&.Mui-selected': { color, fontWeight: 'bold' },
});

const watchlistTabStyle = {
    color: 'white',
    backgroundColor: 'white',
    borderBottom: 'none',
    '-webkit-text-stroke': '0.6px black',
    '& .MuiSvgIcon-root': { color: 'black' },
    '&.Mui-selected': {
        '-webkit-text-stroke': '1.2px black',
        color: 'white',
        fontWeight: 'bold',
    },
};

const tabContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
};

export default TabbedTable;