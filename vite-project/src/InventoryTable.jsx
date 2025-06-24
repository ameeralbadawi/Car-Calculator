import React, { useState } from "react";
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

function InventoryTable({ onViewCar, onEditCar }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get all non-sold cars from Redux (original data source)
  const pipelineData = useSelector((state) => {
    return Object.values(state.pipeline.stages).flat().filter((car) => car.status !== "Sold");
  });

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

  // Original status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Purchased":
        return "blue";
      case "Transport":
        return "orange";
      case "Parts":
        return "purple";
      case "Mechanic":
        return "darkred";
      case "Bodyshop":
        return "teal";
      case "Detail":
        return "pink";
      case "Available":
        return "green";
      default:
        return "gray";
    }
  };

  // Original column definitions
  const columns = [
    {
      accessorKey: "year",
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
      accessorKey: "cost",
      header: "Cost",
      Cell: ({ cell }) => `$${Number(cell.getValue()).toFixed(2)}`
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue()}
          style={{
            backgroundColor: getStatusColor(cell.getValue()),
            color: "white",
            fontWeight: "bold",
          }}
        />
      ),
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
  ];

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={pipelineData}
        enableSorting
        enablePagination
      />
      
      {/* Action menu */}
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
          View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
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

export default InventoryTable;