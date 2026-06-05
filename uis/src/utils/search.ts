import type { Location, MenuItem } from "../types/models";

// Este archivo contiene utilidades de busqueda para encontrar locales e items dentro de colecciones.
// Incluye busquedas lineales por id y nombre, y una busqueda binaria por capacidad en listas ordenadas.

// 1 - Busca un local por id y devuelve el objeto o null si no existe:
export function findLocationById(locations: Location[], id: string): Location | null {
  for (const locacion of locations) {
    if (locacion.id === id) {
      return locacion;
    }
  }

  return null;
}

// 2 - Busca un item del menu por nombre sin distinguir mayusculas:
export function findMenuItemByName(items: MenuItem[], name: string): MenuItem | null {
  const nombreBuscado: string = name.toLowerCase();

  for (const item of items) {
    if (item.name.toLowerCase() === nombreBuscado) {
      return item;
    }
  }

  return null;
}

// 3 - Busca por capacidad usando busqueda binaria y devuelve el indice o -1:
export function binarySearchLocationByCapacity(
  sortedLocations: Location[],
  targetCapacity: number
): number {
  let indiceIzquierdo: number = 0;
  let indiceDerecho: number = sortedLocations.length - 1;

  while (indiceIzquierdo <= indiceDerecho) {
    const indiceMedio: number = Math.floor((indiceIzquierdo + indiceDerecho) / 2);
    const capacidadActual: number = sortedLocations[indiceMedio].seatingCapacity;

    if (capacidadActual === targetCapacity) {
      return indiceMedio;
    }

    if (capacidadActual < targetCapacity) {
      indiceIzquierdo = indiceMedio + 1;
    } else {
      indiceDerecho = indiceMedio - 1;
    }
  }

  return -1;
}
