'use strict';

const { stripColors } = require('colors/safe');
const { valid } = require('semver');
const test = require('tape');
const listPublishers = require('../');

test('ls-publishers', async (t) => {
	const messages = [];
	function logger(x) {
		messages.push(x);
	}

	const { byPackage, byPublisher } = await listPublishers('auto', { logger });

	t.ok(byPackage instanceof Map, 'byPackage is a Map');
	t.ok(byPublisher instanceof Map, 'byPublisher is a Map');

	t.ok(
		Array.from(byPackage).every(([key, packages]) => typeof key === 'string' && packages instanceof Map),
		'byPackage has string keys and Map values',
	);
	t.ok(
		Array.from(byPackage)
			.every(([, packages]) => Array.from(packages)
				.every(([version, publisher]) => valid(version)
                    && typeof publisher.name === 'string'
                    && typeof publisher.email === 'string')),
		'byPackage Map keys are semver versions, and values are publisher objects',
	);

	t.ok(
		Array.from(byPublisher).every(([key, packages]) => typeof key === 'string' && packages instanceof Set),
		'byPublisher has string keys and Set values',
	);

	t.deepEqual(
		messages.map(stripColors),
		['`node_modules` found; loading tree from disk...'],
		'expected messages are logged',
	);
});
