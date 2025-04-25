import React from "react";

const admin_name = "ibrahim";
const Admin = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="bg-red-500 p-5 rounded-full w-[90%] mt-25 text-2xl text-white flex justify-center">
          <h2>bonjour {admin_name}</h2>
        </div>
        <div className="mt-4">
          {/* Search input */}
          <div className="relative mb-4">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for users"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full table-auto w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-400 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-400 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-400 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">1</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">John Doe</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">voyageur</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-row">
                      <h6 className="text-red-500 mr-2">delete</h6>{" "}
                      <h6 className="text-green-500">Update</h6>
                    </div>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">2</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Jane Smith</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">jane.smith@example.com</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">voyageur</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-row">
                      <h6 className="text-red-500 mr-2">delete</h6>{" "}
                      <h6 className="text-green-500">Update</h6>
                    </div>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">3</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Samuel Johnson</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">samuel.johnson@example.com</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">voyageur</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-row">
                      <h6 className="text-red-500 mr-2">delete</h6>{" "}
                      <h6 className="text-green-500">Update</h6>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
