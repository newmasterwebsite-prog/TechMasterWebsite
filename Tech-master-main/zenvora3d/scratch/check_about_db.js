const mongoose = require('mongoose');

async function checkAbout() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/techmaster" || "mongodb://localhost:27017/techmaster";
  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  const CMSData = mongoose.connection.db.collection('cmsdatas');
  const cmsDoc = await CMSData.findOne({ key: "about" });
  console.log("CMSData about value:", JSON.stringify(cmsDoc ? cmsDoc.value : null, null, 2));

  const About = mongoose.connection.db.collection('abouts');
  const aboutDoc = await About.findOne({});
  console.log("About document:", JSON.stringify(aboutDoc, null, 2));

  await mongoose.disconnect();
}

checkAbout().catch(console.error);
