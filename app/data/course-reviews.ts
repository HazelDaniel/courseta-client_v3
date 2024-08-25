import { CourseReviewType } from "~/types";

export const courseReviews: CourseReviewType[] = [
  {
    studentEmail: "student1@example.com",
    studentID: "s12345",
    avatar: "/illustrations/avatar1.jpg",
    avatarMeta: {
      updated_at: "2023-07-01T12:00:00Z",
      created_at: "2022-07-01T12:00:00Z",
    },
    reviewText:
      "This course was extremely helpful and well-structured. I learned a lot, but some parts were confusing.",
    rating: 4.5,
    dateCreated: "2024-07-17T06:57:42.447Z",
  },
  {
    studentEmail: "student3@example.com",
    studentID: "s11223",
    avatar: "/illustrations/avatar1.jpg",
    avatarMeta: {
      updated_at: "2023-07-01T12:00:00Z",
      created_at: "2022-07-01T12:00:00Z",
    },
    reviewText: "Great content but the instructor was hard to follow.",
    rating: 3,
    dateCreated: "2024-06-20T06:57:42.447Z",
  },
  {
    studentEmail: "student4@example.com",
    studentID: "s44556",
    avatar: "/illustrations/avatar1.jpg",
    avatarMeta: {
      updated_at: "2023-07-01T12:00:00Z",
      created_at: "2022-07-01T12:00:00Z",
    },
    reviewText: "Excellent course, highly recommend it.",
    rating: 5,
    dateCreated: "2024-06-22T06:57:42.447Z",
  },
  {
    studentEmail: "student5@example.com",
    studentID: "s77889",
    avatar: "/illustrations/avatar1.jpg",
    avatarMeta: {
      updated_at: "2023-07-01T12:00:00Z",
      created_at: "2022-07-01T12:00:00Z",
    },
    reviewText: "Not what I expected, the course needs improvement.",
    rating: 2,
    dateCreated: "2024-05-01T06:57:42.447Z",
  },
];
