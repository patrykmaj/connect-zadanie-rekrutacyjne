import { defaultXMLOptions, XMLOptions } from "./options";
import * as parts from "./parts";
import qrcode from "qrcode-generator";
import { QRCode } from "../utils/types";
import { getMode, calculateImageSize } from "../utils/utils";
import { errorCorrectionPercents } from "../utils/consts"


const uri = `data:image/png;base64,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`;

export const generateNightlyQRCodeXML = (
  address: string,
  options?: Partial<XMLOptions>
) => {
  const codeOptions: XMLOptions = {
    ...defaultXMLOptions,
    image: uri,
    imageWidth: 1510, // workaround for problem with getting image size
    imageHeight: 1660, // way used on web is incompatible with one used on native and vice versa
    data: address,
    ...(options ?? {}),
  };

  const qr: QRCode = qrcode(
    codeOptions.qrOptions.typeNumber,
    codeOptions.qrOptions.errorCorrectionLevel
  );
  qr.addData(
    codeOptions.data,
    codeOptions.qrOptions.mode || getMode(codeOptions.data)
  );
  qr.make();

  const count = qr.getModuleCount();
  const minSize =
    Math.min(codeOptions.width, codeOptions.height) - codeOptions.margin * 2;
  const dotSize = Math.floor(minSize / count);

  let drawImageSize = {
    hideXDots: 0,
    hideYDots: 0,
    width: 0,
    height: 0,
  };

  if (codeOptions.image && codeOptions.imageHeight && codeOptions.imageWidth) {
    const { imageOptions, qrOptions } = codeOptions;
    const coverLevel =
      imageOptions.imageSize *
      errorCorrectionPercents[qrOptions.errorCorrectionLevel];
    const maxHiddenDots = Math.floor(coverLevel * count * count);

    drawImageSize = calculateImageSize({
      originalWidth: codeOptions.imageWidth,
      originalHeight: codeOptions.imageHeight,
      maxHiddenDots,
      maxHiddenAxisDots: count - 14,
      dotSize,
    });
  }

  const backgroundNode = parts.simpleColor({
    color: codeOptions.backgroundOptions.color,
    x: 0,
    y: 0,
    name: "background-color",
    width: codeOptions.width,
    height: codeOptions.height,
  });

  const dotPaths = parts.drawDots(
    qr,
    codeOptions.width,
    codeOptions.height,
    codeOptions.margin,
    codeOptions.dotsOptions.color,
    codeOptions.imageOptions.hideBackgroundDots,
    count,
    drawImageSize
  );

  const cornerPaths = parts.drawCorners(
    codeOptions.width,
    codeOptions.height,
    codeOptions.margin,
    codeOptions.cornersSquareOptions.color,
    codeOptions.cornersDotOptions.color,
    count
  );

  const image = parts.centerImage({
    qrWidth: codeOptions.width,
    qrHeight: codeOptions.height,
    width: drawImageSize.width,
    height: drawImageSize.height,
    count,
    dotSize,
    image: codeOptions.image,
    imageMargin: codeOptions.imageOptions.margin,
  });

  const paths = [backgroundNode, ...dotPaths, ...cornerPaths, image];

  return `<svg width="${codeOptions.width}" height="${codeOptions.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
    ${paths.join("")}
  </svg>`;
};