import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


const useStore = create(
  devtools((set) => ({
    isLoadingModels:false,
    isUserLogged: false,
    teacherLoggedIn:{},
    activeId: false,
    classes: [
      {
        title: "Aula Unisul I",
        students: [
          { name: "Leo", photoUrl: "https://example.com/leo.jpg" },
          { name: "Ana", photoUrl: "https://example.com/ana.jpg" },
        ],
      },
      {
        title: "Aula Unisul II",
        students: [
          { name: "Leo", photoUrl: "https://example.com/leo.jpg" },
          { name: "Maria", photoUrl: "https://example.com/maria.jpg" },
        ],
      },
      {
        title: "Aula Unisul III",
        students: [
          { name: "Leo", photoUrl: "https://example.com/leo.jpg" },
          { name: "João", photoUrl: "https://example.com/joao.jpg" },
        ],
      },
      {
        title: "Aula Unisul IV",
        students: [
          { name: "Leo", photoUrl: "https://example.com/leo.jpg" },
          { name: "Clara", photoUrl: "https://example.com/clara.jpg" },
        ],
      },
    ],
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