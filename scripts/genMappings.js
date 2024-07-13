const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "hack-0",
  api_key: "418569145725966",
  api_secret: "zat3wFszQCshxRMa6IE8j4SyPQ4",
});

const mappings = {};

const spriteSheets = {};
const previews = {};

function fetchAssets(next_cursor) {
  cloudinary.api.resources(
    {
      type: "upload",
      prefix: "holoverse_customizer/",
      max_results: 500,
      next_cursor: next_cursor,
    },
    function (error, result) {
      if (error) throw error;

      for (const asset of result.resources) {
        const assetUrl = asset.secure_url;
        const parts = assetUrl.split("_");
        const commonPart = parts.slice(1, -2).join("_");

        if (assetUrl.includes("preview_")) {
          previews[commonPart] = assetUrl;
        } else if (assetUrl.includes("32x32")) {
          spriteSheets[commonPart] = assetUrl;
        }
      }

      if (result.next_cursor) {
        fetchAssets(result.next_cursor);
      } else {
        for (const commonPart in previews) {
          if (spriteSheets[commonPart]) {
            mappings[previews[commonPart]] = spriteSheets[commonPart];
          }
        }

        const json = JSON.stringify(mappings, null, 2);

        fs.writeFile("mappings.json", json, (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
      }
    }
  );
}

fetchAssets()
