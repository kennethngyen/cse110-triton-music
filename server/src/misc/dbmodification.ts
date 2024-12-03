import { eq } from "drizzle-orm/sql";
import { db } from "../db/db";
import { auth } from "../db/schema";
import { encrypt, decrypt } from "./encryption";

export async function updateRefreshTokenDB(userID: string, token: string) {
    await db.update(auth)
        .set({ spotifyRefreshToken: encrypt(token) })
        .where(eq(auth.id, userID));
}

export async function getRefreshTokenDB(userID: string) : Promise<string> {
    const result = await db.select({ token: auth.spotifyRefreshToken }).from(auth).where(eq(auth.id, userID));
    const { token } = result[0];
    if (!token) {
        return "";
    }
    return decrypt(token);
}