export function generateRandomString(length: number): string {
    const possibleChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let word: string = "";
    for (let i = 0; i < length; ++i) {
        word += possibleChars.charAt(
            Math.floor(Math.random() * possibleChars.length)
        );
    }

    return word;
}