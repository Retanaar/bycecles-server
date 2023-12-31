import chalk from "chalk";

export default class Logging {
  public static log = (arg: any) => this.info(arg);
  public static info = (arg: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}][INFO]`),
      typeof arg === "string" ? chalk.blueBright(arg) : arg
    );
  public static warn = (arg: any) =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}][WARN]`),
      typeof arg === "string" ? chalk.yellowBright(arg) : arg
    );
  public static error = (arg: any) =>
    console.log(
      chalk.red(`[${new Date().toLocaleString()}][ERROR]`),
      typeof arg === "string" ? chalk.redBright(arg) : arg
    );
}
