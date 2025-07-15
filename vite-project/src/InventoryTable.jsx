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
  Paper,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCarFromStage } from "./store";

function InventoryTable({ onViewCar, onEditCar }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pipelineData = useSelector((state) =>
    Object.values(state.pipeline.stages)
      .flat()
      .filter((car) => car.status !== "Sold")
  );

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
      dispatch(deleteCarFromStage({ stage: carToDelete.status, carId: carToDelete.id }));
    }
    setIsDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Purchased":
        return theme.palette.primary.main;
      case "Transport":
        return theme.palette.warning.main;
      case "Parts":
        return "#9c27b0";
      case "Mechanic":
        return "#c62828";
      case "Bodyshop":
        return "#00897b";
      case "Detail":
        return "#f06292";
      case "Available":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const columns = [
    {
      header: "Vehicle",
      accessorFn: (row) => `${row.year || ""} ${row.make || ""} ${row.model || ""}`.trim(),
      Cell: ({ cell }) => `${cell.getValue()}`,
    },
    {
      accessorKey: "vin",
      header: "VIN",
    },
    {
      accessorKey: "cost",
      header: "Cost",
      Cell: ({ cell }) => `$${Number(cell.getValue()).toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue()?.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: getStatusColor(cell.getValue()),
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <IconButton onClick={(e) => handleMenuOpen(e, row.original)} size="small">
          <MoreVertIcon />
        </IconButton>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];  

  return (
    <>
      <Box width="90%" mx="auto" mt={2}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
          <MaterialReactTable
            columns={columns}
            data={pipelineData}
            enableSorting
            enablePagination
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: "hidden",
              },
            }}
            muiTableBodyRowProps={{
              sx: {
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: { py: 0.5, px: 1 }, // Compact row padding
            }}
            muiTableHeadCellProps={{
              sx: { py: 0.5, px: 1 },
            }}
          />
        </Paper>
      </Box>

      {/* Action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 160,
          },
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
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error.main">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 2,
            py: 1.5,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            backgroundColor: theme.palette.grey[100],
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2">
            Are you sure you want to delete{" "}
            <Box component="span" fontWeight="bold" color="error.main">
              {carToDelete?.year} {carToDelete?.make} {carToDelete?.model}
            </Box>
            ?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InventoryTable;
