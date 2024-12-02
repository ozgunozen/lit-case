import {createSlice} from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    viewMode: 'table',
    searchQuery: '',
    sort: {
      column: 'id',
      order: 'asc',
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    toast: {
      message: '',
      isVisible: false,
    },
  },
  reducers: {
    setSortColumn: (state, action) => {
      if (state.sort.column === action.payload) {
        state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.column = action.payload;
        state.sort.order = 'asc';
      }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    showToast(state, action) {
      state.toast.message = action.payload.message;
      state.toast.isVisible = true;
    },
    hideToast(state) {
      state.toast.isVisible = false;
    },
  },
});

export const {
  setSortColumn,
  setViewMode,
  setPage,
  setPageSize,
  setSearchQuery,
  showToast,
  hideToast,
} = appSlice.actions;

export default appSlice.reducer;
