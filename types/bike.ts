export interface StolenRecord {
  city: string | null;
  state: string | null;
  country: string | null;
  date_stolen: number | null; // Unix timestamp
  theft_description: string | null;
  police_report_number: string | null;
  police_report_url: string | null;
}

export interface BikeListItem {
  id: number;
  title: string;
  serial: string | null;
  status: 'with owner' | 'stolen' | 'found' | 'impounded' | string;
  stolen: boolean;
  stolen_location: string | null;
  date_stolen: number | null; // Unix timestamp
  thumb: string | null;
  url: string;
  manufacturer_name: string | null;
  frame_model: string | null;
  year: number | null;
  frame_colors: string[];
}

export interface BikeDetail extends BikeListItem {
  stolen_record: StolenRecord | null;
  description: string | null;
  frame_size: string | null;
  handlebar_type_slug: string | null;
  registration_created_at: number | null;
  updated_at: number | null;
}

export interface BikeDetailResponse {
  bike: BikeDetail;
}

export interface BikeSearchResponse {
  bikes: BikeListItem[];
  total: number | null;
}
