import mongoose, { Document, Schema } from "mongoose";

export interface PhoneNumber {
  type: string;
  value: string;
}

export interface ImageUrls {
  small: string;
  large: string;
}

export interface MultimediaPhoto {
  id: number;
  caption: string;
  urls: {
    small: string;
  };
}

export interface Agency {
  id: number;
  type: string;
  showOnlyAgentPhone: boolean;
  phones: PhoneNumber[];
  bookableVisit: {
    isVisitBookable: boolean;
    virtualVisitEnabled: boolean;
  };
  isPaid: boolean;
  label: string;
  displayName: string;
  guaranteed: boolean;
  showAgentPhone: boolean;
  showLogo: boolean;
  imageUrls: ImageUrls;
  agencyUrl: string;
}

export interface Supervisor {
  type: string;
  imageGender: string;
  phones: PhoneNumber[];
  imageType: string;
  displayName: string;
  label: string;
}

export interface Advertiser {
  agency: Agency;
  supervisor: Supervisor;
  hasCallNumbers: boolean;
}

export interface Price {
  visible: boolean;
  value: number;
  formattedValue: string;
  minValue: string;
  maxValue: string;
  mq_price: number;
}

export interface Multimedia {
  photos: MultimediaPhoto[];
  virtualTours: any[]; // You can define a proper export interface if needed
  hasMultimedia: boolean;
}

export interface Typology {
  id: number;
  name: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  marker: string;
  region: string;
  province: string;
  macrozone: string;
  microzone: string;
  city: string;
  nation: {
    id: string;
    name: string;
    keyurl: string;
  };
}

export interface Feature {
  type: string;
  label: string;
  compactLabel?: string;
}

export interface Property {
  income: boolean;
  multimedia: Multimedia;
  floors: string;
  price: Price;
  surface: string;
  surfaceValue: string;
  typology: Typology;
  typologyV2: Typology;
  ga4Garage: string;
  typologyGA4Translation: string;
  ga4features: string[];
  typologyAmount: number;
  caption: string;
  category: {
    id: number;
    name: string;
  };
  description: string;
  energy: {
    zeroEnergyBuilding: boolean;
    thermalInsulation: any; // Define a proper export interface if needed
    emission: any; // Define a proper export interface if needed
    heatingType: string;
    airConditioning: string;
    GA4Heating: string;
  };
  photo: {
    id: number;
    caption: string;
    urls: {
      thumb: string;
      small: string;
      medium: string;
      large: string;
    };
  };
  location: Location;
  featureList: Feature[];
  rooms: string;
}

export interface RealEstate extends Document {
  dataType: string;
  id: number;
  uuid: string;
  advertiser: Advertiser;
  contract: string;
  isNew: boolean;
  luxury: boolean;
  price: Price;
  properties: Property[];
  propertiesCount: number;
  title: string;
  type: string;
  typology: Typology;
  visibility: string;
  hasMainProperty: boolean;
  isProjectLike: boolean;
  loc: {
    type: string;
    coordinates: [number, number];
  };
  location: {
    latitude: Number;
    longitude: Number;
    marker: String;
    region: String;
    province: String;
    macrozone: String;
    city: String;
  };
  seo: {
    anchor: String;
    title: String;
    metaTitle: String;
    url: String;
  };
}

// const phoneNumberSchema = new Schema<PhoneNumber>({
//     type: String,
//     value: String,
// });

// const imageUrlsSchema = new Schema<ImageUrls>({
//     small: String,
//     large: String,
// });

// const multimediaPhotoSchema = new Schema<MultimediaPhoto>({
//     id: Number,
//     caption: String,
//     urls: {
//         small: String,
//     },
// });

// const agencySchema = new Schema<Agency>({
//     id: Number,
//     type: String,
//     showOnlyAgentPhone: Boolean,
//     phones: [phoneNumberSchema],
//     bookableVisit: {
//         isVisitBookable: Boolean,
//         virtualVisitEnabled: Boolean,
//     },
//     isPaid: Boolean,
//     label: String,
//     displayName: String,
//     guaranteed: Boolean,
//     showAgentPhone: Boolean,
//     showLogo: Boolean,
//     imageUrls: imageUrlsSchema,
//     agencyUrl: String,
// });

// const supervisorSchema = new Schema<Supervisor>({
//     type: String,
//     imageGender: String,
//     phones: [phoneNumberSchema],
//     imageType: String,
//     displayName: String,
//     label: String,
// });

// const advertiserSchema = new Schema<Advertiser>({
//     agency: agencySchema,
//     supervisor: supervisorSchema,
//     hasCallNumbers: Boolean,
// });

// const priceSchema = new Schema<Price>({
//     visible: Boolean,
//     value: Number,
//     formattedValue: String,
//     minValue: String,
//     maxValue: String,
//     mq_price: Number,
// });

// const typologySchema = new Schema<Typology>({
//     id: Number,
//     name: String,
// });

// const locationSchema = new Schema<Location>({
//     latitude: Number,
//     longitude: Number,
//     marker: String,
//     region: String,
//     province: String,
//     macrozone: String,
//     microzone: String,
//     city: String,
//     nation: {
//         id: String,
//         name: String,
//         keyurl: String,
//     },
// });

// const featureSchema = new Schema<Feature>({
//     type: String,
//     label: String,
//     compactLabel: String,
// });

// const propertySchema = new Schema<Property>({
//     income: Boolean,
//     multimedia: {
//         photos: [multimediaPhotoSchema],
//         virtualTours: [String],
//         hasMultimedia: Boolean,
//     },
//     floors: String,
//     price: priceSchema,
//     surface: String,
//     surfaceValue: String,
//     typology: typologySchema,
//     typologyV2: typologySchema,
//     ga4Garage: String,
//     typologyGA4Translation: String,
//     ga4features: [String],
//     typologyAmount: Number,
//     caption: String,
//     category: {
//         id: Number,
//         name: String,
//     },
//     description: String,
//     energy: {
//         zeroEnergyBuilding: Boolean,
//         thermalInsulation: Schema.Types.Mixed,
//         emission: Schema.Types.Mixed,
//         heatingType: String,
//         airConditioning: String,
//         GA4Heating: String,
//     },
//     photo: {
//         id: Number,
//         caption: String,
//         urls: {
//             thumb: String,
//             small: String,
//             medium: String,
//             large: String,
//         },
//     },
//     location: locationSchema,
//     featureList: [featureSchema],
//     rooms: String,
// });

// const realEstateSchema = new Schema<RealEstate>({
//     dataType: String,
//     id: Number,
//     uuid: String,
//     advertiser: advertiserSchema,
//     contract: String,
//     isNew: Boolean,
//     luxury: Boolean,
//     price: priceSchema,
//     properties: [propertySchema],
//     propertiesCount: Number,
//     title: String,
//     type: String,
//     typology: typologySchema,
//     visibility: String,
//     hasMainProperty: Boolean,
//     isProjectLike: Boolean,
//     loc: {
//         type: { type: String },
//         coordinates: [Number],
//     },
// });

// realEstateSchema.index({ loc: '2dsphere' });

// const RealEstateModel = mongoose.model<RealEstate>('RealEstate', realEstateSchema);

// export default RealEstateModel;
