/*
    Simple error handler
    Built to be expanded later
*/

module.exports = {
    disconnect: () => {
        console.warn(`#> Disconnected`);
    },
    reconnecting: () => {
        console.log(`#> Reconnecting`);
    },
    warn: (err) => {
        console.warn(`#> [WARNING]`, err);
    },
    error: (err) => {
        console.error(`#> [ERROR]`, err.message);
    },
    DiscordAPIError: (err) => {
        console.log(`#> [DiscordAPIError]`, err);
    },
    uncaughtException: (err) => {
        console.error(`#> [uncaughtException] ${err.stack}`);
    },
    unhandledRejection: (err, promise) => {
        console.log(`#> [unhandledRejection]`, err.stack);
    }
}