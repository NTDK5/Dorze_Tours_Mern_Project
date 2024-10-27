/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';

const PaymentsTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Transaction ID',
        accessor: 'transactionId',
      },
      {
        Header: 'Amount ($)',
        accessor: 'amount',
        Cell: ({ value }) => `$${value.toFixed(2)}`,
      },
      {
        Header: 'Booking ID',
        accessor: 'booking._id',
      },
      {
        Header: 'Booking Status',
        accessor: 'booking.status',
      },
      {
        Header: 'Booking Date',
        accessor: 'booking.bookingDate',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
      },
      {
        Header: 'Payment Status',
        accessor: 'paymentStatus',
      },
      {
        Header: 'User Email',
        accessor: 'user.email',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    []
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
        className="table-auto w-full border-spacing-0"
      >
        <thead className="bg-[#323D4E] text-left">
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
        <tbody className="bg-[#273142]" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                className="border-b-[1px] border-[#c6c6c61f]"
                {...row.getRowProps()}
                key={row.id}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-4"
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

PaymentsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      paymentMethod: PropTypes.string.isRequired,
      paymentStatus: PropTypes.string.isRequired,
      transactionId: PropTypes.string.isRequired,
      booking: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        bookingDate: PropTypes.string.isRequired,
      }).isRequired,
      user: PropTypes.shape({
        email: PropTypes.string.isRequired,
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PaymentsTable;
