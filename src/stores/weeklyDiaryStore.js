import { defineStore } from 'pinia';

export const useWeeklyDiaryStore = defineStore('weeklyDiary', {
  state: () => ({
    hoveredCards: [],
    baseZIndex: {
      sunday: 7,
      monday: 6,
      tuesday: 5,
      wednesday: 4,
      thursday: 3,
      friday: 2,
      saturday: 1
    }
  }),
  
  actions: {
    addHoveredCard(day) {

      this.hoveredCards = this.hoveredCards.filter(card => card !== day);
      this.hoveredCards.unshift(day);
    },
    
    removeHoveredCard(day) {
    },
    
    resetHoveredCards() {

      this.hoveredCards = [];
    },
    
    getCardZIndex(day) {
      const hoveredIndex = this.hoveredCards.indexOf(day);
      
      if (hoveredIndex !== -1) {
        return 20 - hoveredIndex;
      }
      
      return this.baseZIndex[day];
    }
  }
}); 