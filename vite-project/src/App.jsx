import React, { useState } from 'react';
import VehicleFormModal from './VehicleFormModal';
import { formatCurrency } from './utils';
import TabbedTable from './TabbedTable';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux'; // For dispatching actions to the store
import { addCarToStage } from './store'; // Import the action to add car to stages

function App() {
  const [open, setOpen] = useState(false);  // Modal open state
  const [vin, setVin] = useState('');
  const [mmr, setMmr] = useState('');
  const [transport, setTransport] = useState('');
  const [repair, setRepair] = useState('');
  const [carfaxStatus, setCarfaxStatus] = useState('');
  const [profit, setProfit] = useState('');
  const [rows, setRows] = useState([]);
  const [cars, setCars] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pipelineCars, setPipelineCars] = useState([]);
  
  const dispatch = useDispatch();  // Initialize dispatch

  // Open the modal
  const handleOpen = () => setOpen(true);
  
  // Close the modal
  const handleClose = () => setOpen(false);

  const handleMenuOpen = (event, car) => {
    setAnchorEl(event.currentTarget);
    setSelectedCar(car); // Save the selected car's details
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCar(null);
  };

  const handlePurchased = () => {
    // Move car to the Pipeline "Purchased" stage
    moveToPurchased(selectedCar);
    handleMenuClose();
  };

  const moveToPurchased = (car) => {
    console.log("Moving to Purchased:", car);
    setPipelineCars((prevCars) => {
      const updatedPipelineCars = [...prevCars, car];
      console.log("Updated Pipeline Cars:", updatedPipelineCars);
      return updatedPipelineCars;
    });
  };

  const handleSubmit = async () => {
    const parsedMmr = parseFloat(mmr) || 0;
    const parsedProfit = parseFloat(profit) || 0;
    const parsedTransport = parseFloat(transport) || 0;
    const parsedRepair = parseFloat(repair) || 0;
  
    const fees = (parsedMmr - parsedProfit - parsedTransport - parsedRepair) * 0.05;
    const maxBid = parsedMmr - parsedProfit - parsedTransport - parsedRepair - fees;
  
    const vehicleDetails = await fetchVehicleDetails(vin);
  
    const newCar = {
      id: Date.now(), // Generate a unique ID
      vin,
      mmr,
      transport,
      repair,
      fees,
      maxBid,
      carfaxStatus,
      profit,
      ...vehicleDetails,
      status: 'Purchased', // Default status
    };
  
    setRows([...rows, newCar]);
    setCars([...cars, newCar]);
  
    dispatch(addCarToStage({ stage: 'Purchased', car: newCar })); // Dispatch to Redux
  
    setVin('');
    setMmr('');
    setTransport('');
    setRepair('');
    setCarfaxStatus('');
    setProfit('');
    handleClose();
  };
  

  const fetchVehicleDetails = async (vin) => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVIN/${vin}?format=json`);
      const data = await response.json();
      return {
        make: data.Results.find(result => result.Variable === 'Make')?.Value || 'N/A',
        model: data.Results.find(result => result.Variable === 'Model')?.Value || 'N/A',
        year: data.Results.find(result => result.Variable === 'Model Year')?.Value || 'N/A',
      };
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      return { make: 'N/A', model: 'N/A', year: 'N/A' };
    }
  };

  const columns = [
    { accessorKey: 'year', header: 'Year' },
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'model', header: 'Model' },
    { accessorKey: 'vin', header: 'VIN' },
    { accessorKey: 'mmr', header: 'MMR', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    { accessorKey: 'transport', header: 'Transport', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    { accessorKey: 'repair', header: 'Repair', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    { accessorKey: 'fees', header: 'Fees', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    {
      accessorKey: 'maxBid',
      header: 'Max Bid',
      muiTableBodyCellProps: {
        sx: {
          fontWeight: 'bold',
        },
      },
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    { accessorKey: 'carfaxStatus', header: 'Carfax' },
    {
      accessorKey: 'actionsMenu',
      header: 'Actions',
      Cell: ({ row }) => (
        <IconButton onClick={(e) => handleMenuOpen(e, row.original)}>
          <MoreVertIcon />
        </IconButton>
      )
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <TabbedTable rows={rows} setRows={setRows} columns={columns} handleOpen={handleOpen} cars={cars} moveToPurchased={moveToPurchased} pipelineCars={pipelineCars}/>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePurchased}>Purchased</MenuItem>
        {/* Add more menu items as needed */}
      </Menu>
      <VehicleFormModal
        open={open}  // Ensure this is passed to control modal visibility
        handleClose={handleClose}
        vin={vin}
        setVin={setVin}
        mmr={mmr}
        setMmr={setMmr}
        transport={transport}
        setTransport={setTransport}
        repair={repair}
        setRepair={setRepair}
        carfaxStatus={carfaxStatus}
        setCarfaxStatus={setCarfaxStatus}
        profit={profit}
        setProfit={setProfit}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
