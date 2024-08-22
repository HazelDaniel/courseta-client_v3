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
export type UserRoleType = "student" | "creator";

export type RankRange = 1 | 2 | 3 | 4 | 5 | 6;

export type StudentRankType =
  | "novice"
  | "amateur"
  | "senior"
  | "professional"
  | "master"
  | "legendary";

export interface ImageMetaType {
  updated_at: string;
  created_at: string;
  id?: string;
  mime_type?: string;
}

export interface RankType {
  level: RankRange;
  title: string;
  icon: string;
  xpRange: { max: string | number; min: string | number };
}

export interface CourseAttemptType {
  lessonCount: number;
  title: string;
  percentageCompleted: number;
  courseURL: string;
}

export interface UserType {
  avatar: string;
  avatarMeta: ImageMetaType;
  firstName: string;
  lastName: string;
  email: string;
  role: "student";
  createdAt: string;
  id: string;
}

export interface SessionUserType {
  id: string;
  email: string;
  role: UserRoleType;
}

export interface CreatorUserType extends UserType {
  role: "creator";
  creatorPass?: string;
  averageCourseRating: number;
  courseReviewCount: number;
  courseCount: number;
  studentCount: number;
}

export interface StudentUserType extends UserType {
  rank: StudentRankType;
  points: number;
}

export interface StudentProfileType {
  user: UserType;
  currentRank: RankRange;
  ranks: {
    value: RankRange;
    dateAttained: string;
  }[];
  points: number;
  attemptedCourses: CourseAttemptType[] | null;
}

export interface CreatorProfileType {
  user: CreatorUserType;
}

export interface AuthType {
  token: string | null;
  user: Pick<StudentProfileType, "user">["user"] | CreatorProfileType["user"];
}

export interface QuizAnswerType {
  correct: boolean;
  text: string;
  quizID: string;
  id: string;
}
export interface QuestionType {
  id: string;
  question: string;
  points: number;
  options: QuizAnswerType[];
  trashed?: boolean;
}

export interface CourseEntryType {
  title: string;
  lessonCount: number;
  progress: number;
  id: number;
  description: string;
  duration: number; // in seconds
  createdAt: string;
  updatedAt: string;
  tags: string[];
  archived?: boolean;
  avatar: string;
  avatarMeta: ImageMetaType;
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

type PossibleAccessmentState = "passed" | "failed";

export interface ExamResultType {
  status: PossibleAccessmentState;
  courseID: string;
  dateAttempted: string;
  percentScore: number;
}

export interface QuizResultType extends ExamResultType {}

export interface AssessmentReportType {
  exams: ExamResultType[];
  quizzes: QuizResultType[];
}

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

export interface CourseAssessmentType {
  status: PossibleAccessmentState;
  courseID: string;
  dateAttempted: string;
  percentScore?: number;
}

export interface AssessmentDataType {
  average: {
    exams: number;
    courses: number;
  };
  exams: ExamAssessmentType[];
  courses: CourseAssessmentType[];
}

export type LessonVariantType = "video" | "text";

export type AssessmentVariantType = "quiz" | "exam";

export interface LessonContentType {
  id: number;
  title: string;
  href: string;
  type?: LessonVariantType;
  duration?: number;
}

export interface LessonContentType2 {
  id: number;
  title: string;
  href: string;
  contentType: LessonVariantType;
  duration?: number;
}

export interface CreatorAssessmentEditViewType {
  questions: QuestionType[];
  assessmentType: AssessmentVariantType;
  parentID: number;
}

export interface GenericAssessmentType {
  id: string;
  questions: QuestionType[];
  completed?: boolean;
  availablePoints: number;
  lostPoints?: number;
  description?: string;
  passScore?: number;
  title?: string;
  assessmentType?: AssessmentVariantType;
  parentID?: number;
}

export interface LessonQuizType {
  id: string;
  title: string;
  totalPoints: number; // questions[] not added because they should be fetched independently
  description: string;
}

export interface CourseExamType extends GenericAssessmentType {
  startDate: string;
  endDate: string;
  duration: number;
  description: string;
}

export interface CourseExamType2 {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  description: string;
  passScore: number;
}

export interface CourseExamDetailType extends CourseExamType2 {
  totalPoints: number;
  questionCount: number;
  questions: QuestionType[];
}

export interface LessonQuizDetailType extends Omit<LessonQuizType, "id"> {
  passScore: number;
  questionCount: number;
  questions: QuestionType[];
}

export interface CourseLessonType {
  id: number;
  title: string;
  completed: boolean;
  contents: LessonContentType[];
  assessment: LessonAssessmentType;
  courseTitle: string;
  duration: number;
}

export interface CourseLessonType2 {
  id: number;
  title: string;
  duration: number;
  contents: LessonContentType2[];
  quiz?: LessonQuizType;
  contentCount: number;
}

export interface LessonContentFormType extends Omit<LessonContentType, "id"> {
  lessonPositionID: number;
}

export interface QuizFormType {
  id?: number;
  lessonPositionID: number;
  title: string;
  passScore: number;
  description: string;
}

export interface LessonCreationFormStateType {
  lessonCount: number;
  lessons: { title: string; positionID: number; quizCount: number }[];
  contents: LessonContentFormType[];
  quizzes: QuizFormType[];
}

export interface CourseDetailType extends CourseEntryType {
  lessons: Partial<CourseLessonType>[];
  exam?: CourseExamType;
}

export interface CourseReviewType {
  studentEmail: string;
  studentID: string;
  avatar: string;
  avatarMeta: ImageMetaType;
  reviewText: string;
  rating: number;
  dateCreated: string;
}

export interface CourseCreatorViewType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarMeta: ImageMetaType;
  averageCourseRating: number;
  courseCount: number;
  studentCount: number;
  courseReviewCount: number;
}

