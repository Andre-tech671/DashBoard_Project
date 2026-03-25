import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL, USER_ROLES } from "../constants";

const baseUrl = (BACKEND_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL: `${baseUrl}/auth`,
  user: {
    additionalFields: {
      role: {
        type: USER_ROLES,
        required: true,
        defaultValue: "student",
        input: true,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});