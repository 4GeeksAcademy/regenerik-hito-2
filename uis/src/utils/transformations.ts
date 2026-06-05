import type {
  Country,
  CountryMetrics,
  Location,
  MenuItem,
  Moneda,
  PaymentMethod,
  Price,
  SaleTransaction,
  WasteReason,
  WasteRecord,
} from "../types/models";

function redondearADosDecimales(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function esMismaFecha(primeraFecha: Date, segundaFecha: Date): boolean {
  return (
    primeraFecha.getFullYear() === segundaFecha.getFullYear() &&
    primeraFecha.getMonth() === segundaFecha.getMonth() &&
    primeraFecha.getDate() === segundaFecha.getDate()
  );
}

function crearPrecioVacio(): Price {
  return { USD: 0, COP: 0 };
}

function buscarItemPorId(items: MenuItem[], itemId: string): MenuItem | undefined {
  return items.find((item: MenuItem) => item.id === itemId);
}

export function calculateDailyRevenue(
  sales: SaleTransaction[],
  date: Date,
  currency: Moneda
): number {
  const ingresoTotal: number = sales
    .filter((venta: SaleTransaction) => esMismaFecha(venta.timestamp, date))
    .reduce((total: number, venta: SaleTransaction) => total + venta.totalPrice[currency], 0);

  return redondearADosDecimales(ingresoTotal);
}

export function calculateLocationMargin(
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  locationId: string,
  currency: Moneda
): number {
  const ventasDeLocacion: SaleTransaction[] = sales.filter(
    (venta: SaleTransaction) => venta.locationId === locationId
  );

  const ingresoTotal: number = ventasDeLocacion.reduce(
    (total: number, venta: SaleTransaction) => total + venta.totalPrice[currency],
    0
  );

  if (ingresoTotal === 0) {
    return 0;
  }

  const costoTotalIngredientes: number = ventasDeLocacion.reduce(
    (total: number, venta: SaleTransaction) => {
      const itemEncontrado: MenuItem | undefined = buscarItemPorId(menuItems, venta.itemId);

      if (!itemEncontrado) {
        return total;
      }

      return total + itemEncontrado.ingredientCost[currency] * venta.quantity;
    },
    0
  );

  const margen: number = ((ingresoTotal - costoTotalIngredientes) / ingresoTotal) * 100;
  return redondearADosDecimales(margen);
}

export function calculateWasteCost(
  wasteRecords: WasteRecord[],
  locationId: string,
  currency: Moneda
): number {
  const costoTotal: number = wasteRecords
    .filter((desperdicio: WasteRecord) => desperdicio.locationId === locationId)
    .reduce((total: number, desperdicio: WasteRecord) => total + desperdicio.cost[currency], 0);

  return redondearADosDecimales(costoTotal);
}

export function convertCurrency(
  amount: number,
  fromCurrency: Moneda,
  toCurrency: Moneda
): number {
  const pesosColombianosPorDolar: number = 4000;

  if (fromCurrency === toCurrency) {
    return redondearADosDecimales(amount);
  }

  if (fromCurrency === "USD" && toCurrency === "COP") {
    return redondearADosDecimales(amount * pesosColombianosPorDolar);
  }

  return redondearADosDecimales(amount / pesosColombianosPorDolar);
}

export function scoreLocationPerformance(
  location: Location,
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[]
): number {
  const ventasDeLocacion: SaleTransaction[] = sales.filter(
    (venta: SaleTransaction) => venta.locationId === location.id
  );

  const ingresoTotalUsd: number = ventasDeLocacion.reduce(
    (total: number, venta: SaleTransaction) => total + venta.totalPrice.USD,
    0
  );

  const fechaApertura: Date = new Date(location.openingYear, 0, 1);
  const fechaActual: Date = new Date();
  const milisegundosPorDia: number = 1000 * 60 * 60 * 24;

  const diasOperativos: number = Math.max(
    1,
    Math.floor((fechaActual.getTime() - fechaApertura.getTime()) / milisegundosPorDia)
  );

  const ingresoDiarioPromedio: number = ingresoTotalUsd / diasOperativos;
  const puntajeIngresos: number = Math.min((ingresoDiarioPromedio / 1000) * 40, 40);

  const puntajeEficiencia: number = Math.min(
    (ventasDeLocacion.length / location.seatingCapacity) * 30,
    30
  );

  const costoDesperdicioUsd: number = calculateWasteCost(wasteRecords, location.id, "USD");
  const porcentajeDesperdicio: number =
    ingresoTotalUsd === 0 ? 100 : (costoDesperdicioUsd / ingresoTotalUsd) * 100;

  const puntajeDesperdicio: number = Math.max(20 - porcentajeDesperdicio * 2, 0);

  const margen: number = calculateLocationMargin(sales, menuItems, location.id, "USD");
  const puntajeMargen: number = Math.min(margen / 10, 10);

  const puntajeFinal: number =
    puntajeIngresos + puntajeEficiencia + puntajeDesperdicio + puntajeMargen;

  return redondearADosDecimales(puntajeFinal);
}

export function rankLocationsByPerformance(
  locations: Location[],
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[]
): Array<{ location: Location; score: number }> {
  return locations
    .map((locacion: Location) => ({
      location: locacion,
      score: scoreLocationPerformance(locacion, sales, wasteRecords, menuItems),
    }))
    .sort((primeraLocacion, segundaLocacion) => segundaLocacion.score - primeraLocacion.score);
}

export function countSalesByPaymentMethod(sales: SaleTransaction[]): Record<PaymentMethod, number> {
  const conteo: Record<PaymentMethod, number> = {
    Cash: 0,
    "Credit card": 0,
    "Debit card": 0,
    "Digital wallet": 0,
  };

  for (const venta of sales) {
    conteo[venta.paymentMethod] += 1;
  }

  return conteo;
}

export function calculateAverageTicket(
  sales: SaleTransaction[],
  currency: Moneda
): number {
  if (sales.length === 0) {
    return 0;
  }

  const ingresoTotal: number = sales.reduce(
    (total: number, venta: SaleTransaction) => total + venta.totalPrice[currency],
    0
  );

  return redondearADosDecimales(ingresoTotal / sales.length);
}

export function findTopSellingItems(
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  topN: number
): Array<{ item: MenuItem; totalSold: number }> {
  if (topN <= 0) {
    return [];
  }

  const totalesPorItem: Record<string, number> = {};

  for (const venta of sales) {
    totalesPorItem[venta.itemId] = (totalesPorItem[venta.itemId] ?? 0) + venta.quantity;
  }

  return Object.entries(totalesPorItem)
    .map(([itemId, totalSold]) => {
      const itemEncontrado: MenuItem | undefined = buscarItemPorId(menuItems, itemId);

      if (!itemEncontrado) {
        return null;
      }

      return {
        item: itemEncontrado,
        totalSold,
      };
    })
    .filter((resultado): resultado is { item: MenuItem; totalSold: number } => resultado !== null)
    .sort((primerItem, segundoItem) => segundoItem.totalSold - primerItem.totalSold)
    .slice(0, topN);
}

export function groupWasteByReason(wasteRecords: WasteRecord[]): Record<WasteReason, WasteRecord[]> {
  const desperdiciosAgrupados: Record<WasteReason, WasteRecord[]> = {
    Expired: [],
    "Cooking error": [],
    "Customer return": [],
    Damage: [],
    Other: [],
  };

  for (const desperdicio of wasteRecords) {
    desperdiciosAgrupados[desperdicio.reason].push(desperdicio);
  }

  return desperdiciosAgrupados;
}

export function calculateCountryComparison(
  sales: SaleTransaction[],
  locations: Location[],
  menuItems: MenuItem[]
): { Colombia: CountryMetrics; USA: CountryMetrics } {
  const paises: Country[] = ["Colombia", "USA"];

  const comparacion: { Colombia: CountryMetrics; USA: CountryMetrics } = {
    Colombia: {
      totalLocations: 0,
      totalRevenue: crearPrecioVacio(),
      averageRevenuePerLocation: crearPrecioVacio(),
      totalSales: 0,
    },
    USA: {
      totalLocations: 0,
      totalRevenue: crearPrecioVacio(),
      averageRevenuePerLocation: crearPrecioVacio(),
      totalSales: 0,
    },
  };

  for (const pais of paises) {
    const locacionesDelPais: Location[] = locations.filter(
      (locacion: Location) => locacion.country === pais
    );

    const idsLocacionesDelPais: string[] = locacionesDelPais.map(
      (locacion: Location) => locacion.id
    );

    const ventasDelPais: SaleTransaction[] = sales.filter((venta: SaleTransaction) =>
      idsLocacionesDelPais.includes(venta.locationId)
    );

    const ingresoTotal: Price = ventasDelPais.reduce(
      (totales: Price, venta: SaleTransaction) => ({
        USD: totales.USD + venta.totalPrice.USD,
        COP: totales.COP + venta.totalPrice.COP,
      }),
      crearPrecioVacio()
    );

    const totalLocaciones: number = locacionesDelPais.length;

    comparacion[pais] = {
      totalLocations: totalLocaciones,
      totalRevenue: {
        USD: redondearADosDecimales(ingresoTotal.USD),
        COP: redondearADosDecimales(ingresoTotal.COP),
      },
      averageRevenuePerLocation: {
        USD: totalLocaciones === 0 ? 0 : redondearADosDecimales(ingresoTotal.USD / totalLocaciones),
        COP: totalLocaciones === 0 ? 0 : redondearADosDecimales(ingresoTotal.COP / totalLocaciones),
      },
      totalSales: ventasDelPais.length,
    };
  }

  return comparacion;
}
