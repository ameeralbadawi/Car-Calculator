import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Typography, Card, CardContent } from "@mui/material";

const predefinedStages = [
    "Purchased",
    "Transport",
    "Needs Parts",
    "Mechanic",
    "Bodyshop",
    "Detail",
    "Available",
    "Sold",
];

function Pipeline({ rows, setRows }) {
    const [stages, setStages] = useState({});

    useEffect(() => {
        if (!stages || Object.values(stages).every((stage) => stage.length === 0)) {
            const groupedStages = predefinedStages.reduce((acc, stage) => {
                acc[stage] = [];
                return acc;
            }, {});
    
            rows.forEach((car) => {
                const stage = car.status || "Uncategorized";
                if (!groupedStages[stage]) {
                    groupedStages[stage] = [];
                }
                groupedStages[stage].push({
                    id: car.vin,
                    year: car.year,
                    make: car.make,
                    model: car.model,
                });
            });
    
            console.log("Initialized Stages:", groupedStages);
            setStages(groupedStages);
        }
    }, [rows]);
    


    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
    
        if (!destination) {
            // If item is dropped outside a droppable area
            return;
        }
    
        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;
    
        if (sourceStage === destinationStage) {
            // No change in stage, do nothing
            return;
        }
    
        const movedItem = stages[sourceStage].find((item) => item.id === draggableId);
    
        if (!movedItem) {
            console.error("Item not found in source stage");
            return;
        }
    
        // Remove item from source stage
        const updatedSourceStage = stages[sourceStage].filter(
            (item) => item.id !== movedItem.id
        );
    
        // Add item to destination stage
        const updatedDestinationStage = [...stages[destinationStage], movedItem];
    
        // Update stages
        const updatedStages = {
            ...stages,
            [sourceStage]: updatedSourceStage,
            [destinationStage]: updatedDestinationStage,
        };
    
        setStages(updatedStages);
    
        // Update rows
        const updatedRows = rows.map((row) =>
            row.vin === draggableId ? { ...row, status: destinationStage } : row
        );
        setRows(updatedRows);
    
        console.log("Stages Updated:", updatedStages);
        console.log("Rows Updated:", updatedRows);
    };
       

    return (
        <Box
            sx={{
                display: "flex",
                overflowX: "auto",
                padding: "20px",
            }}
        >
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.keys(stages).map((stage) => (
                    <Droppable droppableId={stage} key={stage}>
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{
                                    width: "140px",
                                    backgroundColor: "#f5f5f5",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    boxShadow: 3,
                                    textAlign: "center",
                                    marginRight: "10px",
                                }}
                            >
                                <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                    {stage}
                                </Typography>
                                {stages[stage].map((car, index) => (
                                    <Draggable
                                        draggableId={car.id}
                                        index={index}
                                        key={car.id}
                                    >
                                        {(provided) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    marginBottom: "10px",
                                                    backgroundColor: "#ffffff",
                                                    boxShadow: 7,
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="body1">{car.year} {car.make} {car.model}</Typography>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </Box>
    );
}

export default Pipeline;
