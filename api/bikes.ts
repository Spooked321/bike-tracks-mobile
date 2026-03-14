export interface OurBike {
  id: string;           // "bt:uuid"
  make: string;
  model: string;
  serial: string;
  color: string;
  year?: number;
  status: 'registered' | 'stolen';
  bikeIndexId?: number;
}

export interface BikeRegistrationData {
  make: string;
  model: string;
  serial: string;
  color: string;
  year?: number;
}

export class BtBikeNotFoundError extends Error {
  constructor(id: string) {
    super(`No bike found with ID: ${id}`);
    this.name = 'BtBikeNotFoundError';
  }
}

function generateBtId(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const s = (n: number) => Array.from({ length: n }, hex).join('');
  return `bt:${s(8)}-${s(4)}-4${s(3)}-${['8','9','a','b'][Math.floor(Math.random()*4)]}${s(3)}-${s(12)}`;
}

// STUB: replace with POST /api/bikes
export async function registerBike(data: BikeRegistrationData): Promise<OurBike> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    id: generateBtId(),
    make: data.make,
    model: data.model,
    serial: data.serial,
    color: data.color,
    year: data.year,
    status: 'registered',
  };
}

// STUB: replace with GET /api/bikes/:btId
export async function getBikeByBtId(btId: string): Promise<OurBike> {
  if (!btId.startsWith('bt:')) {
    throw new BtBikeNotFoundError(btId);
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    id: btId,
    make: 'Trek',
    model: 'Marlin 5',
    serial: 'ABC123',
    color: 'Blue',
    year: 2021,
    status: 'registered',
  };
}
