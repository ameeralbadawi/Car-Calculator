import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { Chip, IconButton, Menu, MenuItem, ListItemIcon  } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCarFromStage } from "./store";

function SoldTable({ onViewCar, onEditCar }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  // Get the stages from the Redux store
  const stages = useSelector((state) => state.pipeline.stages);

  // Filter out cars with status "Sold"
  const filteredData = useMemo(() => {
    return stages["Sold"] || []; // Ensure it handles undefined or empty array gracefully
  }, [stages]);

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

  // // Define a function to assign colors to each status
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "Sold":
  //       return "red"; // Color for Sold status
  //     default:
  //       return "gray";
  //   }
  // };

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

export default SoldTable;
