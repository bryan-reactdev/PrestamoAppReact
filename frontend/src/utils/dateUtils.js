export function getCurrentDate(){
  return new Date().toLocaleDateString('sv-ES').split('-').join('-');
}

export function DateTimeToDateAndTime(fecha) {
  const date = new Date(fecha);

  // Get components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // convert 0 to 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

export function DateTimeToDate(fecha) {
  const date = new Date(fecha);

  // Get components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  return `${day}/${month}/${year}`;
}

export function getWeekLabel(weekOffset = 0) {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + (weekOffset * 7));
  
  const startOfWeek = new Date(targetDate);
  const day = targetDate.getDay();
  const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  if (weekOffset === 0) return 'Semana Actual';
  if (weekOffset === -1) return 'Semana Anterior';
  if (weekOffset === 1) return 'Próxima Semana';
  
  const startStr = startOfWeek.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  const endStr = endOfWeek.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  return `Semana del ${startStr} al ${endStr}`;
}

export function getMonthLabel(monthOffset = 0) {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  
  if (monthOffset === 0) return 'Mes Actual';
  if (monthOffset === -1) return 'Mes Anterior';
  if (monthOffset === 1) return 'Próximo Mes';
  
  const monthStr = targetDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
}