export interface DBUserType extends Pick<UserType, "email" | "name"> {
  points: number;
  rank: string;
  avatar: string;
  avatarMeta: ImageMetaType;
  avatarID?: string;
}

export interface DefaultFormDataType {
  [props: string]: string | undefined;
}
export interface DefaultDashboardFormDataType extends DefaultFormDataType {
  first_name?: string;
  last_name?: string;
  avatar?: string;
  email?: string;
  creator_pass?: string;
  new_password?: string;
  old_password?: string;
}

export interface DefaultCourseFormDataType extends DefaultFormDataType {
  title?: string;
  description?: string;
  tags?: string;
  avatar_url?: string;
}

e;

export interface DashboardCustomInputType<T extends string> {
  heading: string;
  namespace: string;
  form: {
    intent: T;
    actions: string[];
    variant:
      | "one-uni-button"
      | "two-uni-button"
      | "one-dual-button"
      | "one-graphic-button"
      | "one-uni-checkbox"
      | "none";
  };
  inputs: {
    name: keyof DefaultDashboardFormDataType;
    title: string;
    type: HTMLInputElement["type"] | "textarea";
    min?: number;
    max?: number;
  }[];
  buttons: { text: string; name?: string }[];
  images: {
    url: string;
    ref: Partial<React.Ref<HTMLImageElement>>;
    id?: string;
  }[];
}

export interface DBCreatorType extends DBUserType {}

//RE-USABLE REDUCER TYPES
export interface StateAnswerType
  extends Partial<Omit<QuizAnswerType, "quizID">> {
  questionPosition: number;
  id: string;
  loaded?: boolean;
}

export interface StateQuestionType
  extends Partial<Omit<QuestionType, "options">> {
  position: number;
  trashed?: boolean;
  loaded?: boolean;
}

//RE-USABLE STATE TYPES
export interface QuestionModalStateType {
  question: Omit<StateQuestionType, "id">;
  answers: Partial<StateAnswerType>[];
}

export interface CourseEditStateType {
  title: string;
  description: string;
  thumbnail: string;
  tags: string;
}

export interface AssessmentEditStateType {
  title?: string;
  passScore?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
}

export interface LessonContentAdditionStateType
  extends Partial<Omit<LessonContentType, "id">> {}

export interface StateQuizType extends GenericAssessmentType {
  lessonPosition: number;
}

export interface StateContentType extends Partial<LessonContentType> {
  lessonPosition: number;
}

// SERIALIZER DATA TYPE

export interface ImageSearchPayloadType {
  mimeType: string; //raw base64
}

export interface ImageUpdatePayloadType {
  newAvatar: [string, string];
  avatarMeta: ImageMetaType;
}

export interface ImageCreationPayloadType {
  id: string;
  imageUrl: string;
}

