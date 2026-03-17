import { registerBike, getBikeByBtId, getMyBikes, BtBikeNotFoundError } from '../../api/bikes';

describe('registerBike', () => {
  it('returns an OurBike with a bt:-prefixed id and status registered', async () => {
    const result = await registerBike({
      make: 'Trek',
      model: 'Marlin 5',
      serial: 'ABC123',
      color: 'Blue',
      year: 2021,
    });

    expect(result.id).toMatch(/^bt:/);
    expect(result.status).toBe('registered');
    expect(result.make).toBe('Trek');
    expect(result.model).toBe('Marlin 5');
    expect(result.serial).toBe('ABC123');
    expect(result.color).toBe('Blue');
    expect(result.year).toBe(2021);
  });

  it('works without a year', async () => {
    const result = await registerBike({
      make: 'Giant',
      model: 'Talon',
      serial: 'XYZ789',
      color: 'Red',
    });

    expect(result.id).toMatch(/^bt:/);
    expect(result.year).toBeUndefined();
  });
});

describe('getBikeByBtId', () => {
  it('returns a stub bike for a valid bt: id', async () => {
    const id = 'bt:a3f9c821-4b2d-4abc-8abc-000000000001';
    const result = await getBikeByBtId(id);

    expect(result.id).toBe(id);
    expect(result.status).toBeDefined();
  });

  it('throws BtBikeNotFoundError for a non-bt: string', async () => {
    const err = await getBikeByBtId('3350313').catch((e) => e);
    expect(err).toBeInstanceOf(BtBikeNotFoundError);
  });

  it('throws BtBikeNotFoundError for a plain string without bt: prefix', async () => {
    const err = await getBikeByBtId('some-random-tag').catch((e) => e);
    expect(err).toBeInstanceOf(BtBikeNotFoundError);
    expect(err.message).toContain('some-random-tag');
  });
});

describe('getMyBikes', () => {
  it('returns an array of OurBike with at least one item', async () => {
    const result = await getMyBikes();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns bikes with required OurBike fields', async () => {
    const result = await getMyBikes();
    const bike = result[0];

    expect(bike.id).toBeDefined();
    expect(bike.make).toBeDefined();
    expect(bike.model).toBeDefined();
    expect(bike.serial).toBeDefined();
    expect(bike.color).toBeDefined();
    expect(bike.status).toBeDefined();
  });
});
