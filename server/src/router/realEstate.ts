import express from "express";

import {
  getAllRealEstatesByLocationNameList,
  getAllRealEstatesLocationByLocationNameList,
  getAllRealEstatesLocationFromBoundingBoxList,
  getRealEstateList,
  getRealEstatesFromBoundingBoxList,
} from "../controllers/realEstate";

export default (router: express.Router) => {
  router.get("/real-estate/list", getRealEstateList);
  router.post("/real-estate/boundingBox", getRealEstatesFromBoundingBoxList);
  router.post(
    "/real-estate/locationsByBoundingBox",
    getAllRealEstatesLocationFromBoundingBoxList
  );
  router.post(
    "/real-estate/locationsByName",
    getAllRealEstatesLocationByLocationNameList
  );
  router.post("/real-estate/byName", getAllRealEstatesByLocationNameList);
};
