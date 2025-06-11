import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { moveCarBetweenStages, deleteCarFromStage } from "./store";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import InvoiceModal from "./InvoiceModal"; // Adjust the path if needed
import ViewModal from "./ViewModal";


function Pipeline() {
    const dispatch = useDispatch();
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewCar, setViewCar] = useState(null);
    const [carToDelete, setCarToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


    const handleViewClick = (car) => {
        setViewCar(car);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleSave = (updatedCar) => {
        console.log("Updated car:", updatedCar);
        // Dispatch or update the car details in the Redux store
    };


    // Get the stages from the Redux store
    const stages = useSelector((state) => state.pipeline.stages);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return; // If dropped outside a droppable area, do nothing

        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;

        if (sourceStage === destinationStage && source.index === destination.index)
            return; // If dropped in the same position, do nothing

        dispatch(
            moveCarBetweenStages({
                sourceStage,
                destinationStage,
                carId: parseInt(draggableId), // Convert draggableId back to a number if necessary
            })
        );
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${Object.keys(stages).length}, 1fr)`,
                width: "100%",
                height: "calc(100vh - 80px)",
                backgroundColor: "#f8f9fa",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRight: "1px solid #e0e0e0",
                                    "&:last-child": { borderRight: "none" },
                                    overflowY: "auto",
                                    backgroundColor: "#ffffff",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        backgroundColor: "#232c31", // Replace with your desired color (e.g., teal-blue)
                                        color: "#ffffff", // White text for better contrast
                                        padding: "8px",
                                        textTransform: "uppercase", // Optional: Make the text uppercase for a modern look
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {stage}
                                </Typography>
                                {stages[stage].map((car, index) => (
                                    <Draggable draggableId={String(car.id)} index={index} key={car.id}>
                                        {(provided) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    width: "100%",
                                                    margin: 0,
                                                    padding: "8px",
                                                    backgroundColor: "#f9f9f9",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "0",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    position: "relative", // Ensure icons are positioned relative to the card
                                                    boxShadow: "none",
                                                    transition: "background-color 0.2s ease",
                                                    "&:hover": {
                                                        backgroundColor: "#f1f1f1",
                                                    },
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        padding: "8px", // Keep padding minimal
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        width: "100%", // Ensure content spans the card's full width
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "#333",
                                                            overflow: "hidden",
                                                            whiteSpace: "nowrap",
                                                            textOverflow: "ellipsis",
                                                            position: "relative",
                                                            transition: "all 0.2s ease",
                                                            "&:hover": {
                                                                overflow: "visible",
                                                                whiteSpace: "normal",
                                                                textOverflow: "clip",
                                                                backgroundColor: "#ffffff",
                                                                zIndex: 1,
                                                                boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)", // Optional: Add a hover highlight
                                                                padding: "4px", // Ensure proper padding for revealed text
                                                            },
                                                        }}
                                                    >
                                                        {`${car.year} ${car.make.charAt(0).toUpperCase()}${car.make.slice(1).toLowerCase()} ${car.model}`}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            marginTop: "4px",
                                                            color: "#666", // Subtle color for secondary text
                                                            overflow: "hidden",
                                                            whiteSpace: "nowrap",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {car.vin.slice(-8)} {/* Extract the last 8 characters */}
                                                    </Typography>
                                                    {/* Icons Section */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: "2px",
                                                            position: "absolute",
                                                            bottom: "1px",
                                                            right: "15px",
                                                        }}
                                                    >
                                                        <Visibility
                                                            sx={{
                                                                fontSize: "20px",
                                                                cursor: "pointer",
                                                                color: "#757575",
                                                                "&:hover": { color: "#000" },
                                                            }}
                                                            onClick={() => handleViewClick(car)}
                                                        />
                                                        <Edit
                                                            sx={{
                                                                fontSize: "20px",
                                                                cursor: "pointer",
                                                                color: "#757575",
                                                                "&:hover": { color: "#000" },
                                                            }}
                                                            onClick={() => handleEditClick(car)}
                                                        />
                                                        <Delete
                                                            sx={{
                                                                fontSize: "20px",
                                                                cursor: "pointer",
                                                                color: "#757575",
                                                                "&:hover": { color: "#000" },
                                                            }}
                                                            onClick={() => {
                                                                setCarToDelete(car);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                        />

                                                    </Box>
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
            <InvoiceModal
                open={isModalOpen}
                onClose={handleModalClose}
                car={selectedCar}
                onSave={handleSave}
            />
            <ViewModal
                open={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setViewCar(null);
                }}
                car={viewCar}
            />

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>
                            {carToDelete?.year} {carToDelete?.make} {carToDelete?.model}
                        </strong>
                        ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (carToDelete) {
                                dispatch(deleteCarFromStage({ stage: carToDelete.status, carId: carToDelete.id }));
                                setIsDeleteDialogOpen(false);
                                setCarToDelete(null);
                            }
                        }}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>

    );
}

export default Pipeline;
