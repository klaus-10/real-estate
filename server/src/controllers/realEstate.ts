import express from "express";

import {
  getAllRealEstatesByLocationName,
  getAllRealEstatesLocationByLocationName,
  getAllRealEstatesLocationFromBoundingBox,
  getRealEstates,
  getRealEstatesFromBoundingBox,
  getRealEstateComuniSearch,
  getRealEstateComuniById,
  getMacroareaComuniByLocationName,
} from "../db/realEstate";
import { BoundingBoxRequest } from "interfaces/request";
import { filterOptionsQueryTransformer2 } from "../utils/db_filter";
import { sortOptionsQueryTransformer } from "../utils/db_sort";

// Define the type of your query parameters
interface GetRealEstateListQueryParams {
  locationName?: string;
  page?: number;
  limit?: number;
}

export const getRealEstateList = async (
  req: express.Request<{}, {}, {}, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  // #swagger.tags = ['realEstate']
  // #swagger.summary = 'default get all api'
  // #swagger.description = 'default get all api'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  /* #swagger.parameters['parameterName'] = {
        in: <string>,                            
        description: <string>,                   
        required: <boolean>,                     
        type: <string>,                          
        format: <string>,                        
        schema: <array>, <object> or <string>    
} */
  try {
    const { page, limit } = req.query;

    const realEstateList = await getRealEstates(page, 25, null);
    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
    return res.status(200).send(realEstateList);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getRealEstatesFromBoundingBoxList = async (
  req: express.Request<
    {},
    {},
    BoundingBoxRequest,
    GetRealEstateListQueryParams
  >,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate All - RealEstate - FromBoundingBox'
  // #swagger.description = 'RealEstate All - RealEstate - FromBoundingBox'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    console.log("body: ", req.body);
    console.log("query: ", req.query);
    const { page, limit } = req.query;

    console.log("Query params: ", req.query);
    const boundingBox = req.body;

    // console.log("boundingBox: ", boundingBox);

    const realEstateList = await getRealEstatesFromBoundingBox(
      boundingBox,
      page,
      25,
      filterOptionsQueryTransformer2(boundingBox?.filter),
      sortOptionsQueryTransformer(boundingBox?.filter)
    );

    // const realEstateList = ["a", "b"];

    // console.log("geoData: ", realEstateList.geodata);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
    return res.status(200).send(realEstateList);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllRealEstatesLocationFromBoundingBoxList = async (
  req: express.Request<
    {},
    {},
    BoundingBoxRequest,
    GetRealEstateListQueryParams
  >,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate All - RealEstateLocations - FromBoundingBox'
  // #swagger.description = 'RealEstate All - RealEstateLocations - FromBoundingBox'
  // #swagger.deprecated = false
  // #swagger.ignore = false
  try {
    const { page, limit } = req.query;

    console.log("BoundingBox&Filters: ", req.body);
    const boundingBox = req.body;

    const realEstateList = await getAllRealEstatesLocationFromBoundingBox(
      boundingBox,
      25,
      filterOptionsQueryTransformer2(boundingBox.filter),
      sortOptionsQueryTransformer(boundingBox.filter)
    );

    // console.log("geoData: ", realEstateList.geodata);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
    return res.status(200).send(realEstateList);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllRealEstatesByLocationNameList = async (
  req: express.Request<
    {},
    {},
    BoundingBoxRequest,
    GetRealEstateListQueryParams
  >,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate All - RealEstates - ByLocationName'
  // #swagger.description = 'RealEstate All - RealEstates - ByLocationName'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    const { locationName, page, limit } = req.query;
    // const { west, east, north, south } = req.body;

    console.log("reury params: ", locationName, page, limit);
    console.log("BoundingBox&Filters: ", req.body);
    const boundingBox = req.body;

    const realEstateList = await getAllRealEstatesByLocationName(
      locationName,
      page,
      25,
      filterOptionsQueryTransformer2(boundingBox.filter),
      sortOptionsQueryTransformer(boundingBox.filter)
    );

    console.log("realEstateList: ", realEstateList.total);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
    return res.status(200).send(realEstateList);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllRealEstatesLocationByLocationNameList = async (
  req: express.Request<
    {},
    {},
    BoundingBoxRequest,
    GetRealEstateListQueryParams
  >,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate Location - ByLocationName'
  // #swagger.description = 'RealEstate Location - ByLocationName'
  // #swagger.deprecated = false
  // #swagger.ignore = false
  try {
    const { locationName, page, limit } = req.query;

    console.log("BoundingBox&Filters: ", req.body);
    const boundingBox = req.body;

    const realEstateList = await getAllRealEstatesLocationByLocationName(
      locationName,
      page,
      25,
      filterOptionsQueryTransformer2(boundingBox.filter),
      sortOptionsQueryTransformer(boundingBox.filter)
    );

    console.log("query params: ", locationName, page, limit);
    console.log("DATA: ", realEstateList);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
    return res.status(200).send(realEstateList);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getRealEstateComuniSearchList = async (
  req: express.Request<{}, {}, {}, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate Comuni - Search'

  try {
    const { locationName } = req.query;
    const realEstateList = await getRealEstateComuniSearch(locationName);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }

    return res.status(200).send(realEstateList);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const getRealEstateComuniByIdList = async (
  req: express.Request<{ id: string }, {}, {}, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate Comuni - Search'

  try {
    const { id } = req.params;
    console.log("id: ", id);
    const realEstateList = await getRealEstateComuniById(id);

    console.log("ok");
    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }

    return res.status(200).send(realEstateList);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const getMacroareaComuniByLocationNameList = async (
  req: express.Request<{}, {}, {}, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  try {
    const { locationName } = req.query;
    const macroareaList = await getMacroareaComuniByLocationName(locationName);

    console.log("INSIDE");
    if (!macroareaList) {
      return res.status(404).send("macroareaList not found");
    }

    return res.status(200).send(macroareaList);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
