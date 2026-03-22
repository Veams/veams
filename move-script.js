const fs = require("fs");
let content = fs.readFileSync("web/src/content/site.ts", "utf8");

// Find start of docsPackages array
const startIndex = content.indexOf("export const docsPackages: DocsPackage[] = [");
if (startIndex === -1) {
  console.log("Could not find docsPackages start.");
  process.exit(1);
}

const arrayStart = content.indexOf("[", startIndex);
const contentBeforeArray = content.substring(0, arrayStart + 1);
const contentInsideAndAfterArray = content.substring(arrayStart + 1);

// A simple parser to extract top-level objects in the array
let depth = 0;
let inString = false;
let currentStringChar = "";
let currentObjectStart = -1;
const objects = [];
let arrayEndIndex = -1;

for (let i = 0; i < contentInsideAndAfterArray.length; i++) {
    const char = contentInsideAndAfterArray[i];
    
    // Handle strings to ignore braces inside them
    if (inString) {
        if (char === currentStringChar && contentInsideAndAfterArray[i-1] !== "") {
            inString = false;
        }
        continue;
    }
    if (char === '"' || char === "'" || char === "`") {
        inString = true;
        currentStringChar = char;
        continue;
    }

    if (char === "{") {
        if (depth === 0) {
            currentObjectStart = i;
        }
        depth++;
    } else if (char === "}") {
        depth--;
        if (depth === 0 && currentObjectStart !== -1) {
            // Found a complete top-level object
            objects.push({
                start: currentObjectStart,
                end: i + 1,
                text: contentInsideAndAfterArray.substring(currentObjectStart, i + 1)
            });
            currentObjectStart = -1;
        }
    } else if (char === "]" && depth === 0) {
        // End of docsPackages array
        arrayEndIndex = i;
        break;
    }
}

if (arrayEndIndex === -1) {
  console.log("Could not find end of array.");
  process.exit(1);
}

let partialHydrationObj = null;
let otherObjects = [];

for (const obj of objects) {
    if (obj.text.includes("id: 'partial-hydration'")) {
        partialHydrationObj = obj;
    } else {
        otherObjects.push(obj);
    }
}

if (!partialHydrationObj) {
    console.log("Could not find partial-hydration object");
    process.exit(1);
}

const contentAfterArray = contentInsideAndAfterArray.substring(arrayEndIndex);

let newArrayContent = "\n";
for (let i = 0; i < otherObjects.length; i++) {
    newArrayContent += "  " + otherObjects[i].text + ",\n";
}
// Add partial-hydration at the end, without a trailing comma for cleaner diff (or with one, JS doesn't care)
newArrayContent += "  " + partialHydrationObj.text + "\n";

fs.writeFileSync("web/src/content/site.ts", contentBeforeArray + newArrayContent + contentAfterArray);
console.log("Successfully moved partial-hydration to the bottom.");