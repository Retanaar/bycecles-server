export function testNumber(str: string): boolean {
  const regExp: RegExp = /^-?\d+\.?\d*$/;
  return regExp.test(str);
}
