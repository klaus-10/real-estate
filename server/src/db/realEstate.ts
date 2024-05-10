import { RealEstate, PhoneNumber, ImageUrls, MultimediaPhoto, Agency, Supervisor, Advertiser, Price, Multimedia, Typology, Location, Feature, Property } from "interfaces/db/realEstate";
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
    }
});

realEstateSchema.index({ loc: '2dsphere' });

  
export const RealEstateModel = mongoose.model("RealEstate", realEstateSchema);


// RealEstate Actions
// export const getRealEstates = (page: number, limit: number, filter?: any) => RealEstateModel.find().skip(25 * page).limit(25);

export const getRealEstates = async (page: number, limit: number, filter?: any) => {
    const totalCount = await RealEstateModel.countDocuments();
    const realEstates = await RealEstateModel.find()
        .skip(limit * (page - 1))
        .limit(limit);

    return {
        total: totalCount,
        data: realEstates
    };
};
