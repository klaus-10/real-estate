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
import { MongoClient, ObjectId } from "mongodb";

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
  location: {
    latitude: Number,
    longitude: Number,
    marker: String,
    region: String,
    province: String,
    macrozone: String,
    city: String,
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
    total: totalCount,
    totalPages: totalCount / 25,
    data: realEstates,
  };
};

export const getRealEstatesFromBoundingBox = async (
  boundingBox: BoundingBoxRequest,
  page: number,
  limit: number,
  filter?: any
) => {
  const client = new MongoClient(process.env.MONGOURI);

  try {
    await client.connect();
    console.log("Connected successfully");

    const database = client.db("real-estate");
    const collection = database.collection("realestates");

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
                [boundingBox.west, boundingBox.south], // Closed loop
              ],
            ],
          },
        },
      },
      ...filter, // TODO: fix filter foreach endpoint
    };

    const pipeline = [
      { $match: query },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                "realEstate.loc": 1,
                "realEstate.properties": {
                  $slice: ["$realEstate.properties", 1],
                },
                "seo.url": 1,
                "seo.title": 1,
                "realEstate.price.formattedValue": 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await collection.aggregate(pipeline).next();

    if (result) {
      return {
        total: result.totalCount[0] ? result.totalCount[0].count : 0,
        totalPages: result.totalCount[0]
          ? Math.ceil(result.totalCount[0].count / limit)
          : 0,
        data: result.data,
      };
    } else {
      console.log("Document not found");
      return { total: 0, totalPages: 0, data: [] };
    }
  } catch (e) {
    console.error("Error (getRealEstatesFromBoundingBox):", e);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
};

export const getAllRealEstatesLocationFromBoundingBox = async (
  boundingBox: BoundingBoxRequest,
  limit: number,
  filter?: any
) => {
  const client = new MongoClient(process.env.MONGOURI);

  try {
    await client.connect();
    console.log("Connected successfully");

    const database = client.db("real-estate");
    const collection = database.collection("realestates");

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
                [boundingBox.west, boundingBox.south], // Closed loop
              ],
            ],
          },
        },
      },
      ...filter, // TODO: fix filter foreach endpoint
    };

    const pipeline = [
      { $match: query },
      {
        $facet: {
          data: [
            {
              $project: {
                "realEstate.loc": 1,
                "realEstate.properties": {
                  $slice: ["$realEstate.properties", 1],
                },
                "seo.url": 1,
                "seo.title": 1,
                "realEstate.price.formattedValue": 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await collection.aggregate(pipeline).next();

    if (result) {
      return {
        total: result.totalCount[0] ? result.totalCount[0].count : 0,
        totalPages: result.totalCount[0]
          ? Math.ceil(result.totalCount[0].count / limit)
          : 0,
        data: result.data,
      };
    } else {
      console.log("Document not found");
      return { total: 0, totalPages: 0, data: [] };
    }
  } catch (e) {
    console.error("Error (getRealEstatesFromBoundingBox):", e);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
};

export const getAllRealEstatesLocationByLocationName = async (
  locationName: string,
  page: number,
  limit: number,
  filter?: any
) => {
  const client = new MongoClient(process.env.MONGOURI);

  try {
    await client.connect();
    console.log("Connected successfully");

    const database = client.db("real-estate");
    const collection = database.collection("realestates");

    const query = {
      $or: [
        { "realEstate.location.city": locationName },
        { "realEstate.location.region": locationName },
        { "realEstate.location.province": locationName },
      ],
      ...filter, // TODO: fix filter foreach endpoint
    };

    const projectionDetails = { "realEstate.loc": 1, _id: 0 };

    const total = await collection.countDocuments(query);

    const result = await collection
      .find(query)
      .project(projectionDetails)
      .toArray();

    if (result) {
      console.log("Retrieved document:", result);
      return {
        total: total,
        totalPages: Math.ceil(total / 25),
        data: result,
      };
    } else {
      console.log("Document not found");
    }
  } catch (e) {
    console.error("Error (getAllRealEstatesLocationByLocationName):", e);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
};

export const getAllRealEstatesByLocationName = async (
  locationName: string,
  page: number,
  limit: number,
  filter?: any
) => {
  const client = new MongoClient(process.env.MONGOURI);

  try {
    await client.connect();
    console.log("Connected successfully");

    const database = client.db("real-estate");
    const collection = database.collection("realestates");

    // const query = {
    //   "realEstate.location.city": locationName,
    //   ...filter,
    // };

    const query = {
      $or: [
        { "realEstate.location.city": locationName },
        { "realEstate.location.region": locationName },
        { "realEstate.location.province": locationName },
      ],
      ...filter, // TODO: fix filter foreach endpoint
    };

    const pipeline = [
      { $match: query },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $facet: {
          data: [{ $project: { realEstate: 1, seo: 1, _id: 1 } }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const total = await collection.countDocuments(query);
    const result = await collection.aggregate(pipeline).next();

    if (result) {
      console.log(
        "Retrieved document:",
        " total ",
        total,
        " totalPages: ",
        Math.ceil(total / limit)
      );
      return {
        total: total,
        totalPages: Math.ceil(total / limit),
        data: result.data,
      };
    } else {
      console.log("Document not found");
    }
  } catch (e) {
    console.error("Error (getAllRealEstatesByLocationName):", e);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
};

// todo: cambiare il file di query visto che si sta interrogando una collection diversa?
export const getRealEstateComuniSearch = async (locationName: string) => {
  const client = new MongoClient(process.env.MONGOURI);
  try {
    await client.connect();
    console.log("Connected successfully");
    const database = client.db("real-estate");
    const collection = database.collection("city");

    const projectionDetails = { lat: 1, lon: 1, place_id: 1, _id: 1, name: 1 };

    const result = await collection
      .find({
        name: { $regex: "^" + locationName + "", $options: "i" },
      })
      .project(projectionDetails)
      .toArray();

    if (result) {
      console.log("Retrieved document:", result);
      return result;
    } else {
      console.log("Document not found");
    }
  } catch (e) {
    console.error("Error (getRealEstateComuniSearch):", e);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
};

export const getRealEstateComuniById = async (id: string) => {
  const client = new MongoClient(process.env.MONGOURI);
  try {
    await client.connect();
    console.log("Connected successfully");
    const database = client.db("real-estate");
    const collection = database.collection("city");

    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (result) {
      console.log("Retrieved document:", result);
      return result;
    } else {
      console.log("Document not found");
    }
  } catch (e) {
    console.error("Error (getRealEstateComuniSearch):", e);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
};
