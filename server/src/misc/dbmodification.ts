import { eq } from "drizzle-orm/sql";
import { db } from "../db/db";
import { usersTable } from "../db/schema";
import { encrypt, decrypt } from "./encryption";

//TODO: alter when spotifytoken column is added

export async function updateRefreshTokenDB(email: string, token: string) {
    await db.update(usersTable)
        .set({ name: encrypt(token) })
        .where(eq(usersTable.email, email));
}

export async function getRefreshTokenDB(email: string) : Promise<string> {
    const result = await db.select({ token: usersTable.name }).from(usersTable).where(eq(usersTable.email, email));
    const { token } = result[0];
    return decrypt(token);
}