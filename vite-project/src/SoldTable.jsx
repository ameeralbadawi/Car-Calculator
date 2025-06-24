import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { 
  Chip, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCarFromStage } from "./store";

function SoldTable({ onViewCar, onEditCar }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Get the stages from the Redux store
  const stages = useSelector((state) => state.pipeline.stages);

  // Filter out cars with status "Sold"
  const filteredData = useMemo(() => {
    return stages["Sold"] || []; // Ensure it handles undefined or empty array gracefully
  }, [stages]);

  const handleMenuOpen = (event, car) => {
    setAnchorEl(event.currentTarget);
    setCarToDelete(car);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onViewCar(carToDelete);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEditCar(carToDelete);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (carToDelete) {
      dispatch(deleteCarFromStage({ 
        stage: carToDelete.status, 
        carId: carToDelete.id 
      }));
    }
    setIsDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "year", // Accessor key for the data property
        header: "Year",
      },
      {
        accessorKey: "make",
        header: "Make",
      },
      {
        accessorKey: "model",
        header: "Model",
      },
      {
        accessorKey: "vin",
        header: "VIN",
      },
      {
        accessorKey: "saleAmount",
        header: "Sold For",
        Cell: ({ cell }) => `$${Number(cell.getValue()).toFixed(2)}`
      },
      {
        accessorKey: "netProfit",
        header: "Net Profit",
        Cell: ({ cell }) => `$${Number(cell.getValue()).toFixed(2)}`
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <>
            <IconButton onClick={(e) => handleMenuOpen(e, row.original)}>
              <MoreVertIcon />
            </IconButton>
          </>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={filteredData} // Display only the cars with the status "Sold"
        enableSorting
        enablePagination
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
            sx: {
                borderRadius: "12px",
                padding: "16px",
                minWidth: "400px"
            }
        }}
      >
        <DialogTitle sx={{ 
            fontWeight: "bold", 
            padding: "16px 16px 8px",
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.grey[200]}`
        }}>
            Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
            <Typography>
                Are you sure you want to delete{" "}
                <Box component="span" fontWeight="bold" color={theme.palette.error.main}>
                    {carToDelete?.year} {carToDelete?.make} {carToDelete?.model}
                </Box>?
            </Typography>
        </DialogContent>
        <DialogActions sx={{ 
            padding: "8px 16px 16px",
            borderTop: `1px solid ${theme.palette.grey[200]}`
        }}>
            <Button 
                onClick={() => setIsDeleteDialogOpen(false)}
                sx={{ 
                    color: theme.palette.text.secondary,
                    "&:hover": { 
                        backgroundColor: theme.palette.grey[100] 
                    }
                }}
            >
                Cancel
            </Button>
            <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                sx={{
                    backgroundColor: theme.palette.error.main,
                    "&:hover": { 
                        backgroundColor: theme.palette.error.dark 
                    }
                }}
            >
                Delete
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SoldTable;