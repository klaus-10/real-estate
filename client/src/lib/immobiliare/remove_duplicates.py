from pymongo import MongoClient

# Replace with your actual connection string
client = MongoClient("mongodb://root:password@localhost:27017/")

# Replace with your actual database and collection names
db = client["real-estate"]
collection = db["realestates"]


# Function to find duplicates
def find_duplicates(collection, field):
    pipeline = [
        {"$group": {"_id": f"${field}", "count": {"$sum": 1}}},
        {"$match": {"count": {"$gt": 1}}}
    ]
    return list(collection.aggregate(pipeline))

# Function to remove duplicates
def remove_duplicates(collection, field):
    duplicates = find_duplicates(collection, field)
    
    for duplicate in duplicates:
        ids = duplicate["_id"]
        # Find all documents with the duplicate id
        docs = list(collection.find({"realEstate.id": ids}))
        
        # Keep the first document, remove the rest
        for doc in docs[1:]:
            collection.delete_one({"_id": doc["_id"]})

# Check for duplicates
duplicates = find_duplicates(collection, "realEstate.id")

if duplicates:
    print(f"Found {len(duplicates)} duplicate entries.")
    for duplicate in duplicates:
        print(f"Duplicate ID: {duplicate['_id']} Count: {duplicate['count']}")
    # Remove duplicates
    remove_duplicates(collection, "realEstate.id")
else:
    print("No duplicates found.")
