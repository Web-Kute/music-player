export function fisherYatesShuffle(array) {
  const shuffledArray = [...array];
  const getRandomInt = (max) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
