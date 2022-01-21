# ls-publishers <sup>[![Version Badge][2]][1]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][5]][6]
[![dev dependency status][7]][8]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][11]][1]

List your dependency graph, grouped by publishers.

## Example

### CLI

```console
> ls-publishers
`node_modules` found; loading tree from disk...
┌────────────────┬───────┬──────────────────────────────────────────┐
│ publisher      │ count │ packages                                 │
├────────────────┼───────┼──────────────────────────────────────────┤
│ alice          │ 3     │ a@1.0.0                                  │
│                │       │ b@1.0.1                                  │
│                │       │ c@1.1.1                                  │
├────────────────┼───────┼──────────────────────────────────────────┤
│ bob            │ 2     │ d@1.2.5                                  │
│                │       │ e@1.0.2                                  │
└────────────────┴───────┴──────────────────────────────────────────┘
```

```console
> publishers publishers --json
{
	"alice": [
		{
			"name": "a",
			"publisher": {
				"name": "alice",
				"email": "alice@example.com"
			},
			"version": "1.1.0"
		},
		{
			"name": "b",
			"publisher": {
				"name": "alice",
				"email": "alice@example.com"
			},
			"version": "1.0.1"
		},
		{
			"name": "c",
			"publisher": {
				"name": "alice",
				"email": "alice@example.com"
			},
			"version": "1.1.1"
		},
	],
	"bob": [
		{
			"name": "d",
			"publisher": {
				"name": "bob",
				"email": "bob@example.com"
			},
			"version": "1.2.5"
		},
		{
			"name": "e",
			"publisher": {
				"name": "bob",
				"email": "bob@example.com"
			},
			"version": "1.0.2"
		}
	]
}
```

### API
```js
const assert = require('assert');
const listPublishers = require('ls-publishers');

listPublishers('publishers').then(({ byPackage, byPublisher }) => {
	assert.deepEqual(
		byPublisher,
		new Map([
			['alice', new Set([
				{
					"name": "a",
					"publisher": {
						"name": "alice",
						"email": "alice@example.com"
					},
					"version": "1.1.0"
				},
				{
					"name": "b",
					"publisher": {
						"name": "alice",
						"email": "alice@example.com"
					},
					"version": "1.0.1"
				},
				{
					"name": "c",
					"publisher": {
						"name": "alice",
						"email": "alice@example.com"
					},
					"version": "1.1.1"
				},
			])],
			['bob', new Set([
				{
					"name": "d",
					"publisher": {
						"name": "bob",
						"email": "bob@example.com"
					},
					"version": "1.2.5"
				},
				{
					"name": "e",
					"publisher": {
						"name": "bob",
						"email": "bob@example.com"
					},
					"version": "1.0.2"
				}
			])],
		])
	);
}).catch((e) => {
	console.error(e);
	process.exit(1);
});
```

[1]: https://npmjs.org/package/ls-publishers
[2]: https://versionbadg.es/ljharb/ls-publishers.svg
[5]: https://david-dm.org/ljharb/ls-publishers.svg
[6]: https://david-dm.org/ljharb/ls-publishers
[7]: https://david-dm.org/ljharb/ls-publishers/dev-status.svg
[8]: https://david-dm.org/ljharb/ls-publishers?type=dev
[11]: https://nodei.co/npm/ls-publishers.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/ls-publishers.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/ls-publishers.svg
[downloads-url]: https://npm-stat.com/charts.html?package=ls-publishers
[codecov-image]: https://codecov.io/gh/ljharb/ls-publishers/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/ls-publishers/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/ls-publishers
[actions-url]: https://github.com/ljharb/ls-publishers/actions
