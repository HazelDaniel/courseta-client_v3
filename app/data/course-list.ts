import { CourseViewType } from "~/server.types";
import type { CourseDetailType, CourseEntryType } from "~/types";

export const courseData: CourseViewType[] = [
  {
    title: "Introduction to Programming",
    lessonCount: 8,
    avatar: "/images/building-soft-skills.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar0",
    },
    courseID: 0,
  },
  {
    title: "Introduction to Programming 2",
    lessonCount: 12,
    avatar: "/images/programming-1.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar1",
    },
    courseID: 1,
  },
  {
    title: "Sticky Notes - The Correct Way",
    lessonCount: 9,
    avatar: "/images/sticky-notes-introduction.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar2",
    },
    courseID: 9,
  },
  {
    title: "Introduction to Programming",
    lessonCount: 7,
    avatar: "/images/computer-networks.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar3",
    },
    courseID: 10,
  },
  {
    title: "Introduction to Programming",
    lessonCount: 10,
    avatar: "/images/programming-1.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar4",
    },
    courseID: 11,
  },
  {
    title: "Introduction to Programming",
    lessonCount: 6,
    avatar: "/images/building-soft-skills.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar5",
    },
    courseID: 12,
  },
  {
    title: "Introduction to Programming: A Layman's Point of View",
    lessonCount: 8,
    avatar: "/images/computer-networks.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar6",
    },
    courseID: 13,
  },
  {
    title: "Introduction to Programming",
    lessonCount: 11,
    avatar: "/images/building-soft-skills.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar7",
    },
    courseID: 14,
  },
  // Additional dummy data
  {
    title: "Advanced Programming Concepts",
    lessonCount: 15,
    avatar: "/images/advanced-programming.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar8",
    },
    courseID: 15,
  },
  {
    title: "Introduction to Web Development",
    lessonCount: 20,
    avatar: "/images/web-development.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar9",
    },
    courseID: 16,
  },
  {
    title: "Machine Learning Basics",
    lessonCount: 10,
    avatar: "/images/machine-learning.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z",
      created_at: "2022-04-01T12:00:00Z",
      id: "avatar10",
    },
    courseID: 17,
  },
];


