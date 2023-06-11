import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { columns } from "./Columns";
//Material UI Imports
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { darken } from "@mui/material";

export const DteTable = () => {
  const [dataTable, setDataTable] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8082/getDteDetails").then((response) => {
      setDataTable(response.data);
    });
  }, []);

  const [value, setValue] = useState(dayjs("2022-04-17T15:30"));

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    //do something when the row selection changes...
  }, [rowSelection]);
  return (
    <MaterialReactTable
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      }}
      muiTableBodyProps={{
        sx: (theme) => ({
          '& tr:nth-of-type(odd)': {
            backgroundColor: darken(theme.palette.background.default, 0.1),
          },
        }),
      }}
      columns={columns}
      data={dataTable}
      enableRowSelection
      getRowId={(row) => row.userId} //give each row a more useful id
      onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
      state={{ rowSelection }} //pass our managed row selection state to the table to use
      renderTopToolbarCustomActions={({ table }) => {
        const handleUpdate = () => {
          const updatedDataTable = [];
          table.getSelectedRowModel().flatRows.map((row) => {
            dataTable.flatMap((object) => {
              if (object.id === row.original.id) {
                object.extent = new String(value);
                console.log(object);
              }
              updatedDataTable.push(object);
            });
          });
          setDataTable(updatedDataTable);
        };
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                <DateTimePicker
                  label="Update your status"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleUpdate}
              variant="contained"
              className="btn btn-primary btn-sm"
            >
              Update selected rows
            </button>
          </div>
        );
      }}
    />
  );
};
