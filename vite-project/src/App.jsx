import React, { useState, useEffect } from 'react';
import VehicleFormModal from './VehicleFormModal';
import { formatCurrency } from './utils';
import TabbedTable from './TabbedTable';
import { IconButton, Menu, MenuItem, Tooltip, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCarToSheet,
  deleteCarFromSheet
} from './store';
import {
  fetchWatchlistsFromBackend,
  createWatchlistInBackend,
  addCarToWatchlistThunk
} from './watchlistThunks';
import { saveCarToBackend } from './pipelineThunks';



function App() {
  const [rows, setRows] = useState([]);
  const [cars, setCars] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pipelineCars, setPipelineCars] = useState([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const dispatch = useDispatch();
  const activeSheetId = useSelector(state => state.sheets.activeSheetId);

  // Load watchlists on mount
  useEffect(() => {
    dispatch(fetchWatchlistsFromBackend()).then((action) => {
      if (action.payload?.length === 0) {
        dispatch(createWatchlistInBackend("Sheet 1"));
        dispatch(createWatchlistInBackend("Sheet 2"));
      }
    });
  }, [dispatch]);

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

    const purchasedCar = {
      ...selectedCar,
      status: 'Purchased'
    };

    setRows(rows.filter(row => row.id !== selectedCar.id));
    setCars(cars.map(car =>
      car.id === selectedCar.id ? purchasedCar : car
    ));

    moveToPurchased(purchasedCar);

    dispatch(deleteCarFromSheet({ carId: selectedCar.id }));
    dispatch(saveCarToBackend({ stage: 'Purchased', car: purchasedCar }));

    handleMenuClose();
  };

  const moveToPurchased = (car) => {
    setPipelineCars((prevCars) => [...prevCars, car]);
  };
  

  const handleAddCarToWatchlist = async (carData) => {
    try {
      // Destructure vin and run_number separately, gather the rest as "details"
      const { vin, run_number, ...rest } = carData;
  
      // Wrap everything except vin inside details, but also include run_number in details
      // (run_number is part of details in your backend model)
      const payload = {
        vin,
        details: {
          run_number,
          ...rest
        }
      };
  
      const response = await dispatch(addCarToWatchlistThunk({
        watchlistId: activeSheetId,
        carData: payload
      })).unwrap();
  
      // response.car contains the full car record saved
      const fullCar = response.car;
  
      setRows((prev) => [...prev, fullCar]);
      setCars((prev) => [...prev, fullCar]);
      setShowVehicleForm(false);
    } catch (error) {
      console.error("Failed to add car to watchlist:", error);
    }
  };
  
  

  const handleDelete = () => {
    if (!selectedCar) return;

    setRows(rows.filter(row => row.id !== selectedCar.id));
    setCars(cars.filter(car => car.id !== selectedCar.id));
    dispatch(deleteCarFromSheet({ carId: selectedCar.id }));

    handleMenuClose();
  };

  const columns = [
    {
      header: 'Vehicle',
      accessorFn: (row) => {
        return `${row.car.details.year || ""} ${row.car.details.make || ""} ${row.car.details.model || ""}`.trim();
      },
    },    
    { accessorKey: 'car.vin', header: 'VIN' },
    { accessorKey: 'car.details.run_number', header: 'RUN #' },
    {
      accessorKey: 'car.details.mmr',
      header: 'MMR',
      Cell: ({ cell }) => formatCurrency(cell.getValue())
    },
    {
      accessorKey: 'car.details.profit',
      header: 'Profit',
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
      muiTableBodyCellProps: {
        sx: {
          color: 'success.main',
          fontWeight: 'bold'
        }
      }
    },
    { accessorKey: 'car.details.transport', header: 'Transport', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    { accessorKey: 'car.details.repair', header: 'Repair', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    { accessorKey: 'car.details.fees', header: 'Fees', Cell: ({ cell }) => formatCurrency(cell.getValue()) },
    {
      header: 'Max Bid',
      accessorFn: (row) => {
        const details = row?.car?.details || {};
        const {
          mmr = 0,
          profit = 0,
          transport = 0,
          repair = 0,
          fees = 0,
        } = details;
    
        return mmr - profit - transport - repair - fees;
      },
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: 'car.details.carfax_statuses',
      header: 'Carfax',
      Cell: ({ cell }) => {
        const statuses = cell.getValue();
        if (!statuses || statuses.length === 0) return 'N/A';
        return (
          <Tooltip title={statuses.join(', ')} placement="top" arrow disableInteractive>
            <Box sx={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {statuses.length > 2 ? `${statuses.slice(0, 2).join(', ')}...` : statuses.join(', ')}
            </Box>
          </Tooltip>
        );
      }
    },
    {
      accessorKey: 'car.details.autocheck_statuses',
      header: 'Autocheck',
      Cell: ({ cell }) => {
        const statuses = cell.getValue();
        if (!statuses || statuses.length === 0) return 'N/A';
        return (
          <Tooltip title={statuses.join(', ')} placement="top" arrow disableInteractive>
            <Box sx={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {statuses.length > 2 ? `${statuses.slice(0, 2).join(', ')}...` : statuses.join(', ')}
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
        handleOpen={() => setShowVehicleForm(true)}
        cars={cars}
        moveToPurchased={moveToPurchased}
        pipelineCars={pipelineCars}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handlePurchased}>PURCHASED</MenuItem>
        <MenuItem onClick={handleDelete}>
          <IconButton size="small"><DeleteIcon fontSize="small" color='error' /></IconButton>
        </MenuItem>
      </Menu>

      <VehicleFormModal
        open={showVehicleForm}
        onClose={() => setShowVehicleForm(false)}
        onSubmit={handleAddCarToWatchlist}
      />
    </div>
  );
}

export default App;
