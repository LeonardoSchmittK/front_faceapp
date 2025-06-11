import { create } from 'zustand';
import axios from 'axios';

const useClassroomStore = create((set) => ({
  classes: [],
  loadingClasses: false,
  errorClasses: null,
  initRoll:false,

  fetchClasses: async (teacherId) => {
    set({ loadingClasses: true, errorClasses: null });
    try {
      const res = await axios.get('http://ec2-18-231-123-33.sa-east-1.compute.amazonaws.com:3001/api/v1/Classrooms/byTeacher/' + teacherId);
      const data = res.data.data;

      set({ classes: data, loadingClasses: false });
      console.log(data);
    } catch (err) {
      set({
        errorClasses: err.message || 'Error fetching classrooms',
        loadingClasses: false,
      });
    }
  },

  setClasses: (newClasses) => set({ classes: newClasses }),
  setRoll: (flag) => set({ initRoll: flag  }),
   resetRoll : () => set({ initRoll: false })
}));

export default useClassroomStore;