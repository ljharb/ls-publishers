'use strict';

const pacote = require('pacote');
const getTree = require('get-dep-tree');

const packumentCache = new Map();
const fullMetadata = true;

const defaultLogger = (x) => console.error(x);

module.exports = async function listPublishers(mode, { dev, peer, production, logger = defaultLogger } = {}) {
	const tree = await getTree(mode, { dev, fullMetadata, logger, packumentCache, peer, production });
	const byPackage = new Map();
	const byPublisher = new Map();
	await Promise.allSettled(Array.from(tree.inventory.values(), async (node) => {
		if (!node.isProjectRoot) {
			const packument = await pacote.packument(node.packageName, { fullMetadata, packumentCache }).catch((e) => {
				console.warn(`no published package found: ${node.packageName}`);
				throw e;
			});
			if (!byPackage.has(node.packageName)) {
				byPackage.set(node.packageName, new Map());
			}
			const versions = byPackage.get(node.packageName);
			Object.entries(packument.versions)
				.filter(([v]) => v === node.version)
				.forEach(([v, { _npmUser: u }]) => {
					const publisher = typeof u === 'string' ? { name: u } : u;
					if (publisher) {
						if (!byPublisher.has(publisher.name)) {
							byPublisher.set(publisher.name, new Set());
						}
						byPublisher.get(publisher.name).add({
							name: node.packageName,
							publisher,
							version: v,
						});
						versions.set(v, u);
					} else {
						console.warn(`no publisher found: ${node.packageName}@${v}`);
					}
				});
		}
	}));
	return { byPackage, byPublisher };
};
