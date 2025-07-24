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
} from '@mui/material';
import { Add, Edit, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  renameSheet,
  setActiveSheet,
  deleteSheet,
} from './store';
import { createWatchlistInBackend, renameWatchlistInBackend } from './watchlistThunks';


function CarTable({ columns, rows, setRows, handleMenuOpen }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { sheets, activeSheetId } = useSelector((state) => state.sheets);
  const [editingTab, setEditingTab] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSheet = () => {
    const newId = sheets.length > 0 ? Math.max(...sheets.map(s => s.id)) + 1 : 1;
    const newName = `Sheet ${newId}`;
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

  return (
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
                              dispatch(deleteSheet(sheet.id));
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
                profit: false,
                transport: false,
                repair: false,
                fees: false,
                carfaxStatuses: false,
                autocheckStatuses: false,
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
  );
}

export default CarTable;
