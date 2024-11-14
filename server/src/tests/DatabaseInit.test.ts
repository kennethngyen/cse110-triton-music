import { eq } from "drizzle-orm/sql";
import { db } from "../db/db";
import { usersTable } from "../db/schema";

describe("Add one user to User table, then get", () => {
    test("should add correctly", async () => {
        // const randString = (Math.random() + 1).toString(36).substring(7);
        const name = "Michael Coblenz";
        const email = "mcoblenz@ucsd.edu";

        // to stop the UNIQUE error from the email
        await db.delete(usersTable).where(eq(usersTable.email, email));

        const result = await db.insert(usersTable).values({ name, email }).returning();
        expect(result[0].name).toBe(name);
        expect(result[0].email).toBe(email);
    });
    test("should pull users correctly", async () => {
        const allUsers = await db.select().from(usersTable);
        expect(allUsers.length).toBeGreaterThan(0);
    });
});
