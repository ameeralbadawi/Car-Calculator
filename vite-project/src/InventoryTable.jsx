import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { 
  Chip, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon 
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCarFromStage } from "./store";

function InventoryTable({ onViewCar, onEditCar }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  // Get all non-sold cars from Redux (original data source)
  const pipelineData = useSelector((state) => {
    return Object.values(state.pipeline.stages).flat().filter((car) => car.status !== "Sold");
  });

  const handleMenuOpen = (event, car) => {
    setAnchorEl(event.currentTarget);
    setSelectedCar(car);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCar(null);
  };

  const handleView = () => {
    onViewCar(selectedCar);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEditCar(selectedCar);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedCar) {
      dispatch(deleteCarFromStage({ 
        stage: selectedCar.status, 
        carId: selectedCar.id 
      }));
    }
    handleMenuClose();
  };

  // Original status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Purchased":
        return "blue";
      case "Transport":
        return "orange";
      case "Needs Parts":
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
      
      {/* Original action menu styling */}
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
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

export default InventoryTable;