import React, { useState } from 'react';
import VehicleFormModal from './VehicleFormModal';
import { formatCurrency } from './utils';
import TabbedTable from './TabbedTable';
import { IconButton, Menu, MenuItem, Tooltip, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { addCarToSheet, deleteCarFromSheet } from './store';
import { saveCarToBackend } from './pipelineThunks'; // update the path as needed


const formatMake = (make) => {
  if (!make || typeof make !== 'string') return 'N/A';
  return make.charAt(0).toUpperCase() + make.slice(1).toLowerCase();
};

function App() {
  const [open, setOpen] = useState(false);
  const [vin, setVin] = useState('');
  const [mmr, setMmr] = useState('');
  const [transport, setTransport] = useState('');
  const [repair, setRepair] = useState('');
  const [carfaxStatuses, setCarfaxStatuses] = useState([]);
  const [autocheckStatuses, setAutocheckStatuses] = useState([]);
  const [profit, setProfit] = useState(0);
  const [rows, setRows] = useState([]);
  const [cars, setCars] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pipelineCars, setPipelineCars] = useState([]);

  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMenuOpen = (event, car) => {
    setAnchorEl(event.currentTarget);
    setSelectedCar(car);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCar(null);
  };

  const handlePurchased = () => {
    if (!selectedCar) return;
    
    // Create a new car object with status (only for purchased cars)
    const purchasedCar = {
      ...selectedCar,
      status: 'Purchased' // Adding status only here
    };

    // Update the rows state (keeping original rows)
    setRows(rows.filter(row => row.id !== selectedCar.id));
    
    // Update the cars state
    setCars(cars.map(car => 
      car.id === selectedCar.id ? purchasedCar : car
    ));

    // Add to pipeline
    moveToPurchased(purchasedCar);
    
    // Dispatch to Redux
    dispatch(deleteCarFromSheet({ carId: selectedCar.id })); // Remove from sheet
    dispatch(saveCarToBackend({ stage: 'Purchased', car: purchasedCar }));
    
    handleMenuClose();
  };

  const moveToPurchased = (car) => {
    setPipelineCars((prevCars) => [...prevCars, car]);
  };

  const handleSubmit = async ({ 
    vin, 
    runNumber,
    mmr, 
    transport, 
    repair, 
    profit, 
    fees, 
    carfaxStatuses, 
    autocheckStatuses 
  }) => {
    const parsedMmr = parseFloat(mmr) || 0;
    const parsedProfit = parseFloat(profit) || 0;
    const parsedTransport = parseFloat(transport) || 0;
    const parsedRepair = parseFloat(repair) || 0;
    const parsedFees = parseFloat(fees) || 0;
  
    const maxBid = parsedMmr - parsedProfit - parsedTransport - parsedRepair - parsedFees;
  
    const vehicleDetails = await fetchVehicleDetails(vin);
  
    const newCar = {
      id: Date.now(),
      vin,
      runNumber: runNumber || null,
      mmr: parsedMmr,
      transport: parsedTransport,
      repair: parsedRepair,
      fees: parsedFees,
      maxBid,
      profit: parsedProfit,
      carfaxStatuses,
      autocheckStatuses,
      ...vehicleDetails
      // No status property here
    };
  
    // Dispatch to add to the active sheet in Redux
    dispatch(addCarToSheet({ car: newCar }));
    
    // // Dispatch to add to the Purchased stage in pipeline
    // dispatch(addCarToStage({ stage: 'Purchased', car: newCar }));
  
    // Update local state if still needed
    setRows([...rows, newCar]);
    setCars([...cars, newCar]);
    handleClose();
  };

  const fetchVehicleDetails = async (vin) => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVIN/${vin}?format=json`);
      const data = await response.json();
      return {
        make: formatMake(data.Results.find(result => result.Variable === 'Make')?.Value || 'N/A'),
        model: data.Results.find(result => result.Variable === 'Model')?.Value || 'N/A',
        year: data.Results.find(result => result.Variable === 'Model Year')?.Value || 'N/A',
      };
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      return { make: 'N/A', model: 'N/A', year: 'N/A' };
    }
  };

  const handleDelete = () => {
    if (!selectedCar) return;
    
    // Update local state
    setRows(rows.filter(row => row.id !== selectedCar.id));
    setCars(cars.filter(car => car.id !== selectedCar.id));
    
    // Dispatch to Redux
    dispatch(deleteCarFromSheet({ carId: selectedCar.id }));
    
    handleMenuClose();
  };

  const columns = [
    {
      header: "Vehicle",
      accessorFn: (row) => `${row.year || ""} ${row.make || ""} ${row.model || ""}`.trim(),
      Cell: ({ cell }) => `${cell.getValue()}`,
    },
    { accessorKey: 'vin', header: 'VIN' },
    { accessorKey: 'runNumber', header: 'RUN #'},
    { 
      accessorKey: 'mmr', 
      header: 'MMR', 
      Cell: ({ cell }) => formatCurrency(cell.getValue()) 
    },
    { 
      accessorKey: 'profit',
      header: 'Profit',
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
      muiTableBodyCellProps: {
        sx: {
          color: 'success.main',
          fontWeight: 'bold'
        }
      }
    },
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
    { 
      accessorKey: 'carfaxStatuses', 
      header: 'Carfax',
      Cell: ({ cell }) => {
        const statuses = cell.getValue();
        if (!statuses || statuses.length === 0) return 'N/A';
        
        return (
          <Tooltip 
            title={statuses.join(', ')} 
            placement="top" 
            arrow
            disableInteractive
          >
            <Box sx={{ 
              maxWidth: '150px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {statuses.length > 2 
                ? `${statuses.slice(0, 2).join(', ')}...` 
                : statuses.join(', ')}
            </Box>
          </Tooltip>
        );
      }
    },
    { 
      accessorKey: 'autocheckStatuses', 
      header: 'Autocheck',
      Cell: ({ cell }) => {
        const statuses = cell.getValue();
        if (!statuses || statuses.length === 0) return 'N/A';
        
        return (
          <Tooltip 
            title={statuses.join(', ')} 
            placement="top" 
            arrow
            disableInteractive
          >
            <Box sx={{ 
              maxWidth: '150px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }}>
              {statuses.length > 2 
                ? `${statuses.slice(0, 2).join(', ')}...` 
                : statuses.join(', ')}
            </Box>
          </Tooltip>
        );
      }
    },
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
      <TabbedTable 
        rows={rows} 
        setRows={setRows} 
        columns={columns} 
        handleOpen={handleOpen} 
        cars={cars} 
        moveToPurchased={moveToPurchased} 
        pipelineCars={pipelineCars} 
      />
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  PaperProps={{
    sx: {
      minWidth: 180,
      borderRadius: 2,
      py: 1,
      boxShadow: 3,
    },
  }}
>
  <MenuItem
    onClick={handlePurchased}
    sx={{
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: '#778899',
      '&:hover': {
        backgroundColor: '#778899',
        color: 'white',
      },
    }}
  >
    PURCHASED
  </MenuItem>

  <MenuItem
    onClick={handleDelete}
    sx={{
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'error.main',
        '& .MuiSvgIcon-root': {
          color: '#fff',
        },
      },
    }}
  >
    <IconButton size="small">
      <DeleteIcon fontSize="small" color='error'/>
    </IconButton>
  </MenuItem>
</Menu>

      <VehicleFormModal
        open={open}
        handleClose={handleClose}
        vin={vin}
        setVin={setVin}
        mmr={mmr}
        setMmr={setMmr}
        transport={transport}
        setTransport={setTransport}
        repair={repair}
        setRepair={setRepair}
        carfaxStatuses={carfaxStatuses}
        setCarfaxStatuses={setCarfaxStatuses}
        autocheckStatuses={autocheckStatuses}
        setAutocheckStatuses={setAutocheckStatuses}
        profit={profit}
        setProfit={setProfit}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;