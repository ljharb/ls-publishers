'use strict';

const colors = require('colors/safe');
const semverCmp = require('semver/functions/compare');
const isMap = require('is-map');
const isSet = require('is-set');

const table = require('./table');

function specifierify({ name, version }) {
	return `${name}@${version}`;
}

function publisherify({ name, email }) {
	return `${name} <${email}>`;
}

function grayBold(x) {
	return colors.bold(colors.gray(x));
}

function uniq(x) {
	return Array.from(new Set(x));
}

function serializer(key, value) {
	if (isSet(value)) {
		return Array.from(value);
	}
	if (isMap(value)) {
		return Object.fromEntries(value);
	}
	return value;
}

function bySize([, v1], [, v2]) {
	return v2.size - v1.size;
}

module.exports = function formatOutput(cache, groupBy, json = false) {
	if (json) {
		const comparator = groupBy === 'package' ? undefined : bySize;
		const sorted = Array.from(cache).sort(comparator);
		return JSON.stringify(new Map(sorted), serializer, '\t');
	}
	if (groupBy === 'package') {
		const rows = [
			['package', 'version/publisher'].map(grayBold),
		].concat(Array.from(cache)
			.sort(([pkgA], [pkgB]) => pkgA.localeCompare(pkgB))
			.map(([pkg, versions]) => [
				colors.green(pkg),
				Array.from(versions)
					.sort(([vA], [vB]) => semverCmp(vB, vA))
					.map(([v, p]) => `${colors.green(v)} by ${colors.blue(publisherify(p))}`)
					.join('\n'),
			]));
		return table(rows);
	}

	if (groupBy !== 'publisher') {
		throw new TypeError('invalid groupBy provided');
	}

	const sorted = Array.from(cache).sort(bySize);
	const rows = [
		['publisher', 'count', 'packages'].map(grayBold),
	].concat(sorted.map(([k, v]) => [
		colors.blue(k),
		colors.bold(v.size),
		colors.green(uniq(Array.from(v.values())
			.sort(({ name: a, version: vA }, { name: b, version: vB }) => a.localeCompare(b) || semverCmp(vB, vA))
			.map(specifierify)).join('\n')),
	]));

	return table(rows);

};
