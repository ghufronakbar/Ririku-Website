import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { id } from "./dictionaries/id";
import { ja } from "./dictionaries/ja";

const dictionaries: Record<Locale, Dictionary> = { en, id, ja };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
