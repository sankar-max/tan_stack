# 🚀 Backend Mastery Roadmap: Beginner → Senior
> Complete guide covering everything you need to know: HTTP, Node.js, TypeScript, PostgreSQL, Neon, Drizzle, Auth, DevOps, System Design, and more.

---

# 📚 TABLE OF CONTENTS

1. [How the Internet Works](#1-how-the-internet-works)
2. [HTTP & APIs](#2-http--apis)
3. [Node.js Deep Dive](#3-nodejs-deep-dive)
4. [TypeScript for Backend](#4-typescript-for-backend)
5. [Building Servers](#5-building-servers)
6. [Databases — Core Concepts](#6-databases--core-concepts)
7. [SQL Mastery](#7-sql-mastery)
8. [PostgreSQL Deep Dive](#8-postgresql-deep-dive)
9. [Neon (Serverless Postgres)](#9-neon-serverless-postgres)
10. [Drizzle ORM — Complete Guide](#10-drizzle-orm--complete-guide)
11. [Data Modeling & Schema Design](#11-data-modeling--schema-design)
12. [Authentication & Authorization](#12-authentication--authorization)
13. [Security](#13-security)
14. [Validation & Error Handling](#14-validation--error-handling)
15. [File Uploads & Storage](#15-file-uploads--storage)
16. [Email & Notifications](#16-email--notifications)
17. [Background Jobs & Queues](#17-background-jobs--queues)
18. [Caching](#18-caching)
19. [WebSockets & Realtime](#19-websockets--realtime)
20. [Testing](#20-testing)
21. [Architecture Patterns](#21-architecture-patterns)
22. [DevOps & Deployment](#22-devops--deployment)
23. [Performance & Optimization](#23-performance--optimization)
24. [System Design](#24-system-design)
25. [Monitoring & Observability](#25-monitoring--observability)
26. [Senior Engineer Mindset](#26-senior-engineer-mindset)
27. [Your Modern Stack](#27-your-modern-stack)
28. [Learning Order & Projects](#28-learning-order--projects)

---

# 1. How the Internet Works

Before writing a single line of backend code, understand what's actually happening when a user visits a website.

## DNS (Domain Name System)
- DNS is the internet's phone book
- When you type `google.com`, your computer asks a DNS server "what IP address is this?"
- DNS returns an IP like `142.250.80.46`
- Your computer then connects to that IP
- **Key terms**: A record, CNAME, TTL, nameservers

## IP Addresses & Ports
- Every device on the internet has an IP address
- Ports are like apartment numbers — same building (IP), different rooms
- Common ports: `80` (HTTP), `443` (HTTPS), `5432` (PostgreSQL), `3000` (dev servers)
- Your server listens on a port for incoming connections

## TCP/IP
- TCP = Transmission Control Protocol — ensures data arrives correctly
- IP = Internet Protocol — handles routing/addressing
- TCP does a "3-way handshake" before sending data (SYN → SYN-ACK → ACK)
- Data is split into packets, sent, and reassembled

## TLS/SSL (HTTPS)
- TLS encrypts data between client and server
- HTTPS = HTTP + TLS
- Certificates prove you're talking to the real server (not an imposter)
- Let's Encrypt gives free certificates

## How a Request Actually Works (Full Flow)
```
1. User types https://myapp.com/api/users
2. Browser checks DNS → gets IP 123.456.789.0
3. Browser opens TCP connection to port 443
4. TLS handshake — encryption established
5. Browser sends HTTP GET request
6. Server receives request, processes it
7. Server queries database
8. Server sends back HTTP response with JSON
9. Browser receives response
10. Frontend renders the data
```

---

# 2. HTTP & APIs

## HTTP Methods
| Method | Purpose | Has Body? | Idempotent? |
|--------|---------|-----------|-------------|
| GET | Read data | No | Yes |
| POST | Create data | Yes | No |
| PUT | Replace data | Yes | Yes |
| PATCH | Update part of data | Yes | No |
| DELETE | Delete data | No | Yes |

**Idempotent** = doing it multiple times has the same effect as doing it once.

## HTTP Status Codes
```
2xx — Success
  200 OK
  201 Created
  204 No Content (success, no body to return)

3xx — Redirect
  301 Moved Permanently
  302 Found (temporary redirect)
  304 Not Modified (cached version is fine)

4xx — Client Error (YOU made a mistake)
  400 Bad Request (invalid data sent)
  401 Unauthorized (not logged in)
  403 Forbidden (logged in but no permission)
  404 Not Found
  409 Conflict (e.g. email already exists)
  422 Unprocessable Entity (validation failed)
  429 Too Many Requests (rate limited)

5xx — Server Error (SERVER made a mistake)
  500 Internal Server Error
  502 Bad Gateway
  503 Service Unavailable
```

## HTTP Headers
```
Request Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
  Accept: application/json
  Cookie: session=abc123

Response Headers:
  Content-Type: application/json
  Set-Cookie: session=abc123; HttpOnly
  Cache-Control: max-age=3600
  Access-Control-Allow-Origin: *
```

## REST API Design Principles
```
# Resources are nouns, not verbs
GET    /users          → list all users
GET    /users/42       → get user with id 42
POST   /users          → create a user
PUT    /users/42       → replace user 42
PATCH  /users/42       → update part of user 42
DELETE /users/42       → delete user 42

# Nested resources
GET    /users/42/posts       → posts by user 42
POST   /users/42/posts       → create post for user 42
GET    /users/42/posts/5     → post 5 by user 42

# Filtering, sorting, pagination
GET /posts?status=published
GET /posts?sort=createdAt&order=desc
GET /posts?page=2&limit=20
GET /posts?search=javascript

# Versioning
GET /api/v1/users
GET /api/v2/users
```

## REST Best Practices
- Return consistent JSON structures
- Always return appropriate status codes
- Use plural nouns for resources (`/users` not `/user`)
- Keep URLs lowercase with hyphens
- Return the created/updated resource in the response
- Include pagination metadata in list responses

## GraphQL (Alternative to REST)
- Single endpoint (`/graphql`)
- Client asks for exactly what it needs
- No over-fetching or under-fetching
- Better for complex, nested data
- Higher learning curve
- Tools: Apollo Server, Pothos, Strawberry

## Request/Response Body
```json
// Request body (POST /users)
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28
}

// Response body
{
  "id": 42,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28,
  "createdAt": "2025-01-15T10:30:00Z"
}

// List response with pagination
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

## CORS (Cross-Origin Resource Sharing)
- Browser security: blocks requests from different origins by default
- Origin = protocol + domain + port (`https://myapp.com:3000`)
- Your server must explicitly allow cross-origin requests
- Simple requests vs Preflight requests (OPTIONS method)

```typescript
// Allow specific origin
app.use(cors({
  origin: 'https://myfrontend.com',
  credentials: true, // allow cookies
}))

// Allow multiple origins
app.use(cors({
  origin: ['https://myfrontend.com', 'https://admin.myfrontend.com'],
}))
```

---

# 3. Node.js Deep Dive

## What Node.js Actually Is
- JavaScript runtime built on Chrome's V8 engine
- Single-threaded but non-blocking (async I/O)
- Uses an event loop to handle concurrency
- NOT good for CPU-heavy tasks (image processing, ML)
- GREAT for I/O-heavy tasks (APIs, databases, file operations)

## The Event Loop
```
Call Stack → Web APIs → Callback Queue → Event Loop → Call Stack

1. Synchronous code runs first
2. Async operations (timers, I/O) offloaded to OS/libuv
3. When async operation completes, callback goes to queue
4. Event loop picks from queue when call stack is empty
```

## Callbacks → Promises → Async/Await
```javascript
// Old way: Callbacks (Callback Hell)
fs.readFile('file.txt', (err, data) => {
  if (err) throw err
  db.query('SELECT * FROM users', (err, users) => {
    if (err) throw err
    sendEmail(users[0], (err) => {
      // 😵 nested hell
    })
  })
})

// Better: Promises
readFile('file.txt')
  .then(data => db.query('SELECT * FROM users'))
  .then(users => sendEmail(users[0]))
  .catch(err => console.error(err))

// Best: Async/Await
async function doWork() {
  try {
    const data = await readFile('file.txt')
    const users = await db.query('SELECT * FROM users')
    await sendEmail(users[0])
  } catch (err) {
    console.error(err)
  }
}
```

## Promise Methods You Must Know
```javascript
// Run promises in parallel (faster!)
const [users, posts, comments] = await Promise.all([
  getUsers(),
  getPosts(),
  getComments(),
])

// First one to resolve wins
const result = await Promise.race([fastQuery(), slowQuery()])

// All settle (even if some fail)
const results = await Promise.allSettled([
  getUsers(),
  getPosts(),
])
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value)
  if (r.status === 'rejected') console.error(r.reason)
})
```

## Node.js Modules
```javascript
// CommonJS (old)
const express = require('express')
module.exports = { myFunction }

// ESM (modern, use this)
import express from 'express'
export { myFunction }
export default myFunction

// In package.json to use ESM:
{ "type": "module" }
```

## Environment Variables
```bash
# .env file (NEVER commit to git)
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=super-secret-key-here
PORT=3000
NODE_ENV=development
```

```typescript
// Load env vars
import 'dotenv/config'

const dbUrl = process.env.DATABASE_URL
// Problem: could be undefined!

// Better: validate at startup with Zod
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
})

export const env = envSchema.parse(process.env)
// Now env.DATABASE_URL is always a string ✅
```

## Streams
```javascript
// For large files/data — don't load everything into memory
import { createReadStream, createWriteStream } from 'fs'

createReadStream('huge-file.csv')
  .pipe(csvParser())
  .pipe(createWriteStream('output.json'))
```

## Node.js Built-in Modules
```javascript
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname, extname } from 'path'
import { createHash, randomBytes } from 'crypto'
import { createServer } from 'http'
import os from 'os'
```

---

# 4. TypeScript for Backend

## Why TypeScript?
- Catch bugs at compile time, not runtime
- Better IDE support (autocomplete, refactoring)
- Self-documenting code
- Essential for team collaboration
- Drizzle and Zod are TypeScript-first

## Types vs Interfaces
```typescript
// Type — more flexible
type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

// Interface — better for objects, can be extended
interface Post {
  id: number
  title: string
  content: string
  author: User
}

interface BlogPost extends Post {
  tags: string[]
  publishedAt: Date | null
}
```

## Essential TypeScript Concepts
```typescript
// Union types
type Status = 'active' | 'inactive' | 'banned'

// Optional properties
type CreateUser = {
  name: string
  email: string
  age?: number // optional
}

// Pick and Omit
type UserPreview = Pick<User, 'id' | 'name'>
type UserWithoutPassword = Omit<User, 'password'>

// Partial — all properties optional
type UpdateUser = Partial<User>

// Required — all properties required
type RequiredUser = Required<User>

// Record — key-value map
type UserMap = Record<string, User>

// Generic types
type ApiResponse<T> = {
  data: T
  error: string | null
  status: number
}

async function getUser(id: number): Promise<ApiResponse<User>> {
  // ...
}

// Array types
const users: User[] = []
const ids: Array<number> = []

// Readonly
const config: Readonly<Config> = { ... }

// Nullish coalescing and optional chaining
const name = user?.profile?.name ?? 'Anonymous'

// Type guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data) // TypeScript knows data exists here
  } else {
    console.log(result.error) // TypeScript knows error exists here
  }
}
```

## tsconfig.json for Backend
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

# 5. Building Servers

## Hono (Modern, Recommended)
```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// Basic route
app.get('/', (c) => c.json({ message: 'Hello World' }))

// Route params
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await getUserById(Number(id))
  if (!user) return c.json({ error: 'Not found' }, 404)
  return c.json(user)
})

// Request body with validation
const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

app.post('/users', zValidator('json', createUserSchema), async (c) => {
  const body = c.req.valid('json') // fully typed!
  const user = await createUser(body)
  return c.json(user, 201)
})

// Query params
app.get('/posts', async (c) => {
  const page = Number(c.req.query('page') ?? '1')
  const limit = Number(c.req.query('limit') ?? '20')
  const posts = await getPosts({ page, limit })
  return c.json(posts)
})

// Route groups
const api = new Hono().basePath('/api/v1')
const users = new Hono()

users.get('/', listUsers)
users.post('/', createUser)
users.get('/:id', getUser)
users.patch('/:id', updateUser)
users.delete('/:id', deleteUser)

api.route('/users', users)
app.route('/', api)

export default app
```

## Middleware
```typescript
// Logger middleware
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  console.log(`${c.req.method} ${c.req.url} - ${c.res.status} (${duration}ms)`)
})

// Auth middleware
const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)
  
  const user = await verifyToken(token)
  if (!user) return c.json({ error: 'Invalid token' }, 401)
  
  c.set('user', user) // pass user to route handlers
  await next()
}

// Apply to specific routes
app.use('/api/dashboard/*', authMiddleware)

// Error handling middleware
app.onError((err, c) => {
  console.error(err)
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode)
  }
  return c.json({ error: 'Internal server error' }, 500)
})
```

---

# 6. Databases — Core Concepts

## Types of Databases
| Type | Examples | Best For |
|------|---------|---------|
| Relational (SQL) | PostgreSQL, MySQL | Structured data, complex queries, transactions |
| Document | MongoDB | Flexible schema, nested data |
| Key-Value | Redis | Caching, sessions, simple lookups |
| Graph | Neo4j | Social networks, recommendations |
| Time-Series | InfluxDB, TimescaleDB | Metrics, IoT, logs |
| Search | Elasticsearch | Full-text search |

**Use PostgreSQL for almost everything. It handles 99% of use cases.**

## Relational Database Fundamentals

### Tables, Rows, Columns
```
Table: users
+----+----------+------------------+-----+
| id | name     | email            | age |
+----+----------+------------------+-----+
|  1 | Alice    | alice@email.com  |  28 |
|  2 | Bob      | bob@email.com    |  34 |
|  3 | Charlie  | charlie@email.com|  22 |
+----+----------+------------------+-----+
```

### Keys
- **Primary Key**: Unique identifier for each row (usually `id`)
- **Foreign Key**: References primary key of another table (creates relationship)
- **Composite Key**: Two or more columns as primary key
- **Natural Key**: Real-world unique value (email, SSN) — avoid as PK
- **Surrogate Key**: Artificial id (integer, UUID) — prefer this

### Relationships
```
One-to-Many: One user has many posts
  users.id ← posts.user_id

One-to-One: One user has one profile
  users.id ← profiles.user_id (unique)

Many-to-Many: Users can be in many groups, groups have many users
  users ← users_groups → groups
  (junction/join table)
```

### ACID Properties
- **Atomicity**: All or nothing — transaction either fully completes or fully fails
- **Consistency**: Data always moves from one valid state to another
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Once committed, data is permanently saved

### Transactions
```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- If anything fails, ROLLBACK — money never disappears
```

### Indexes
```sql
-- Without index: scan every row (table scan) O(n)
-- With index: jump directly to result O(log n)

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_posts_user_status ON posts(user_id, status);

-- When to index:
-- ✅ Columns used in WHERE clauses
-- ✅ Columns used in JOIN conditions
-- ✅ Columns used in ORDER BY
-- ❌ Small tables (not worth it)
-- ❌ Columns rarely queried
-- ❌ Columns that change very frequently
```

---

# 7. SQL Mastery

## Basic CRUD
```sql
-- CREATE TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0 AND age < 150),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- INSERT
INSERT INTO users (name, email, age) VALUES ('Alice', 'alice@email.com', 28);

-- Multiple insert
INSERT INTO users (name, email) VALUES
  ('Bob', 'bob@email.com'),
  ('Charlie', 'charlie@email.com');

-- SELECT
SELECT * FROM users;
SELECT id, name, email FROM users;
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE name LIKE 'A%'; -- starts with A
SELECT * FROM users WHERE email ILIKE '%@gmail.com'; -- case insensitive

-- UPDATE
UPDATE users SET name = 'Alice Smith' WHERE id = 1;
UPDATE users SET role = 'admin', updated_at = NOW() WHERE email = 'alice@email.com';

-- DELETE
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE created_at < NOW() - INTERVAL '1 year'; -- old users
```

## Filtering & Sorting
```sql
-- AND, OR, NOT
SELECT * FROM users WHERE age > 18 AND role = 'user';
SELECT * FROM users WHERE role = 'admin' OR role = 'moderator';
SELECT * FROM users WHERE NOT (role = 'banned');

-- IN, NOT IN
SELECT * FROM users WHERE role IN ('admin', 'moderator');
SELECT * FROM users WHERE id NOT IN (1, 2, 3);

-- BETWEEN
SELECT * FROM users WHERE age BETWEEN 18 AND 65;

-- IS NULL, IS NOT NULL
SELECT * FROM users WHERE deleted_at IS NULL;
SELECT * FROM users WHERE last_login IS NOT NULL;

-- ORDER BY
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users ORDER BY name ASC, age DESC;

-- LIMIT & OFFSET (pagination)
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 40; -- page 3
```

## Aggregation
```sql
-- COUNT, SUM, AVG, MIN, MAX
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE role = 'admin';
SELECT AVG(age) FROM users;
SELECT MIN(created_at), MAX(created_at) FROM users;
SELECT SUM(amount) FROM orders WHERE user_id = 1;

-- GROUP BY
SELECT role, COUNT(*) as total FROM users GROUP BY role;
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as signups
FROM users
GROUP BY month
ORDER BY month;

-- HAVING (filter after grouping, like WHERE for groups)
SELECT role, COUNT(*) as total
FROM users
GROUP BY role
HAVING COUNT(*) > 10;
```

## JOINs
```sql
-- INNER JOIN: only rows with match in BOTH tables
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON p.user_id = u.id;

-- LEFT JOIN: all from left, matched from right (NULLs if no match)
SELECT u.name, p.title
FROM users u
LEFT JOIN posts p ON p.user_id = u.id;
-- Shows users even if they have no posts

-- RIGHT JOIN: all from right, matched from left
SELECT u.name, p.title
FROM users u
RIGHT JOIN posts p ON p.user_id = u.id;

-- Multiple JOINs
SELECT 
  u.name as author,
  p.title,
  c.content as comment
FROM posts p
INNER JOIN users u ON u.id = p.user_id
LEFT JOIN comments c ON c.post_id = p.id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;
```

## Subqueries & CTEs
```sql
-- Subquery
SELECT * FROM users
WHERE id IN (
  SELECT DISTINCT user_id FROM orders WHERE total > 100
);

-- CTE (Common Table Expression) — much more readable
WITH high_spenders AS (
  SELECT user_id, SUM(total) as lifetime_value
  FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 500
)
SELECT u.name, u.email, hs.lifetime_value
FROM users u
INNER JOIN high_spenders hs ON hs.user_id = u.id
ORDER BY hs.lifetime_value DESC;

-- Multiple CTEs
WITH 
  monthly_revenue AS (
    SELECT DATE_TRUNC('month', created_at) as month, SUM(amount) as revenue
    FROM orders GROUP BY month
  ),
  prev_month AS (
    SELECT * FROM monthly_revenue WHERE month = DATE_TRUNC('month', NOW() - INTERVAL '1 month')
  )
SELECT * FROM prev_month;
```

## Window Functions (Advanced)
```sql
-- ROW_NUMBER, RANK, DENSE_RANK
SELECT 
  name,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- Running total
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM sales;

-- Partition — separate window per group
SELECT
  user_id,
  order_date,
  amount,
  RANK() OVER (PARTITION BY user_id ORDER BY amount DESC) as rank_for_user
FROM orders;

-- LAG/LEAD — access previous/next row
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) as growth
FROM monthly_revenue;
```

---

# 8. PostgreSQL Deep Dive

## Data Types
```sql
-- Numbers
INTEGER / INT           -- -2B to 2B
BIGINT                  -- huge numbers
SERIAL                  -- auto-incrementing integer
BIGSERIAL               -- auto-incrementing bigint
NUMERIC(10, 2)          -- exact decimal (use for money!)
FLOAT / REAL            -- approximate (avoid for money)

-- Text
VARCHAR(255)            -- variable length with limit
TEXT                    -- unlimited length (prefer this)
CHAR(10)                -- fixed length (rarely needed)

-- Date/Time
TIMESTAMP               -- date + time, no timezone
TIMESTAMPTZ             -- date + time WITH timezone (prefer this)
DATE                    -- just date
TIME                    -- just time
INTERVAL                -- duration ('1 day', '2 hours')

-- Boolean
BOOLEAN                 -- true / false

-- UUID
UUID                    -- universally unique id
-- Generate: gen_random_uuid() (built-in since PG13)

-- JSON
JSON                    -- stored as text
JSONB                   -- binary JSON, indexed, faster (prefer this)

-- Arrays
INTEGER[]               -- array of integers
TEXT[]                  -- array of text

-- Special
ENUM                    -- custom type with allowed values
```

## Constraints
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ON DELETE behaviors for foreign keys:
-- CASCADE      — delete child rows when parent deleted
-- SET NULL     — set foreign key to NULL when parent deleted  
-- RESTRICT     — prevent deleting parent if children exist
-- NO ACTION    — like RESTRICT but deferred
```

## Useful PostgreSQL Functions
```sql
-- String
LOWER(email)
UPPER(name)
TRIM(name)
CONCAT(first_name, ' ', last_name)
LENGTH(content)
SUBSTRING(content, 1, 100)  -- first 100 chars
REPLACE(slug, '-', ' ')

-- Date/Time
NOW()                           -- current timestamp
CURRENT_DATE                    -- today
DATE_TRUNC('month', created_at) -- truncate to month
EXTRACT(YEAR FROM created_at)   -- get year
AGE(birth_date)                 -- calculate age
created_at + INTERVAL '7 days'  -- add 7 days

-- Math
ROUND(price, 2)
CEIL(value)
FLOOR(value)
ABS(value)

-- Null handling
COALESCE(nickname, name, 'Anonymous')  -- first non-null value
NULLIF(value, '')                       -- return null if equal

-- JSON
data->>'name'           -- get field as text
data->'address'         -- get field as JSON
jsonb_array_elements(tags) -- expand JSON array
```

## Full-Text Search
```sql
-- Built-in full-text search (no Elasticsearch needed for basic search)
ALTER TABLE posts ADD COLUMN search_vector TSVECTOR;

-- Update search vector
UPDATE posts SET search_vector = 
  to_tsvector('english', title || ' ' || content);

-- Create index for fast search
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Search
SELECT * FROM posts 
WHERE search_vector @@ plainto_tsquery('english', 'javascript tutorial');

-- With ranking
SELECT *, ts_rank(search_vector, query) as rank
FROM posts, to_tsquery('english', 'javascript') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

## EXPLAIN & Query Analysis
```sql
-- See query plan
EXPLAIN SELECT * FROM users WHERE email = 'alice@email.com';

-- See actual execution time
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@email.com';

-- Look for:
-- "Seq Scan" = bad for large tables (no index used)
-- "Index Scan" = good
-- "cost" = estimated cost
-- "actual time" = real execution time
```

## Migrations
```sql
-- ALWAYS use migrations to change schema
-- Never edit production DB manually

-- Example migration file: 001_create_users.sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 002_add_name_to_users.sql
ALTER TABLE users ADD COLUMN name TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- 003_add_role.sql
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
ALTER TABLE users ADD COLUMN role user_role DEFAULT 'user';
```

---

# 9. Neon (Serverless Postgres)

## What is Neon?
- Fully managed serverless PostgreSQL
- Separates storage and compute (scale independently)
- **Autoscaling**: scales up under load, scales to ZERO when idle
- **Branching**: database branches like git branches
- Built-in connection pooler (PgBouncer)
- Works great with serverless/edge (Vercel, Netlify, Cloudflare)

## Setting Up Neon
```bash
# Install the Neon serverless driver
npm install @neondatabase/serverless

# Install for Drizzle
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

## Connection Types
```typescript
// Option 1: HTTP/WebSocket (serverless, edge-compatible)
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Direct SQL
const users = await sql`SELECT * FROM users WHERE id = ${userId}`

// Option 2: Pool (for long-running servers like Express)
import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

// Option 3: HTTP driver with Drizzle (serverless, recommended)
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })
```

## Neon Branching
```bash
# Install Neon CLI
npm install -g neonctl

# Create a branch (for development/testing)
neonctl branches create --name dev/feature-auth

# Get connection string for branch
neonctl connection-string dev/feature-auth

# Delete branch when done
neonctl branches delete dev/feature-auth
```

### Branch Strategy
```
main branch       → Production database
staging branch    → Staging environment
dev/* branches    → Individual developer databases
pr/* branches     → One DB per Pull Request (auto-created in CI)
```

## Connection Pooling
```
Problem: Each serverless function opens a new DB connection
         1000 requests = 1000 connections = DB overloaded

Solution: Use Neon's built-in pooler or PgBouncer

Pooled URL:     postgres://user:pass@ep-xxx.pooler.neon.tech/db
Direct URL:     postgres://user:pass@ep-xxx.neon.tech/db

Use pooled for: Application queries (Drizzle)
Use direct for: Migrations (Drizzle Kit)
```

```typescript
// In drizzle.config.ts
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // use DIRECT URL for migrations
  },
})

// In your app (db.ts)
const sql = neon(process.env.DATABASE_URL!) // use POOLED URL for queries
export const db = drizzle(sql, { schema })
```

---

# 10. Drizzle ORM — Complete Guide

## Why Drizzle?
- TypeScript-first ORM — schema defined in TypeScript
- SQL-like queries — close to raw SQL, easy to understand
- Fully type-safe — TypeScript knows exact return types
- Lightweight — no heavy abstractions
- Works with Neon, PlanetScale, Turso, and more
- Great alternative to Prisma (lighter, faster, more control)

## Project Setup
```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit tsx dotenv
```

```
project/
├── src/
│   ├── db/
│   │   ├── index.ts        ← db connection
│   │   ├── schema.ts       ← all table definitions
│   │   └── schema/         ← or split by domain
│   │       ├── users.ts
│   │       ├── posts.ts
│   │       └── index.ts
│   └── ...
├── drizzle/                ← migration files (auto-generated)
├── drizzle.config.ts
└── package.json
```

## Schema Definition
```typescript
// src/db/schema.ts
import {
  pgTable, pgEnum,
  serial, bigserial,
  text, varchar,
  integer, bigint,
  boolean,
  timestamp, date,
  numeric,
  uuid,
  jsonb,
  index, uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'moderator'])
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived'])

// Users table
export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique().notNull(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').default('user').notNull(),
  avatarUrl: text('avatar_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}))

// Posts table
export const posts = pgTable('posts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  status: postStatusEnum('status').default('draft').notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  authorId: bigint('author_id', { mode: 'number' }).notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('posts_author_idx').on(table.authorId),
  statusIdx: index('posts_status_idx').on(table.status),
  slugIdx: uniqueIndex('posts_slug_idx').on(table.slug),
}))

// Tags
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
})

// Many-to-many: Posts ↔ Tags
export const postTags = pgTable('post_tags', {
  postId: bigint('post_id', { mode: 'number' }).notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}))

// Comments
export const comments = pgTable('comments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  content: text('content').notNull(),
  postId: bigint('post_id', { mode: 'number' }).notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  authorId: bigint('author_id', { mode: 'number' }).notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: bigint('parent_id', { mode: 'number' })
    .references((): any => comments.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
```

## Relations
```typescript
// Define relations (for Drizzle's query API)
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  tags: many(postTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}))
```

## Database Connection
```typescript
// src/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

export type DB = typeof db
```

## Querying
```typescript
import { db } from '@/db'
import { users, posts, comments } from '@/db/schema'
import { eq, ne, gt, gte, lt, lte, and, or, not, inArray, isNull, isNotNull, like, ilike, between, count, sum, avg, max, min, desc, asc, sql } from 'drizzle-orm'

// ── SELECT ──────────────────────────────────────────────

// Get all users
const allUsers = await db.select().from(users)

// Select specific columns
const userPreviews = await db
  .select({ id: users.id, name: users.name, email: users.email })
  .from(users)

// With WHERE
const admins = await db.select().from(users).where(eq(users.role, 'admin'))

// Complex WHERE
const activeAdults = await db.select().from(users).where(
  and(
    gte(users.age, 18),
    eq(users.isVerified, true),
    not(eq(users.role, 'banned'))
  )
)

// OR condition
const privileged = await db.select().from(users).where(
  or(eq(users.role, 'admin'), eq(users.role, 'moderator'))
)

// IN
const specificUsers = await db.select().from(users).where(
  inArray(users.id, [1, 2, 3])
)

// LIKE / ILIKE
const searchResults = await db.select().from(users).where(
  ilike(users.name, '%john%')
)

// NULL checks
const unverified = await db.select().from(users).where(
  isNull(users.verifiedAt)
)

// ORDER BY
const newest = await db.select().from(users)
  .orderBy(desc(users.createdAt))

// LIMIT & OFFSET (pagination)
const page = 1
const limit = 20
const paginatedUsers = await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(limit)
  .offset((page - 1) * limit)

// ── INSERT ──────────────────────────────────────────────

// Insert one
const [newUser] = await db.insert(users).values({
  name: 'Alice',
  email: 'alice@example.com',
  role: 'user',
}).returning()

// Insert many
const newPosts = await db.insert(posts).values([
  { title: 'Post 1', slug: 'post-1', content: '...', authorId: 1 },
  { title: 'Post 2', slug: 'post-2', content: '...', authorId: 1 },
]).returning()

// Upsert (insert or update)
await db.insert(users).values({ email: 'alice@example.com', name: 'Alice' })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: 'Alice Updated', updatedAt: new Date() },
  })

// ── UPDATE ──────────────────────────────────────────────

const [updatedUser] = await db.update(users)
  .set({ name: 'Alice Smith', updatedAt: new Date() })
  .where(eq(users.id, 1))
  .returning()

// ── DELETE ──────────────────────────────────────────────

const [deletedUser] = await db.delete(users)
  .where(eq(users.id, 1))
  .returning()

// ── JOINS ──────────────────────────────────────────────

const postsWithAuthors = await db
  .select({
    postId: posts.id,
    title: posts.title,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.status, 'published'))
  .orderBy(desc(posts.createdAt))

// ── AGGREGATION ──────────────────────────────────────────

const [{ total }] = await db.select({ total: count() }).from(users)

const stats = await db
  .select({
    role: users.role,
    count: count(),
  })
  .from(users)
  .groupBy(users.role)

// ── RELATIONAL QUERIES (easier than joins) ──────────────

// Get users with their posts and comments
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: {
      where: eq(posts.status, 'published'),
      orderBy: desc(posts.createdAt),
      limit: 5,
      with: {
        comments: {
          limit: 3,
          with: { author: true },
        },
      },
    },
  },
  where: eq(users.isVerified, true),
  limit: 10,
})

// Find one
const user = await db.query.users.findFirst({
  where: eq(users.email, 'alice@example.com'),
  with: { posts: true },
})

// ── TRANSACTIONS ──────────────────────────────────────────

const result = await db.transaction(async (tx) => {
  const [order] = await tx.insert(orders).values({
    userId: 1,
    total: 99.99,
  }).returning()

  await tx.insert(orderItems).values([
    { orderId: order.id, productId: 5, quantity: 2, price: 49.99 },
  ])

  await tx.update(products)
    .set({ stock: sql`${products.stock} - 2` })
    .where(eq(products.id, 5))

  return order
})

// ── RAW SQL (escape hatch) ──────────────────────────────

const result = await db.execute(
  sql`SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'`
)
```

## Drizzle Config & Migrations
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
```

```bash
# package.json scripts
"db:generate"  : "drizzle-kit generate"   # generate migration files
"db:migrate"   : "drizzle-kit migrate"    # run migrations
"db:push"      : "drizzle-kit push"       # push schema directly (dev only)
"db:studio"    : "drizzle-kit studio"     # open visual DB browser
"db:drop"      : "drizzle-kit drop"       # drop migration

# Workflow:
# 1. Edit schema.ts
# 2. npm run db:generate  (creates SQL migration file in /drizzle)
# 3. Review the generated SQL
# 4. npm run db:migrate   (applies to database)
```

## Type Inference
```typescript
// Infer types from schema
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users, posts } from '@/db/schema'

type User = InferSelectModel<typeof users>
type NewUser = InferInsertModel<typeof users>
type Post = InferSelectModel<typeof posts>

// Use in functions
async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning()
  return user
}
```

---

# 11. Data Modeling & Schema Design

## Good Schema Design Principles
- **Normalize** (don't repeat data) but **denormalize** strategically for performance
- Use `TIMESTAMPTZ` (with timezone) always for dates
- Use `TEXT` over `VARCHAR` in PostgreSQL
- Use `UUID` for public-facing IDs (security), `BIGSERIAL` for internal
- Add `created_at` and `updated_at` to every table
- Use soft deletes (`deleted_at TIMESTAMPTZ`) instead of hard deletes
- Add indexes for every foreign key and commonly queried column

## Soft Deletes Pattern
```typescript
export const users = pgTable('users', {
  // ...
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

// In queries, always filter out deleted
const activeUsers = await db.select().from(users)
  .where(isNull(users.deletedAt))
```

## Audit Log Pattern
```typescript
export const auditLogs = pgTable('audit_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  action: text('action').notNull(), // 'INSERT', 'UPDATE', 'DELETE'
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  userId: bigint('user_id', { mode: 'number' }),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
```

## Common Patterns

### User + Profile Split
```typescript
// Keep auth data separate from profile data
export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).unique().notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  website: text('website'),
})
```

### Polymorphic Relations
```typescript
// One table relates to multiple other tables
// E.g. comments can be on posts OR videos
export const comments = pgTable('comments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  content: text('content').notNull(),
  entityType: text('entity_type').notNull(), // 'post' | 'video'
  entityId: bigint('entity_id', { mode: 'number' }).notNull(),
  authorId: bigint('author_id', { mode: 'number' }).notNull(),
})
```

---

# 12. Authentication & Authorization

## Authentication vs Authorization
- **Authentication**: Verify identity — "Who are you?" → Login
- **Authorization**: Verify permissions — "What can you do?" → Roles

## Password Hashing
```typescript
import { hash, verify } from 'argon2' // better than bcrypt

// Hash password (never store plaintext!)
const passwordHash = await hash(plainTextPassword)

// Verify password
const isValid = await verify(passwordHash, plainTextPassword)
```

## JWT (JSON Web Tokens)
```typescript
// JWT structure: header.payload.signature
// Decoded payload:
{
  "sub": "123",          // subject (user id)
  "role": "admin",
  "iat": 1700000000,     // issued at
  "exp": 1700086400,     // expires at
}

import { sign, verify } from 'hono/jwt'

// Create token
const token = await sign(
  { sub: user.id.toString(), role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
  process.env.JWT_SECRET!
)

// Verify token
const payload = await verify(token, process.env.JWT_SECRET!)
```

### Access Token + Refresh Token Pattern
```
Access Token:  Short-lived (15 min - 1 hour), sent with every request
Refresh Token: Long-lived (7-30 days), stored in DB, used to get new access tokens

Flow:
1. User logs in → server creates both tokens
2. Client stores access token in memory, refresh token in HttpOnly cookie
3. Client sends access token in Authorization header
4. When access token expires, client sends refresh token to /auth/refresh
5. Server validates refresh token, issues new access token
6. On logout, delete refresh token from DB
```

## Sessions (Alternative to JWT)
```typescript
// Server stores session data, client only gets session ID
// Better for: web apps that need instant revocation

import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

// Create session
const sessionId = crypto.randomUUID()
await redis.set(`session:${sessionId}`, JSON.stringify(user), 'EX', 60 * 60 * 24 * 7)
setCookie(c, 'session_id', sessionId, {
  httpOnly: true,    // JS can't access it
  secure: true,      // HTTPS only
  sameSite: 'Lax',   // CSRF protection
  maxAge: 60 * 60 * 24 * 7
})
```

## OAuth (Sign in with Google/GitHub)
```typescript
// Flow:
// 1. User clicks "Sign in with Google"
// 2. Redirect to Google's OAuth page
// 3. User approves, Google redirects back with code
// 4. Exchange code for access token
// 5. Get user info from Google
// 6. Create or find user in your DB
// 7. Create your own session/JWT

// Use Auth.js, Clerk, or Lucia Auth to handle this
```

## Clerk (Easiest, Recommended for Starting)
```typescript
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

app.use('*', clerkMiddleware())

app.get('/api/me', (c) => {
  const auth = getAuth(c)
  if (!auth?.userId) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ userId: auth.userId })
})
```

## Authorization: Roles & Permissions
```typescript
// Simple role check
const requireRole = (role: string) => async (c: Context, next: Next) => {
  const user = c.get('user')
  if (user.role !== role) return c.json({ error: 'Forbidden' }, 403)
  await next()
}

app.delete('/posts/:id', authMiddleware, requireRole('admin'), deletePost)

// More granular: Permission-based
const permissions = {
  user: ['posts:read', 'posts:create', 'comments:create'],
  moderator: ['posts:read', 'posts:create', 'posts:delete', 'comments:delete'],
  admin: ['*'], // all permissions
}

const can = (user: User, action: string) => {
  const perms = permissions[user.role]
  return perms.includes('*') || perms.includes(action)
}
```

---

# 13. Security

## Input Validation (Never Trust User Input)
```typescript
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  content: z.string().min(10).max(50000),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).max(10).optional(),
})
```

## SQL Injection
```typescript
// ❌ NEVER do this — SQL injection vulnerability!
const email = req.body.email // attacker sends: "'; DROP TABLE users; --"
await db.execute(`SELECT * FROM users WHERE email = '${email}'`)

// ✅ Drizzle handles this automatically (parameterized queries)
await db.select().from(users).where(eq(users.email, email))

// ✅ Even with raw SQL, use parameterized queries
await db.execute(sql`SELECT * FROM users WHERE email = ${email}`)
```

## XSS (Cross-Site Scripting)
```typescript
// Attacker injects: <script>document.cookie</script>

// ✅ Sanitize HTML if you accept HTML input
import DOMPurify from 'isomorphic-dompurify'
const clean = DOMPurify.sanitize(userHtml)

// ✅ Set Content Security Policy headers
app.use('*', (c, next) => {
  c.header('Content-Security-Policy', "default-src 'self'")
  return next()
})
```

## Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})

app.use('/api/*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') ?? 'anonymous'
  const { success, limit, remaining } = await ratelimit.limit(ip)
  
  if (!success) {
    return c.json({ error: 'Too many requests' }, 429)
  }
  return next()
})
```

## Security Headers
```typescript
app.use('*', (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  return next()
})
```

## Environment Variables & Secrets
```bash
# Never commit .env to git!
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Use strong secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## CSRF Protection
```typescript
// CSRF attacks tricks users into making unintended requests
// Protection: SameSite cookies + CSRF tokens

setCookie(c, 'session', sessionId, {
  sameSite: 'Lax',  // browser won't send on cross-origin POST
  httpOnly: true,
})
```

---

# 14. Validation & Error Handling

## Zod — Complete Guide
```typescript
import { z } from 'zod'

// Primitive types
z.string()
z.number()
z.boolean()
z.date()
z.undefined()
z.null()
z.any()
z.unknown()

// String validations
z.string().min(3).max(100).trim().toLowerCase()
z.string().email()
z.string().url()
z.string().uuid()
z.string().regex(/^[a-z0-9-]+$/)
z.string().startsWith('https://')

// Number validations
z.number().int().positive()
z.number().min(0).max(100)
z.coerce.number() // converts string to number

// Object
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().min(0).optional(),
})

// Extend / merge
const adminSchema = userSchema.extend({ role: z.literal('admin') })

// Pick / omit
const publicUser = userSchema.pick({ name: true })
const withoutAge = userSchema.omit({ age: true })

// Partial / required
const updateUser = userSchema.partial()
const fullUser = userSchema.required()

// Array
z.array(z.string()).min(1).max(10)

// Enum
z.enum(['draft', 'published', 'archived'])

// Union
z.union([z.string(), z.number()])
z.string().or(z.number())

// Transform
z.string().transform(s => s.toLowerCase().trim())

// Refine (custom validation)
z.string().refine(
  (password) => password.length >= 8 && /[A-Z]/.test(password),
  { message: 'Password must be 8+ chars and contain uppercase' }
)

// Parse (throws on invalid)
const user = userSchema.parse(requestBody)

// SafeParse (returns result object)
const result = userSchema.safeParse(requestBody)
if (!result.success) {
  console.error(result.error.errors)
}
```

## Custom Error Classes
```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized', 401, 'UNAUTHORIZED')
  }
}

export class ValidationError extends AppError {
  constructor(public errors: unknown) {
    super('Validation failed', 422, 'VALIDATION_ERROR')
  }
}

// Global error handler
app.onError((err, c) => {
  console.error(err)
  
  if (err instanceof AppError) {
    return c.json({
      error: { message: err.message, code: err.code },
    }, err.statusCode as any)
  }
  
  if (err instanceof ZodError) {
    return c.json({
      error: { message: 'Validation failed', issues: err.errors },
    }, 422)
  }
  
  return c.json({ error: { message: 'Internal server error' } }, 500)
})
```

---

# 15. File Uploads & Storage

## Using Uploadthing (Easiest)
```bash
npm install uploadthing
```

```typescript
import { createUploadthing } from 'uploadthing/server'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async (req) => {
      const user = await getUser(req)
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.update(users).set({ avatarUrl: file.url })
        .where(eq(users.id, metadata.userId))
      return { url: file.url }
    }),
}
```

## Using AWS S3 / Cloudflare R2
```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
})

// Generate presigned upload URL (client uploads directly to S3)
async function getUploadUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  })
  return getSignedUrl(s3, command, { expiresIn: 3600 })
}

// Generate presigned download URL
async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  })
  return getSignedUrl(s3, command, { expiresIn: 3600 })
}
```

---

# 16. Email & Notifications

## Transactional Email with Resend
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Send email
await resend.emails.send({
  from: 'noreply@myapp.com',
  to: user.email,
  subject: 'Welcome to MyApp!',
  html: `<h1>Welcome ${user.name}!</h1>`,
})

// With React Email templates
import { WelcomeEmail } from '@/emails/welcome'
import { render } from '@react-email/render'

await resend.emails.send({
  from: 'noreply@myapp.com',
  to: user.email,
  subject: 'Welcome!',
  html: render(WelcomeEmail({ userName: user.name })),
})
```

## Push Notifications
```typescript
// Web Push with web-push library
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:admin@myapp.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Send notification
await webpush.sendNotification(
  subscription, // stored in DB from frontend
  JSON.stringify({
    title: 'New message!',
    body: 'You have a new message from Alice',
    icon: '/icon.png',
  })
)
```

---

# 17. Background Jobs & Queues

## Why You Need Queues
- Don't make users wait for slow operations (email, PDF, image processing)
- Retry failed operations automatically
- Process jobs in parallel with multiple workers
- Handle traffic spikes gracefully

## BullMQ (Redis-based Queue)
```typescript
import { Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'

const connection = new Redis(process.env.REDIS_URL!)

// Create queue
const emailQueue = new Queue('emails', { connection })

// Add job to queue
await emailQueue.add('welcome-email', {
  userId: user.id,
  email: user.email,
  name: user.name,
})

// Worker processes jobs
const worker = new Worker('emails', async (job) => {
  const { email, name } = job.data
  await resend.emails.send({
    to: email,
    subject: 'Welcome!',
    html: `<h1>Welcome ${name}!</h1>`,
  })
}, { connection, concurrency: 5 })

// Handle failures
worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

// Scheduled/cron jobs
await emailQueue.add('digest', {}, {
  repeat: { cron: '0 9 * * 1' } // every Monday at 9am
})
```

## Trigger.dev (Serverless Jobs)
```typescript
// No Redis needed — managed background jobs
import { task } from '@trigger.dev/sdk/v3'

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: { userId: number }) => {
    const user = await getUserById(payload.userId)
    await resend.emails.send({ to: user.email, ... })
  },
})

// Trigger from your API
await sendWelcomeEmail.trigger({ userId: newUser.id })
```

---

# 18. Caching

## Why Cache?
- Database queries are expensive (disk I/O, network)
- Same data requested thousands of times
- Caching serves from memory — 10-100x faster

## Redis with Upstash
```typescript
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv() // Uses UPSTASH_REDIS_REST_URL and TOKEN

// Cache-aside pattern
async function getUser(id: number) {
  // 1. Check cache
  const cached = await redis.get<User>(`user:${id}`)
  if (cached) return cached

  // 2. Get from DB
  const user = await db.query.users.findFirst({
    where: eq(users.id, id)
  })

  if (!user) return null

  // 3. Store in cache (expire after 1 hour)
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user))

  return user
}

// Invalidate cache when data changes
async function updateUser(id: number, data: Partial<User>) {
  const user = await db.update(users).set(data).where(eq(users.id, id)).returning()
  await redis.del(`user:${id}`) // invalidate cache
  return user
}

// Rate limiting with Redis
const requests = await redis.incr(`rate:${ip}`)
if (requests === 1) await redis.expire(`rate:${ip}`, 60) // 1 minute window
if (requests > 100) throw new TooManyRequestsError()

// Session storage
await redis.setex(`session:${sessionId}`, 86400, JSON.stringify(sessionData))
const session = await redis.get(`session:${sessionId}`)
```

## HTTP Caching
```typescript
// Tell browsers/CDNs to cache responses
app.get('/api/public/posts', async (c) => {
  const posts = await getPosts()
  c.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  return c.json(posts)
})

// No caching for private data
app.get('/api/me', authMiddleware, async (c) => {
  const user = c.get('user')
  c.header('Cache-Control', 'private, no-cache')
  return c.json(user)
})
```

---

# 19. WebSockets & Realtime

## When to Use Realtime
- Chat applications
- Live notifications
- Collaborative editing
- Live sports scores
- Real-time dashboards

## WebSockets with Hono
```typescript
import { upgradeWebSocket } from 'hono/deno'

const rooms = new Map<string, Set<WebSocket>>()

app.get('/ws/chat/:room', upgradeWebSocket((c) => {
  const room = c.req.param('room')
  
  return {
    onOpen(event, ws) {
      if (!rooms.has(room)) rooms.set(room, new Set())
      rooms.get(room)!.add(ws.raw!)
    },
    onMessage(event, ws) {
      const message = JSON.parse(event.data as string)
      // Broadcast to all in room
      rooms.get(room)?.forEach(client => {
        client.send(JSON.stringify(message))
      })
    },
    onClose(event, ws) {
      rooms.get(room)?.delete(ws.raw!)
    },
  }
}))
```

## Server-Sent Events (One-way, Simpler)
```typescript
// Good for: notifications, live updates (no need for bidirectional)
app.get('/events', authMiddleware, (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const notifications = await getNewNotifications(userId)
      for (const n of notifications) {
        await stream.writeSSE({ data: JSON.stringify(n), event: 'notification' })
      }
      await stream.sleep(5000) // poll every 5 seconds
    }
  })
})
```

## Pusher / Ably (Managed Realtime)
```typescript
// Easier than managing your own WebSocket server
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'us2',
})

// Trigger event from server
await pusher.trigger('chat-room-123', 'new-message', {
  from: 'Alice',
  content: 'Hello!',
  timestamp: Date.now(),
})
```

---

# 20. Testing

## Types of Tests
- **Unit tests**: Test single functions in isolation
- **Integration tests**: Test multiple components together (API + DB)
- **E2E tests**: Test complete user flows (browser → API → DB)

## Vitest (Recommended)
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createUser, getUserById } from '@/services/users'
import { db } from '@/db'

describe('User Service', () => {
  beforeEach(async () => {
    // Setup test DB
    await db.delete(users)
  })

  it('creates a user', async () => {
    const user = await createUser({
      name: 'Test User',
      email: 'test@example.com',
    })
    
    expect(user.id).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.role).toBe('user') // default role
  })

  it('throws error for duplicate email', async () => {
    await createUser({ name: 'Alice', email: 'alice@test.com' })
    
    await expect(
      createUser({ name: 'Alice 2', email: 'alice@test.com' })
    ).rejects.toThrow()
  })
})

// Mocking
vi.mock('@/services/email', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
}))
```

## API Integration Testing
```typescript
import { describe, it, expect } from 'vitest'
import app from '@/app'

describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice', email: 'alice@test.com' }),
    })

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.email).toBe('alice@test.com')
  })

  it('returns 422 for invalid email', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice', email: 'not-an-email' }),
    })
    expect(res.status).toBe(422)
  })
})
```

---

# 21. Architecture Patterns

## Layered Architecture
```
src/
├── routes/          ← HTTP layer (parse request, send response)
│   └── users.ts
├── services/        ← Business logic (the "what")
│   └── user.service.ts
├── repositories/    ← Data access (the "how" of DB queries)
│   └── user.repository.ts
├── db/
│   ├── schema.ts
│   └── index.ts
├── middleware/
├── utils/
└── types/
```

```typescript
// Repository — only DB operations
export class UserRepository {
  async findById(id: number) {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  }
  
  async findByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) })
  }
  
  async create(data: NewUser) {
    const [user] = await db.insert(users).values(data).returning()
    return user
  }
}

// Service — business logic, calls repository
export class UserService {
  constructor(private userRepo: UserRepository) {}
  
  async register(data: RegisterDTO) {
    const existing = await this.userRepo.findByEmail(data.email)
    if (existing) throw new ConflictError('Email already in use')
    
    const passwordHash = await hash(data.password)
    const user = await this.userRepo.create({ ...data, passwordHash })
    
    await emailQueue.add('welcome', { userId: user.id })
    
    return user
  }
}

// Route — HTTP handling
users.post('/register', zValidator('json', registerSchema), async (c) => {
  const body = c.req.valid('json')
  const user = await userService.register(body)
  const token = createToken(user)
  return c.json({ user, token }, 201)
})
```

## Repository Pattern Benefits
- Easy to swap DB without changing business logic
- Easy to test (mock the repository)
- Separation of concerns

## Domain-Driven Design (Advanced)
```
src/
├── modules/
│   ├── users/
│   │   ├── users.schema.ts
│   │   ├── users.repository.ts
│   │   ├── users.service.ts
│   │   ├── users.routes.ts
│   │   └── users.types.ts
│   ├── posts/
│   └── orders/
```

---

# 22. DevOps & Deployment

## Docker
```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml (for local development)
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

## CI/CD with GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test
      - run: npm run typecheck
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Deployment Platforms
| Platform | Best For | Free Tier |
|----------|---------|-----------|
| **Vercel** | Serverless APIs, Next.js | Yes |
| **Railway** | Full servers, background workers | $5/mo |
| **Fly.io** | Docker apps, global | Limited |
| **Render** | Easy deployment | Yes (sleeps) |
| **AWS/GCP/Azure** | Enterprise scale | Paid |

## Environment Management
```bash
# Development
.env.local          # local secrets, never committed

# Staging/Production
Set in platform UI or CI/CD secrets — never in code!

# Required .gitignore entries
.env
.env.local
.env.*.local
```

---

# 23. Performance & Optimization

## The N+1 Query Problem
```typescript
// ❌ N+1 problem — 1 query for users + N queries for posts
const users = await db.select().from(users)
for (const user of users) {
  user.posts = await db.select().from(posts).where(eq(posts.authorId, user.id))
}
// If 100 users → 101 database queries!

// ✅ Fix with JOIN or relational query
const users = await db.query.users.findMany({
  with: { posts: true },
})
// Only 1-2 queries total
```

## Database Performance
```sql
-- EXPLAIN ANALYZE your slow queries
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 123;

-- Add index if you see "Seq Scan" on large table
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Use connection pooling
-- Avoid SELECT * (select only needed columns)
-- Paginate large result sets (never return all 1M rows)
-- Use LIMIT in queries

-- Avoid expensive operations in loops
-- Batch inserts instead of one by one
```

## API Performance
```typescript
// Run independent operations in parallel
// ❌ Sequential (slow)
const user = await getUser(userId)
const posts = await getPosts(userId)
const followers = await getFollowers(userId)

// ✅ Parallel (3x faster)
const [user, posts, followers] = await Promise.all([
  getUser(userId),
  getPosts(userId),
  getFollowers(userId),
])
```

## Response Compression
```typescript
import { compress } from 'hono/compress'
app.use(compress())
```

## Pagination Best Practices
```typescript
// Cursor-based pagination (better for large datasets)
// vs offset pagination (simple but slow on large pages)

// Cursor pagination
const posts = await db.select().from(posts)
  .where(cursor ? lt(posts.id, cursor) : undefined)
  .orderBy(desc(posts.id))
  .limit(limit + 1) // fetch one extra to know if there's next page

const hasNextPage = posts.length > limit
const items = posts.slice(0, limit)
const nextCursor = hasNextPage ? items[items.length - 1].id : null
```

---

# 24. System Design

## Key Concepts Every Senior Must Know

### Scalability
- **Vertical scaling**: Bigger server (more RAM, CPU)
- **Horizontal scaling**: More servers (load balancer)
- **Stateless servers**: Any server can handle any request (use Redis for sessions)

### Load Balancer
```
Client → Load Balancer → Server 1
                      → Server 2
                      → Server 3

Algorithms: Round robin, least connections, IP hash
```

### CDN (Content Delivery Network)
- Cache static assets (images, CSS, JS) near users
- Reduce latency from 200ms → 20ms
- CloudFlare, Fastly, AWS CloudFront

### Database Scaling
```
Read Replicas:   1 primary (writes) + N replicas (reads)
Sharding:        Split data across multiple DBs by key
Partitioning:    Split one large table into smaller ones

Connection pooling: PgBouncer, Neon's built-in pooler
```

### Microservices vs Monolith
```
Monolith (Start here!):
  + Simple to develop and deploy
  + Easy to test
  + Lower operational overhead
  - Harder to scale individual parts
  - Tech stack locked

Microservices (When you need scale):
  + Independent scaling
  + Independent deployment
  + Different tech per service
  - Complex infrastructure
  - Network latency between services
  - Hard to debug
```

### CAP Theorem
- **Consistency**: All nodes see same data
- **Availability**: System always responds
- **Partition Tolerance**: Works despite network failures
- You can only guarantee 2 of 3
- PostgreSQL: CP (consistent + partition tolerant)
- Most NoSQL: AP (available + partition tolerant)

### Common System Design Questions
- Design Twitter/Instagram/WhatsApp
- Design a URL shortener
- Design a rate limiter
- Design a notification system
- Design YouTube

**Framework for answering:**
1. Clarify requirements and scale (users, requests/sec)
2. Estimate capacity (storage, bandwidth)
3. Define API
4. Design data model
5. High-level architecture
6. Deep dive into components
7. Discuss trade-offs

---

# 25. Monitoring & Observability

## The Three Pillars
- **Logs**: What happened (events, errors)
- **Metrics**: How is it performing (latency, error rate, throughput)
- **Traces**: How a request flowed through the system

## Structured Logging with Pino
```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
})

// Use structured logs (not console.log)
logger.info({ userId: user.id, action: 'login' }, 'User logged in')
logger.error({ err, requestId, userId }, 'Failed to process payment')

// Request logging middleware
app.use('*', async (c, next) => {
  const start = Date.now()
  const requestId = crypto.randomUUID()
  c.set('requestId', requestId)
  
  await next()
  
  logger.info({
    requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: Date.now() - start,
  }, 'Request completed')
})
```

## Error Tracking with Sentry
```typescript
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of requests
})

// Capture errors automatically
app.onError((err, c) => {
  Sentry.captureException(err)
  return c.json({ error: 'Internal server error' }, 500)
})
```

## Health Check Endpoint
```typescript
app.get('/health', async (c) => {
  try {
    // Check DB connection
    await db.execute(sql`SELECT 1`)
    
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (err) {
    return c.json({ status: 'unhealthy', error: err.message }, 503)
  }
})
```

## Metrics with Prometheus
```typescript
import { collectDefaultMetrics, Counter, Histogram, register } from 'prom-client'

collectDefaultMetrics()

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
})

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'path'],
})

app.get('/metrics', async (c) => {
  return c.text(await register.metrics())
})
```

---

# 26. Senior Engineer Mindset

## Code Quality
- **SOLID principles**: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It (don't over-engineer)
- **KISS**: Keep It Simple, Stupid
- Code is read 10x more than it's written — optimize for readability

## What Makes a Senior?
- **Systems thinking**: See the whole picture, not just the ticket
- **Trade-off reasoning**: No perfect solution, only right trade-offs
- **Proactive**: Sees problems before they happen
- **Mentoring**: Makes the team better
- **Communication**: Explains technical concepts to non-technical people
- **Estimation**: Accurate, includes unknowns
- **Debugging**: Methodical, hypotheses-driven
- **Incident response**: Calm under pressure, focuses on mitigation first

## Code Review Checklist
```
□ Does it work correctly?
□ Is it readable? Would a stranger understand it?
□ Are edge cases handled?
□ Is error handling complete?
□ Are there any security issues?
□ Are there performance concerns?
□ Is it tested?
□ Is it properly logged?
□ Does it follow existing patterns?
□ Are environment variables handled correctly?
```

## Performance Checklist
```
□ Are N+1 queries avoided?
□ Are appropriate indexes added?
□ Are expensive operations cached?
□ Are independent operations parallelized?
□ Is pagination used for large result sets?
□ Are large files streamed, not loaded into memory?
```

## API Design Checklist
```
□ Consistent naming (nouns not verbs)
□ Correct HTTP methods
□ Correct status codes
□ Input validation on all inputs
□ Pagination on list endpoints
□ Authentication required where needed
□ Appropriate rate limiting
□ Response includes created/updated data
□ Errors include meaningful messages
```

---

# 27. Your Modern Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Language | TypeScript | Type safety, better DX |
| Framework | Hono | Fast, lightweight, edge-compatible |
| Database | PostgreSQL via Neon | Powerful, serverless, branching |
| ORM | Drizzle | SQL-first, type-safe |
| Validation | Zod | Runtime + TypeScript types |
| Auth | Clerk or Auth.js | Don't reinvent auth |
| Email | Resend | Developer-friendly |
| Storage | Cloudflare R2 | Cheap, S3-compatible |
| Cache | Upstash Redis | Serverless Redis |
| Jobs | Trigger.dev | Serverless background jobs |
| Deploy | Vercel / Railway | Easy, scalable |
| Monitoring | Sentry + Pino | Error tracking + logging |
| Testing | Vitest | Fast, TypeScript-native |
| CI/CD | GitHub Actions | Free, integrated |

---

# 28. Learning Order & Projects

## Phase 1 — Foundations (4-6 weeks)
- [ ] TypeScript basics
- [ ] HTTP concepts (request, response, methods, status codes)
- [ ] Build REST API with Hono/Express
- [ ] Input validation with Zod
- [ ] SQL fundamentals (SELECT, INSERT, UPDATE, DELETE, JOINs)
- [ ] PostgreSQL basics

**Project**: Build a simple CRUD REST API (todo list, blog, etc.)

## Phase 2 — Real Data (3-4 weeks)
- [ ] Drizzle ORM schema design
- [ ] Connect to Neon database
- [ ] Migrations
- [ ] Data relationships (one-to-many, many-to-many)
- [ ] Authentication (JWT + password hashing)
- [ ] Environment variable management

**Project**: Build a blog API (users, posts, comments, auth)

## Phase 3 — Production Features (4-6 weeks)
- [ ] File uploads (Uploadthing or S3)
- [ ] Email sending (Resend)
- [ ] Rate limiting
- [ ] Caching with Redis
- [ ] Background jobs
- [ ] Security hardening

**Project**: Build a full SaaS backend (subscriptions, file uploads, emails)

## Phase 4 — DevOps & Scale (3-4 weeks)
- [ ] Docker
- [ ] CI/CD with GitHub Actions
- [ ] Deploy to Railway or Vercel
- [ ] Monitoring with Sentry
- [ ] Structured logging
- [ ] Performance optimization

**Project**: Deploy your SaaS backend with full observability

## Phase 5 — Senior Topics (ongoing)
- [ ] System design practice
- [ ] WebSockets and realtime
- [ ] Advanced PostgreSQL (window functions, full-text search)
- [ ] Testing strategy and coverage
- [ ] API versioning
- [ ] OpenAPI/Swagger documentation

## Resources
```
Documentation:
  - Drizzle: https://orm.drizzle.team
  - Neon: https://neon.tech/docs
  - Hono: https://hono.dev
  - Zod: https://zod.dev

Practice:
  - PostgreSQL exercises: https://pgexercises.com
  - SQL: https://sqlbolt.com
  - System design: https://github.com/donnemartin/system-design-primer

Books:
  - "Designing Data-Intensive Applications" (DDIA) — essential for seniors
  - "Clean Code" by Robert Martin
  - "The Pragmatic Programmer"
```

---

> **Remember**: The best way to learn is to BUILD. Pick a project idea and build it. Break it. Fix it. Repeat. Every senior engineer got there by writing a lot of bad code first.

> **The most important skill** is learning how to learn. Technologies change. SQL, HTTP, and good architecture thinking don't.
