import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Tabs, Tab, Box, IconButton, TextField } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';

function CarTable({ columns, data, onAddCar }) {
  const [watchlists, setWatchlists] = useState([
    { id: 1, name: 'Sheet 1', data: [] },
    { id: 2, name: 'Sheet 2', data: [] }
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [editingTab, setEditingTab] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSheet = () => {
    const newId = watchlists.length > 0 ? Math.max(...watchlists.map(w => w.id)) + 1 : 1;
    setWatchlists([...watchlists, { id: newId, name: `Sheet ${newId}`, data: [] }]);
    setActiveTab(watchlists.length);
  };

  const handleRenameStart = (index) => {
    setEditingTab(index);
    setEditValue(watchlists[index].name);
  };

  const handleRenameSave = () => {
    const updated = [...watchlists];
    updated[editingTab].name = editValue;
    setWatchlists(updated);
    setEditingTab(null);
  };

  const handleAddCarToWatchlist = (newCar) => {
    const updated = [...watchlists];
    updated[activeTab].data = [...updated[activeTab].data, newCar];
    setWatchlists(updated);
    if (onAddCar) onAddCar(newCar);
  };

  return (
    <div style={{ width: '90%', paddingTop: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {watchlists.map((watchlist, index) => (
            <Tab
              key={watchlist.id}
              label={
                editingTab === index ? (
                  <TextField
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleRenameSave}
                    onKeyPress={(e) => e.key === 'Enter' && handleRenameSave()}
                    autoFocus
                    size="small"
                    sx={{ width: '100px' }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {watchlist.name}
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

      {watchlists.map((watchlist, index) => (
        <div
          key={watchlist.id}
          role="tabpanel"
          hidden={activeTab !== index}
          style={{ marginTop: '16px' }}
        >
          {activeTab === index && (
            <MaterialReactTable
              columns={columns}
              data={watchlist.data}
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