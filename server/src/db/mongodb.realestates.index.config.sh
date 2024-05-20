#!/bin/bash

# MongoDB connection details
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_DB="real-estate"
MONGO_COLLECTION="realestates"
MONGO_USER="root"
MONGO_PASS="password"

# Commands to create indexes
COMMANDS=$(cat <<EOF

db.$MONGO_COLLECTION.createIndex(
  { 'realEstate.loc': '2dsphere' },
  { name: 'realEstate.loc_2dsphere', v: 2, '2dsphereIndexVersion': 3 }
);

db.$MONGO_COLLECTION.createIndex(
  { _fts: 'text', _ftsx: 1 },
  {
    name: 'realEstate.location.city_text',
    weights: { 'realEstate.location.city': 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3,
    v: 2
  }
);

db.$MONGO_COLLECTION.createIndex(
  { 'realEstate.location.region': 1 },
  { name: 'realEstate.location.region_1', v: 2 }
);

db.$MONGO_COLLECTION.createIndex(
  { 'realEstate.location.province': 1 },
  { name: 'realEstate.location.province_1', v: 2 }
);

db.$MONGO_COLLECTION.createIndex(
  { 'realEstate.location.city': 1 },
  { name: 'realEstate.location.city_1', v: 2 }
);

db.$MONGO_COLLECTION.createIndex(
  { loc: '2dsphere' },
  { name: 'loc_2dsphere', v: 2, background: true, '2dsphereIndexVersion': 3 }
);
EOF
)

# Execute the commands using mongosh
echo "$COMMANDS" | mongosh "mongodb://$MONGO_USER:$MONGO_PASS@$MONGO_HOST:$MONGO_PORT/$MONGO_DB"
