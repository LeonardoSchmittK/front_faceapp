import useStore from '../store/store.js'; // Your global store
import useClassroomStore from '../store/classStore.js';
import { useEffect } from "react";

function useClassrooms() {
  const teacherLoggedIn = useStore((state) => state.teacherLoggedIn);
  const fetchClasses = useClassroomStore((state) => state.fetchClasses);
  const classes = useClassroomStore((state) => state.classes); // Getting classes from state
  const setClasses = useClassroomStore((state) => state.setClasses); // Add setClasses

  useEffect(() => {
    if (teacherLoggedIn?.id) {
      fetchClasses(teacherLoggedIn.id);
    }
  }, [teacherLoggedIn, fetchClasses]);

  return {
    classes,
    setClasses, // Return setClasses for use in components
  };
}

export default useClassrooms;