export const RESEND_OTP_EMAIL_LINK = 'https://www.udemy.com/join/two-factor/';
export const LOGIN_LINK = 'https://www.udemy.com/join/login-popup/';
export const MFA_INFO_LINK = 'https://teach.udemy.com/mfa-instructors/';
export const MX_MFA_INFO_LINK = 'https://support.udemy.com/hc/en-us/articles/4420349685015';

/* eslint-disable */
const MAX_ATTEMPT = gettext("You’ve reached the maximum number of attempts. Please wait and retry with a new code.")  // DISPLAY_ERROR
const IS_INVALID = gettext("The code you entered is invalid. Please try again.")  // DISPLAY_ERROR
const IS_USED= gettext("This code has been used before. Please wait for a few minutes and retry with another code.")  // DISPLAY_ERROR

export const DISPLAYABLE_TOTP_ERROR_TYPE = [MAX_ATTEMPT, IS_INVALID, IS_USED]
