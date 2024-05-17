import {
  RealEstate,
  PhoneNumber,
  ImageUrls,
  MultimediaPhoto,
  Agency,
  Supervisor,
  Advertiser,
  Price,
  Multimedia,
  Typology,
  Location,
  Feature,
  Property,
} from "interfaces/db/realEstate";
import { BoundingBoxRequest } from "interfaces/request";
import mongoose, { Schema } from "mongoose";

const phoneNumberSchema = new Schema<PhoneNumber>({
  type: String,
  value: String,
});

const imageUrlsSchema = new Schema<ImageUrls>({
  small: String,
  large: String,
});

const multimediaPhotoSchema = new Schema<MultimediaPhoto>({
  id: Number,
  caption: String,
  urls: {
    small: String,
  },
});

const agencySchema = new Schema<Agency>({
  id: Number,
  type: String,
  showOnlyAgentPhone: Boolean,
  phones: [phoneNumberSchema],
  bookableVisit: {
    isVisitBookable: Boolean,
    virtualVisitEnabled: Boolean,
  },
  isPaid: Boolean,
  label: String,
  displayName: String,
  guaranteed: Boolean,
  showAgentPhone: Boolean,
  showLogo: Boolean,
  imageUrls: imageUrlsSchema,
  agencyUrl: String,
});

const supervisorSchema = new Schema<Supervisor>({
  type: String,
  imageGender: String,
  phones: [phoneNumberSchema],
  imageType: String,
  displayName: String,
  label: String,
});

const advertiserSchema = new Schema<Advertiser>({
  agency: agencySchema,
  supervisor: supervisorSchema,
  hasCallNumbers: Boolean,
});

const priceSchema = new Schema<Price>({
  visible: Boolean,
  value: Number,
  formattedValue: String,
  minValue: String,
  maxValue: String,
  mq_price: Number,
});

const typologySchema = new Schema<Typology>({
  id: Number,
  name: String,
});

const locationSchema = new Schema<Location>({
  latitude: Number,
  longitude: Number,
  marker: String,
  region: String,
  province: String,
  macrozone: String,
  microzone: String,
  city: String,
  nation: {
    id: String,
    name: String,
    keyurl: String,
  },
});

const featureSchema = new Schema<Feature>({
  type: String,
  label: String,
  compactLabel: String,
});

const propertySchema = new Schema<Property>({
  income: Boolean,
  multimedia: {
    photos: [multimediaPhotoSchema],
    virtualTours: [String],
    hasMultimedia: Boolean,
  },
  floors: String,
  price: priceSchema,
  surface: String,
  surfaceValue: String,
  typology: typologySchema,
  typologyV2: typologySchema,
  ga4Garage: String,
  typologyGA4Translation: String,
  ga4features: [String],
  typologyAmount: Number,
  caption: String,
  category: {
    id: Number,
    name: String,
  },
  description: String,
  energy: {
    zeroEnergyBuilding: Boolean,
    thermalInsulation: Schema.Types.Mixed,
    emission: Schema.Types.Mixed,
    heatingType: String,
    airConditioning: String,
    GA4Heating: String,
  },
  photo: {
    id: Number,
    caption: String,
    urls: {
      thumb: String,
      small: String,
      medium: String,
      large: String,
    },
  },
  location: locationSchema,
  featureList: [featureSchema],
  rooms: String,
});

const realEstateSchema = new Schema<RealEstate>({
  dataType: String,
  id: Number,
  uuid: String,
  advertiser: advertiserSchema,
  contract: String,
  luxury: Boolean,
  price: priceSchema,
  properties: [propertySchema],
  propertiesCount: Number,
  title: String,
  type: String,
  typology: typologySchema,
  visibility: String,
  hasMainProperty: Boolean,
  isProjectLike: Boolean,
  // isNew: Boolean,
  loc: {
    type: { type: String },
    coordinates: [Number],
  },
  seo: {
    anchor: String,
    title: String,
    metaTitle: String,
    url: String,
  },
});

realEstateSchema.index({ loc: "2dsphere" });

export const RealEstateModel = mongoose.model("RealEstate", realEstateSchema);

// RealEstate Actions
// export const getRealEstates = (page: number, limit: number, filter?: any) => RealEstateModel.find().skip(25 * page).limit(25);

export const getRealEstates = async (
  page: number,
  limit: number,
  filter?: any
) => {
  const totalCount = await RealEstateModel.count();
  const realEstates = await RealEstateModel.find()
    .skip(limit * (page - 1))
    .limit(limit);

  return {
    total: totalCount / 25,
    data: realEstates,
  };
};

