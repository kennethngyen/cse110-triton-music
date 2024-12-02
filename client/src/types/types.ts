export type FeedItem = {
  content: string;
  songId: number;
  userId: string;
  username: string;
  userPfp: string;
};

export type User = {
  id: string;
  name: string;
  email:string;
}