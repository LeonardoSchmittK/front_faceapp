import { create } from 'zustand';
import axios from 'axios';

const useClassroomStore = create((set) => ({
  classes: [],
  loadingClasses: false,
  errorClasses: null,

  fetchClasses: async (teacherId) => {  
    set({ loadingClasses: true, errorClasses: null });
    try {

      const res = await axios.get('http://localhost:3001/api/v1/Classrooms/byTeacher/' + teacherId);
      const data = res.data.data;

      set({ classes: data, loadingClasses: false });
      console.log(data)
    } catch (err) {
      set({ 
        errorClasses: err.message || 'Error fetching classrooms', 
        loadingClasses: false 
      });
    }
  },
}));

export default useClassroomStore;
