import type {
  Location,
  MenuCategory,
  MenuItem,
  Moneda,
  Orden,
  SaleTransaction,
} from "../types/models";

export function filterSalesByLocation(
  ventas: SaleTransaction[],
  locationId: string
): SaleTransaction[] {
  return ventas.filter((venta: SaleTransaction) => venta.locationId === locationId);
}

export function filterSalesByDateRange(
  ventas: SaleTransaction[],
  startDate: Date,
  endDate: Date
): SaleTransaction[] {
  return ventas.filter((venta: SaleTransaction) => {
    return venta.timestamp >= startDate && venta.timestamp <= endDate;
  });
}

export function filterMenuItemsByCategory(
  items: MenuItem[],
  category: MenuCategory
): MenuItem[] {
  return items.filter((item: MenuItem) => item.category === category);
}

export function filterActiveLocations(locations: Location[]): Location[] {
  return locations.filter((locacion: Location) => locacion.status === "Active");
}

export function sortLocationsByCapacity(
  locations: Location[],
  order: Orden
): Location[] {
  return [...locations].sort((primeraLocacion: Location, segundaLocacion: Location) => {
    const diferencia: number = primeraLocacion.seatingCapacity - segundaLocacion.seatingCapacity;
    return order === "asc" ? diferencia : -diferencia;
  });
}

export function sortMenuItemsByPrice(
  items: MenuItem[],
  currency: Moneda,
  order: Orden
): MenuItem[] {
  return [...items].sort((primerItem: MenuItem, segundoItem: MenuItem) => {
    const diferencia: number = primerItem.basePrice[currency] - segundoItem.basePrice[currency];
    return order === "asc" ? diferencia : -diferencia;
  });
}
