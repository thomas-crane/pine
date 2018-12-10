export function printObj(obj: any): void {
  console.log(`${typeof obj}`);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      if (typeof element === 'function') {
        if (element.name === 'toString') {
          console.log(`  ${element.toString()}`);
        }
      }
    }
  }
}
