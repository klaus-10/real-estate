import express from "express";

import{ getRealEstates, getRealEstatesFromBoundingBox } from "../db/realEstate";
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
    req: Request<BoundingBoxRequest, {}, {}, {}, GetRealEstateListQueryParams>,
    res: Response
  ) => {
    try {
      const { page, limit, filter } = req.query;
      const { boundingBox } = req.body;
      const realEstateList = await getRealEstatesFromBoundingBox(boundingBox, page, 25, filter);

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