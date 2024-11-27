import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Chip } from "@mui/material";

function InventoryTable({ pipelineData }) {
  // Filter out cars with status "Sold"
  const filteredData = useMemo(() => {
    return pipelineData.filter((car) => car.status !== "Sold");
  }, [pipelineData]);

  // Define a function to assign colors to each status
  const getStatusColor = (status) => {
    switch (status) {
      case "Purchased":
        return "blue"; // Change to your preferred color
      case "Transport":
        return "orange"; // Change to your preferred color
      case "Needs Parts":
        return "purple"; // Change to your preferred color
      case "Mechanic":
        return "yellow"; // Change to your preferred color
      case "BodyShop":
        return "teal"; // Change to your preferred color
      case "Detail":
        return "pink"; // Change to your preferred color
      case "Available":
        return "green"; // Keep green for "Available"
      default:
        return "gray"; // Default color for unknown statuses
    }
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
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()} // Display the status text
            style={{
              backgroundColor: getStatusColor(cell.getValue()),
              color: "white",
              fontWeight: "bold",
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={filteredData}
      enableSorting
      enablePagination
    />
  );
}

export default InventoryTable;
