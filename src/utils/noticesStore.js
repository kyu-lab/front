import {create} from 'zustand';

export const noticesStore = create((set) => ({
  notices: [],
  isNotice: false,
  addNotice: (notice) => {
    if (notice === undefined || notice.length === 0) {
      return;
    }
    const newNotices = Array.isArray(notice) ? notice : [notice];
    set(() => ({
      notices: [...newNotices, notice],
      isNotice: true
    }))
  },
  clearNotice: () => {
    set(() => ({
      notices: [],
      isNotice: false
    }))
  }
}));

export default noticesStore;
