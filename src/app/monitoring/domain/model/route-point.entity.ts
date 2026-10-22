export interface RoutePoint {
  time: string;
  placeName: string;
  status: 'Salida' | 'Zona segura' | 'En camino' | 'Llegada';
}
