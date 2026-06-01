import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  params.set("auth", "signup");

  // Forward any existing query parameters
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  redirect(`/?${params.toString()}`);
}
