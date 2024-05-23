export default function filterOptionsQueryTranformer(filters: FilterOptions): any {
    const query: any = {};
  
    // Loop through filter options and build corresponding query clauses
    for (const key in filters) {
      const value = filters[key];
  
      if (value) { // Only create a clause if a value exists
        switch (key) {
          case 'city':
            query.city = { $regex: new RegExp(value, 'i') }; // Case-insensitive search
            break;
          case 'type':
          case 'property':
          case 'autore':
            query[key] = value;
            break;
          case 'price':
            if (value.min && value.max) {
              query.price = { $gte: parseFloat(value.min), $lte: parseFloat(value.max) };
            }
            break;
          case 'rooms':
            if (value >= 0) {
              query.rooms = value;
            }
            break;
          case 'date':
            if (value.from && value.to) {
              const fromDate = new Date(value.from);
              const toDate = new Date(value.to);
              toDate.setDate(toDate.getDate() + 1);
              query.date = { $gte: fromDate, $lt: toDate };
            }
            break;
          case 'mq':
            if (value.from && value.to) {
              query.mq = { $gte: parseInt(value.from), $lte: parseInt(value.to) };
            }
            break;
          case 'mqPrice':
            if (value.from && value.to) {
              query.mqPrice = { $gte: parseFloat(value.from), $lte: parseFloat(value.to) };
            }
            break;
          default:
            // Handle unexpected filter keys (optional)
            console.warn(`Ignoring unexpected filter key: ${key}`);
        }
      }
    }
  
    return query ? { $and: [query] } : {}; // Build final query with $and operator if filters exist
  }
  