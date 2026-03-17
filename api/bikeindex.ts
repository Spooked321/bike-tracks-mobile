import type { BikeDetail, BikeListItem } from '../types/bike';

const BASE_URL = 'https://bikeindex.org/api/v3';
const FETCH_TIMEOUT_MS = 10_000;

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export class BikeNotFoundError extends Error {
  constructor(id: number) {
    super(`Bike ${id} not found`);
    this.name = 'BikeNotFoundError';
  }
}

export class BikeIndexNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BikeIndexNetworkError';
  }
}

export async function getBikeById(id: number): Promise<BikeDetail> {
  let response: Response;
  try {
    response = await fetchWithTimeout(`${BASE_URL}/bikes/${id}`);
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? 'Request timed out'
        : err instanceof Error
          ? err.message
          : 'Network request failed';
    throw new BikeIndexNetworkError(message);
  }

  if (response.status === 404) {
    throw new BikeNotFoundError(id);
  }

  if (!response.ok) {
    throw new BikeIndexNetworkError(`Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.bike as BikeDetail;
}

export async function searchBikes(
  query: string,
  stolenOnly = false
): Promise<BikeListItem[]> {
  const params = new URLSearchParams({
    serial: query,
    stolenness: stolenOnly ? 'stolen' : 'all',
    per_page: '20',
  });

  let response: Response;
  try {
    response = await fetchWithTimeout(`${BASE_URL}/search?${params}`);
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? 'Request timed out'
        : err instanceof Error
          ? err.message
          : 'Network request failed';
    throw new BikeIndexNetworkError(message);
  }

  if (!response.ok) {
    throw new BikeIndexNetworkError(`Server error: ${response.status}`);
  }

  const data = await response.json();
  return (data.bikes ?? []) as BikeListItem[];
}
