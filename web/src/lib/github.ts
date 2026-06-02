// Load environment variables for GitHub API integration
const githubToken = process.env.GITHUB_ACCESS_TOKEN;
const githubOwner = process.env.GITHUB_OWNER;
const githubRepo = process.env.GITHUB_REPO;

// Check if GitHub API integration is fully configured
export function isGitHubConfigured(): boolean {
  return !!(githubToken && githubOwner && githubRepo);
}

/**
 * Fetches the current file details (specifically the SHA) from GitHub.
 * Returns null if the file does not exist yet.
 */
export async function getGitHubFileSha(path: string): Promise<string | null> {
  if (!isGitHubConfigured()) return null;

  try {
    const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenPrimer-Sync-Agent',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.sha;
    }
    return null;
  } catch (error: any) {
    console.error(`🚨 Failed to query file SHA from GitHub for "${path}":`, error.message);
    return null;
  }
}

/**
 * Programmatically commits and pushes a file to the GitHub repository using the REST API.
 * Encodes the Markdown/JSON content in Base64 and executes a PUT request.
 */
export async function pushToGitHub(path: string, content: string, message: string): Promise<boolean> {
  if (!isGitHubConfigured()) {
    console.warn(`⚠️ GitHub API is not configured. Skipped committing file "${path}" to repository.`);
    return false;
  }

  try {
    // 1. Get SHA if the file already exists (necessary for updates)
    const sha = await getGitHubFileSha(path);

    // 2. Base64 encode the content (handles UTF-8 strings properly)
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${path}`;
    const body: Record<string, any> = {
      message: message,
      content: base64Content,
    };
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'OpenPrimer-Sync-Agent',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Programmatic GitHub commit successful: "${path}" (${response.status === 201 ? 'Created' : 'Updated'}).`);
      return true;
    } else {
      const errData = await response.json();
      console.error(`🚨 GitHub API error (${response.status}) on PUT "${path}":`, errData.message);
      return false;
    }
  } catch (error: any) {
    console.error(`🚨 Failed to commit to GitHub for path "${path}":`, error.message);
    return false;
  }
}

/**
 * Programmatically commits a deletion to the GitHub repository using the REST API.
 * This completely archives/removes the file from the current HEAD branch while preserving full Git history.
 */
export async function deleteFromGitHub(path: string, message: string): Promise<boolean> {
  if (!isGitHubConfigured()) {
    console.warn(`⚠️ GitHub API is not configured. Skipped deleting file "${path}" from repository.`);
    return false;
  }

  try {
    // 1. Get SHA (absolutely required for GitHub deletions)
    const sha = await getGitHubFileSha(path);
    if (!sha) {
      console.warn(`⚠️ File "${path}" was not found on GitHub. Nothing to delete.`);
      return true; // Already deleted/non-existent
    }

    const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${path}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'OpenPrimer-Sync-Agent',
      },
      body: JSON.stringify({
        message: message,
        sha: sha,
      }),
    });

    if (response.status === 200) {
      console.log(`✅ Programmatic GitHub deletion successful: "${path}" committed deletion.`);
      return true;
    } else {
      const errData = await response.json();
      console.error(`🚨 GitHub API error (${response.status}) on DELETE "${path}":`, errData.message);
      return false;
    }
  } catch (error: any) {
    console.error(`🚨 Failed to commit deletion to GitHub for path "${path}":`, error.message);
    return false;
  }
}
