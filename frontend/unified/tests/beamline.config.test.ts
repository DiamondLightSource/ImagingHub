import { expect, test } from "vitest";

import { BEAMLINE_CONFIG, isMetadataPair } from "../src/beamline.config";

test("check BEAMLINE_CONFIG references valid fields", () => {
  /**
   * In this test we check that the strings under BEAMLINE_CONFIG.ui correspond
   * to fields under BEAMLINE_CONFIG.fields
   */
  for (const conf of BEAMLINE_CONFIG) {
    const scanSelector = conf.ui.scanSelector;
    expect(
      conf.fields?.[scanSelector.title],
      `field ${scanSelector.title} not found`
    ).not.toBeUndefined();
    expect(
      conf.fields?.[scanSelector.item1],
      `field ${scanSelector.item1} not found`
    ).not.toBeUndefined();
    if (scanSelector.item2) {
      expect(
        conf.fields?.[scanSelector.item2],
        `field ${scanSelector.item2} not found`
      ).not.toBeUndefined();
    }
    if (scanSelector.item3) {
      expect(
        conf.fields?.[scanSelector.item3],
        `field ${scanSelector.item3} not found`
      ).not.toBeUndefined();
    }

    const fullMetadata = conf.ui.fullMetadata;
    for (const metadata of fullMetadata) {
      if (isMetadataPair(metadata)) {
        expect(
          conf.fields?.[metadata.value1],
          `field ${metadata.value1} not found`
        ).not.toBeUndefined();
        expect(
          conf.fields?.[metadata.value2],
          `field ${metadata.value2} not found`
        ).not.toBeUndefined();
      } else {
        expect(
          conf.fields?.[metadata],
          `field '${metadata}' not found`
        ).not.toBeUndefined();
      }
    }
  }
});
