import type { Location, MenuItem, ResultadoValidacion, SaleTransaction } from "../types/models";

function esPositivo(valor: number): boolean {
  return valor > 0;
}

function tieneTexto(valor: string): boolean {
  return valor.trim().length > 0;
}

export function validateMenuItem(item: MenuItem): ResultadoValidacion {
  const errors: string[] = [];

  if (!tieneTexto(item.name)) {
    errors.push("name no debe estar vacío");
  }

  if (!esPositivo(item.basePrice.USD) || !esPositivo(item.basePrice.COP)) {
    errors.push("basePrice.USD y basePrice.COP deben ser mayores a 0");
  }

  if (!esPositivo(item.ingredientCost.USD) || !esPositivo(item.ingredientCost.COP)) {
    errors.push("ingredientCost.USD y ingredientCost.COP deben ser mayores a 0");
  }

  if (!esPositivo(item.prepTimeMinutes) || item.prepTimeMinutes > 60) {
    errors.push("prepTimeMinutes debe ser mayor a 0 y menor o igual a 60");
  }

  if (!item.isAvailableInColombia && !item.isAvailableInUSA) {
    errors.push("El ítem debe estar disponible en al menos un país");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSaleTransaction(sale: SaleTransaction): ResultadoValidacion {
  const errors: string[] = [];

  if (!esPositivo(sale.quantity)) {
    errors.push("quantity debe ser mayor a 0");
  }

  if (!esPositivo(sale.totalPrice.USD) || !esPositivo(sale.totalPrice.COP)) {
    errors.push("totalPrice.USD y totalPrice.COP deben ser mayores a 0");
  }

  if (!tieneTexto(sale.waiterName)) {
    errors.push("waiterName no debe estar vacío");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateLocation(location: Location): ResultadoValidacion {
  const errors: string[] = [];
  const anioActual: number = new Date().getFullYear();

  if (location.openingYear < 2008 || location.openingYear > anioActual) {
    errors.push("openingYear debe ser mayor o igual a 2008 y menor o igual al año actual");
  }

  if (!esPositivo(location.seatingCapacity)) {
    errors.push("seatingCapacity debe ser mayor a 0");
  }

  if (!esPositivo(location.staffCount)) {
    errors.push("staffCount debe ser mayor a 0");
  }

  if (!esPositivo(location.monthlyRentCost.USD) || !esPositivo(location.monthlyRentCost.COP)) {
    errors.push("monthlyRentCost.USD y monthlyRentCost.COP deben ser mayores a 0");
  }

  if (
    !esPositivo(location.averageMonthlyUtilities.USD) ||
    !esPositivo(location.averageMonthlyUtilities.COP)
  ) {
    errors.push("averageMonthlyUtilities.USD y averageMonthlyUtilities.COP deben ser mayores a 0");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
