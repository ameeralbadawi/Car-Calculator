import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Tabs, Tab, Box, IconButton, TextField } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addSheet, renameSheet, setActiveSheet, addCarToSheet } from './store';

function CarTable({ columns, onAddCar }) {
  const dispatch = useDispatch();
  const { sheets, activeSheetId } = useSelector((state) => state.sheets);
  const [editingTab, setEditingTab] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSheet = () => {
    dispatch(addSheet());
  };

  const handleRenameStart = (index) => {
    setEditingTab(index);
    setEditValue(sheets[index].name);
  };

  const handleRenameSave = (id) => {
    dispatch(renameSheet({ id, newName: editValue }));
    setEditingTab(null);
  };

  const handleTabChange = (_, index) => {
    const sheetId = sheets[index].id;
    dispatch(setActiveSheet(sheetId));
  };

  const handleAddCarToWatchlist = (newCar) => {
    dispatch(addCarToSheet({ car: newCar }));
    if (onAddCar) onAddCar(newCar);
  };

  const activeTabIndex = sheets.findIndex(sheet => sheet.id === activeSheetId);

  return (
    <div style={{ width: '90%', paddingTop: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
        <Tabs 
          value={activeTabIndex} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {sheets.map((sheet, index) => (
            <Tab
              key={sheet.id}
              label={
                editingTab === index ? (
                  <TextField
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleRenameSave(sheet.id)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRenameSave(sheet.id)}
                    autoFocus
                    size="small"
                    sx={{ width: '100px' }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  </Box>
                )
              }
            />
          ))}
        </Tabs>
        <IconButton onClick={handleAddSheet} sx={{ ml: 'auto' }}>
          <Add />
        </IconButton>
      </Box>

      {sheets.map((sheet, index) => (
        <div
          key={sheet.id}
          role="tabpanel"
          hidden={activeTabIndex !== index}
          style={{ marginTop: '16px' }}
        >
          {activeTabIndex === index && (
            <MaterialReactTable
              columns={columns}
              data={sheet.data}
              initialState={{
                density: 'compact',
                columnVisibility: {
                  make: false,
                  profit: false,
                  transport: false,
                  repair: false,
                  fees: false,
                  carfaxStatuses: false,
                  autocheckStatuses: false,
                }
              }}
              enableDensityToggle={true}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CarTable;