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

function edges() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // create new image as copy of original imag
  const imageClone = new Image();
  imageClone.src = drawnImage.src;

  // combine all filters
  const filtersArray = [];
  for (const filter in filters) {
    filtersArray.push(filters[filter]);
  }

  // apply filters
  ctx.filter = filtersArray.join(" ");
  ctx.drawImage(imageClone, 0, 0);
  console.log("filter");

  const filteredImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(filteredImage);

  const pixels = new ImageData(
    new Uint8ClampedArray(filteredImage.data),
    filteredImage.width,
    filteredImage.height
  );

  console.log(pixels);
  const pixelsArray = [];

  // create object for each pixel and add to array of pixels
  for (let i = 0; i < pixels.data.length; i += 4) {
    // pixels.data[i + 0] = 255;
    const one = {
      r: pixels.data[i],
      g: pixels.data[i + 1],
      b: pixels.data[i + 2],
      a: pixels.data[i + 3]
    }
    pixelsArray.push(one);
  }

  console.log(pixelsArray);
  console.log(pixels.width);

  const pixelGrid = [];

  // create nested arrays as rows of pixels
  for (let i = 0; i < pixels.height; i++) {
    const inner = []
    for (let j = 0; j < pixels.width; j++) {
      inner.push(pixelsArray[i + j])
    }
    pixelGrid.push(inner);
  }

  console.log(pixelGrid[0]);

  // test to see if can affect nested grid
  for (let i = 450; i < 550; i++) {
    for (let j = 450; j < 450; j++) {
      pixelGrid[i][j].g = 255;
    } 
  }

  const transformArray = [];
  // transform back to image data object
  for (let i = 0; i < pixelGrid.length; i++) {
    for (let j = 0; j < pixelGrid[i].length; j++) {
      transformArray.push(pixelGrid[i][j].r)
      transformArray.push(pixelGrid[i][j].g)
      transformArray.push(pixelGrid[i][j].b)
      transformArray.push(pixelGrid[i][j].a)
    }
  }

  console.log("here")
  console.log(pixels.data)
  console.log(transformArray)

  const transformPixels = new ImageData(
    new Uint8ClampedArray(transformArray),
    filteredImage.width,
    filteredImage.height
  );

  console.log(transformPixels);
  ctx.putImageData(transformPixels, 0, 0);



  // gx array and gy array
  const gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

  // copy pixels variable so that changes to image don't effect next calculation
  const pixelsCopy = new ImageData(
    new Uint8ClampedArray(filteredImage.data),
    filteredImage.width,
    filteredImage.height
  );

   // treat pixels outside boundaries as black(0,0,0)

}

const edgesButton = document.querySelector("#edges-button");
edgesButton.addEventListener("click", edges);

// Change image colours based on slider and its property
function colorChange(property, unit, e) {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // create new image as copy of original image
  const imageClone = new Image();
  imageClone.src = drawnImage.src;

  // add new filter from slider value
  const newFilter = `${property}(${e.target.value}${unit})`;
  filters[property] = newFilter;

  // combine all filters
  const filtersArray = [];
  for (const filter in filters) {
    filtersArray.push(filters[filter]);
  }
  console.log(filtersArray);

  // apply filters
  ctx.filter = filtersArray.join(" ");
  console.log(filtersArray.join(" "));

  // draw image with filters too canvas
  ctx.drawImage(imageClone, 0, 0);
}

// keep track of filters to apply
let filters = {
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

// Add event listener to each slider
const brightnessSlider = document.querySelector("#brightness-slider");
brightnessSlider.addEventListener("input", (e) =>
  colorChange("brightness", "%", e)
);

const grayscaleSlider = document.querySelector("#grayscale-slider");
grayscaleSlider.addEventListener("input", (e) =>
  colorChange("grayscale", "%", e)
);

const sepiaSlider = document.querySelector("#sepia-slider");
sepiaSlider.addEventListener("input", (e) => colorChange("sepia", "%", e));

const invertSlider = document.querySelector("#invert-slider");
invertSlider.addEventListener("input", (e) => colorChange("invert", "%", e));

const blurSlider = document.querySelector("#blur-slider");
blurSlider.addEventListener("input", (e) => colorChange("blur", "px", e));

const saturationSlider = document.querySelector("#saturation-slider");
saturationSlider.addEventListener("input", (e) =>
  colorChange("saturate", "%", e)
);

const hueSlider = document.querySelector("#hue-slider");
hueSlider.addEventListener("input", (e) => colorChange("hue-rotate", "deg", e));

const opacitySlider = document.querySelector("#opacity-slider");
opacitySlider.addEventListener("input", (e) => colorChange("opacity", "%", e));

const contrastSlider = document.querySelector("#contrast-slider");
contrastSlider.addEventListener("input", (e) =>
  colorChange("contrast", "%", e)
);

// Restore original image and filters
function resetImage() {
  // Replace with original image
  ctx.putImageData(originalImage, 0, 0);

  // Reset sliders
  brightnessSlider.value = 0;
  grayscaleSlider.value = 0;
  sepiaSlider.value = 0;
  invertSlider.value = 0;
  blurSlider.value = 0;
  saturationSlider.value = 100;
  hueSlider.value = 0;
  opacitySlider.value = 100;
  contrastSlider.value = 100;

  // Reset filters
  filters = {
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

  console.log(filters);
}

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", resetImage);

// Download image
function downloadImage() {
  const imageURL = canvas.toDataURL("image/png");
  console.log(imageURL);
  this.href = imageURL;
  this.download = "image.png";
}

const downloadButton = document.querySelector("#download-button");
downloadButton.addEventListener("click", downloadImage, false);
