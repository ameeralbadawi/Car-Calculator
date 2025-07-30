import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Tabs,
  Tab,
  Box,
  IconButton,
  TextField,
  Paper,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from '@mui/material';
import { Add, Edit, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  setActiveSheet,
} from './store';
import { createWatchlistInBackend, renameWatchlistInBackend, deleteSheetThunk } from './watchlistThunks';


function CarTable({ columns, rows, setRows, handleMenuOpen }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { sheets, activeSheetId } = useSelector((state) => state.sheets);
  const [editingTab, setEditingTab] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState(null);


  const handleAddSheet = () => {
    const newId = sheets.length > 0 ? Math.max(...sheets.map(s => s.id)) + 1 : 1;
    const newName = `Sheet ${sheets.length + 1}`;
    dispatch(createWatchlistInBackend(newName));
  };

  const handleRenameStart = (index) => {
    setEditingTab(index);
    setEditValue(sheets[index].name);
  };

  const handleRenameSave = (id) => {
    dispatch(renameWatchlistInBackend({ id, newName: editValue }));
    setEditingTab(null);
  };

  const handleTabChange = (_, index) => {
    const sheetId = sheets[index].id;
    dispatch(setActiveSheet(sheetId));
  };

  const activeTabIndex = sheets.findIndex((sheet) => sheet.id === activeSheetId);
  const activeSheetData = sheets.find((sheet) => sheet.id === activeSheetId)?.data || [];

  const handleDeleteConfirm = () => {
    if (sheetToDelete) {
      dispatch(deleteSheetThunk(sheetToDelete.id));
    }
    setIsDeleteDialogOpen(false);
    setSheetToDelete(null);
  };
  

  return (
    <>
    <Box width="90%" mx="auto" pt={3}>
      <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tabs
            value={activeTabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              flex: 1,
              '& .MuiTabs-indicator': {
                backgroundColor: '#778899',
              },
            }}
          >
            {sheets.map((sheet, index) => (
              <Tab
                key={sheet.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {editingTab === index ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleRenameSave(sheet.id)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleRenameSave(sheet.id)
                        }
                        autoFocus
                        size="small"
                        sx={{
                          width: 100,
                        }}
                      />
                    ) : (
                      <>
                        {sheet.name}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameStart(index);
                          }}
                          sx={{ ml: 0.5 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        {sheets.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSheetToDelete(sheet); // capture the sheet to be deleted
                              setIsDeleteDialogOpen(true);
                            }}
                            sx={{ ml: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>

                        )}
                      </>
                    )}
                  </Box>
                }
                sx={{
                  '&.Mui-selected': {
                    color: '#778899',
                  },
                  '&.Mui-selected .MuiSvgIcon-root': {
                    color: '#778899',
                  },
                }}
              />
            ))}
          </Tabs>

          <IconButton onClick={handleAddSheet} sx={{ ml: 2 }}>
            <Add />
          </IconButton>
        </Box>

        <Box mt={2}>
          <MaterialReactTable
            columns={columns}
            data={activeSheetData}
            initialState={{
              density: 'compact',
              columnVisibility: {
                Profit: false,
                Transport: false,
                Repair: false,
                Fees: false,
                Carfax: false,
                Autocheck: false,
              },
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              },
            }}
            muiTableBodyRowProps={{
              sx: {
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: { py: 0.5, px: 1 },
            }}
            muiTableHeadCellProps={{
              sx: { py: 0.5, px: 1 },
            }}
            enableDensityToggle={true}
          />
        </Box>
      </Paper>
    </Box>
    <Dialog
    open={isDeleteDialogOpen}
    onClose={() => setIsDeleteDialogOpen(false)}
    PaperProps={{
      sx: {
        borderRadius: 3,
        px: 0,
        py: 0,
        minWidth: 420,
        overflow: "hidden",
        boxShadow: 10,
      },
    }}
  >
    <DialogTitle
      sx={{
        fontWeight: 600,
        px: 3,
        py: 2.5,
        fontSize: "1.125rem",
        bgcolor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      Confirm Deletion
    </DialogTitle>
  
    <DialogContent sx={{ px: 3, py: 2 }}>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete this sheet?
      </Typography>
      {sheetToDelete && (
        <Typography
          variant="h6"
          fontWeight={600}
          color="error"
          sx={{
            mt: 1,
            px: 1.5,
            py: 1,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 2,
            fontSize: "0.95rem",
          }}
        >
          {sheetToDelete.name || `Sheet #${sheetToDelete.id}`}
        </Typography>
      )}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1.5 }}
      >
        This action is permanent and cannot be undone.
      </Typography>
    </DialogContent>
  
    <DialogActions
      sx={{
        px: 3,
        py: 1.5,
        bgcolor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Button
        onClick={() => setIsDeleteDialogOpen(false)}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.grey[100],
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleDeleteConfirm}
        variant="contained"
        color="error"
        sx={{ textTransform: "none", fontWeight: 500 }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
  </>
  );
}

export default CarTable;
