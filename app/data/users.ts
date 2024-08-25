import { CreatorProfileType, StudentProfileType } from "~/types";

export const studentsData: StudentProfileType[] = [
  {
    user: {
      avatar: "/illustrations/avatar1.jpg",
      avatarMeta: {
        updated_at: "2023-07-01T12:00:00Z",
        created_at: "2022-07-01T12:00:00Z",
      },
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      role: "student",
      createdAt: "2021-07-01T12:00:00Z",
      id: "1",
    },
    currentRank: 3,
    ranks: [
      { value: 1, dateAttained: "2021-07-15T12:00:00Z" },
      { value: 2, dateAttained: "2022-07-15T12:00:00Z" },
      { value: 3, dateAttained: "2023-07-15T12:00:00Z" },
    ],
    points: 1500,
    attemptedCourses: [
      {
        lessonCount: 10,
        title: "Introduction to Programming",
        percentageCompleted: 100,
        courseURL: "https://example.com/course1",
      },
      {
        lessonCount: 8,
        title: "Advanced Mathematics",
        percentageCompleted: 75,
        courseURL: "https://example.com/course2",
      },
    ],
  },
  {
    user: {
      avatar: "https://example.com/avatar2.jpg",
      avatarMeta: {
        updated_at: "2023-07-01T12:00:00Z",
        created_at: "2022-07-01T12:00:00Z",
      },
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@example.com",
      role: "student",
      createdAt: "2021-07-01T12:00:00Z",
      id: "2",
    },
    currentRank: 4,
    ranks: [
      { value: 1, dateAttained: "2021-07-15T12:00:00Z" },
      { value: 2, dateAttained: "2022-07-15T12:00:00Z" },
      { value: 3, dateAttained: "2023-01-15T12:00:00Z" },
      { value: 4, dateAttained: "2023-07-15T12:00:00Z" },
    ],
    points: 2000,
    attemptedCourses: [
      {
        lessonCount: 15,
        title: "Physics 101",
        percentageCompleted: 50,
        courseURL: "https://example.com/course3",
      },
      {
        lessonCount: 12,
        title: "Chemistry Basics",
        percentageCompleted: 100,
        courseURL: "https://example.com/course4",
      },
    ],
  },
];

export let creatorsData: CreatorProfileType[] = [
  {
    user: {
      avatar: "/illustrations/person-admin.png",
      avatarMeta: {
        updated_at: "2023-07-01T12:00:00Z",
        created_at: "2022-07-01T12:00:00Z",
      },
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie.brown@example.com",
      role: "creator",
      createdAt: "2021-07-01T12:00:00Z",
      id: "0",
      creatorPass: "secret1",
      averageCourseRating: 4.5,
      courseReviewCount: 120,
      courseCount: 5,
    },
  },
  {
    user: {
      avatar: "/illustrations/person-admin.png",
      avatarMeta: {
        updated_at: "2023-07-01T12:00:00Z",
        created_at: "2022-07-01T12:00:00Z",
      },
      firstName: "Diana",
      lastName: "Prince",
      email: "diana.prince@example.com",
      role: "creator",
      createdAt: "2021-07-01T12:00:00Z",
      id: "1",
      creatorPass: "secret2",
      averageCourseRating: 4.8,
      courseReviewCount: 150,
      courseCount: 8,
    },
  },
];
