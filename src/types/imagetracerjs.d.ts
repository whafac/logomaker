declare module "imagetracerjs" {
  interface ImageDataLike {
    width: number;
    height: number;
    data: Uint8ClampedArray | number[];
  }

  interface TracerOptions {
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    colorsampling?: number;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    scale?: number;
    linefilter?: boolean;
    strokewidth?: number;
    viewbox?: boolean;
  }

  const ImageTracer: {
    imagedataToSVG: (
      imageData: ImageDataLike,
      options?: TracerOptions
    ) => string;
  };

  export default ImageTracer;
}
