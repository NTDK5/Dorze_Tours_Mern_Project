// components/TourCard.js
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';

const BookingTable = ({ data, onDelete }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Booking ID',
        accessor: '_id',
      },
      {
        Header: 'Booking Date',
        accessor: 'bookingDate',
        Cell: ({ value }) => new Date(value).toLocaleString(), // Format booking date
      },
      {
        Header: 'Number of People',
        accessor: 'numberOfPeople',
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Total Price ($)',
        accessor: 'totalPrice',
        Cell: ({ value }) => `$${value.toFixed(2)}`, // Format price
      },
      {
        Header: 'Tour',
        accessor: 'tour', // Assuming this is an object
        Cell: ({ value }) => `${value?.title || 'Tour Title Unavailable'}`, // Show the tour title
      },
      {
        Header: 'User',
        accessor: 'user', // Assuming this is an object
        Cell: ({ value }) =>
          `${value?.first_name} ${value?.last_name} (${value?.email})`, // Show user's full name and email
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({ value }) => <div className="line-clamp-3">{value}</div>, // Limit to 3 lines
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
            <tr {...row.getRowProps()} key={row.id}>
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
  );
};

BookingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookingDate: PropTypes.string.isRequired,
      numberOfPeople: PropTypes.number.isRequired,
      paymentMethod: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      tour: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string, // Assuming tour has a title
      }),
      user: PropTypes.shape({
        _id: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        email: PropTypes.string,
      }),
      notes: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookingTable;
