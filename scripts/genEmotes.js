const fs = require("fs");
const path = require("path");

const emotesDir = "/home/nginze/Documents/vhub/frontend/public/emotes";

fs.readdir(emotesDir, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  const emotes = files.map((file) => {
    const name = path.parse(file).name;
    return {
      name: name,
      id: name,
      short_names: [name],
      keywords: [], // add relevant keywords manually
      skins: [{ src: `/emotes/${file}` }],
    };
  });

  fs.writeFile("emotes.json", JSON.stringify(emotes, null, 2), (err) => {
    if (err) {
      console.error("Error writing file", err);
    } else {
      console.log("Successfully wrote to emotes.json");
    }
  });
});
