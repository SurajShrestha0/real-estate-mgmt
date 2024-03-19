# Fetch Addons

> A collection of addons for the fetch API.

## Install

```sh
npm install fetch-addons
```

## Usage

```js
import * as addons from 'fetch-addons';
```

### toCurl

Serializes a `Request` object to a cURL command. Handy for logging and replaying failed requests.

```js
import { toCurl } from 'fetch-addons';

// fetch(input, init)
toCurl(input, init);
toCurl(request);

// curl --url https://example.com \
//   --request POST \
//   --header 'content-type: application/json' \
//   --data '{"foo":"bar"}'`
```

### getRequest

Get a `Request` object from `RequestInit`.

```js
import { getRequest } from 'fetch-addons';

// fetch(input, init);
const request = getRequest(input, init);
const request = getRequest(request);
```

### getHeaders

Get a `Headers` object from `HeadersInit`.

```js
import { getHeaders } from 'fetch-addons';

// fetch(input, init);
const headers = getHeaders(init.headers);

fetch('https://example.com').then((response) => {
	const headers = getHeaders(response.headers);
});
```

### deleteEmptyHeaders

Delete empty headers from a `Headers` object.

```js
import { deleteEmptyHeaders } from 'fetch-addons';

const request = new Request('https://example.com', {
	headers: {
		'content-type': 'application/json',
		'x-1': '',
		'x-2': 'undefined',
		'x-3': 'null',
	},
});

deleteEmptyHeaders(request.headers);
// Headers { 'content-type': 'application/json' }
```
