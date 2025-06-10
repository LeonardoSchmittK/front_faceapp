import { create } from 'zustand';

const useClassRollstore = create((set) => ({
  activeClass: null,
  setActiveClass: (selectedClass) => set({ activeClass: selectedClass }),
}));

export default useClassRollstore;