export const getRealEstatesFromBoundingBox = async (
  boundingBox: BoundingBoxRequest,
  page: number,
  limit: number,
  filter?: any
) => {
  const query = {
    "realEstate.loc": {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [
              [boundingBox.west, boundingBox.south],
              [boundingBox.east, boundingBox.south],
              [boundingBox.east, boundingBox.north],
              [boundingBox.west, boundingBox.north],
              [boundingBox.west, boundingBox.south],
            ],
          ],
        },
      },
    },
  };

  const projection = [
    {
      $project: {
        "realEstate.loc": 1,
        "realEstate.properties": { $slice: ["$realEstate.properties", 1] },
        "seo.url": 1,
        "seo.title": 1,
        "realEstate.price.formattedValue": 1,
      },
    },
  ];

  const geodata = await RealEstateModel.find(query)
    .skip(limit * (page - 1))
    .limit(limit);

  return geodata;
};

export const getAllRealEstatesLocationFromBoundingBox = async (
  boundingBox: BoundingBoxRequest,
  page: number,
  limit: number,
  filter?: any
) => {
  const query = {
    "realEstate.loc": {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [
              [boundingBox.west, boundingBox.south],
              [boundingBox.east, boundingBox.south],
              [boundingBox.east, boundingBox.north],
              [boundingBox.west, boundingBox.north],
              [boundingBox.west, boundingBox.south],
            ],
          ],
        },
      },
    },
  };

  const projection = [
    {
      $project: {
        "realEstate.loc": 1,
      },
    },
  ];

  return await RealEstateModel.aggregate([{ $match: query }, ...projection]);
};

// export const getAllRealEstatesByLocationName = async (
//   locationName: string,
//   page: number,
//   limit: number,
//   filter?: any
// ) => {
//   const totalCount = await RealEstateModel.find({
//     "realEstate.location.properties.0": {
//       $elemMatch: {
//         $or: [
//           { "location.city": locationName },
//           { "location.region": locationName },
//           { "location.province": locationName },
//         ],
//       },
//     },
//   }).count();
//   const realEstates = await RealEstateModel.find({
//     "realEstate.location.properties.0": {
//       $elemMatch: {
//         $or: [
//           { "location.city": locationName },
//           { "location.region": locationName },
//           { "location.province": locationName },
//         ],
//       },
//     },
//   })
//     .skip(limit * (page - 1))
//     .limit(limit);

//   return {
//     total: totalCount,
//     data: realEstates,
//   };
// };

export const getAllRealEstatesLocationByLocationName = async (
  locationName: string,
  page: number,
  limit: number,
  filter?: any
) => {
  return RealEstateModel.find(
    {
      "realEstate.location.properties.0": {
        $elemMatch: {
          $or: [
            { "location.city": locationName },
            { "location.region": locationName },
            { "location.province": locationName },
          ],
        },
      },
    },
    { "realEstate.loc": 1, _id: 0 }
  ); // Projection to include only the loc field
};

export const getAllRealEstatesByLocationName = async (
  locationName: string,
  page: number,
  limit: number,
  filter?: any
) => {
  const testQuery = await RealEstateModel.find({
    $or: [
      { "realEstate.properties.0.location.city": locationName },
      { "realEstate.properties.0.location.region": locationName },
      { "realEstate.properties.0.location.province": locationName },
    ],
  });

  console.log(testQuery);
};

// export const getAllRealEstatesByLocationName = async (
//   locationName: string,
//   page: number,
//   limit: number,
//   filter?: any
// ) => {
//   const matchStage = {
//     $match: {
//       $or: [
//         { "realEstate.location.properties.0.location.city": locationName },
//         { "realEstate.location.properties.0.location.region": locationName },
//         { "realEstate.location.properties.0.location.province": locationName },
//       ],
//     },
//   };

//   const facetStage = {
//     $facet: {
//       totalCount: [{ $count: "count" }],
//       realEstates: [{ $skip: limit * (page - 1) }, { $limit: limit }],
//     },
//   };

//   const pipeline = [matchStage, facetStage];

//   const result = await RealEstateModel.aggregate(pipeline).exec();

//   const totalCount = result[0].totalCount[0]
//     ? result[0].totalCount[0].count
//     : 0;
//   const realEstates = result[0].realEstates;

//   return {
//     total: totalCount,
//     data: realEstates,
//   };
// };
