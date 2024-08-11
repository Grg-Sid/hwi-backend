const MongoClient = require('mongodb').MongoClient;
require('dotenv').config(); // Load environment variables from .env file

const { DB_URI } = process.env;

async function findNearbyCoordinates(userLat, userLong) {
    const uri = DB_URI;

    // TODO: To be replaced
    const dbName = 'test';
    const collectionName = 'coordinates';

    const client = await MongoClient.connect(uri);

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLong, userLat],
                    },
                    $maxDistance: 50,
                },
            },
        });

        return result;
    } finally {
        await client.close();
    }
}

module.exports = { findNearbyCoordinates };
