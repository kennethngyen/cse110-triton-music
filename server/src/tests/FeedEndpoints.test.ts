const request = require("supertest");
const { app } = require("../index"); 
import { feedItems } from "../constants";

describe("GET /feed", () => {
    test("should return the full feed", async () => {
        const res = await request(app).get("/feed");

        expect(res.status).toBe(200);
        expect(res.body.data).toStrictEqual(feedItems);
    });
});

describe("GET /feed/:userID", ()=>{
    test("user's feed where the user has a friend", async () => {
        const res = await request(app).get("/feed/234eda1");

        expect(res.status).toBe(200);
        expect(res.body.data).toStrictEqual([feedItems[1]]);
    });

    test("user's feed where the user has no friends", async () => {
        const res = await request(app).get("/feed/89a6be1");

        expect(res.status).toBe(200);
        expect(res.body.data).toStrictEqual([]);
    });

    test("query with invalid userID", async () => {
        const res = await request(app).get("/feed/420aef7");

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("user does not exist");
    });
    
});

describe("POST /feed", ()=>{
    test("post a new valid feed item", async () => {
        const oldFeed = feedItems.concat([]);

        const newFeedItem = {
            id: "2",
            content: ":)",
            songID: "23da4e89",
            userID: "89a6be1",
            username: "donald_duck",
        };

        const res = await request(app).post("/feed/").send(newFeedItem);

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(newFeedItem);

        const res2 = await request(app).get("/feed");

        expect(res2.status).toBe(200);
        expect(res2.body.data).toStrictEqual(oldFeed.concat(newFeedItem));
    });

    test("post an incomplete item", async () => {
        const newFeedItem = {
            id: "2",
            content: ":)",
            userID: "89a6be1",
            username: "donald_duck",
        };

        const res = await request(app).post("/feed/").send(newFeedItem);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Missing required fields");
    });
});
