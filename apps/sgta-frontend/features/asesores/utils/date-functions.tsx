export const formatFecha = (
  fecha: string | Date | null | undefined,
): string => {
  if (!fecha) return "Sa";

  if (fecha instanceof Date) {
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  // Si es string, se espera en formato "dd/MM/yyyy"
  const [dia, mes, anio] = fecha.split("/");
  if (!dia || !mes || !anio) return "Sa";

  const dayNum = parseInt(dia, 10);
  const monthNum = parseInt(mes, 10);
  const yearNum = parseInt(anio, 10);

  if (
    isNaN(dayNum) ||
    isNaN(monthNum) ||
    isNaN(yearNum) ||
    dayNum < 1 ||
    dayNum > 31 ||
    monthNum < 1 ||
    monthNum > 12
  ) {
    return "Sa";
  }

  return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${anio}`;
};
