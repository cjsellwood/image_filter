const imageForm = document.querySelector("#image-upload");
const container = document.querySelector(".container");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let drawnImage;

function handleUpload(e) {
  e.preventDefault();
  // Get information on file uploaded
  const image = imageForm.querySelector("input").files[0];

  // Create file reader object to read file contents
  let reader = new FileReader();

  // Will run whenever a readAs method is used
  reader.onload = function (e) {
    // Append image element
    // const imageElement = document.createElement("img");
    // imageElement.src = e.target.result;
    // container.append(imageElement);
    imageForm.style.display = "none";

    // Add to canvas
    const canvasImage = new Image();
    canvasImage.src = e.target.result;

    canvasImage.onload = function () {
      // Set canvas size to same as image
      const imageWidth = canvasImage.width;
      const imageHeight = canvasImage.height;
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      // Center horizontally
      const left = canvas.width / 2 - imageWidth / 2;
      ctx.drawImage(canvasImage, left, 0);

      originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      drawnImage = canvasImage;
    };
  };

  // return file as base64 encoded string
  reader.readAsDataURL(image);
}

imageForm.addEventListener("submit", handleUpload);

// function changeColor(e) {
//   console.log(e);

//   // get rgba data from each pixel of image on canvas
//   const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   console.log(pixels.data);

//   // loop over each pixel
//   for (let i = 0; i < pixels.data.length; i += 4) {
//     // pixels.data[i] = pixels.data[i] + Math.floor(Math.random() * 10) - 5;
//     // pixels.data[i + 1] = pixels.data[i + 1] + Math.floor(Math.random() * 10) - 5;
//     // pixels.data[i + 2] = pixels.data[i + 2] + Math.floor(Math.random() * 10) - 5;
//     // pixels.data[i + 3] = pixels.data[i + 3] + Math.floor(Math.random() * 10) - 5;
//   }
//   // console.log(rgbPixels);

//   // Add to canvas
//   ctx.putImageData(pixels, 0, 0);
// }

// canvas.addEventListener("click", changeColor);

const filterForm = document.querySelector("#filter-form");

let originalImage;

// function to change image colors

// change brightness
// function changeBrightness() {
//   // console.log(this.value);
//   // console.log(originalImage);
//   // const pixels = new ImageData(
//   //   new Uint8ClampedArray(originalImage.data),
//   //   originalImage.width,
//   //   originalImage.height
//   // );

//   // // loop over each pixel
//   // for (let i = 0; i < pixels.data.length; i += 4) {
//   //   pixels.data[i + 0] = pixels.data[i] + Number(this.value);
//   //   pixels.data[i + 1] = pixels.data[i + 1] + Number(this.value);
//   //   pixels.data[i + 2] = pixels.data[i + 2] + Number(this.value);
//   // }
//   // // console.log(rgbPixels);

//   // // Add to canvas
//   // ctx.putImageData(pixels, 0, 0);

//   // use canvas filters
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.filter = `brightness(${this.value}%)`;
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.drawImage(imageClone, 0, 0);
// }

const brightnessSlider = document.querySelector("#brightness-slider");
brightnessSlider.addEventListener("input", (e) =>
  colorChange("brightness", "%", e)
);

// // change grayscale amount
// function grayscale() {
//   // const pixels = new ImageData(
//   //   new Uint8ClampedArray(originalImage.data),
//   //   originalImage.width,
//   //   originalImage.height
//   // );

//   // // loop over each pixel
//   // for (let i = 0; i < pixels.data.length; i += 4) {
//   //   const r = pixels.data[i + 0];
//   //   const g = pixels.data[i + 1];
//   //   const b = pixels.data[i + 2];
//   //   const average = (r + g + b) / 3;
//   //   pixels.data[i + 0] = average;
//   //   pixels.data[i + 1] = average;
//   //   pixels.data[i + 2] = average;
//   // }

//   // // Add to canvas
//   // ctx.putImageData(pixels, 0, 0);

//   console.log("grayscale");
//   // use canvas filters
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.filter = `grayscale(${this.value}%)`;
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.drawImage(imageClone, 0, 0);
// }

const grayscaleSlider = document.querySelector("#grayscale-slider");
grayscaleSlider.addEventListener("input", (e) =>
  colorChange("grayscale", "%", e)
);

// function sepia() {
//   // const pixels = new ImageData(
//   //   new Uint8ClampedArray(originalImage.data),
//   //   originalImage.width,
//   //   originalImage.height
//   // );

