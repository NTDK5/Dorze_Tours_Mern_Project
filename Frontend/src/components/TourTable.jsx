/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';

const ToursTable = ({ data, onDelete }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: '_id',
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => <div className="line-clamp-3">{value}</div>, // Apply line-clamp to limit description to 3 lines
      },
      {
        Header: 'Destination',
        accessor: 'destination',
      },
      {
        Header: 'Price ($)',
        accessor: 'price',
        Cell: ({ value }) => `$${value.toFixed(2)}`, // Format price
      },
      {
        Header: 'Duration',
        accessor: 'duration',
      },
      {
        Header: 'Image URL',
        accessor: 'imageUrl',
        Cell: ({ value }) => (value ? value : 'No Image'), // Display image URL
      },
      {
        Header: 'Itinerary Items',
        accessor: 'itinerary',
        Cell: ({ value }) => value.length, // Display count of itinerary items
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(row.original._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onDelete]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="overflow-hidden rounded-3xl">
      <table
        {...getTableProps()}
        className="table-auto w-full border-collapse border rounded-lg border-gray-200"
      >
        <thead className="bg-[#323D4E] border-[1px] text-left border-[#313D4F] rounded-lg">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-2"
                  key={column.id}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          className="bg-[#273142] border-[1px] border-[#313D4F] rounded-lg"
          {...getTableBodyProps()}
        >
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className="border-b-[1px] border-[#c6c6c61f]"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-2 py-2"
                    key={cell.column.id}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ToursTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      duration: PropTypes.string.isRequired,
      imageUrl: PropTypes.string, // Add imageUrl to prop types
      itinerary: PropTypes.array.isRequired, // Ensure itinerary is present
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ToursTable;
