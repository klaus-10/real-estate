// import { FilterOptions } from "interfaces/request/boundingBox";

// export const filterOptionsQueryTranformer = (filters: FilterOptions): any => {
//   const query: any = {};

//   // Loop through filter options and build corresponding query clauses
//   for (const key in filters) {
//     const value = filters[key];

//     if (value) {
//       // Only create a clause if a value exists
//       switch (key) {
//         case "city":
//           query["realEstate.location.city"] = {
//             $regex: new RegExp(value, "i"),
//           }; // Case-insensitive search
//           break;
//         case "type": // TODO; check -> acquisto o affitto
//           query["realEstate.type"] = { $regex: new RegExp(value, "i") }; // TODO: check condition
//         case "property":
//           query["realEstate.type"] = { $regex: new RegExp(value, "i") }; // TODO: check condition => should return for query ad || apartament
//         case "property-type":
//           query["realEstate.isNew"] = value; // TODO: check condition => should return for query ad || apartament
//         case "autore":
//           query["realEstate.autore"] = value; // TODO: implement search "private" or "agency"
//           break;
//         case "price":
//           if (value.min && value.max) {
//             query["realEstate.price.value"] = {
//               $gte: parseFloat(value.min),
//               $lte: parseFloat(value.max),
//             };
//           }
//           break;
//         case "rooms":
//           if (value >= 0) {
//             query["realEstate.properties.0.rooms"] = value;
//           }
//           break;
//         case "date": // TODO: integrate into the db the insertion date of the announcement
//           if (value.from && value.to) {
//             const fromDate = new Date(value.from);
//             const toDate = new Date(value.to);
//             toDate.setDate(toDate.getDate() + 1);
//             query.date = { $gte: fromDate, $lt: toDate };
//           }
//           break;
//         case "mq":
//           if (value.from && value.to) {
//             query["realEstate.properties.0.surface"] = {
//               $gte: parseInt(value.from),
//               $lte: parseInt(value.to),
//             };
//           }
//           break;
//         case "mqPrice":
//           if (value.from && value.to) {
//             query["realEstate.price.mqPrice"] = {
//               $gte: parseFloat(value.from),
//               $lte: parseFloat(value.to),
//             };
//           }
//           break;
//         default:
//           // Handle unexpected filter keys (optional)
//           console.warn(`Ignoring unexpected filter key: ${key}`);
//       }
//     }
//   }

//   return query ? { $and: [query] } : {}; // Build final query with $and operator if filters exist
// };

// import { FilterOptions } from "interfaces/request/boundingBox";

// export const filterOptionsQueryTransformer2 = (filters: FilterOptions): any => {
//   const query: any = {};

//   // Loop through filter options and build corresponding query clauses
//   (Object.keys(filters) as (keyof FilterOptions)[]).forEach((key) => {
//     const value = filters[key];

//     console.log("value: ", value);

