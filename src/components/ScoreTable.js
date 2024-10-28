import React, { useState,useEffect } from 'react';

import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import './index.css'

function ScoreTable() {
  // Initial state: 10 rows, 2 columns
  const [tableData, setTableData] = useState(Array.from({ length: 7 }, () => Array(2).fill("")));
  const [columnNames, setColumnNames] = useState(["Column 1", "Column 2"]);

  // useEffect
  useEffect(() => {
    const savedColumnNames = localStorage.getItem('columnNames');
    const savedTableData = localStorage.getItem('tableData');

    if (savedColumnNames) {
        setColumnNames(JSON.parse(savedColumnNames));
    }
    if (savedTableData) {
        setTableData(JSON.parse(savedTableData));
    }
}, []);

const saveDataToLocalStorage = () => {
    localStorage.setItem('columnNames', JSON.stringify(columnNames));
    localStorage.setItem('tableData', JSON.stringify(tableData));
};

  // Update cell value
  const handleCellChange = (row, col, value) => {
    const newData = [...tableData];
    newData[row][col] = value;

    // Add a new row if we're on the last row and it's no longer empty
    if (row === newData.length - 1 && value !== "") {
      newData.push(Array(columnNames.length).fill(""));
    }

    setTableData(newData);

    saveDataToLocalStorage()
  };

  // Calculate column totals
  const calculateColumnTotals = () => {
    return columnNames.map((_, colIndex) =>
      tableData.reduce((sum, row) => sum + (parseInt(row[colIndex]) || 0), 0)
    );
  };

  // Add a new column
  const addColumn = () => {
    setColumnNames([...columnNames, `Column ${columnNames.length + 1}`]);
    setTableData(tableData.map(row => [...row, ""]));
    saveDataToLocalStorage();
  };

  // Reset table data
  const resetTable = () => {
    setTableData(tableData.map(() => Array(columnNames.length).fill("")));
    saveDataToLocalStorage();
  };

  // Handle deleting a specific column
  const deleteColumn = (colIndex) => {
    const newColumnNames = columnNames.filter((_, index) => index !== colIndex);
    const updatedTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    
    setColumnNames(newColumnNames);
    setTableData(updatedTableData);
    saveDataToLocalStorage();
  };

  const totals = calculateColumnTotals();

  return (
    <div className='app-container'>
        <h1>Score Board</h1>
      {/* Table for data entry */}
      <div class="table-container">
        <table border="0" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              {columnNames.map((name, colIndex) => (
                <th key={colIndex} className='col-heading'>
                  <input
                  className='heading-input'
                    value={name}
                    onChange={e => {
                      const newNames = [...columnNames];
                      newNames[colIndex] = e.target.value;
                      setColumnNames(newNames);
                      saveDataToLocalStorage();
                    }}
                  />
                  <button className='delete-column-btn btn' onClick={() => deleteColumn(colIndex)}>
                    <MdDelete className='delete-icon'/>
                  </button>
                </th>
              ))}
              <th><button className='add-column-btn btn' onClick={addColumn}><IoMdAdd className='add-column-icon'/></button></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                    className='data-input'
                      value={cell}
                      onChange={e => handleCellChange(rowIndex, colIndex, e.target.value)}
                      type="text"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {totals.map((total, colIndex) => (
                <td
                className='total-score'
                  key={colIndex}
                  style={{ color: total >= 201 ? '#dc2f2f' : '#222831' }}
                >
                  {total}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <button className='reset-btn btn' onClick={resetTable}>Reset Table</button>
    </div>
    
  );
}

export default ScoreTable;
