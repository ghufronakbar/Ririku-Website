/** Splits a sentence into words for the word-by-word reveal, keeping the spaces. */
export function words(text: string) {
  return text.split(" ").map((word, i, all) => (i < all.length - 1 ? `${word} ` : word));
}
