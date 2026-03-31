import { createImageUrlBuilder } from '@sanity/image-url';

import { client } from './client';

const builder = createImageUrlBuilder(client);

export function urlForImage(source: { asset: { _ref: string } }): ReturnType<typeof builder.image> {
  return builder.image(source);
}
