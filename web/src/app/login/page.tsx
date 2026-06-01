import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  params.set("auth", "login");

  // Forward any existing query parameters (like redirect URLs, email, token)
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  redirect(`/?${params.toString()}`);
}
