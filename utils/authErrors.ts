import { FirebaseError } from "firebase/app";

export const getRegisterErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return "Registration failed. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid school email.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Could not create account. Please try again.";
  }
};

export const getLoginErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return "Login failed. Please try again.";
  }

  switch (error.code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Login failed. Please try again.";
  }
};
