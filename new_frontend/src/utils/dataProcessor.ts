export interface Record {
  [key: string]: string | number | boolean | null;
}

export interface ProcessedData {
  records: Record[];
  columns: string[];
  summary: {
    rowCount: number;
    numericColumns: string[];
    categoricalColumns: string[];
    dateColumns: string[];
  };
}

// Parse CSV string to array of objects
function parseCSV(csvString: string): Record[] {
  const lines = csvString.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const records: Record[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(value => value.trim());
    const record: Record = {};
    
    for (let j = 0; j < headers.length; j++) {
      // Convert to number if it looks like a number
      const value = values[j];
      if (!isNaN(Number(value)) && value !== '') {
        record[headers[j]] = Number(value);
      } else {
        record[headers[j]] = value;
      }
    }
    
    records.push(record);
  }
  
  return records;
}

// Parse JSON string to array of objects
function parseJSON(jsonString: string): Record[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      // Handle case where JSON is an object with array inside
      for (const key in parsed) {
        if (Array.isArray(parsed[key])) {
          return parsed[key];
        }
      }
      // If no arrays found, return object wrapped in array
      return [parsed];
    }
    throw new Error('JSON does not contain an array of records');
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw error;
  }
}

// Process data to extract column types and summary
export function processData(data: string, fileType: 'csv' | 'json'): ProcessedData {
  const records = fileType === 'csv' ? parseCSV(data) : parseJSON(data);
  
  if (records.length === 0) {
    throw new Error('No records found in the data');
  }
  
  // Extract columns from the first record
  const columns = Object.keys(records[0]);
  
  // Identify column types
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];
  
  columns.forEach(column => {
    // Check first 10 records (or all if less than 10)
    const sampleSize = Math.min(10, records.length);
    let numericCount = 0;
    let dateCount = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const value = records[i][column];
      
      if (typeof value === 'number') {
        numericCount++;
      } else if (typeof value === 'string') {
        // Simple date check (improve as needed)
        const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}/;
        if (datePattern.test(value)) {
          dateCount++;
        }
      }
    }
    
    // Classify column based on majority type
    if (numericCount >= sampleSize * 0.7) {
      numericColumns.push(column);
    } else if (dateCount >= sampleSize * 0.7) {
      dateColumns.push(column);
    } else {
      categoricalColumns.push(column);
    }
  });
  
  return {
    records,
    columns,
    summary: {
      rowCount: records.length,
      numericColumns,
      categoricalColumns,
      dateColumns
    }
  };
}
