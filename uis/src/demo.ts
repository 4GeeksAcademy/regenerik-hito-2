import {
  filterActiveLocations,
  filterMenuItemsByCategory,
  filterSalesByDateRange,
  filterSalesByLocation,
  sortLocationsByCapacity,
  sortMenuItemsByPrice,
} from "./utils/collections";

import {
  binarySearchLocationByCapacity,
  findLocationById,
  findMenuItemByName,
} from "./utils/search";

import {
  calculateAverageTicket,
  calculateCountryComparison,
  calculateDailyRevenue,
  calculateLocationMargin,
  calculateWasteCost,
  convertCurrency,
  countSalesByPaymentMethod,
  findTopSellingItems,
  groupWasteByReason,
  rankLocationsByPerformance,
} from "./utils/transformations";

import {
  validateLocation,
  validateMenuItem,
  validateSaleTransaction,
} from "./utils/validations";

import {
  desperdiciosDeEjemplo,
  itemsMenuDeEjemplo,
  locacionesDeEjemplo,
  ventasDeEjemplo,
} from "./data/sampleData";

const ventasMedellin = filterSalesByLocation(ventasDeEjemplo, "LOC-MEDELLIN-01");
const ventasDelDia = filterSalesByDateRange(
  ventasDeEjemplo,
  new Date("2024-03-15T00:00:00"),
  new Date("2024-03-15T23:59:59")
);
const carnes = filterMenuItemsByCategory(itemsMenuDeEjemplo, "Meat");
const locacionesActivas = filterActiveLocations(locacionesDeEjemplo);
const locacionesPorCapacidad = sortLocationsByCapacity(locacionesDeEjemplo, "asc");
const itemsPorPrecioUsd = sortMenuItemsByPrice(itemsMenuDeEjemplo, "USD", "desc");

console.log("Ventas de Medellín:", ventasMedellin);
console.log("Ventas del día:", ventasDelDia);
console.log("Ítems de categoría Meat:", carnes);
console.log("Locaciones activas:", locacionesActivas);
console.log("Locaciones ordenadas por capacidad:", locacionesPorCapacidad);
console.log("Ítems ordenados por precio USD:", itemsPorPrecioUsd);

console.log("Locación encontrada:", findLocationById(locacionesDeEjemplo, "LOC-MIAMI-01"));
console.log("Ítem encontrado por nombre:", findMenuItemByName(itemsMenuDeEjemplo, "picanha 250g"));
console.log(
  "Índice encontrado por búsqueda binaria:",
  binarySearchLocationByCapacity(locacionesPorCapacidad, 100)
);

console.log("Ingreso diario USD:", calculateDailyRevenue(ventasDeEjemplo, new Date("2024-03-15"), "USD"));
console.log(
  "Margen Medellín USD:",
  calculateLocationMargin(ventasDeEjemplo, itemsMenuDeEjemplo, "LOC-MEDELLIN-01", "USD")
);
console.log(
  "Costo de desperdicio Medellín USD:",
  calculateWasteCost(desperdiciosDeEjemplo, "LOC-MEDELLIN-01", "USD")
);
console.log("Convertir 10 USD a COP:", convertCurrency(10, "USD", "COP"));
console.log("Conteo por método de pago:", countSalesByPaymentMethod(ventasDeEjemplo));
console.log("Ticket promedio USD:", calculateAverageTicket(ventasDeEjemplo, "USD"));
console.log("Top 2 ítems vendidos:", findTopSellingItems(ventasDeEjemplo, itemsMenuDeEjemplo, 2));
console.log("Desperdicios agrupados:", groupWasteByReason(desperdiciosDeEjemplo));
console.log(
  "Ranking de performance:",
  rankLocationsByPerformance(
    locacionesDeEjemplo,
    ventasDeEjemplo,
    desperdiciosDeEjemplo,
    itemsMenuDeEjemplo
  )
);
console.log(
  "Comparación por país:",
  calculateCountryComparison(ventasDeEjemplo, locacionesDeEjemplo, itemsMenuDeEjemplo)
);

console.log("Validación MenuItem:", validateMenuItem(itemsMenuDeEjemplo[0]));
console.log("Validación SaleTransaction:", validateSaleTransaction(ventasDeEjemplo[0]));
console.log("Validación Location:", validateLocation(locacionesDeEjemplo[0]));
