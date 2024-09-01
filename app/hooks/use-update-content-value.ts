import { useContext, useEffect, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import {
  LessonUpdateContext,
  LessonUpdateContextValueType,
} from "~/contexts/lesson-update.context";

import {
  LessonUpdateActionType,
  __updateContent,
  __updateQuiz,
} from "~/reducers/lesson-update.reducer";
import { LessonContentFormType, QuizFormType } from "~/types";

export function useUpdateContentValue<T>(defaultValue: T, timeout: number) {
  const [contentState, setContentState] = useState<T>(defaultValue);
  const debouncedValue = useDebounce<T>(contentState, timeout);
  const { lessonUpdateDispatch } = useContext(
    LessonUpdateContext
  ) as LessonUpdateContextValueType;

  useEffect(() => {
    if (debouncedValue) lessonUpdateDispatch(__updateContent(debouncedValue));
  }, [debouncedValue, lessonUpdateDispatch]);
  return { setContentState };
}

export function useUpdateQuizValue<T>(defaultValue: T, timeout: number) {
  const [quizState, setQuizState] = useState<T>(defaultValue);
  const debouncedValue = useDebounce<T>(quizState, timeout);
  const { lessonUpdateDispatch } = useContext(
    LessonUpdateContext
  ) as LessonUpdateContextValueType;

  useEffect(() => {
    if (debouncedValue) lessonUpdateDispatch(__updateContent(debouncedValue));
  }, [debouncedValue, lessonUpdateDispatch]);
  return { setQuizState };
}

export function useUpdateLessonItemValue<
  T extends Partial<QuizFormType | LessonContentFormType>
>(defaultValue: T, itemType: "quiz" | "content", timeout: number = 1000) {
  const [state, dispatch] = useState<T>(defaultValue);
  const debouncedValue = useDebounce<T>(state, timeout);
  const updateContext = useContext(LessonUpdateContext);
  const { lessonUpdateDispatch } = updateContext;

  useEffect(() => {
    let actionProducer: LessonUpdateActionType =
      itemType === "quiz"
        ? __updateQuiz(debouncedValue)
        : __updateContent(debouncedValue);
    if (Object.keys(debouncedValue).length)
      lessonUpdateDispatch(actionProducer);
  }, [debouncedValue, lessonUpdateDispatch]);
  return { dispatch };
}
