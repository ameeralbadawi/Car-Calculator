import React, { useState, useEffect } from 'react';
import VehicleFormModal from './VehicleFormModal';
import { formatCurrency } from './utils';
import TabbedTable from './TabbedTable';
import { IconButton, Menu, MenuItem, Tooltip, Box, Typography} from '@mui/material';
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
import { saveCarToBackend } from './pipelineThunks.jsx';
import Header from './Header';



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

  const handlePurchased = async () => {
    if (!selectedCar) return;

    try {
      const car = selectedCar.car;
      const details = car.details || {};

      // 1. Delete from active watchlist
      await dispatch(deleteCarFromWatchlistThunk({
        watchlistId: activeSheetId,
        carId: car.id,
      })).unwrap();

      // 2. Calculate max bid
      const maxBid =
        (details.mmr || 0) -
        (details.profit || 0) -
        (details.transport || 0) -
        (details.repair || 0) -
        (details.fees || 0);

      // 3. Build the purchased car object
      const purchasedCar = {
        vin: car.vin || '',
        status: 'Purchased',
        Car: {
          CarDetails: {
            vin: car.vin || '',
            year: details.year || '',
            make: details.make || '',
            model: details.model || '',
          },
          EstimateDetails: {
            mmr: details.mmr || 0,
            profit: details.profit || 0,
            transport: details.transport || 0,
            repair: details.repair || 0,
            fees: details.fees || 0,
            maxBid,
            carfaxStatuses: details.carfax_statuses || [],
            autocheckStatuses: details.autocheck_statuses || [],
          },
          PurchaseDetails: {
            purchaseDate: '',
            purchaseFrom: '',
            purchaseLocation: '',
            mileage: '',
            winningBid: '',
            amountPaid: 0,
            buyerName: '',
            stockNumber: '',
            color: '',
            purchaseNotes: '',
          },
          TransportDetails: {
            transporterName: '',
            transporterPhone: '',
            pickupDate: '',
            deliveryDate: '',
            cost: 0,
            transporterNotes: '',
          },
          PartsDetails: {
            parts: [{ part: '', purchasedFrom: '', amount: 0 }],
            partsNotes: '',
          },
          MechanicDetails: {
            mechanicServices: [{ shop: '', service: '', amount: 0 }],
            mechanicNotes: '',
          },
          BodyshopDetails: {
            bodyshopServices: [{ shop: '', service: '', amount: 0 }],
            bodyshopNotes: '',
          },
          MiscellaniousDetails: {
            miscServices: [{ name: '', service: '', amount: 0 }],
            miscNotes: '',
          },
          saleDetails: {
            saleType: '',
            saleDate: '',
            saleAmount: 0,
            sellerFees: 0,
            soldTo: '',
            salesmanName: '',
            commission: 0,
            saleNotes: '',
          }
        }

      };

      // 4. Save to backend
      const result = await dispatch(saveCarToBackend({
        stage: 'Purchased',
        car: purchasedCar,
      })).unwrap();

      // 5. Update UI
      moveToPurchased(result);

      enqueueSnackbar(
        `Successfully purchased ${details.year} ${details.make} ${details.model}`,
        { variant: 'success' }
      );
    } catch (error) {
      console.error('Error in purchase process:', error);
      enqueueSnackbar(
        `Failed to purchase vehicle: ${error.message || 'Unknown error'}`,
        { variant: 'error' }
      );
    } finally {
      handleMenuClose();
    }
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
      <Header/>
      <TabbedTable
        rows={rows}
        columns={columns}
        handleOpen={() => setShowVehicleForm(true)}
        moveToPurchased={moveToPurchased}
        pipelineCars={pipelineCars}
      />


<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  PaperProps={{
    sx: {
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      minWidth: 180,
      mt: 1,
    },
  }}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
  <MenuItem
    onClick={handlePurchased}
    sx={{
      fontWeight: 500,
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: '#f0f4f8',
        color: '#778899',
      },
    }}
  >
    <Typography variant='subtitle2'>PURCHASED</Typography>
  </MenuItem>
  <MenuItem
    onClick={handleDelete}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      '&:hover': {
        backgroundColor: '#ffecec',
      },
    }}
  >
    <DeleteIcon fontSize="small" color="error" />
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
