import moment from "moment";
const log = console.log;



// Color functions using ANSI escape codes
// https://en.wikipedia.org/wiki/ANSI_escape_code
function clrCode(message: string, n: number): string {
    return `\x1b[${n}m` + message + "\x1b[0m";
}
const red       = (m: string) => clrCode(m, 91);
const green     = (m: string) => clrCode(m, 92);
const yellow    = (m: string) => clrCode(m, 93);
const blue      = (m: string) => clrCode(m, 94);
const magenta   = (m: string) => clrCode(m, 95);
const grey      = (m: string) => clrCode(m, 90);



// Returns a formatted timestamp
const now = () => moment().format("YYYY-MM-DD HH:mm:ss");



// All exported functions
function log_(message: string) {
    log(grey(`[${now()}] `) + `LOG: ${message}`);
}

function info(message: string) {
    log(grey(`[${now()}] `) + blue("INFO: ") + message);
}

function error(errtype: string|number, message: string) {
    log(grey(`[${now()}] `) + red(`ERROR (${errtype}): `) + message);
}

function warn(message: string) {
    log(grey(`[${now()}] `) + yellow("WARN: ") + message);
}

function debug(message: string) {
    log(grey(`[${now()}] `) + green("DEBUG: ") + message);
}
function data(args: object) {
    log(grey(`[${now()}] `) + green("DEBUG-DATA: "));
    for (const [ key, value ] of Object.entries(args)) {
        process.stdout.write(magenta(`${key}: `));   
        log(value);
    }
}

/**
 * Simple logger
 */
export default {
    error,
    info,
    warn,
    log: log_,
    debug,
    now,
    data
}