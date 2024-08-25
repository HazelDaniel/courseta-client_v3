import { CourseExamType, GenericAssessmentType } from "~/types";

export const AssessmentListData: (GenericAssessmentType | CourseExamType)[] = [
  {
    id: 10,
    availablePoints: 280,
    assessmentType: "quiz",
    passScore: 50,
    completed: false,
    description: "this is a sample quiz",
    title: "a quiz to test your knowledge",
    parentID: 3,
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
      {
        id: "5",
        question:
          "What are some real-world applications of blockchain technology beyond cryptocurrency?",
        points: 10,
        options: [
          {
            correct: true,
            text: "Blockchain can be used for secure supply chain management, tracking the origin and movement of goods.",
            quizID: "5",
            id: "1",
          },
          {
            correct: false,
            text: "Cryptocurrency is the primary application of blockchain technology.",
            quizID: "5",
            id: "2",
          },
          {
            correct: true,
            text: "Blockchain can be used for secure voting systems, ensuring transparency and immutability of votes.",
            quizID: "5",
            id: "3",
          },
        ],
      },
    ],
  },
  {
    id: 1,
    startDate: "2024-07-01",
    endDate: "2024-07-07",
    duration: 7200,
    description: "Final exam covering all lessons.",
    assessmentType: "exam",
    parentID: 0,
    questions: [
      {
        id: "1",
        question: "Explain the concept of variables.",
        points: 20,
        options: [
          {
            correct: true,
            text: "A storage location paired with an associated symbolic name.",
            quizID: "1",
            id: "exopt1",
          },
          {
            correct: false,
            text: "A function",
            quizID: "1",
            id: "exopt2",
          },
        ],
      },
    ],
    availablePoints: 20,
  },
  {
    id: 3,
    availablePoints: 150,
    parentID: 0,
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
];
