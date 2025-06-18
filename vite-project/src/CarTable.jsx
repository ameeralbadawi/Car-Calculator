import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Tabs, Tab, Box, IconButton, TextField } from '@mui/material';
import { Add, Edit, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addSheet, renameSheet, setActiveSheet, deleteSheet, deleteCarFromSheet } from './store';

function CarTable({ columns, rows, setRows, handleMenuOpen }) {
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

  const activeTabIndex = sheets.findIndex(sheet => sheet.id === activeSheetId);
  const activeSheetData = sheets.find(sheet => sheet.id === activeSheetId)?.data || [];

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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {editingTab === index ? (
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
            />
          ))}
        </Tabs>
        <IconButton onClick={handleAddSheet} sx={{ ml: 'auto' }}>
          <Add />
        </IconButton>
      </Box>

      <div style={{ marginTop: '16px' }}>
        <MaterialReactTable
          columns={columns}
          data={activeSheetData}
          initialState={{
            density: 'compact',
            columnVisibility: {
              year: false,
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
      </div>
    </div>
  );
}

export default CarTable;