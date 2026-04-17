import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { BlogLayoutView } from "@/features/blog/components/BlogLayoutView";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  openGraph: { type: "website" },
};

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <BlogLayoutView user={session?.user}>
      {children}
    </BlogLayoutView>
  );
}
