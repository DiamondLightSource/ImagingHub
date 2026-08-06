import type { NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";
import { proxyService } from "../../api/services";
import { decode } from "fast-png";

export default async function loadData(
  tifURL: string,
  sampleRate: number,
  setLoadingImageIndex: React.Dispatch<
    React.SetStateAction<number | undefined>
  >,
  setTotalImages: React.Dispatch<React.SetStateAction<number | undefined>>
): Promise<NDT[]> {
  const images: NDT[] = [];

  const {
    page_count: pageCount,
    width,
    height,
  } = await proxyService.getTiffMetadata(tifURL);
  const downsampledWidth = Math.floor(width / sampleRate);
  const downsampledHeight = Math.floor(height / sampleRate);

  setTotalImages(pageCount);

  for (let i = 0; i < pageCount; i++) {
    setLoadingImageIndex(i);

    const pngData = await proxyService.getTiffPage(tifURL, i, sampleRate);
    const decodedPng = decode(pngData.buffer);
    const currentPageNDT = ndarray(decodedPng.data, [
      downsampledHeight,
      downsampledWidth,
    ]) as NDT;

    images.push(currentPageNDT);
  }

  return images;
}
