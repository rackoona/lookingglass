export interface NetworkInfoResponse {
  location: string;
  map_url: string;
  facility: string;
  facility_url: string;
  looking_glass_ipv4: string;
  looking_glass_ipv6: string;
  your_ip: string;
}

export interface LookingGlassRequest {
  target: string;
}

export type PingRequest = LookingGlassRequest;
export type Ping6Request = LookingGlassRequest;
export type TracerouteRequest = LookingGlassRequest;
export type Traceroute6Request = LookingGlassRequest;
export type MtrRequest = LookingGlassRequest;
export type Mtr6Request = LookingGlassRequest;

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// Streaming types
export type StreamCallback = (chunk: string) => void;

export interface StreamOptions {
  onData: StreamCallback;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  signal?: AbortSignal;
}


