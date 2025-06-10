import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


const useStore = create(
  devtools((set) => ({
    isLoadingModels:false,
    deadline:null,
    isUserLogged: false,
    teacherLoggedIn:{},
    activeId: false,
    previewUserImage:false,
    setPreviewUserImage:(flag)=>set(()=>({
      previewUserImage:flag
    })),

   login: (teacherData) =>
  set(
    () => ({
      isUserLogged: true,
      teacherLoggedIn: teacherData,
    }),
    false,
    'login'
  ),

  logout: () =>
    set(
      () => {
        return {
          isUserLogged: false,
          teacherLoggedIn: {},
        };
      },
      false,
      'logout'
    ),
    setActiveId:(id)=>set((state)=>({activeId:id})),
    setDeadline:(d)=>set((state)=>({deadline:d})),
    updateStudents: (classTitle, newStudents) =>
      set(
        (state) => ({
          classes: state.classes.map((classItem) =>
            classItem.title === classTitle
              ? { ...classItem, students: newStudents }
              : classItem
          ),
        }),
        false,
        'updateStudents'
      ),
  }))
);

export default useStore;