import {
  DashboardAvatarUpdateActionType,
  DashboardAvatarUpdateFormStateType,
  DashboardEmailUpdateActionType,
  DashboardEmailUpdateFormStateType,
  DashboardNamesUpdateActionType,
  DashboardNamesUpdateFormStateType,
  DashboardPassUpdateActionType,
  DashboardPassUpdateFormStateType,
  DashboardPasswordUpdateActionType,
  DashboardPasswordUpdateFormStateType,
} from "~/types";

export const serializeNamesUpdateFormInAction: (
  updateState: DashboardNamesUpdateFormStateType
) => DashboardNamesUpdateActionType = (updateState) => {
  const { firstName, lastName } = updateState;
  return {
    intent: "UPDATE_NAMES",
    payload: { firstName, lastName },
  } as DashboardNamesUpdateActionType;
};

export const serializeEmailUpdateFormInAction: (
  updateState: DashboardEmailUpdateFormStateType
) => DashboardEmailUpdateActionType = (updateState) => {
  const { email } = updateState;
  return {
    intent: "UPDATE_EMAIL",
    payload: { email },
  } as DashboardEmailUpdateActionType;
};

export const serializePasswordUpdateFormInAction: (
  updateState: DashboardPasswordUpdateFormStateType
) => DashboardPasswordUpdateActionType = (updateState) => {
  const { newPassword, oldPassword } = updateState;
  return {
    intent: "UPDATE_PASSWORD",
    payload: { newPassword, oldPassword },
  } as DashboardPasswordUpdateActionType;
};

export const serializePassUpdateFormInAction: (
  updateState: DashboardPassUpdateFormStateType
) => DashboardPassUpdateActionType = (updateState) => {
  return {
    intent: "UPDATE_PASS",
    payload: {},
  } as DashboardPassUpdateActionType;
};

export const serializeAvatarUpdateFormInAction: (
  updateState: DashboardAvatarUpdateFormStateType
) => DashboardAvatarUpdateActionType = (updateState) => {
  const { newAvatar, oldAvatarID } = updateState;
  return {
    intent: "UPDATE_AVATAR",
    payload: {
      newAvatar: JSON.parse(newAvatar) as [string, string],
      oldAvatarID,
      avatarMeta: {id: oldAvatarID}
    },
  } as DashboardAvatarUpdateActionType;
};
