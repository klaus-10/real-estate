import express from "express";

import{ getAllRealEstatesLocationByLocationName, getAllRealEstatesLocationFromBoundingBox, getRealEstates, getRealEstatesFromBoundingBox } from "../db/realEstate";
import { BoundingBoxRequest } from "interfaces/request";

// Define the type of your query parameters
interface GetRealEstateListQueryParams {
  page?: number;
  limit?: number;
  filter?: any; // Replace with specific filter type if applicable
}

export const getRealEstateList = async (req: express.Request<{}, {}, {}, GetRealEstateListQueryParams>, res: express.Response) => {
    try {
      const { page, limit, filter } = req.query;
        
        const realEstateList = await getRealEstates(page, 25, filter);
        if (!realEstateList) {
            return res.status(404).send("realEstateList not found");
          }
        return res
        .status(200)
        .send(realEstateList);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
}

export const getRealEstatesFromBoundingBoxList = async (
    req: express.Request<{}, {}, BoundingBoxRequest, GetRealEstateListQueryParams>,
    res: express.Response
  ) => {
    try {
      const { page, limit, filter } = req.query;
      // const { west, east, north, south } = req.body;
      const boundingBox = req.body;

      // console.log("boundingBox: ",boundingBox);

      const realEstateList = await getRealEstatesFromBoundingBox(boundingBox, page, 25, filter);

      // console.log("geoData: ", realEstateList.geodata);

      if (!realEstateList) {
        return res.status(404).send("realEstateList not found");
      }
    return res
    .status(200)
    .send(realEstateList);
    } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export const getAllRealEstatesLocationFromBoundingBoxList = async (
  req: express.Request<{}, {}, BoundingBoxRequest, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  try {
    const { page, limit, filter } = req.query;
    // const { west, east, north, south } = req.body;
    const boundingBox = req.body;

    // console.log("boundingBox: ",boundingBox);

    const realEstateList = await getAllRealEstatesLocationFromBoundingBox(boundingBox, page, 25, filter);

    // console.log("geoData: ", realEstateList.geodata);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
  return res
  .status(200)
  .send(realEstateList);
  } catch (error) {
  console.log(error);
  return res.sendStatus(500);
}
}

export const getAllRealEstatesLocationByLocationNameList = async (
  req: express.Request<{}, {}, BoundingBoxRequest, GetRealEstateListQueryParams>,
  res: express.Response
) => {
  try {
    const { page, limit, filter } = req.query;
    // const { west, east, north, south } = req.body;
    const boundingBox = req.body;

    // console.log("boundingBox: ",boundingBox);

    const realEstateList = await getAllRealEstatesLocationByLocationName(boundingBox, page, 25, filter);

    // console.log("geoData: ", realEstateList.geodata);

    if (!realEstateList) {
      return res.status(404).send("realEstateList not found");
    }
  return res
  .status(200)
  .send(realEstateList);
  } catch (error) {
  console.log(error);
  return res.sendStatus(500);
}
}