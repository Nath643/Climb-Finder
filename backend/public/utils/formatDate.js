// formats a date with this format: 2025-12-04

export function formatDate(dateString) {
    // Create a new Date object from the dateString
    var date = new Date(dateString);

    // Get the day, month, and year from the Date object
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    var year = date.getFullYear();

    // Return the formatted date as "dd.mm.yyyy"
    return day + '.' + month + '.' + year;
}

