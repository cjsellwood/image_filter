const imageForm = document.querySelector("#image-upload");
const filterForm = document.querySelector("#filter-form");
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
    // hide form and show canvas and filter form
    imageForm.style.display = "none";
    canvas.style.display = "block";
    filterForm.style.display = "flex";

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

function showFile(e) {
  const fileLabel = document.querySelector("label[for='image-input']");
  fileLabel.textContent = e.target.files[0].name;
}

const fileLabel = document.querySelector("label[for='image-input']");
const fileInput = document.querySelector("input");
fileInput.addEventListener("input", showFile);

let originalImage;

// edge highlight filter
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

  // get filtered image data
  const filteredImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const pixels = new ImageData(
    new Uint8ClampedArray(filteredImage.data),
    filteredImage.width,
    filteredImage.height
  );

  const pixelsArray = [];

  // create object for each pixel and add to array of pixels
  for (let i = 0; i < pixels.data.length; i += 4) {
    const one = {
      r: pixels.data[i],
      g: pixels.data[i + 1],
      b: pixels.data[i + 2],
      a: pixels.data[i + 3],
    };
    pixelsArray.push(one);
  }

  let pixelGrid = [];

  // create nested arrays as rows of pixels
  for (let i = 0; i < pixels.height; i++) {
    const inner = [];
    for (let j = 0; j < pixels.width; j++) {
      inner.push(pixelsArray[pixels.width * i + j]);
    }
    pixelGrid.push(inner);
  }

  // perform edge calculation on pixel grid
  const edgedGrid = edgeCalculation(pixelGrid);

  // transform back to image data object
  const edgedArray = [];
  for (let i = 0; i < edgedGrid.length; i++) {
    for (let j = 0; j < edgedGrid[i].length; j++) {
      edgedArray.push(edgedGrid[i][j].r);
      edgedArray.push(edgedGrid[i][j].g);
      edgedArray.push(edgedGrid[i][j].b);
      edgedArray.push(edgedGrid[i][j].a);
    }
  }

  const edgedPixels = new ImageData(
    new Uint8ClampedArray(edgedArray),
    filteredImage.width,
    filteredImage.height
  );

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // add to canvas
  ctx.putImageData(edgedPixels, 0, 0);
}

// perform edge calculations
function edgeCalculation(grid) {
  // create copy of grid for calculations
  const copy = [];
  for (let i = 0; i < grid.length; i++) {
    const inner = [];
    for (let j = 0; j < grid[i].length; j++) {
      inner.push({ ...grid[i][j] });
    }
    copy.push(inner);
  }

  // gx array and gy array
  const gx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const gy = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  for (let i = 0; i < copy.length; i++) {
    for (let j = 0; j < copy[i].length; j++) {
      let gxRed = 0;
      let gxGreen = 0;
      let gxBlue = 0;
      let gyRed = 0;
      let gyGreen = 0;
      let gyBlue = 0;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          // don't add to sum if over the boundaries of image
          if (
            i + x !== -1 &&
            j + y !== -1 &&
            i + x !== copy.length &&
            j + y !== copy[i].length
          ) {
            //calculate gxRed gxGreen gxBlue gyRed gyGreen gyBlue
            gxRed += gx[x + 1][y + 1] * copy[i + x][j + y].r;
            gxGreen += gx[x + 1][y + 1] * copy[i + x][j + y].g;
            gxBlue += gx[x + 1][y + 1] * copy[i + x][j + y].b;
            gyRed += gy[x + 1][y + 1] * copy[i + x][j + y].r;
            gyGreen += gy[x + 1][y + 1] * copy[i + x][j + y].g;
            gyBlue += gy[x + 1][y + 1] * copy[i + x][j + y].b;
          }
        }
      }
      // image[i][j].r = sqrt(gx_red^2 + gy_red^2) and < 255
      let newRed = Math.round(Math.sqrt(gxRed ** 2 + gyRed ** 2));
      let newGreen = Math.round(Math.sqrt(gxGreen ** 2 + gyGreen ** 2));
      let newBlue = Math.round(Math.sqrt(gxBlue ** 2 + gyBlue ** 2));

      // ensure not greater than 255
      newRed = newRed > 255 ? 255 : newRed;
      newGreen = newGreen > 255 ? 255 : newGreen;
      newBlue = newBlue > 255 ? 255 : newBlue;

      grid[i][j].r = newRed;
      grid[i][j].g = newGreen;
      grid[i][j].b = newBlue;
    }
  }

  return grid;
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

  // apply filters
  ctx.filter = filtersArray.join(" ");

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

// Restore original sliders, image and filters
function resetImage() {
  // Reset sliders
  brightnessSlider.value = 100;
  grayscaleSlider.value = 0;
  sepiaSlider.value = 0;
  invertSlider.value = 0;
  blurSlider.value = 0;
  saturationSlider.value = 100;
  hueSlider.value = 0;
  opacitySlider.value = 100;
  contrastSlider.value = 100;

  for (const filter in filters) {
    filters[filter] = null;
  }

  // create new image as copy of original image
  const imageClone = new Image();
  imageClone.src = drawnImage.src;

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // apply filters
  ctx.filter = "none";

  ctx.drawImage(imageClone, 0, 0);
}

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", resetImage);

// Download image
function downloadImage() {
  const imageURL = canvas.toDataURL("image/jpeg");
  this.href = imageURL;
  this.download = "image.jpeg";
}

const downloadButton = document.querySelector("#download-button");
downloadButton.addEventListener("click", downloadImage, false);
