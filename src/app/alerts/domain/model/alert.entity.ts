export interface AlertEvent {
  id: string;
  type: 'critical' | 'warning' | 'neutral';
  title: string;
  description: string;
  timestamp: string;
  status: 'Pendiente' | 'Atendida por Valeria' | 'Resuelta';
}
