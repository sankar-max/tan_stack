app/
├── (auth)/
│   ├── signin/page.tsx
│   └── signup/page.tsx
├── blog/
│   ├── page.tsx                // /blog – public feed
│   └── [slug]/page.tsx         // single post
├── dashboard/                  // all protected
│   ├── layout.tsx              // sidebar + header
│   ├── page.tsx                // overview
│   ├── posts/
│   │   ├── page.tsx            // my posts list
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── edit/page.tsx
│   │       └── page.tsx        // optional detail/analytics
│   ├── comments/page.tsx       // moderate comments
│   └── profile/page.tsx
└── page.tsx                    // / → home / landing (optional redirect to /blog)

src/
├── actions/
│   └── posts.ts
├── components/
│   ├── ui/
│   ├── blog/
│   └── dashboard/
└── lib/
    ├── auth.ts
    └── db/



    