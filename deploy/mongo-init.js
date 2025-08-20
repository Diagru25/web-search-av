// MongoDB initialization script
db = db.getSiblingDB("websearch");

// Create collections if they don't exist
db.createCollection("users");
db.createCollection("malware");
db.createCollection("collectionunits");

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

db.malware.createIndex({ md5: 1 }, { unique: true });
db.malware.createIndex({ sha1: 1 });
db.malware.createIndex({ sha256: 1 });
db.malware.createIndex({ name: 1 });
db.malware.createIndex({ createdAt: -1 });

db.collectionunits.createIndex({ name: 1 }, { unique: true });
db.collectionunits.createIndex({ createdAt: -1 });

// Create default admin user (password: admin123)
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2b$10$hNQ9Cewho.vjetd1wC55o..cIIkNfPs6qs9yRqe4ZVPTEMAiT9P26", // bcrypt hash of 'admin123'
  fullName: "System Administrator",
  department: "IT Security",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Create default collection units
const collectionUnits = [
  {
    name: "IT Security",
    description: "Đơn vị An ninh thông tin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Research Lab",
    description: "Phòng nghiên cứu",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "External",
    description: "Nguồn bên ngoài",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Threat Intelligence",
    description: "Đơn vị Tình báo Mối đe dọa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

db.collectionunits.insertMany(collectionUnits);

print("Database initialization completed successfully");
