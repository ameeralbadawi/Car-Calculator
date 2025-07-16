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
import Tooltip from "@mui/material/Tooltip";
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

  const calculateTotalCost = (car) => {
    const partsTotal = (car.parts || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const mechanicTotal = (car.mechanicServices || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const bodyshopTotal = (car.bodyshopServices || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const miscTotal = (car.miscServices || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

    const amountPaid = parseFloat(car.amountPaid) || 0;
    const transport = parseFloat(car.cost) || 0;
    const sellerFees = parseFloat(car.sellerFees) || 0;

    return amountPaid + transport + partsTotal + mechanicTotal + bodyshopTotal + miscTotal + sellerFees;
};

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
      header: "Cost",
      accessorFn: (car) => calculateTotalCost(car), // raw number
      Cell: ({ cell }) => `$${Number(cell.getValue()).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
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
      p: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: 1,
    },
  }}
>
  <Tooltip title="View">
    <IconButton onClick={handleView} size="small" sx={{ color: "#778899" }}>
      <VisibilityIcon fontSize="small" />
    </IconButton>
  </Tooltip>

  <Tooltip title="Edit">
    <IconButton onClick={handleEdit} size="small" sx={{ color: "#778899" }}>
      <EditIcon fontSize="small" />
    </IconButton>
  </Tooltip>

  <Tooltip title="Delete">
    <IconButton onClick={handleDeleteClick} size="small" color="error">
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Tooltip>
</Menu>

      {/* Delete Dialog */}
      <Dialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 3,
      px: 0,
      py: 0,
      minWidth: 420,
      overflow: "hidden",
      boxShadow: 10,
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 600,
      px: 3,
      py: 2.5,
      fontSize: "1.125rem",
      bgcolor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.divider}`,
    }}
  >
    Confirm Deletion
  </DialogTitle>

  <DialogContent sx={{ px: 3, py: 2 }}>
    <Typography variant="body1" gutterBottom>
      Are you sure you want to remove the following vehicle?
    </Typography>
    <Typography
      variant="h6"
      fontWeight={600}
      color="error"
      sx={{
        mt: 1,
        px: 1.5,
        py: 1,
        backgroundColor: theme.palette.grey[100],
        borderRadius: 2,
        fontSize: "0.95rem",
      }}
    >
      {carToDelete?.year} {carToDelete?.make} {carToDelete?.model} - {carToDelete?.vin.slice(-8)}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 1.5 }}
    >
      This action is permanent and cannot be undone.
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      py: 1.5,
      bgcolor: theme.palette.background.default,
      borderTop: `1px solid ${theme.palette.divider}`,
    }}
  >
    <Button
      onClick={() => setIsDeleteDialogOpen(false)}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.grey[100],
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleDeleteConfirm}
      variant="contained"
      color="error"
      sx={{ textTransform: "none", fontWeight: 500 }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

</>
  );
}

export default InventoryTable;
