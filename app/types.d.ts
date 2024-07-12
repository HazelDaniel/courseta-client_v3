export interface AnnouncementItem {
  target: "creators" | "students";
  title: string;
  details?: string;
  dateDelivered: string;
}

export interface AnnouncementGroupType {
  announcementDate: string;
  announcements: AnnouncementItem[];
}

export type RankRange = 1 | 2 | 3 | 4 | 5 | 6;

export interface RankType {
  level: RankRange;
  title: string;
  icon: string;
  xpRange: { max: number; min: number };
}

export interface CourseAttemptType {
  lessonCount: number;
  title: string;
  percentageCompleted: number;
  courseURL: string;
}

export interface UserType {
  avatar: { url: string; updatedAt: string; createdAt: string };
  firstName: string;
  lastName: string;
  email: string;
  role: "student";
  createdAt: string;
  id: string;
}

export interface CreatorUserType extends UserType {
  role: "creator";
  creatorPass: string;
  averageCourseRating: number;
  courseReviewCount: number;
  courseCount: number;
}


export interface StudentProfileType {
  user: UserType;
  currentRank: RankRange;
  ranks: {
    value: RankRange;
    dateAttained: string;
  }[];
  points:  number;
  attemptedCourses: CourseAttemptType[] | null;
}

export interface CreatorProfileType {
  user: CreatorUserType;
}

export interface AuthType {
  token: string | null;
  user: Pick<StudentProfileType, "user">["user"] | CreatorProfileType["user"];
}


export interface QuizOptionType {
  correct: boolean;
  text: string;
  quizID: string;
  id: string;
}
export interface QuizType {
  id: string;
  question: string;
  points: number;
  options: QuizOptionType[];
}


export interface CourseEntryType {
  imageUrl: string;
  title: string;
  lessonCount: number;
  progress: number;
  id: number;
  description: string;
  duration: number; // in seconds
}

export type CourseListType = CourseEntryType[];

export interface CourseFilterOptionType {
  text: string;
  id: number;
}

export interface CourseFilterType {
  selected: number;
  filterName: string;
  filterTitle: string;
  options: CourseFilterOptionType[];
}

type PossibleAccessmentState<T> = T extends "generic"
  ? "passed" | "failed"
  : "passed" | "failed" | "no-attempt";

export interface CourseAssessmentType {
  status: PossibleAccessmentState<"generic">;
  courseID: string;
  dateAttempted: string;
  percentScore?: number;
}
export interface ExamAssessmentType
  extends Omit<CourseAssessmentType, "courseID"> {
  status: PossibleAccessmentState<"exam">;
  examID: number;
}

export interface AssessmentDataType {
  average: {
    exams: number;
    courses: number;
  };
  exams: ExamAssessmentType[];
  courses: CourseAssessmentType[];
}

export interface CourseContentType {
  id: number;
  title: string;
  href: string;
  type?: "video" | "text";
}

export interface LessonAssessmentType {
  id: number;
  completed: boolean;
  questions: QuizType[];
  lostPoints?: number;
  availablePoints: number;
}

export interface CourseExamType extends LessonAssessmentType {
  startDate: string;
  endDate: string;
  duration: number;
  description: string;
}
export interface CourseLessonType {
  id: number;
  title: string;
  completed: boolean;
  contents: CourseContentType[];
  assessment: LessonAssessmentType;
  courseTitle: string;
  duration: number;
}

export interface CourseDetailType extends CourseEntryType {
  lessons: Partial<CourseLessonType>[];
  exam?: CourseExamType;
}


export interface DBUserType extends Pick<UserType, "email" | "name"> {
  points: number;
  rank: string;
  avatar: "string";
}

export interface DefaultDashboardFormDataType {
	first_name?: string;
	last_name?: string;
	avatar?: string;
	email?: string;
	creator_pass?: string;
  new_password?: string;
  old_password?: string;
}
export interface DashboardCustomInputType {
  heading: string;
  namespace: string;
  form: {
    intent: string;
    actions: string[];
    variant:
      | "one-uni-button"
      | "two-uni-button"
      | "one-dual-button"
      | "one-graphic-button";
  };
  inputs: { name: keyof DefaultDashboardFormDataType; title: string; type: string }[];
  buttons: { text: string }[];
  images: {
    url: string;
    ref: Partial<React.Ref<HTMLImageElement>>;
  }[];
}

export interface DBCreatorType extends DBUserType {}

