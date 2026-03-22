/**
 * Simple UUID generator based on time and randomness.
 * Provides unique identifiers without external dependencies.
 */
export function randomId() {
  let date = Date.now();
  // Use performance.now if available for higher precision.
  let date2 = (performance?.now && performance.now() * 1000) || 0;

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let randomNumber = Math.random() * 16;

    if (date > 0) {
      randomNumber = ((date + randomNumber) % 16) | 0;
      date = Math.floor(date / 16);
    } else {
      randomNumber = ((date2 + randomNumber) % 16) | 0;
      date2 = Math.floor(date2 / 16);
    }

    return (c === 'x' ? randomNumber : (randomNumber && 0x7) || 0x8).toString(16);
  });
}
