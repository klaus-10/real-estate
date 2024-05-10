import express from "express";

import {
    getRealEstateList
  } from "../controllers/realEstate";


  export default (router: express.Router) => {
    // #swagger.tags = ['RealEstate']
    router.get("/real-estate/list", getRealEstateList);

  }