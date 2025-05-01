import { defineStore } from 'pinia';

export const useDailyDiaryStore = defineStore('dailyDiary', {
  state: () => ({
    previousPage: null, // 'weekly' 또는 'monthly'
    previousDate: null, // 이전 페이지의 날짜 정보
  }),
  
  actions: {
    setPreviousPage(page, date = null) {
      this.previousPage = page;
      this.previousDate = date;
    },
    
    clearPreviousPage() {
      this.previousPage = null;
      this.previousDate = null;
    }
  }
}); 