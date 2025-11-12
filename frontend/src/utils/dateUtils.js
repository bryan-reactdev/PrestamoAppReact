export function getCurrentDate(daysOffset = 0){
  const date = new Date();
  if (daysOffset !== 0) {
    date.setDate(date.getDate() + daysOffset);
  }
  return date.toLocaleDateString('sv-ES').split('-').join('-');
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
  
  const startStr = startOfWeek.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  const endStr = endOfWeek.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  const dateRange = `(${startStr} - ${endStr})`;
  
  if (weekOffset === 0) return `Semana Actual ${dateRange}`;
  if (weekOffset === 1) return 'Próxima Semana';
  
  return `Semana del ${startStr} al ${endStr}`;
}

export function getMonthLabel(monthOffset = 0) {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  
  const monthStr = targetDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const monthName = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  
  if (monthOffset === 0) return `Mes Actual (${monthName})`;
  if (monthOffset === 1) return 'Próximo Mes';
  
  return monthName;
}

export function getMultiMonthLabel(numberOfMonths = 3, monthOffset = 0, yearOffset = 0) {
  const today = new Date();
  
  if (numberOfMonths === 12) {
    // For yearly view, show from January through current month (or full year for past/future years)
    const targetYear = today.getFullYear() + yearOffset;
    const isCurrentYear = yearOffset === 0;
    const endMonth = isCurrentYear ? today.getMonth() : 11; // 0-11, 11 = December
    
    const startMonth = new Date(targetYear, 0, 1); // January
    const endMonthDate = new Date(targetYear, endMonth, 1);
    
    const startStr = startMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const endStr = endMonthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    if (yearOffset === 0) return `Año Actual: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
    if (yearOffset === -1) return `Año Anterior: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
    if (yearOffset === 1) return `Próximo Año: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
    return `Año ${targetYear}: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
  }
  
  // For 3 and 6 month views, show the last N months
  const startMonth = new Date(today.getFullYear() + yearOffset, today.getMonth() + monthOffset - (numberOfMonths - 1), 1);
  const endMonth = new Date(today.getFullYear() + yearOffset, today.getMonth() + monthOffset, 1);
  
  const startStr = startMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const endStr = endMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  if (numberOfMonths === 3) return `3 Meses: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
  if (numberOfMonths === 6) return `6 Meses: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
  
  return `${numberOfMonths} Meses: ${startStr.charAt(0).toUpperCase() + startStr.slice(1)} - ${endStr.charAt(0).toUpperCase() + endStr.slice(1)}`;
}