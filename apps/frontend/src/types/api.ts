export type ApiState = 'idle' | 'loading' | 'success' | 'error';

export interface HealthResponse {
  status: 'ok';
  service: 'backend';
  timestamp: string;
}
