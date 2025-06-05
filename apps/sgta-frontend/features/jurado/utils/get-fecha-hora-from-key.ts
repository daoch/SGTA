export function getFechaHoraFromKey(key: string) {
  const [fecha, hora] = key.split("|");
  return `${fecha}|${hora}`;
}
