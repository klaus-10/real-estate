import express from "express";

import {
    getRealEstateList,
    getRealEstatesFromBoundingBoxList
  } from "../controllers/realEstate";


  export default (router: express.Router) => {
    // #swagger.tags = ['RealEstate']
    router.get("/real-estate/list", getRealEstateList);
    router.post("/real-estate/boundingBox", getRealEstatesFromBoundingBoxList);
  }