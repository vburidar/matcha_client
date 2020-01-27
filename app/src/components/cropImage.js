const createImageAsync = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', (error) => reject(error));
  image.src = url;
});

export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImageAsync(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y);

  const data = ctx.getImageData(0, 0, image.width, image.height);

  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/jpeg');
}
