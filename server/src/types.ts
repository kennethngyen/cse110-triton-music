/**
 * Represents a single item in a user's home feed,
 * based on their friend's activity/song recommendations
 * 
 * id: unique id of the feed item
 * content: text inside the feedbox
 * songID: id of the relevant song
 * userID: id of the relevant user
 * username: username of the relevant user
 * 
 */
export interface FeedItem {
  id: string
  content: string;
  songID: string;
  userID: string;
  username: string;
};

/**
 * Represents a single user of the app
 * 
 * userID: id of the user
 * username: what is displayed to other clients
 * friends: list of the user's friends' userIDs
 */
export interface User {
  userID: string;
  username: string;
  friends: string[];
}
