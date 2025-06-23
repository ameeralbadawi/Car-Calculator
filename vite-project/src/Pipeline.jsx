import React, { useState } from "react";
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
import { moveCarBetweenStages, deleteCarFromStage } from "./store";

function Pipeline({ onViewCar, onEditCar }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const stages = useSelector((state) => state.pipeline.stages);
    const [carToDelete, setCarToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        dispatch(
            moveCarBetweenStages({
                sourceStage: source.droppableId,
                destinationStage: destination.droppableId,
                carId: parseInt(draggableId),
            })
        );
    };

    const handleDeleteConfirm = () => {
        if (carToDelete) {
            dispatch(deleteCarFromStage({ 
                stage: carToDelete.status, 
                carId: carToDelete.id 
            }));
        }
        setIsDeleteDialogOpen(false);
    };

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
                                                            {`${car.year} ${car.make.charAt(0).toUpperCase()}${car.make.slice(1).toLowerCase()} ${car.model.substring(0, 10)}${car.model.length > 10 ? '...' : ''}`}
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
                                                                {car.vin.slice(-6)}
                                                            </Typography>
                                                            
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: theme.palette.text.primary,
                                                                    fontWeight: "500",
                                                                    backgroundColor: theme.palette.success.light,
                                                                    px: "4px",
                                                                    py: "1px",
                                                                    borderRadius: "3px",
                                                                    fontSize: "0.7rem"
                                                                }}
                                                            >
                                                                ${car.cost}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box sx={{ 
                                                            display: "flex", 
                                                            justifyContent: "flex-end",
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
                                                            <Typography 
                                                            sx={{
                                                                color: theme.palette.text.primary,
                                                                fontWeight: "500",
                                                                backgroundColor: "yellow",
                                                                px: "4px",
                                                                py: "1px",
                                                                borderRadius: "3px",
                                                                fontSize: "0.7rem",
                                                                textAlign: "left",
                                                                justifyContent: "left"
                                                            }}>
                                                                0 Days
                                                            </Typography>
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