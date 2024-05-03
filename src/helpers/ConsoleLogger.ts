export enum ConsoleColor {
    "RED" = "31",
    "GREEN" = "32",
    "YELLOW" = "33",
    "BLUE" = "34",
    "PURPLE" = "35",
    "CYAN" = "36",
}

export class ConsoleLogger {
    static PrintMessage(message: string, color?: ConsoleColor) {
        if (!color) {
            console.log(`\u001b[1;33m${message} \u001b[0m`)
        } else {
            console.log(`\u001b[1;${color}m${message} \u001b[0m`)
        }
    }
}
