import { UserAuthPayloadType, UserAuthType } from "~/types";

export const serializeAuthFormForAction: (
  authState: UserAuthType
) => UserAuthPayloadType = (authState) => {
  const {
    email,
    firstName,
    lastName,
    password,
    asCreator,
    creatorPass,
    rememberMe,
  } = authState;
  return {
    email,
    firstName,
    lastName,
    password,
    asCreator: asCreator === "on",
    role: asCreator === "on" ? "creator" : "student",
    creatorPass,
    rememberMe: rememberMe === "on",
  } as UserAuthPayloadType;
};
