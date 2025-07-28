import React, { useState, useEffect } from 'react';
import VehicleFormModal from './VehicleFormModal';
import { formatCurrency } from './utils';
import TabbedTable from './TabbedTable';
import { IconButton, Menu, MenuItem, Tooltip, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCarFromSheet, setWatchlistCars } from './store';
import {
  fetchWatchlistsFromBackend,
  createWatchlistInBackend,
  addCarToWatchlistThunk,
  fetchCarsInWatchlist,
  deleteCarFromWatchlistThunk
} from './watchlistThunks';
import { saveCarToBackend } from './pipelineThunks';



function App() {
  const activeSheet = useSelector(state =>
    state.sheets.sheets.find(sheet => sheet.id === state.sheets.activeSheetId)
  );

  const rows = activeSheet?.data || [];
  const cars = rows;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pipelineCars, setPipelineCars] = useState([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const dispatch = useDispatch();
  const activeSheetId = useSelector(state => state.sheets.activeSheetId);

  // In your App component
  const transformFetchedCar = (carWrapper) => {
    return {
      car: carWrapper.car // Ensure this matches what your columns expect
    };
  };

  const transformFetchedCars = (cars) => cars.map(carWrapper => ({
    car: carWrapper.car
  }));

  // Load watchlists on mount
  useEffect(() => {
    dispatch(fetchWatchlistsFromBackend()).then((action) => {
      const watchlists = action.payload || [];

      if (watchlists.length === 0) {
        dispatch(createWatchlistInBackend("Sheet 1"));
        dispatch(createWatchlistInBackend("Sheet 2"));
      } else {
        watchlists.forEach((watchlist) => {
          dispatch(fetchCarsInWatchlist(watchlist.id)).then((carAction) => {
            const rawCars = carAction.payload || [];
            const formattedCars = transformFetchedCars(rawCars);

            // Dispatch another action to set transformed cars in state
            dispatch(setWatchlistCars({ watchlistId: watchlist.id, cars: formattedCars }));
          });
        });
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

      setShowVehicleForm(false);
    } catch (error) {
      console.error("Failed to add car to watchlist:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCar) return;
  
    const carId = selectedCar.car?.id || selectedCar.id;
    
    try {
      await dispatch(deleteCarFromWatchlistThunk({ 
        watchlistId: activeSheetId, 
        carId 
      })).unwrap();
      
      // Success case - no need to do anything, UI already updated
    } catch (error) {
      // Error already handled in the thunk
      console.error('Car deletion error:', error);
    }
    
    handleMenuClose();
  };

  const columns = [
    {
      header: 'Vehicle',
      accessorFn: (row) => {
        const details = row.car?.details || {};
        return `${details.year || ""} ${details.make || ""} ${details.model || ""}`.trim();
      },
    },
    {
      header: 'VIN',
      accessorFn: (row) => row.car?.vin || '',
    },
    {
      header: 'RUN #',
      accessorFn: (row) => row.car?.details?.run_number || '',
    },
    {
      header: 'MMR',
      accessorFn: (row) => row.car?.details?.mmr || 0,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      header: 'Profit',
      accessorFn: (row) => row.car?.details?.profit || 0,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
      muiTableBodyCellProps: {
        sx: {
          color: 'success.main',
          fontWeight: 'bold',
        },
      },
    },
    {
      header: 'Transport',
      accessorFn: (row) => row.car?.details?.transport || 0,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      header: 'Repair',
      accessorFn: (row) => row.car?.details?.repair || 0,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      header: 'Fees',
      accessorFn: (row) => row.car?.details?.fees || 0,
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      header: 'Max Bid',
      accessorFn: (row) => {
        const details = row.car?.details || {};
        const mmr = details.mmr || 0;
        const profit = details.profit || 0;
        const transport = details.transport || 0;
        const repair = details.repair || 0;
        const fees = details.fees || 0;

        return mmr - profit - transport - repair - fees;
      },
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      header: 'Carfax',
      accessorFn: (row) => row.car?.details?.carfax_statuses || [],
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
      header: 'Autocheck',
      accessorFn: (row) => row.car?.details?.autocheck_statuses || [],
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
        columns={columns}
        handleOpen={() => setShowVehicleForm(true)}
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
