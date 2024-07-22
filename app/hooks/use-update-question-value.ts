import { useEffect, useState } from "react";
import { QuestionModalStateType } from "~/types";
import { useDebounce } from "./use-debounce";

export function useUpdateQuestionValue<
  T extends Partial<QuestionModalStateType>
>(
  defaultValue: T,
  timeout: number = 1000,
  dispatchFunction: React.Dispatch<React.SetStateAction<QuestionModalStateType>>
) {
  const [state, dispatch] = useState<T>(defaultValue);
  const debouncedValue = useDebounce<T>(state, timeout);

  useEffect(() => {
    if (!Object.keys(debouncedValue).length) return;
    dispatchFunction(debouncedValue as QuestionModalStateType);
  }, [debouncedValue, dispatchFunction]);
  return { state, dispatch };
}
