import * as FileSaver from 'file-saver';
import jsyaml from 'js-yaml';
import { brunoToOpenCollection } from '@usebruno/converters';
import { sanitizeName } from 'utils/common/regex';
import { filterTransientItems } from 'utils/collections';

// Build the OpenCollection YAML for a collection and return it as a string.
// Pure (no file I/O) so callers can also upload it (e.g. as a release asset),
// not just save it. Does not mutate the input collection.
export const buildOpenCollectionYaml = (collection, version) => {
  const coll = { ...collection, items: filterTransientItems(collection.items) };

  const openCollection = brunoToOpenCollection(coll);

  if (!openCollection.extensions) {
    openCollection.extensions = {};
  }
  if (!openCollection.extensions.bruno) {
    openCollection.extensions.bruno = {};
  }
  openCollection.extensions.bruno.exportedAt = new Date().toISOString();
  openCollection.extensions.bruno.exportedUsing = version ? `Bruno/${version}` : 'Bruno';

  return jsyaml.dump(openCollection, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false
  });
};

export const exportCollection = (collection, version) => {
  const yamlContent = buildOpenCollectionYaml(collection, version);
  const sanitizedName = sanitizeName(collection.name);
  const fileName = `${sanitizedName}.yml`;
  const fileBlob = new Blob([yamlContent], { type: 'application/x-yaml' });

  FileSaver.saveAs(fileBlob, fileName);
};

export default exportCollection;
