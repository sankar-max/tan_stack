import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  boolean,
  AnyPgColumn,
  primaryKey,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { user } from "./auth.schema"

/* ---------------- POSTS ---------------- */

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    published: boolean("published").default(false).notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("posts_slug_idx").on(table.slug),
    index("posts_author_idx").on(table.authorId),
    index("posts_published_idx").on(table.published),
    index("posts_updated_idx").on(table.updatedAt),
    index("posts_id_idx").on(table.id),
  ]
)

/* ---------------- COMMENTS ---------------- */

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    parentId: integer("parent_id").references((): AnyPgColumn => comments.id, {
      onDelete: "cascade",
    }),
    depth: integer("depth").default(0).notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("comments_post_idx").on(table.postId),
    index("comments_parent_idx").on(table.parentId),
    index("comments_author_idx").on(table.authorId),
    index("comments_updated_idx").on(table.updatedAt),
    index("comments_id_idx").on(table.id),
  ]
)

/* ---------------- TAGS ---------------- */

export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
  },
  (table) => [index("tags_slug_idx").on(table.slug)]
)

/* ---------------- POST ↔ TAG ---------------- */

export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })]
)

/* ---------------- LIKES ---------------- */

export const postLikes = pgTable(
  "post_likes",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.userId] })]
)

/* ---------------- FOLLOWS ---------------- */

export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.followerId, table.followingId] })]
)

/* ---------------- RELATIONS ---------------- */

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(user, { fields: [posts.authorId], references: [user.id] }),
  comments: many(comments),
  tags: many(postTags),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  author: one(user, { fields: [comments.authorId], references: [user.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}))

/* ---------------- BOOKMARKS ---------------- */

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.postId] })]
)

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(user, { fields: [bookmarks.userId], references: [user.id] }),
  post: one(posts, { fields: [bookmarks.postId], references: [posts.id] }),
}))

/* ---------------- COMMENT LIKES ---------------- */

export const commentLikes = pgTable(
  "comment_likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.commentId] })]
)

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(user, { fields: [commentLikes.userId], references: [user.id] }),
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
}))
