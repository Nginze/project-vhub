const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "hack-0",
  api_key: "418569145725966",
  api_secret: "zat3wFszQCshxRMa6IE8j4SyPQ4",
});

const previews = [];
const spriteSheets = [];
const mappings = {};

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
        const publicId = asset.public_id;
        const assetUrl = asset.secure_url;

        console.log("Processing asset: ", publicId);

        // Ignore assets that do not include '32x32' in their names
        if (!publicId.includes("32x32")) {
          console.log("Skipping asset: ", publicId);
          continue;
        }

        if (publicId.includes("preview_")) {
          previews.push({ id: publicId, url: assetUrl });
        } else {
          spriteSheets.push({ id: publicId, url: assetUrl });
        }
      }

      if (result.next_cursor) {
        fetchAssets(result.next_cursor);
      } else {
        for (const preview of previews) {
          const previewMiddlePart = preview.id.split("preview_")[1].split("_");
          previewMiddlePart.pop(); // remove the last part
          const previewMiddlePartJoined = previewMiddlePart.join("_");
          const spriteSheet = spriteSheets.find((sheet) =>
            sheet.id.includes(previewMiddlePartJoined)
          );
          if (spriteSheet) {
            mappings[preview.url] = spriteSheet.url;
          }
        }

        const json = JSON.stringify(mappings, null, 2);

        fs.writeFile("mappings.json", json, (err) => {
          if (err) throw err;
          console.log("Data written to file");
        });
      }
    }
  );
}

fetchAssets();
