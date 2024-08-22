import "~/styles/lesson-content-addition-modal.css";
import { LessonItemAdditionBox } from "./lesson-item-addition-box";
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ModalContext, ModalContextValueType } from "~/contexts/modal.context";
import { __hideModal } from "~/reducers/modal.reducer";
import {
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import {
  LessonAdditionActionType,
  LessonContentAdditionPayloadType,
  LessonContentAdditionStateType,
  LessonContentCreationActionType,
} from "~/types";
import { serializeLessonContentForCreateAction } from "~/serializers/lesson-content.serializer";

export const LessonContentAdditionModal: React.FC = React.memo(() => {
  const { modalState, modalDispatch } = useContext(
    ModalContext
  ) as ModalContextValueType;
  const location = useLocation();
  const navigate = useNavigate();
  const lessonID = useMemo<string>(
    () => (location.hash || ".").split(".")[1],
    [location.hash]
  );
  const [contentAdditionState, setContentAdditionState] =
    useState<LessonContentAdditionStateType>({});

  const contentAdditionStateHandler = useCallback(
    (
      source: ChangeEvent,
      setFunction: React.Dispatch<
        React.SetStateAction<LessonContentAdditionStateType>
      >,
      keySelector: keyof LessonContentAdditionStateType,
      isNumeric?: boolean,
      isCheckable?: boolean,
      checkedValue?: string
    ) => {
      const target: HTMLInputElement = source.target as HTMLInputElement;
      setFunction((prevState) => {
        if (!isCheckable && target.value === prevState[keySelector]) {
          return prevState;
        } else if (isCheckable && checkedValue === prevState[keySelector]) {
          return prevState;
        }
        if (isCheckable) {
          return {
            ...prevState,
            [keySelector]: isNumeric ? +(checkedValue as string) : checkedValue,
          };
        }
        return {
          ...prevState,
          [keySelector]: isNumeric ? +target.value : target.value || target,
        };
      });
    },
    []
  );

  const submit = useSubmit();
  if (Number.isNaN(+lessonID) || !lessonID.length) {
    return null;
  }

  // console.log("the lesson content addition state is ");
  // console.log(contentAdditionState);

  return (
    <div
      className={`lesson_content_addition_modal${
        modalState.lessonContentAdditionModal ? " visible" : ""
      }`}
    >
      <div className="lesson_content_addition_modal_top">
        <h2>add lesson content</h2>
        <span
          onClick={() => {
            modalDispatch(__hideModal("lessonContentAdditionModal"));
          }}
        >
          <svg
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 2L2 26M2 2L26 26"
              stroke="var(--icon-fill-here)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="lesson_content_addition_modal_middle">
        <ul className="content_addition_area">
          <LessonItemAdditionBox
            lessonPositionID={+lessonID}
            itemType="content"
            stateHandler={contentAdditionStateHandler}
            additionDispatch={setContentAdditionState}
          />
        </ul>
      </div>
      <div className="lesson_content_addition_modal_bottom">
        <button
          onClick={() => {
            navigate(".", { replace: true });
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const payload = serializeLessonContentForCreateAction(
              contentAdditionState,
              +lessonID
            );
            const submitPayload: LessonContentCreationActionType = {
              intent: "ADD_LESSON_CONTENT",
              payload,
            };
            submit(submitPayload as any, {
              method: "post",
              action: "./",
              encType: "application/json",
              navigate: false,
            });
            navigate(".", { replace: true });
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
});

export default LessonContentAdditionModal;