export interface CourseCreationPayloadType
  extends Partial<{
    info: Partial<CourseEditStateType>;
    images: [string | null, string | null];
  }> {}

export interface CourseEditPayloadType extends CourseCreationPayloadType {}

export interface ActionButtonType<T extends object> {
  intent: string;
  payload: T;
}

export type UserAuthIntentType = "LOGOUT";

export interface UserAuthActionType
  extends ActionButtonType<Omit<SessionUserType, "email">> {
  intent: UserAuthIntentType;
}

export interface StudentCourseActionType
  extends ActionButtonType<{ studentID: string }> {
  intent: "ENROLL";
}

export type CoursesActionIntentType = "DELETE" | "ARCHIVE" | "UNARCHIVE";

export interface CreatorCoursesActionType
  extends ActionButtonType<{ courseID: number }> {
  intent: CoursesActionIntentType;
}

export interface CourseDeletionActionType
  extends ActionButtonType<{ courseID: number }> {
  intent: "DELETE";
}

export type CourseEditActionIntentType =
  | "UPDATE_INFO"
  | "DELETE_CONTENT"
  | "DELETE_QUIZ"
  | "DELETE_EXAM"
  | "ADD_LESSONS"
  | "ADD_LESSON_CONTENT"
  | "DELETE_LESSON";

export interface CourseArchiveActionType
  extends ActionButtonType<{ courseID: number }> {
  intent: "ARCHIVE" | "UNARCHIVE";
}

export interface CourseInfoEditActionType
  extends ActionButtonType<Partial<CourseEditPayloadType>> {
  intent: CourseEditActionIntentType;
}

export interface CourseItemDeletionActionType
  extends ActionButtonType<{
    contentID?: number;
    quizID?: string;
    examID?: string;
    lessonID?: number;
    courseID?: number;
  }> {
  intent: Exclude<CourseEditActionIntentType, "UPDATE_INFO">;
}

export interface LessonCreationPayloadType {
  courseID: number;
  title: string;
  positionID: number;
}

export interface LessonContentCreationPayloadType {
  title: string;
  href: string;
  contentType: LessonVariantType;
  duration: number;
  lessonPositionID: number;
}

export interface LessonQuizCreationPayloadType {
  quizTitle: string;
  description: string;
  passScore: number;
  lessonPositionID: number;
}

export interface LessonAdditionPayloadType {
  lessonData: LessonCreationPayloadType[];
  lessonContentData: LessonContentCreationPayloadType[];
  lessonQuizData: LessonQuizCreationPayloadType[];
}

export interface LessonAdditionActionType
  extends ActionButtonType<LessonAdditionPayloadType> {
  intent: "ADD_LESSONS";
}

export interface LessonContentAdditionPayloadType
  extends Omit<LessonContentAdditionStateType, "type"> {
  contentType: LessonVariantType;
  lessonID: number;
}

export interface LessonContentCreationActionType
  extends ActionButtonType<LessonContentAdditionPayloadType> {
  intent: "ADD_LESSON_CONTENT";
}

export interface QuizCreationPayloadType
  extends Pick<LessonAssessmentType, "description" | "passScore"> {
  parentEntityID?: number;
  quizTitle: string;
}

export type QuizCreationActionIntentType = "ADD_QUIZ";

export interface QuizCreationActionType
  extends ActionButtonType<QuizCreationPayloadType> {
  intent: QuizCreationActionIntentType;
}

export type ExamCreationActionIntentType = "ADD_EXAM";

export interface ExamCreationPayloadType extends AssessmentEditStateType {
  parentEntityID?: number;
}

export interface ExamCreationActionType
  extends ActionButtonType<ExamCreationPayloadType> {
  intent: ExamCreationActionIntentType;
}

export type AssessmentEditActionIntentType = "UPDATE_EXAM" | "UPDATE_QUIZ";

export interface QuestionAdditionPayloadType {
  questionText: string;
  points: number;
  positionID: number;
  assessmentID: string;
  assessmentType: AssessmentVariantType;
}

export interface AnswerAdditionPayloadType {
  answerText: string;
  isCorrect: boolean;
  questionPositionID: number;
}

export interface AssessmentEditPayloadType {
  parentEntityID?: number;
  questionDataList: QuestionAdditionPayloadType[];
  answerDataList: AnswerAdditionPayloadType[];
  trashQuestionIDList: number[];
}

