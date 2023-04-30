import fs from 'node:fs'; // import fs module to read or write files
import client from 'node:https'; // import client module to make https request

const memeUrl = 'https://memegen-link-examples-upleveled.netlify.app/'; // Url from memepage
const folderPath = './memes'; // Path to memes folder

// fetching data from memeUrl and store into response
// translating response into text and saving it in responseText
const response = await fetch(memeUrl);
const responseText = await response.text();

// saving filtered image urls to an array
const imageSrcs = [];

// function declaration for filtering the responseText for image urls
function getImageUrls(data) {
  let html = data.split('<section')[1];
  for (let i = 0; i < 10; i++) {
    const startIndex = html.indexOf('src=') + 5;
    const imageUrl = html.substring(startIndex).split('.jpg')[0] + '.jpg';
    html = html.slice(Math.max(0, startIndex + imageUrl.length));
    imageSrcs.push(imageUrl);
  }
}

// function declaration for downloading images
function saveImage(urls, filepath) {
  client.get(urls, (res) => {
    res.pipe(fs.createWriteStream(filepath));
  });
}

// Calling the function getImageUrls
await getImageUrls(responseText);

// looping through images and assigning download location
let counter = 1;
const dec = 0;

for (let i = 0; i < imageSrcs.length; i++) {
  counter = i + 1;

  if (i < 9) {
    saveImage(imageSrcs[i], folderPath + `/${dec}${counter}.jpg`);
  } else {
    saveImage(imageSrcs[i], folderPath + `/${counter}.jpg`);
  }
}
