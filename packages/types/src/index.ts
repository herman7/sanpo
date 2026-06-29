
export interface TestSanpo {
  title: string;
  name: string;
  age?: number;
}

// Connectivity test response between web and nest-api
export interface TestPingResponse {
  message: string;
  service: string;
  timestamp: string;
}