//     // if (value) {
//     //   // Only create a clause if a value exists
//     //   switch (key) {
//     //     case "city":
//     //       query["realEstate.location.city"] = {
//     //         $regex: new RegExp(value, "i"),
//     //       }; // Case-insensitive search
//     //       break;
//     //     case "type": // TODO; check -> acquisto o affitto
//     //       query["realEstate.type"] = { $regex: new RegExp(value, "i") };
//     //       break; // Added missing break statement
//     //     case "property":
//     //       query["realEstate.type"] = { $regex: new RegExp(value, "i") }; // TODO: check condition => should return for query ad || apartament
//     //       break; // Added missing break statement
//     //     case "property_type":
//     //       query["realEstate.isNew"] = value; // TODO: check condition => should return for query ad || apartament
//     //       break; // Added missing break statement
//     //     case "autore":
//     //       query["realEstate.autore"] = value; // TODO: implement search "private" or "agency"
//     //       break;
//     //     case "price":
//     //       if (value.min && value.max) {
//     //         query["realEstate.price.value"] = {
//     //           $gte: parseFloat(value.min),
//     //           $lte: parseFloat(value.max),
//     //         };
//     //       }
//     //       break;
//     //     case "rooms":
//     //       if (value >= 0) {
//     //         query["realEstate.properties.0.rooms"] = value;
//     //       }
//     //       break;
//     //     case "date": // TODO: integrate into the db the insertion date of the announcement
//     //       if (value.from && value.to) {
//     //         const fromDate = new Date(value.from);
//     //         const toDate = new Date(value.to);
//     //         toDate.setDate(toDate.getDate() + 1);
//     //         query.date = { $gte: fromDate, $lt: toDate };
//     //       }
//     //       break;
//     //     case "mq":
//     //       if (value.from && value.to) {
//     //         query["realEstate.properties.0.surface"] = {
//     //           $gte: parseInt(value.from),
//     //           $lte: parseInt(value.to),
//     //         };
//     //       }
//     //       break;
//     //     case "mqPrice":
//     //       if (value.from && value.to) {
//     //         query["realEstate.price.mqPrice"] = {
//     //           $gte: parseFloat(value.from),
//     //           $lte: parseFloat(value.to),
//     //         };
//     //       }
//     //       break;
//     //     default:
//     //       // Handle unexpected filter keys (optional)
//     //       console.warn(`Ignoring unexpected filter key: ${key}`);
//     //   }
//     // }
//   });

//   return query ? { $and: [query] } : {}; // Build final query with $and operator if filters exist
// };

import { FilterOptions } from "interfaces/request/boundingBox";

export const filterOptionsQueryTransformer2 = (filters: FilterOptions): any => {
  const query: any = {};

  // Loop through filter options and build corresponding query clauses
  (Object.keys(filters) as (keyof FilterOptions)[]).forEach((key) => {
    const value = filters[key];

    if (value) {
      // Only create a clause if a value exists
      switch (key) {
        // case "city":
        //   query["realEstate.location.city"] = {
        //     $regex: new RegExp(value as string, "i"),
        //   }; // Case-insensitive search
        //   break;
        // case "type": // TODO; check -> acquisto(ad) o asta(auction)
        //   query["realEstate.type"] = {
        //     $regex: new RegExp(value as string, "i"),
        //   };
        //   break;
        // case "property": // 'Appartamento', 'Attico', 'Casale', 'Mansarda', 'Palazzo - Edificio', 'Rustico', 'Stabile o palazzo', 'Terratetto plurifamiliare', 'Terratetto unifamiliare', 'Villa a schiera', 'Villa bifamiliare', 'Villa plurifamiliare', 'Villa unifamiliare'
        //   query["realEstate.typology.name"] = {
        //     $regex: new RegExp(value as string, "i"),
        //   };
        //   break;
        // case "isNew": // change property to isNew
        //   console.log("IN");
        //   query["realEstate.isNew"] = value == "1" ? true : false;
        //   break;

        // case "autore": // TODO: implement search "private" or "agency"
        //   query["realEstate.autore"] = value;
        //   break;

        // case "price":
        //   if (typeof value === "object" && "min" in value && "max" in value) {
        //     query["realEstate.price.value"] = {
        //       $gte: value.min,
        //       $lte: value.max,
        //     };
        //   }
        //   break;

        case "rooms":
          if (typeof value === "number" && value >= 0) {
            query["realEstate.properties.0.rooms"] = value;
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
        // case "mq":
        //   if (typeof value === "object" && "from" in value && "to" in value) {
        //     query["realEstate.properties.0.surface"] = {
        //       $gte: parseInt(value.from),
        //       $lte: parseInt(value.to),
        //     };
        //   }
        //   break;
        // case "mqPrice":
        //   if (typeof value === "object" && "from" in value && "to" in value) {
        //     query["realEstate.price.mqPrice"] = {
        //       $gte: parseFloat(value.from),
        //       $lte: parseFloat(value.to),
        //     };
        //   }
        //   break;
        default:
          console.warn(`Ignoring unexpected filter key: ${key}`);
      }
    }
  });

  console.log("query: ", query);

  return Object.keys(query).length ? { $and: [query] } : {}; // Build final query with $and operator if filters exist
};
