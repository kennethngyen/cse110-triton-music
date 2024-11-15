import { FeedItem, User } from "../types";
import { Request, Response } from "express";

/**
 * posts the client's feed item to the feedItems const on the backend
 * TODO: eventually add the feed item to the database
 */
export function createFeedItem(
    req: Request,
    res: Response,
    feedItems: FeedItem[]
) {
    const { id, content, songID, userID, username } = req.body;

    if (!id || !content || !songID || !userID || !username) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const newFeedItem: FeedItem = {
        id: id,
        content: content,
        songID: songID,
        userID: userID,
        username: username,
    };

    feedItems.push(newFeedItem);
    res.status(201).send(newFeedItem);
}

/* export function deleteFeedItem(req: Request, res: Response, feedItems: FeedItem[]) {

} */

/**
 * gets the entire feedItems const to the client
 */
export function getFeed(req: Request, res: Response, feedItems: FeedItem[]) {
    res.status(200).send({ data: feedItems });
}

/**
 * filters the feedItems for only the friends of the client
 */
export function getFriendFeed(
    req: Request,
    res: Response,
    feedItems: FeedItem[],
    users: User[]
) {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).send({ error: "Missing required userID" });
    }

    /*
    perhaps a faster way to do this,
    consider changing this implementation for scalability
    */

    const index = users.findIndex((user: User) => user.userID == userID);
    if (index < 0) {
        return res.status(400).send({ error: "user does not exist" });
    }

    const friends = users[index].friends;
    const filteredFeed = feedItems.filter((item: FeedItem) => friends.indexOf(item.userID) != -1);

    res.status(200).send({ data: filteredFeed });
}
