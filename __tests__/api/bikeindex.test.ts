import { getBikeById, searchBikes, BikeNotFoundError, BikeIndexNetworkError } from '../../api/bikeindex';
import type { BikeDetail, BikeListItem } from '../../types/bike';

const mockBikeDetail: BikeDetail = {
  id: 3350313,
  title: '2019 Trek Marlin 5',
  serial: 'WTU123456',
  status: 'stolen',
  stolen: true,
  stolen_location: 'Portland, OR',
  date_stolen: 1609459200,
  thumb: null,
  url: 'https://bikeindex.org/bikes/3350313',
  manufacturer_name: 'Trek',
  frame_model: 'Marlin 5',
  year: 2019,
  frame_colors: ['Blue'],
  stolen_record: {
    city: 'Portland',
    state: 'OR',
    country: 'US',
    date_stolen: 1609459200,
    theft_description: 'Locked outside overnight',
    police_report_number: 'PDX-2021-001',
    police_report_url: null,
  },
  description: null,
  frame_size: 'M',
  handlebar_type_slug: null,
  registration_created_at: 1600000000,
  updated_at: 1609460000,
};

const mockListItem: BikeListItem = {
  id: 3350313,
  title: '2019 Trek Marlin 5',
  serial: 'WTU123456',
  status: 'stolen',
  stolen: true,
  stolen_location: 'Portland, OR',
  date_stolen: 1609459200,
  thumb: null,
  url: 'https://bikeindex.org/bikes/3350313',
  manufacturer_name: 'Trek',
  frame_model: 'Marlin 5',
  year: 2019,
  frame_colors: ['Blue'],
};

describe('getBikeById', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches the correct URL and returns bike detail', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ bike: mockBikeDetail }),
    });

    const result = await getBikeById(3350313);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://bikeindex.org/api/v3/bikes/3350313'
    );
    expect(result).toEqual(mockBikeDetail);
  });

  it('throws BikeNotFoundError on 404', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'not found' }),
    });

    const err = await getBikeById(9999999).catch((e) => e);
    expect(err).toBeInstanceOf(BikeNotFoundError);
    expect(err.message).toBe('Bike 9999999 not found');
  });

  it('throws BikeIndexNetworkError on server error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const err = await getBikeById(1).catch((e) => e);
    expect(err).toBeInstanceOf(BikeIndexNetworkError);
    expect(err.message).toBe('Server error: 500');
  });

  it('throws BikeIndexNetworkError on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const err = await getBikeById(1).catch((e) => e);
    expect(err).toBeInstanceOf(BikeIndexNetworkError);
    expect(err.message).toBe('Failed to fetch');
  });
});

describe('searchBikes', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('builds the correct URL for a general search', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ bikes: [mockListItem], total: 1 }),
    });

    const results = await searchBikes('WTU123456');

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('serial=WTU123456');
    expect(calledUrl).toContain('stolenness=all');
    expect(results).toEqual([mockListItem]);
  });

  it('uses stolenness=stolen when stolenOnly is true', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ bikes: [], total: 0 }),
    });

    await searchBikes('WTU123456', true);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('stolenness=stolen');
  });

  it('returns empty array when bikes is missing from response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ total: 0 }),
    });

    const results = await searchBikes('UNKNOWN');
    expect(results).toEqual([]);
  });

  it('throws BikeIndexNetworkError on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(searchBikes('WTU123456')).rejects.toThrow(BikeIndexNetworkError);
  });
});
