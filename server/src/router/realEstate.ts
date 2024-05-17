import express from "express";

import {
  getAllRealEstatesByLocationNameList,
  getAllRealEstatesLocationByLocationNameList,
  getAllRealEstatesLocationFromBoundingBoxList,
  getRealEstateList,
  getRealEstatesFromBoundingBoxList,
} from "../controllers/realEstate";

export default (router: express.Router) => {
  // #swagger.tags = ['RealEstate']
  router.get("/real-estate/list", getRealEstateList);
  router.post("/real-estate/boundingBox", getRealEstatesFromBoundingBoxList);
  router.post(
    "/real-estate/locationsByBoundingBox",
    getAllRealEstatesLocationFromBoundingBoxList
  );
  router.get(
    "/real-estate/locationsByName",
    getAllRealEstatesLocationByLocationNameList
  );
  router.get("/real-estate/byName", getAllRealEstatesByLocationNameList);
};
