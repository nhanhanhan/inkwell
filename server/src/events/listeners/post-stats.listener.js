// server/src/events/listeners/post-stats.listener.js
//
// Exercise 1: a second listener on the same "post.published" event,
// proving the Observer pattern supports multiple independent reactions
// to one action without PostService.publish() knowing about either.

import { EventBus } from "../event-bus.js";

export const postStats = {
  totalPublished: 0,
};

EventBus.on("post.published", () => {
  postStats.totalPublished += 1;
});
