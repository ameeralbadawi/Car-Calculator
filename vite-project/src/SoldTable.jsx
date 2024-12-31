import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { Chip } from "@mui/material";

function SoldTable() {
  // Get the stages from the Redux store
  const stages = useSelector((state) => state.pipeline.stages);

  // Filter out cars with status "Sold"
  const filteredData = useMemo(() => {
    return stages["Sold"] || []; // Ensure it handles undefined or empty array gracefully
  }, [stages]);

  // Define a function to assign colors to each status
  const getStatusColor = (status) => {
    switch (status) {
      case "Sold":
        return "red"; // Color for Sold status
      default:
        return "gray";
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
      data={filteredData} // Display only the cars with the status "Sold"
      enableSorting
      enablePagination
    />
  );
}

export default SoldTable;
