export interface ActiveUserData {
  /**
   * The "subject" of the token. the value of this property is the user ID
   * that granted this token.
   */
  id: number;

  /**
   * The subject's (user) email.
   */
  email: string;

  /**
   * The subject's (user) name.
   */
  name: string;
}
