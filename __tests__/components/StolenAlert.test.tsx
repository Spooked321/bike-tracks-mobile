import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { StolenAlert } from '../../components/StolenAlert';
import type { BikeDetail } from '../../types/bike';

const stolenBike: BikeDetail = {
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
    theft_description: 'Locked outside a coffee shop overnight',
    police_report_number: 'PDX-2021-001',
    police_report_url: null,
  },
  description: null,
  frame_size: 'M',
  handlebar_type_slug: null,
  registration_created_at: 1600000000,
  updated_at: 1609460000,
};

describe('StolenAlert', () => {
  it('renders STOLEN BIKE header', () => {
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    expect(getByText('STOLEN BIKE')).toBeTruthy();
  });

  it('renders the bike title', () => {
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    expect(getByText('2019 Trek Marlin 5')).toBeTruthy();
  });

  it('renders serial number', () => {
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    expect(getByText('Serial: WTU123456')).toBeTruthy();
  });

  it('renders location from stolen_record', () => {
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    expect(getByText('Location: Portland, OR')).toBeTruthy();
  });

  it('renders theft description', () => {
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    expect(getByText('Locked outside a coffee shop overnight')).toBeTruthy();
  });

  it('renders police report number', () => {
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    expect(getByText('Police report: PDX-2021-001')).toBeTruthy();
  });

  it('shows Alert.alert with "Coming soon" on Alert Owner press', () => {
    jest.spyOn(Alert, 'alert');
    const { getByText } = render(<StolenAlert bike={stolenBike} />);
    fireEvent.press(getByText('Alert Owner'));
    expect(Alert.alert).toHaveBeenCalledWith('Coming soon', expect.any(String));
  });

  it('falls back to stolen_location when stolen_record has no city/state', () => {
    const bikeNoRecord: BikeDetail = {
      ...stolenBike,
      stolen_record: null,
    };
    const { getByText } = render(<StolenAlert bike={bikeNoRecord} />);
    expect(getByText('Location: Portland, OR')).toBeTruthy();
  });
});
