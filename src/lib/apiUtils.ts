export const STORAGE_KEYS = {
  BACKOFFICE_USER_DATA: 'backoffice_user_data',
};

export function createHeaders(skipAuth = false): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (!skipAuth) {
    const backofficeUserData = localStorage.getItem(STORAGE_KEYS.BACKOFFICE_USER_DATA);
    let userData = { access_token: undefined };

    if (backofficeUserData) {
      try {
        userData = JSON.parse(backofficeUserData);
      } catch (error) {
        console.error(`Failed to parse ${STORAGE_KEYS.BACKOFFICE_USER_DATA}:`, error);
      }
    }
    const accessToken = userData?.access_token;
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function fetchWithErrorHandling<R = unknown>(
  url: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<R> {
  const { skipAuth, ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(skipAuth),
      ...fetchOptions,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const responseText = await response.text();
      throw new Error(`Expected JSON, got ${contentType}: ${responseText.substring(0, 100)}`);
    }

    return response.json();
  } catch (error) {
    console.error('[API] Request failed:', error);
    throw error;
  }
}
