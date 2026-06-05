import type { Location, MenuItem } from "../types/models";

export function findLocationById(locations: Location[], id: string): Location | null {
  for (const locacion of locations) {
    if (locacion.id === id) {
      return locacion;
    }
  }

  return null;
}

export function findMenuItemByName(items: MenuItem[], name: string): MenuItem | null {
  const nombreBuscado: string = name.toLowerCase();

  for (const item of items) {
    if (item.name.toLowerCase() === nombreBuscado) {
      return item;
    }
  }

  return null;
}

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
