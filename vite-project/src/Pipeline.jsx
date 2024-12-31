import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { moveCarBetweenStages } from "./store";

function Pipeline() {
    const dispatch = useDispatch();

    // Get the stages from the Redux store
    const stages = useSelector((state) => state.pipeline.stages);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return; // If dropped outside a droppable area, do nothing

        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;

        if (sourceStage === destinationStage && source.index === destination.index)
            return; // If dropped in the same position, do nothing

        console.log(
            `Car with ID ${draggableId} moved from "${sourceStage}" to "${destinationStage}"`
        );        

        // Dispatch the action to move the car and update its status
        dispatch(
            moveCarBetweenStages({
                sourceStage,
                destinationStage,
                carId: parseInt(draggableId), // Convert draggableId back to a number if necessary
            })
        );
    };

    return (
        <Box sx={{ display: "flex", overflowX: "auto", padding: "20px" }}>
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
                                        draggableId={String(car.id)} // Use string IDs consistently
                                        index={index}
                                        key={car.id} // Ensure each card has a unique key
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
                                                    <Typography variant="body1">
                                                        {car.year} {car.make} {car.model}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                    >
                                                        Status: {car.status}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder} {/* Ensures proper spacing when dragging */}
                            </Box>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </Box>
    );
}

export default Pipeline;