//   // // loop over each pixel
//   // for (let i = 0; i < pixels.data.length; i += 4) {
//   //   const r = pixels.data[i + 0];
//   //   const g = pixels.data[i + 1];
//   //   const b = pixels.data[i + 2];
//   //   pixels.data[i + 0] = 0.393 * r + 0.769 * g + 0.189 * b;
//   //   pixels.data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
//   //   pixels.data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
//   // }

//   // // Add to canvas
//   // ctx.putImageData(pixels, 0, 0);

//   console.log("sepia");
//   // use canvas filters
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.filter = `sepia(${this.value}%)`;
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.drawImage(imageClone, 0, 0);
// }

const sepiaSlider = document.querySelector("#sepia-slider");
sepiaSlider.addEventListener("input", (e) => colorChange("sepia", "%", e));

// let inverted = false;

// function invert() {
//   // reset to default if
//   // if (inverted) {
//   //   resetImage();
//   //   return;
//   // }
//   // const pixels = new ImageData(
//   //   new Uint8ClampedArray(originalImage.data),
//   //   originalImage.width,
//   //   originalImage.height
//   // );

//   // // loop over each pixel
//   // for (let i = 0; i < pixels.data.length; i += 4) {
//   //   const r = pixels.data[i + 0];
//   //   const g = pixels.data[i + 1];
//   //   const b = pixels.data[i + 2];
//   //   pixels.data[i + 0] = 255 - r;
//   //   pixels.data[i + 1] = 255 - g;
//   //   pixels.data[i + 2] = 255 - b;
//   // }

//   // inverted = true;

//   // // Add to canvas
//   // ctx.putImageData(pixels, 0, 0);

//   console.log("invert");
//   // use canvas filters
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.filter = `invert(${this.value}%)`;
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.drawImage(imageClone, 0, 0);
// }

const invertSlider = document.querySelector("#invert-slider");
invertSlider.addEventListener("input", (e) => colorChange("invert", "%", e));

// function blur() {
//   console.log("blur");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.filter = `blur(${this.value}px)`;
//   ctx.drawImage(imageClone, 0, 0);
// }

const blurSlider = document.querySelector("#blur-slider");
blurSlider.addEventListener("input", (e) => colorChange("blur", "px", e));

// function saturation() {
//   console.log("saturation");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.filter = `saturate(${this.value}%)`;
//   ctx.drawImage(imageClone, 0, 0);
// }

const saturationSlider = document.querySelector("#saturation-slider");
saturationSlider.addEventListener("input", (e) =>
  colorChange("saturate", "%", e)
);

// function hue() {
//   console.log("hue");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.filter = `hue-rotate(${this.value}deg)`;
//   ctx.drawImage(imageClone, 0, 0);
// }

const hueSlider = document.querySelector("#hue-slider");
hueSlider.addEventListener("input", (e) => colorChange("hue-rotate", "deg", e));

// function opacity() {
//   console.log("opacity");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   const imageClone = new Image();
//   imageClone.src = drawnImage.src;
//   ctx.filter = `opacity(${this.value}%)`;
//   ctx.drawImage(imageClone, 0, 0);
// }

const opacitySlider = document.querySelector("#opacity-slider");
opacitySlider.addEventListener("input", (e) => colorChange("opacity", "%", e));

const contrastSlider = document.querySelector("#contrast-slider");
contrastSlider.addEventListener("input", (e) =>
  colorChange("contrast", "%", e)
);

function colorChange(property, unit, e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const imageClone = new Image();
  imageClone.src = drawnImage.src;
  const newFilter = `${property}(${e.target.value}${unit})`;
  filters[property] = newFilter;
  const filtersArray = [];
  for (const filter in filters) {
    filtersArray.push(filters[filter])
  }
  console.log(filtersArray);
  ctx.filter = filtersArray.join(" ");
  console.log(filtersArray.join(" "));

  ctx.drawImage(imageClone, 0, 0);
}

const filters = {
  brightness: null,
  grayscale: null,
  sepia: null,
  invert: null,
  blur: null,
  saturate: null,
  "hue-rotate": null,
  opacity: null,
  contrast: null,
};

// Restore original image and filters
function resetImage(e) {
  ctx.putImageData(originalImage, 0, 0);
  brightnessSlider.value = 0;
  inverted = false;
}

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", resetImage);

function downloadImage() {
  const imageURL = canvas.toDataURL("image/png");
  console.log(imageURL);
  this.href = imageURL;
  this.download = "image.png";
}

const downloadButton = document.querySelector("#download-button");
downloadButton.addEventListener("click", downloadImage, false);
