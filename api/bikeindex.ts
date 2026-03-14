import type { BikeDetail, BikeListItem } from '../types/bike';

const BASE_URL = 'https://bikeindex.org/api/v3';

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
    response = await fetch(`${BASE_URL}/bikes/${id}`);
  } catch (err) {
    throw new BikeIndexNetworkError(
      err instanceof Error ? err.message : 'Network request failed'
    );
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
    response = await fetch(`${BASE_URL}/search?${params}`);
  } catch (err) {
    throw new BikeIndexNetworkError(
      err instanceof Error ? err.message : 'Network request failed'
    );
  }

  if (!response.ok) {
    throw new BikeIndexNetworkError(`Server error: ${response.status}`);
  }

  const data = await response.json();
  return (data.bikes ?? []) as BikeListItem[];
}
