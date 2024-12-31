import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { Chip } from "@mui/material";

function InventoryTable() {
  // Retrieve data from Redux store
  const stages = useSelector((state) => state.pipeline.stages);

  // Combine cars from all stages into a single array and filter out "Sold"
  const pipelineData = useMemo(() => {
    return Object.values(stages).flat().filter((car) => car.status !== "Sold");
  }, [stages]);

  // Define a function to assign colors to each status
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
      data={pipelineData}
      enableSorting
      enablePagination
    />
  );
}

export default InventoryTable;
