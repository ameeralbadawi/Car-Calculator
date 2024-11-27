import React from 'react';
import { MaterialReactTable } from 'material-react-table';

function CarTable({ columns, data }) {

  return (
    <div style={{ width: '90%', paddingTop: '20px' }}>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{
          density: 'compact',
        }}
        enableDensityToggle={true}
      />
    </div>
  );
}

export default CarTable;
