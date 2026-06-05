import type {
  Location,
  MenuCategory,
  MenuItem,
  Moneda,
  Orden,
  SaleTransaction,
} from "../types/models";

// Este archivo contiene utilidades para filtrar y ordenar colecciones de ventas, items y locales.
// Las funciones ayudan a trabajar listas sin modificar los datos originales cuando se requiere ordenar.


// 1 - Filtra ventas por local:
export function filterSalesByLocation(
  ventas: SaleTransaction[],
  locationId: string
): SaleTransaction[] {
  return ventas.filter((venta: SaleTransaction) => venta.locationId === locationId);
}


// 2 - Filtra ventas por rango de fechas:
export function filterSalesByDateRange(
  ventas: SaleTransaction[],
  startDate: Date,
  endDate: Date
): SaleTransaction[] {
  return ventas.filter((venta: SaleTransaction) => {
    return venta.timestamp >= startDate && venta.timestamp <= endDate;
  });
}

// 3 - Filtra items del menu por categoria:
export function filterMenuItemsByCategory(
  items: MenuItem[],
  category: MenuCategory
): MenuItem[] {
  return items.filter((item: MenuItem) => item.category === category);
}

// 4 - Filtra solo los locales activos:
export function filterActiveLocations(locations: Location[]): Location[] {
  return locations.filter((locacion: Location) => locacion.status === "Active");
}

// 5 - Ordena locales por capacidad de asientos:
export function sortLocationsByCapacity(
  locations: Location[],
  order: Orden
): Location[] {
  return [...locations].sort((primeraLocacion: Location, segundaLocacion: Location) => {
    const diferencia: number = primeraLocacion.seatingCapacity - segundaLocacion.seatingCapacity;
    return order === "asc" ? diferencia : -diferencia;
  });
}

// 6 - Ordena items del menu por precio segun moneda:
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