export const courseDataDetailed: CourseDetailType[] = [
  {
    avatar: "/images/building-soft-skills.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "Searching algorithms",
    lessonCount: 8,
    progress: 34.2,
    id: 0,
    description: "Learn the basics of programming languages and concepts.",
    duration: 10000,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    lessons: [
      {
        id: 3,
        title: "Lesson 3: Core Principles - Deepening Your Understanding",
        duration: 1020808,
        contents: [
          {
            id: 1,
            title: "Exploring the Core Principles of the Subject",
            href: "https://en.wikipedia.org/wiki/Search_algorithm",
          },
        ],
        assessment: {
          id: 3,
          availablePoints: 150,
          questions: [
            {
              id: "1",
              question: "What is the main objective of this course?",
              points: 1,
              options: [
                {
                  id: "1",
                  text: "To gain a strong foundation in...",
                  correct: true,
                  quizID: "1",
                },
                {
                  id: "2",
                  text: "To simply become familiar with...",
                  correct: false,
                  quizID: "1",
                },
                {
                  id: "3",
                  text: "To casually explore...",
                  correct: false,
                  quizID: "1",
                },
              ],
            },
          ],
          lostPoints: 0,
        },
      },
      {
        id: 10,
        title: "Lesson 10: Putting It All Together - Practical Applications",
        duration: 1020801,
        contents: [
          {
            id: 10,
            title: "Sorting algorithms - A refresher",
            href: "https://en.wikipedia.org/wiki/Sorting_algorithm#:~:text=In%20computer%20science%2C%20a%20sorting,and%20either%20ascending%20or%20descending.",
          },
          {
            id: 12,
            title: "deep dive into kosaraju's algorithm",
            href: "https://en.wikipedia.org/wiki/Sorting_algorithm#:~:text=In%20computer%20science%2C%20a%20sorting,and%20either%20ascending%20or%20descending.",
          },
        ],
        assessment: {
          id: 10,
          availablePoints: 120,
          questions: [
            {
              id: "1",
              question:
                "What is the process used to verify transactions and add new blocks to a blockchain?",
              points: 80,
              options: [
                {
                  correct: true,
                  text: "Proof of Work (PoW) is a consensus mechanism that uses miners to solve complex puzzles to validate transactions.",
                  quizID: "1",
                  id: "1",
                },
                {
                  correct: false,
                  text: "Proof of Stake (PoS) relies on validators who stake cryptocurrency to secure the network, not solving puzzles.",
                  quizID: "1",
                  id: "2",
                },
                {
                  correct: false,
                  text: "Smart contracts are self-executing contracts, not directly involved in validating transactions.",
                  quizID: "1",
                  id: "3",
                },
              ],
            },
            {
              id: "2",
              question:
                "What is the main advantage of using a blockchain for data storage?",
              points: 20,
              options: [
                {
                  correct: true,
                  text: "Decentralization in a blockchain ensures data immutability and tamper-proof records.",
                  quizID: "2",
                  id: "1",
                },
                {
                  correct: false,
                  text: "Centralized servers often offer faster transaction processing speeds.",
                  quizID: "2",
                  id: "2",
                },
                {
                  correct: false,
                  text: "Cryptocurrencies are a specific application built on blockchain technology.",
                  quizID: "2",
                  id: "3",
                },
              ],
            },
            {
              id: "3",
              question:
                "What is a smart contract and how does it function on a blockchain?",
              points: 30,
              options: [
                {
                  correct: true,
                  text: "A smart contract is a self-executing program stored on a blockchain that automatically executes when predetermined conditions are met.",
                  quizID: "3",
                  id: "1",
                },
                {
                  correct: false,
                  text: "Miners write and deploy smart contracts, not users.",
                  quizID: "3",
                  id: "2",
                },
                {
                  correct: false,
                  text: "Blockchain transactions involve transferring cryptocurrency, smart contracts can manage various data and agreements.",
                  quizID: "3",
                  id: "3",
                },
                {
                  correct: false,
                  text: "some test question",
                  quizID: "3",
                  id: "4",
                },
                {
                  correct: false,
                  text: "Blockchain transactions involve transferring cryptocurrency, smart contracts can manage various data and agreements.",
                  quizID: "3",
                  id: "5",
                },
              ],
            },
            {
              id: "4",
              question:
                "What are some potential challenges associated with blockchain technology?",
              points: 40,
              options: [
                {
                  correct: true,
                  text: "Scalability is a challenge for some blockchains, limiting the number of transactions they can process.",
                  quizID: "4",
                  id: "1",
                },
                {
                  correct: false,
                  text: "Security is a major strength of blockchain technology.",
                  quizID: "4",
                  id: "2",
                },
                {
                  correct: false,
                  text: "Widespread adoption and real-world use cases are still being explored for blockchain.",
                  quizID: "4",
                  id: "3",
                }, // Combined two points for readability
              ],
            },
          ],
          lostPoints: 0,
        },
      },
    ],
    exam: {
      id: '1',
      startDate: "2024-07-01",
      endDate: "2024-07-07",
      duration: 7200,
      description: "Final exam covering all lessons.",
      questions: [
        {
          id: "ex1",
          question: "Explain the concept of variables.",
          points: 20,
          options: [
            {
              correct: true,
              text: "A storage location paired with an associated symbolic name.",
              quizID: "ex1",
              id: "exopt1",
            },
            {
              correct: false,
              text: "A function",
              quizID: "ex1",
              id: "exopt2",
            },
          ],
        },
      ],
      availablePoints: 20,
    },
  },
  {
    avatar: "/images/programming-1.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "introduction to programming 2",
    lessonCount: 12,
    progress: 78.5,
    id: 1,
    description:
      "Build upon your programming foundation in this follow-up course.",
    duration: 28080,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    archived: true,
    lessons: [],
  },
  {
    avatar: "/images/sticky-notes-introduction.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "sticky notes - the correct way",
    lessonCount: 9,
    progress: 62.1,
    id: 9,
    description:
      "Master the art of using sticky notes for optimal organization.",
    duration: 25880,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    lessons: [],
  },
  {
    avatar: "/images/computer-networks.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "introduction to programming",
    lessonCount: 7,
    progress: 15.4,
    id: 10,
    description: "Explore the fundamentals of programming concepts.",
    duration: 38000,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    lessons: [],
  },
  {
    avatar: "/images/programming-1.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "introduction to programming",
    lessonCount: 10,
    progress: 92.8,
    id: 11,
    description:
      "Another introduction to programming course, consider this a refresher.",
    duration: 18060,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    archived: true,
    lessons: [],
  },
  {
    avatar: "/images/building-soft-skills.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "introduction to programming",
    lessonCount: 6,
    progress: 48.2,
    id: 12,
    description: "Gain programming knowledge through this introductory course.",
    duration: 18260,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    lessons: [],
  },
  {
    avatar: "/images/computer-networks.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "introduction to programming. a layman's point of view",
    lessonCount: 8,
    progress: 21.7,
    id: 13,
    description: "Learn programming concepts explained for beginners.",
    duration: 48260,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    lessons: [],
  },
  {
    avatar: "//images/building-soft-skills.jpg",
    avatarMeta: {
      updated_at: "2023-06-21T12:00:00Z", // Example placeholder date
      created_at: "2022-04-01T12:00:00Z", // Example placeholder date
      id: "avatar0",
    },
    title: "introduction to programming",
    lessonCount: 0,
    progress: 67.3,
    id: 14,
    description: "Deepen your understanding of programming fundamentals.",
    duration: 48290,
    createdAt: "2022-04-01T12:00:00Z",
    updatedAt: "2023-06-21T12:00:00Z",
    tags: ["programming", "introduction"],
    archived: true,
    lessons: [],
  },
];
