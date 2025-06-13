export function isSingleCharacterOrEmoji(textInput: string): boolean {
  const segmenter = new Intl.Segmenter("es");
  const segments = Array.from(segmenter.segment(textInput)).map((segment) => {
    return segment.segment;
  });

  if (segments.length > 1) {
    return false;
  }

  return true;
}
