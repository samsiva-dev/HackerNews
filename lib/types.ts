export interface HNItem {
  id: number;
  type: "story" | "comment" | "ask" | "show" | "job" | "poll" | "pollopt";
  by?: string;
  time: number;
  text?: string;
  dead?: boolean;
  deleted?: boolean;
  parent?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  descendants?: number;
}

export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export type FeedType = "top" | "new" | "best" | "ask" | "show" | "job";

export interface CommentNode {
  item: HNItem;
  children: CommentNode[];
}
