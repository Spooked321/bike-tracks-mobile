import React from 'react';
import { render } from '@testing-library/react-native';
import { BikeCard } from '../../components/BikeCard';
import type { BikeListItem } from '../../types/bike';

const safeBike: BikeListItem = {
  id: 1001,
  title: '2020 Specialized Allez',
  serial: 'SN987654',
  status: 'with owner',
  stolen: false,
  stolen_location: null,
  date_stolen: null,
  thumb: null,
  url: 'https://bikeindex.org/bikes/1001',
  manufacturer_name: 'Specialized',
  frame_model: 'Allez',
  year: 2020,
  frame_colors: ['Red', 'White'],
};

const stolenBike: BikeListItem = {
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

describe('BikeCard', () => {
  it('renders bike title', () => {
    const { getByText } = render(<BikeCard bike={safeBike} />);
    expect(getByText('2020 Specialized Allez')).toBeTruthy();
  });

  it('renders manufacturer and year', () => {
    const { getByText } = render(<BikeCard bike={safeBike} />);
    expect(getByText('Brand: Specialized')).toBeTruthy();
    expect(getByText('Year: 2020')).toBeTruthy();
  });

  it('renders serial number', () => {
    const { getByText } = render(<BikeCard bike={safeBike} />);
    expect(getByText('Serial: SN987654')).toBeTruthy();
  });

  it('renders frame colors', () => {
    const { getByText } = render(<BikeCard bike={safeBike} />);
    expect(getByText('Color: Red, White')).toBeTruthy();
  });

  it('shows "WITH OWNER" status for safe bike', () => {
    const { getByText } = render(<BikeCard bike={safeBike} />);
    expect(getByText('WITH OWNER')).toBeTruthy();
  });

  it('shows "STOLEN" status for stolen bike', () => {
    const { getByText } = render(<BikeCard bike={stolenBike} />);
    expect(getByText('STOLEN')).toBeTruthy();
  });

  it('renders stolen location for stolen bike', () => {
    const { getByText } = render(<BikeCard bike={stolenBike} />);
    expect(getByText('Last seen: Portland, OR')).toBeTruthy();
  });

  it('renders stolen date for stolen bike', () => {
    const { getByText } = render(<BikeCard bike={stolenBike} />);
    // Date format is locale-dependent — just check it renders something
    expect(getByText(/Stolen:/)).toBeTruthy();
  });
});
