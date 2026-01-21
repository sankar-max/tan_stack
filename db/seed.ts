import fs from "fs"
import path from "path"
import { db } from "."
import { posts, comments, tags, postTags, postLikes, follows } from "./schema"

// Resolve path to db/seed-data.json
const filePath = path.resolve(process.cwd(), "db/seed-data.json")

const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))

async function seed() {
  console.log("🌱 Seeding database from JSON...")

 await db.insert(tags).values(data.tags).onConflictDoNothing()
 await db.insert(posts).values(data.posts).onConflictDoNothing()
 await db.insert(postTags).values(data.postTags).onConflictDoNothing()
 await db.insert(comments).values(data.comments).onConflictDoNothing()
 await db.insert(postLikes).values(data.postLikes).onConflictDoNothing()
 await db.insert(follows).values(data.follows).onConflictDoNothing()


  console.log("✅ JSON seed complete!")
}

seed().catch(console.error)
