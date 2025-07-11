import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    useTheme
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { moveCarBetweenStages } from "./store";
import { deleteCarFromBackend, fetchCarsFromBackend, updateCarStageInBackend } from './pipelineThunks'; // update the path as needed
import dayjs from 'dayjs';

function Pipeline({ onViewCar, onEditCar }) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const stages = useSelector((state) => state.pipeline.stages);
    const loading = useSelector(state => state.pipeline.loading);
    const error = useSelector(state => state.pipeline.error);

    const [carToDelete, setCarToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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


    // Fetch cars on component mount
    useEffect(() => {
        dispatch(fetchCarsFromBackend());
    }, [dispatch]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;

        console.log("Dragged:", draggableId);
        console.log("From:", sourceStage, "To:", destinationStage);

        const car = stages[sourceStage].find((c) => c.vin === draggableId); // or c.id === parseInt(draggableId)
        if (!car) {
            console.warn("Car not found for drag ID:", draggableId);
            return;
        }

        dispatch(
            moveCarBetweenStages({
                sourceStage,
                destinationStage,
                carId: car.id,
            })
        );

        dispatch(
            updateCarStageInBackend({
                vin: car.vin,
                newStage: destinationStage,
            })
        );
    };

    const handleDeleteConfirm = () => {
        if (carToDelete) {
            dispatch(deleteCarFromBackend({
                vin: carToDelete.vin,
                stage: carToDelete.status,
                carId: carToDelete.id
            }));
        }
        setIsDeleteDialogOpen(false);
    };

    if (loading) return <Typography variant="h6" align="center" sx={{ mt: 4 }}>Loading cars...</Typography>;
    if (error) return <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;

    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Object.keys(stages).length}, 1fr)`,
                    width: "100%",
                    height: "calc(100vh - 80px)",
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.grey[200]}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: theme.shadows[2],
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
                                        borderRight: `1px solid ${theme.palette.grey[200]}`,
                                        "&:last-child": { borderRight: "none" },
                                        overflowY: "auto",
                                        backgroundColor: theme.palette.background.paper,
                                        padding: "0 4px",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            backgroundColor: "#778899",
                                            color: theme.palette.primary.contrastText,
                                            padding: "10px",
                                            textTransform: "uppercase",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 1,
                                            letterSpacing: "1px",
                                            fontSize: "0.85rem",
                                            borderBottom: `1px solid #a9a9a9`,
                                            mx: -0.5,
                                        }}
                                    >
                                        {stage} ({stages[stage].length})
                                    </Typography>
                                    {stages[stage].map((car, index) => (
                                        <Draggable draggableId={car.vin} index={index} key={car.vin}>
                                            {(provided) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    sx={{
                                                        width: "calc(100% - 8px)",
                                                        margin: "4px 0",
                                                        padding: "4px",
                                                        backgroundColor: theme.palette.grey[50],
                                                        border: `1px solid ${theme.palette.grey[200]}`,
                                                        borderRadius: "4px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        boxShadow: "none",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            backgroundColor: theme.palette.grey[100],
                                                            boxShadow: theme.shadows[1],
                                                            transform: "translateY(-1px)",
                                                            borderColor: theme.palette.primary.light
                                                        },
                                                    }}
                                                >
                                                    <CardContent sx={{
                                                        padding: "4px !important",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        width: "100%",
                                                        gap: "2px"
                                                    }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: "600",
                                                                color: theme.palette.text.primary,
                                                                overflow: "hidden",
                                                                whiteSpace: "nowrap",
                                                                textOverflow: "ellipsis",
                                                                fontSize: "0.8rem",
                                                                lineHeight: 1.2,
                                                            }}
                                                        >
                                                            {`${car?.year || '—'} ${car?.make ? car.make.charAt(0).toUpperCase() + car.make.slice(1).toLowerCase() : 'Unknown'} ${car?.model ? (car.model.length > 10 ? car.model.substring(0, 10) + '...' : car.model) : 'Model'}`}
                                                        </Typography>

                                                        <Box sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: theme.palette.text.secondary,
                                                                    fontFamily: "'Roboto Mono', monospace",
                                                                    backgroundColor: theme.palette.grey[100],
                                                                    px: "3px",
                                                                    py: "1px",
                                                                    borderRadius: "2px",
                                                                    fontSize: "0.7rem"
                                                                }}
                                                            >
                                                                {car.vin.slice(-8)}
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: theme.palette.common.white,
                                                                    fontWeight: "500",
                                                                    backgroundColor: car.status === 'Sold' ? theme.palette.success.main : theme.palette.error.main,
                                                                    px: "4px",
                                                                    py: "1px",
                                                                    borderRadius: "3px",
                                                                    fontSize: "0.7rem"
                                                                }}
                                                            >
                                                                {car.status === 'Sold'
                                                                    ? `$${parseFloat(car.saleAmount || 0).toLocaleString()}`
                                                                    : `$${calculateTotalCost(car).toLocaleString()}`}
                                                            </Typography>

                                                        </Box>

                                                        <Box sx={{
                                                            display: "flex",
                                                            justifyContent: "left",
                                                            gap: "2px",
                                                            "& .MuiIconButton-root": {
                                                                width: "24px",
                                                                height: "24px",
                                                                padding: "4px",
                                                                "& svg": {
                                                                    fontSize: "16px"
                                                                }
                                                            }
                                                        }}>
                                                            {car.status !== "Sold" && (() => {
                                                                const today = dayjs();
                                                                const purchaseDate = dayjs(car?.purchaseDate);
                                                                const days = purchaseDate.isValid() ? today.diff(purchaseDate, 'day') : 0;

                                                                let backgroundColor = theme.palette.success.light;
                                                                if (days >= 30) {
                                                                    backgroundColor = 'lightcoral';
                                                                } else if (days >= 15) {
                                                                    backgroundColor = 'yellow';
                                                                } else {
                                                                    backgroundColor = 'lightgreen';
                                                                }

                                                                return (
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: theme.palette.text.secondary,
                                                                            fontFamily: "'Roboto Mono', monospace",
                                                                            backgroundColor,
                                                                            px: "3px",
                                                                            py: "1px",
                                                                            borderRadius: "2px",
                                                                            fontSize: "0.7rem",
                                                                        }}
                                                                    >
                                                                        {`${days} Days`}
                                                                    </Typography>
                                                                );
                                                            })()}
                                                            <Tooltip title="View">
                                                                <IconButton
                                                                    onClick={() => onViewCar(car)}
                                                                    sx={{ color: theme.palette.primary.main }}
                                                                >
                                                                    <Visibility />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    onClick={() => onEditCar(car)}
                                                                    sx={{ color: theme.palette.info.main }}
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setCarToDelete(car);
                                                                        setIsDeleteDialogOpen(true);
                                                                    }}
                                                                    sx={{ color: theme.palette.error.main }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>
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
            </Box>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "12px",
                        padding: "16px",
                        minWidth: "400px"
                    }
                }}
            >
                <DialogTitle sx={{
                    fontWeight: "bold",
                    padding: "16px 16px 8px",
                    backgroundColor: theme.palette.grey[50],
                    borderBottom: `1px solid ${theme.palette.grey[200]}`
                }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent sx={{ padding: "16px" }}>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <Box component="span" fontWeight="bold" color={theme.palette.error.main}>
                            {carToDelete?.year} {carToDelete?.make} {carToDelete?.model}
                        </Box>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    padding: "8px 16px 16px",
                    borderTop: `1px solid ${theme.palette.grey[200]}`
                }}>
                    <Button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        sx={{
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                backgroundColor: theme.palette.grey[100]
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            "&:hover": {
                                backgroundColor: theme.palette.error.dark
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Pipeline;
