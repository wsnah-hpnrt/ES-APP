export interface EscalatorInfo {
  es_num: string;
  es_unit: number;
  location: string;
}

export interface MonthlyRawData extends EscalatorInfo {
  date: string;
  boarding_load: number;
  boarding_passenger: number;
  driving_distance: number;
  driving_time: number;
  operating_time: number;
  left_handrail_distance: number;
  left_handrail_speed: number;
  right_handrail_distance: number;
  right_handrail_speed: number;
  nominal_speed: number;
  power_consum: number;
  start_num: number;
  auxmbrake_braking_distance: number;
  driving_chain_increased_length: number;
  mbrake_braking_distance: number;
  stepchain_increased_length: number;
}

export interface DailyRawData extends EscalatorInfo {
  date: string;
  boarding_load: number;
  boarding_passenger: number;
  driving_distance: number;
  driving_time: number;
  operating_time: number;
  left_handrail_distance: number;
  left_handrail_speed: number;
  right_handrail_distance: number;
  right_handrail_speed: number;
  nominal_speed: number;
  power_consum: number;
  start_num: number;
}

export interface HourlyRawData extends EscalatorInfo {
  date: string;
  hour: number;
  boarding_load: number;
  boarding_passenger: number;
  driving_distance: number;
  driving_time: number;
  operating_time: number;
  left_handrail_distance: number;
  left_handrail_speed: number;
  right_handrail_distance: number;
  right_handrail_speed: number;
  nominal_speed: number;
  power_consum: number;
  start_num: number;
  humidity: number;
  temper: number;
}
