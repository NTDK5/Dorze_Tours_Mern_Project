/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import axios from 'axios';

const UsersTable = ({ data }) => {
  // Define columns

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          withCredentials: true,
        });
        window.location.reload(); // Refresh the page to update the list
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: '_id',
      },
      {
        Header: 'First Name',
        accessor: 'first_name',
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <button
            onClick={() => handleDeleteUser(row.original._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  // Create an instance of the table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="overflow-hidden rounded-3xl">
      <table
        {...getTableProps()}
        className="table-auto w-full border-collapse border border-gray-200"
      >
        <thead className="bg-[#323D4E] border-[1px] border-[#313D4F] rounded-lg text-left">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-8 py-3"
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
                className="border-b-[1px] border-[#c6c6c61f]"
                {...row.getRowProps()}
                key={row.id}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-8 py-2"
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

UsersTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }),
};

export default UsersTable;
