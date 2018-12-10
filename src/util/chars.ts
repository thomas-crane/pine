/**
 * Checks whether the character is a space.
 */
export const isSpace = match(/[\s\n\r]/);
/**
 * Check whether the character is a number.
 */
export const isNum = match(/[0-9]/);
/**
 * Checks whether the character is a
 * valid identifier head.
 */
export const isIdHead = match(/[A-Za-z_]/);
/**
 * Checks whether the character is a valid
 * identifier body.
 */
export const isIdBody = match(/[A-Za-z_0-9]/);
/**
 * Checks whether the character is a
 * recognized parenthesis.
 */
export const isParen = match(/[(){}\[\]]/);

/**
 * Returns a function which tests the input against the `pattern`,
 * but returns false if the input is the empty string, null, or undefined.
 * @param pattern The pattern to match.
 */
function match(pattern: RegExp): (char: string) => boolean {
  return (char: string) => {
    if (!char) {
      return false;
    } else {
      return pattern.test(char);
    }
  };
}
