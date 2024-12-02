import {createSelector} from '@reduxjs/toolkit';

export const selectViewMode = (state) => state.app.viewMode;
export const selectSortState = (state) => state.app.sort;
export const selectPaginationState = (state) => state.app.pagination;
export const selectSearchQuery = (state) => state.app.searchQuery;
export const selectAllEmployees = (state) => state.employees;
export const selectEmployeeById = (id) => (state) =>
  state.employees.find((emp) => emp.id == id);

export const selectFilteredEmployees = createSelector(
  [selectAllEmployees, selectSearchQuery],
  (employees, searchQuery) => {
    const query = searchQuery.toLowerCase();
    return employees.filter((emp) =>
      Object.values(emp)
        .filter((value) => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(query))
    );
  }
);

export const selectSortedEmployees = createSelector(
  [selectFilteredEmployees, selectSortState],
  (employees, {column, order}) => {
    return [...employees].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
);

export const selectPaginatedEmployees = createSelector(
  [selectSortedEmployees, selectPaginationState],
  (sortedEmployees, {currentPage, pageSize}) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedEmployees.slice(startIndex, endIndex);
  }
);

export const selectCurrentPage = createSelector(
  [selectPaginationState],
  ({currentPage}) => currentPage
);

export const selectTotalPages = createSelector(
  [selectSortedEmployees, selectPaginationState],
  (sortedEmployees, {pageSize}) => {
    return Math.ceil(sortedEmployees.length / pageSize);
  }
);
