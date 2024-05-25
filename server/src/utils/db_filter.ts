import { FilterOptions } from "interfaces/request/boundingBox";

const isValidValue = (value: any): boolean => {
  return value !== undefined && value !== null && value !== "";
};

export const filterOptionsQueryTransformer2 = (filters: FilterOptions): any => {
  const query: any = {};

  // Loop through filter options and build corresponding query clauses
  (Object.keys(filters) as (keyof FilterOptions)[]).forEach((key) => {
    const value = filters[key];

    if (isValidValue(value)) {
      // Only create a clause if a value exists
      switch (key) {
        case "city":
          query["realEstate.location.city"] = {
            $regex: new RegExp(value as string, "i"),
          }; // Case-insensitive search
          break;
        case "type": // TODO; check -> acquisto(ad) o asta(auction)
          query["realEstate.type"] = {
            $regex: new RegExp(value as string, "i"),
          };
          break;
        case "property": // 'Appartamento', 'Attico', 'Casale', 'Mansarda', 'Palazzo - Edificio', 'Rustico', 'Stabile o palazzo', 'Terratetto plurifamiliare', 'Terratetto unifamiliare', 'Villa a schiera', 'Villa bifamiliare', 'Villa plurifamiliare', 'Villa unifamiliare'
          if (isValidValue(value)) {
            query["realEstate.typology.name"] = {
              $regex: new RegExp(value as string, "i"),
            };
          }
          break;
        case "isNew": // change property to isNew
          if (value == "1" || value == "0")
            query["realEstate.isNew"] = value == "1" ? true : false;
          break;

        case "autore": // TODO: implement search "private" or "agency"
          query["realEstate.autore"] = value;
          break;

        case "price":
          if (typeof value === "object" && "min" in value && "max" in value) {
            if (
              isValidValue(value.min) &&
              isValidValue(value.max) &&
              value.min < value.max
            ) {
              query["realEstate.price.value"] = {
                $gte: value.min,
                $lte: value.max,
              };
            }
          }
          break;

        case "rooms":
          if (typeof value === "string" && isValidValue(value)) {
            const rooms = parseInt(value);

            if (rooms > 0) {
              if (rooms < 3) {
                query["realEstate.properties.0.rooms"] = value;
              } else {
                query["realEstate.properties.0.rooms"] = { $gt: value };
              }
            }
          }
          break;

        // case "date":
        //   if (typeof value === "object" && "from" in value && "to" in value) {
        //     const fromDate = new Date(value.from);
        //     const toDate = new Date(value.to);
        //     toDate.setDate(toDate.getDate() + 1);
        //     query.date = { $gte: fromDate, $lt: toDate };
        //   }
        //   break;
        // case "mq": // TODO: check how to query this nested field
        //   if (typeof value === "object" && "from" in value && "to" in value) {
        //     if (
        //       isValidValue(value.from) &&
        //       isValidValue(value.to) &&
        //       value.from < value.to
        //     ) {
        //       query["realEstate.properties.0.surface"] = {
        //         $gte: parseInt(value.from),
        //         $lte: parseInt(value.to),
        //       };
        //     }
        //   }
        //   break;
        case "mqPrice":
          if (typeof value === "object" && "from" in value && "to" in value) {
            if (
              isValidValue(value.from) &&
              isValidValue(value.to) &&
              value.from < value.to
            ) {
              query["realEstate.price.mqPrice"] = {
                $gte: value.from,
                $lte: value.to,
              };
            }
          }
          break;
        default:
          console.warn(`Ignoring unexpected filter key: ${key}`);
      }
    }
  });

  console.log("query: ", query);

  return Object.keys(query).length ? { $and: [query] } : {}; // Build final query with $and operator if filters exist
};
