import express from "express";

import {
  getAllRealEstatesByLocationName,
  getAllRealEstatesLocationByLocationName,
  getAllRealEstatesLocationFromBoundingBox,
  getRealEstates,
  getRealEstatesFromBoundingBox,
} from "../db/realEstate";
import { BoundingBoxRequest } from "interfaces/request";

// Define the type of your query parameters
interface GetRealEstateListQueryParams {
  locationName?: string;
  page?: number;
  limit?: number;
  filter?: any; // Replace with specific filter type if applicable
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
    const { page, limit, filter } = req.query;

    const realEstateList = await getRealEstates(page, 25, filter);
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
    const { page, limit, filter } = req.query;
    // const { west, east, north, south } = req.body;
    const boundingBox = req.body;

    // console.log("boundingBox: ",boundingBox);

    const realEstateList = await getRealEstatesFromBoundingBox(
      boundingBox,
      page,
      25,
      filter
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
    const { page, limit, filter } = req.query;
    // const { west, east, north, south } = req.body;
    const boundingBox = req.body;

    // console.log("boundingBox: ",boundingBox);

    const realEstateList = await getAllRealEstatesLocationFromBoundingBox(
      boundingBox,
      page,
      25,
      filter
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
  req: express.Request<{}, {}, {}, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate All - RealEstates - ByLocationName'
  // #swagger.description = 'RealEstate All - RealEstates - ByLocationName'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    const { locationName, page, limit, filter } = req.query;
    // const { west, east, north, south } = req.body;

    console.log("reury params: ", locationName, page, limit, filter);

    const realEstateList = await getAllRealEstatesByLocationName(
      locationName,
      page,
      25,
      filter
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
  req: express.Request<{}, {}, {}, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  // #swagger.tags = ['RealEstate']
  // #swagger.summary = 'RealEstate Location - ByLocationName'
  // #swagger.description = 'RealEstate Location - ByLocationName'
  // #swagger.deprecated = false
  // #swagger.ignore = false
  try {
    const { locationName, page, limit, filter } = req.query;
    // const { west, east, north, south } = req.body;

    // console.log("boundingBox: ",boundingBox);

    const realEstateList = await getAllRealEstatesLocationByLocationName(
      locationName,
      page,
      25,
      filter
    );

    console.log("query params: ", locationName, page, limit, filter);
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
