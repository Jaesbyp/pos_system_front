// import Photo1 from "../../public/images/Photo1.jpg";
// import Photo2 from "../../public/images/Photo2.jpg";
// import Photo3 from "../../public/images/Photo3.jpg";
// import Photo4 from "../../public/images/Photo4.jpg";
// import Photo5 from "../../public/images/Photo5.jpg";
import Photo1 from "../../public/images/possytem.png";
import Photo2 from "../../public/images/pos2.png";

interface ImageData {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  data: string;
}

export const PhotoService = {
  getImages: (): Promise<ImageData[]> => {
    return new Promise((resolve) => {
      const images: ImageData[] = [
        {
          itemImageSrc: Photo1.src,
          thumbnailImageSrc: Photo1.src,
          data: "Descripción de la imagen 1",
        },
        {
          itemImageSrc: Photo2.src,
          thumbnailImageSrc: Photo2.src,
          data: "Descripción de la imagen 2",
        },
        // {
        //   itemImageSrc: Photo3.src,
        //   thumbnailImageSrc: Photo3.src,
        //   data: "Descripción de la imagen 3",
        // },
        // {
        //   itemImageSrc: Photo5.src,
        //   thumbnailImageSrc: Photo5.src,
        //   data: "Descripción de la imagen 5",
        // },
      ];

      setTimeout(() => {
        resolve(images);
      }, 100);
    });
  },
};
