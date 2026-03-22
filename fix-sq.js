const fs = require('fs');
const path = 'web/src/content/site.ts';
let content = fs.readFileSync(path, 'utf8');

// We identify the sections array specifically for status-quo
const packageId = "id: 'status-quo',";
const packageIndex = content.indexOf(packageId);

if (packageIndex === -1) {
  console.error("Could not find status-quo package");
  process.exit(1);
}

// Find the sections start
const sectionsStartStr = "sections: [";
const sectionsIndex = content.indexOf(sectionsStartStr, packageIndex);

// Find the sections end. It ends before id: 'status-quo-query'
const nextPackageId = "id: 'status-quo-query',";
const nextPackageIndex = content.indexOf(nextPackageId, sectionsIndex);

if (sectionsIndex === -1 || nextPackageIndex === -1) {
  console.error("Could not find sections or next package");
  process.exit(1);
}

// We want to find the closing ] of the sections array.
// It will be the last ] before nextPackageIndex.
const sectionsContent = content.substring(sectionsIndex, nextPackageIndex);
const lastBracket = sectionsContent.lastIndexOf("],");
if (lastBracket === -1) {
    console.error("Could not find end of sections");
    process.exit(1);
}

const finalSectionsIndex = sectionsIndex + lastBracket + 1;

// Now we need to extract the sections and modify them.
// But actually, I already have the logic for what I want to move.
// I want to take the API section and move its pages into the Guides section.

// Let's re-read the sections content to find the API section
const apiSectionStart = content.indexOf("id: 'api',", sectionsIndex);
const guidesSectionStart = content.indexOf("id: 'guides',", sectionsIndex);

// I will just do a string replacement on the sections content.
// This is still risky but easier than full parsing.

// Actually, I'll just write the NEW sections array completely.
// Since I have the full text from the previous read_file calls (I can re-assemble it).

// Wait, I have a better idea. I will use a regex to find the section objects.
// A section looks like { id: '...', pages: [...], title: '...' }

const apiSectionRegex = /\{\s+id: 'api',[\s\S]*?title: 'API',\s+\},/;
const match = content.match(apiSectionRegex);

if (!match) {
    console.error("Could not find API section match");
    process.exit(1);
}

const apiSectionText = match[0];
// Transform it to a page block or similar? 
// No, the user wants it as a page inside Guides.

// Let's find the Guides pages array.
const guidesPagesEnd = content.indexOf("],", guidesSectionStart + 50); // Rough estimate of where pages end

// This is getting complicated. Let's just do a manual string search and replace for the exact markers.

const oldGuidesEnd = `            title: 'Devtools',
          },
        ],
        title: 'Guides',
      },
      {
        id: 'api',
        pages: [
          {
            blocks: [`;

const newGuidesEnd = `            title: 'Devtools',
          },
          {
            blocks: [`;

// And then fix the end of that page.
const apiPageEnd = `            intro:
              'Start at the root for framework-agnostic pieces, then import the React integration from `@veams/status-quo/react` when you are wiring handlers into React.',
            summary: 'The full surface, minus the noise.',
            title: 'API Reference',
          },
        ],
        title: 'Guides',
      },`;

// This is also brittle. 

// FINAL ATTEMPT AT SCRIPT: 
// 1. Find the API page object.
// 2. Remove the API section wrapper.
// 3. Move the API page object into the Guides pages array.

const apiPageStart = content.indexOf("pages: [", apiSectionStart);
const apiPageEndIdx = content.indexOf("],", apiPageStart);
const apiPageText = content.substring(apiPageStart + 8, apiPageEndIdx);

// Remove the whole API section
const apiSectionEndIdx = content.indexOf("},", apiPageEndIdx) + 2;
const apiSectionFullText = content.substring(apiSectionStart - 10, apiSectionEndIdx); // include some padding

// Find guides pages array end
const guidesPagesStart = content.indexOf("pages: [", guidesSectionStart);
// Find the closing ] of the guides pages array.
let depth = 0;
let guidesPagesEndIdx = -1;
for(let i = guidesPagesStart; i < content.length; i++) {
    if(content[i] === '[') depth++;
    if(content[i] === ']') depth--;
    if(depth === 0) {
        guidesPagesEndIdx = i;
        break;
    }
}

let newContent = content.substring(0, guidesPagesEndIdx) + "," + apiPageText + content.substring(guidesPagesEndIdx);
// Now remove the old API section.
// We need to be careful with the comma.
newContent = newContent.replace(/,\s+\{\s+id: 'api'[\s\S]*?title: 'API',\s+\}/, "");

// Also update the title of the moved page.
newContent = newContent.replace("title: 'API',", "title: 'API Reference',");

fs.writeFileSync(path, newContent, 'utf8');
console.log("Reordered status-quo sections");
