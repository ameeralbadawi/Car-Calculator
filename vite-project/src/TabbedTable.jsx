// TabbedTable.jsx
import React from 'react';
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
import Settings from './Settings';
import Pipeline from './Pipeline';
import InventoryTable from './InventoryTable';
import SoldTable from './SoldTable';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function TabbedTable({ rows, setRows, columns, handleOpen, cars, moveToPurchased, pipelineCars}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="car management tabs" sx={{
                '& .MuiTabs-indicator': { backgroundColor: 'black' }, // indicator color
                borderBottom: '2px solid black', // Outline at the bottom
            }}>

                <Tab icon={<RemoveRedEyeOutlinedIcon />} label="Watchlist" sx={{
                    color: 'white', // Text color
                    backgroundColor: 'white', // Tab background color
                    // border: '1px solid black', // Tab outline
                    borderBottom: 'none', // Remove bottom border to connect with indicator
                    // fontWeight: 'bold',
                    '-webkit-text-stroke': '0.6px black', // Text outline
                    '& .MuiSvgIcon-root': {
                        color: 'black', // Style the icon color
                    },
                    '&.Mui-selected': {
                        '-webkit-text-stroke': '1.2px black', // Text outline
                        color: 'white', // Selected text color (if needed for contrast)
                        fontWeight: 'bold',
                    },
                }} />
                <Tab icon={<CallMergeOutlinedIcon />} label="Pipeline" sx={{
                    color: 'black', // default color
                    '&.Mui-selected': { color: 'black', fontWeight: 'bold' }, // color when selected
                }} />
                <Tab icon={<DirectionsCarFilledIcon />} label="Inventory" sx={{
                    color: 'red', // default color
                    '&.Mui-selected': { color: 'red', fontWeight: 'bold' }, // color when selected
                }} />
                <Tab icon={<AttachMoneyIcon />} label="Sold" sx={{
                    color: 'green', // default color
                    '&.Mui-selected': { color: 'green', fontWeight: 'bold' }, // color when selected
                }} />
                <Tab icon={<LeaderboardIcon />} label="Reports" sx={{
                    color: 'grey', // default color
                    '&.Mui-selected': { color: 'grey', fontWeight: 'bold' }, // color when selected
                }} />
                <Tab icon={<SettingsIcon />} label="Settings" sx={{
                    color: 'black', // default color
                    '&.Mui-selected': { color: 'black', fontWeight: 'bold' }, // color when selected
                }} />
            </Tabs>

            <TabPanel value={value} index={0}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // centers children horizontally
                    gap: 2, // adds spacing between button and table
                }}>
                    {/* Watchlist Tab Content */}
                    <AddCarButton handleOpen={handleOpen} />  {/* Add Car Button */}
                    <CarTable data={rows} columns={columns} />  {/* Car Table */}
                </Box>
            </TabPanel>

            <TabPanel value={value} index={1}>
                {/* Pipeline Tab Content */}
                <Pipeline rows={pipelineCars} setRows={setRows} cars={cars} moveToPurchased={moveToPurchased} />
            </TabPanel>

            <TabPanel value={value} index={2}>
                {/* Inventory Tab Content */}
                <InventoryTable pipelineData={pipelineCars}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                {/* Sold Tab Content */}
                <SoldTable pipelineData={pipelineCars}/>
            </TabPanel>
            <TabPanel value={value} index={4}>
                {/* Reports Tab Content, create Reports.jsx */}
                <Typography>
                    Reports
                </Typography>
            </TabPanel>
            <TabPanel value={value} index={5}>
                {/* Settings Tab Content */}
                <Settings />
            </TabPanel>
        </Box>
    );
}

export default TabbedTable;
