import useStore from '../store/store.js';  // seu store global
import useClassroomStore from '../store/classStore.js';
import { useEffect } from "react";

function useClassrooms() {
  const teacherLoggedIn = useStore((state) => state.teacherLoggedIn);
  const fetchClasses = useClassroomStore((state) => state.fetchClasses);
  const classes = useClassroomStore((state) => state.classes); // pegando as classes do estado

  useEffect(() => {
    if (teacherLoggedIn?.id) {
        
        fetchClasses(teacherLoggedIn.id);
    }
  }, [teacherLoggedIn, fetchClasses]); 

  return {
    classes,
  };
}

export default useClassrooms;