export interface AssessmentEditActionType
  extends ActionButtonType<AssessmentEditPayloadType> {
  intent: AssessmentEditActionIntentType;
}

export interface AssessmentSubmissionPayloadType {
  questionIDList: number[];
  answerList: { question_id: number; answer_id: number }[];
  submissionTime?: string;
  assessmentType: AssessmentVariantType;
}

export type AssessmentSubmissionIntentType = "SUBMIT";

export interface AssessmentSubmissionActionType
  extends ActionButtonType<AssessmentSubmissionPayloadType> {
  intent: AssessmentSubmissionIntentType;
}

export type DashboardEditActionIntentType =
  | "UPDATE_NAMES"
  | "UPDATE_EMAIL"
  | "UPDATE_PASSWORD"
  | "UPDATE_AVATAR"
  | "REQUEST_NEW_PASS";

export interface DashboardNamesUpdateFormStateType {
  intent: "UPDATE_NAMES";
  firstName: string;
  lastName: string;
}

export interface DashboardEmailUpdateFormStateType {
  intent: "UPDATE_EMAIL";
  email: string;
}

export interface DashboardPasswordUpdateFormStateType {
  intent: "UPDATE_PASSWORD";
  newPassword: string;
  oldPassword: string;
}

export interface DashboardPassUpdateFormStateType {
  intent: "REQUEST_NEW_PASS";
}

export interface DashboardAvatarUpdateFormStateType {
  intent: "UPDATE_AVATAR";
  oldAvatarID?: string;
  newAvatar: string;
}

export interface DashboardNamesUpdateActionType
  extends ActionButtonType<Omit<DashboardNamesUpdateFormStateType, "intent">> {
  intent: "UPDATE_NAMES";
}

export interface DashboardEmailUpdateActionType
  extends ActionButtonType<Omit<DashboardEmailUpdateFormStateType, "intent">> {
  intent: "UPDATE_EMAIL";
}

export interface DashboardPasswordUpdateActionType
  extends ActionButtonType<
    Omit<DashboardPasswordUpdateFormStateType, "intent">
  > {
  intent: "UPDATE_PASSWORD";
}

export interface DashboardAvatarUpdateFormParsedType
  extends Omit<DashboardAvatarUpdateFormStateType, "intent"> {
  newAvatar: [string, string];
  avatarMeta: Partial<ImageMetaType>;
}

export interface DashboardAvatarUpdateActionType
  extends ActionButtonType<DashboardAvatarUpdateFormParsedType> {
  intent: "UPDATE_AVATAR";
}

export interface DashboardPassUpdateActionType
  extends ActionButtonType<Omit<DashboardPassUpdateFormStateType, "intent">> {
  intent: "UPDATE_PASS";
}

export type AuthUserIntentType = "SIGN_IN" | "SIGN_UP";

export interface UserAuthType
  extends Pick<UserType, "email" | "firstName" | "lastName" | "role"> {
  password: string;
  rememberMe?: "on";
  creatorPass?: string;
  asCreator?: "on";
}

export interface UserAuthPayloadType extends UserAuthType {
  rememberMe?: boolean;
  asCreator?: boolean;
}

export interface UserSigninActionType
  extends ActionButtonType<UserAuthPayloadType> {
  intent: "SIGN_IN";
}

export interface UserSignupActionType
  extends ActionButtonType<UserAuthPayloadType> {
  intent: "SIGN_UP";
}

export interface StudentReviewPayloadType {
  studentID: string;
  reviewText: string;
  rating: number;
}

export interface StudentReviewActionType
  extends ActionButtonType<StudentReviewPayloadType> {
  intent: "REVIEW_COURSE";
}

export interface StudentEnrollPayloadType {
  studentID: string;
}

export interface StudentEnrollActionType
  extends ActionButtonType<StudentEnrollPayloadType> {
  intent: "ENROLL" | "UNENROLL";
}

// COOKIES AND PAYLOAD
export interface RedirectPayloadType {
  location?: string;
  replace?: boolean;
}

// RESPONSES

export interface ActionResponseType<T> {
  data: T;
  error: string | null;
}

export interface LoaderResponseType<T> {
  data: T;
  error: string;
}
