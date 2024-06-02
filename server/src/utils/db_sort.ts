import { FilterOptions } from "interfaces/request/boundingBox";
import { isValidValue } from "./db_filter";

export const sortOptionsQueryTransformer = (filters: FilterOptions): any => {
  const query: any = {};

  if (isValidValue(filters.orderBy)) {
    switch (filters.orderBy) {
      case "Prezzo up":
        // Handle "Prezzo up" case
        query["realEstate.price.value"] = 1;
        break;
      case "Prezzo down":
        // Handle "Prezzo down" case
        query["realEstate.price.value"] = -1;
        break;
      case "Metri quadri up":
        // Handle "Metri quadri up" case
        query["realEstate.price.mq_price"] = 1;
        break;
      case "Metri quadri down":
        // Handle "Metri quadri down" case
        query["realEstate.price.mq_price"] = -1;
        break;
      //   case "Più recente":
      //     // Handle "Più recente" casev
      //     query["realEstate.date"] = -1;
      //     break;
      //   case "Meno recente":
      //     // Handle "Meno recente" case
      //     query["realEstate.date"] = 1;
      //     break;
      default:
        console.log("query: ", query);
        query["_id"] = -1; // default behaviour
    }
  }

  console.log("query: ", query);

  return query;
};
