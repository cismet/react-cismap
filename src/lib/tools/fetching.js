import localforage from 'localforage';
const noCacheHeaders = new Headers();
// noCacheHeaders.append('pragma', 'no-cache');
// noCacheHeaders.append('cache-control', 'no-cache');

const noCacheInit = {
	method: 'GET',
	headers: noCacheHeaders
};

export const md5FetchJSON = async (prefix, uri) => {
	console.log('uri to fetch', uri);

	let md5 = await (await fetch(uri + '.md5', noCacheInit)).text();
	try {
		const md5InCache = await localforage.getItem('@' + prefix + '..' + uri + '.md5');
		if (md5InCache !== null && md5InCache === md5) {
			console.log('cache hit: ' + uri);
			const jsonStringInCache = await localforage.getItem('@' + prefix + '..' + uri);
			return new Promise((resolve, reject) => {
				resolve(JSON.parse(jsonStringInCache));
			});
		} else {
			console.log('cache miss' + uri);
			const data = await (await fetch(uri)).json();
			await localforage.setItem('@' + prefix + '..' + uri, JSON.stringify(data));
			await localforage.setItem('@' + prefix + '..' + uri + '.md5', md5);
			return new Promise((resolve, reject) => {
				resolve(data);
			});
		}
	} catch (e) {
		console.log('cache lookup error', e);
		const data = await (await fetch(uri)).json();
		return new Promise((resolve, reject) => {
			resolve(data);
		});
	}
};

export const cachedJSON = async (prefix, uri) => {
	console.log('uri to fetch from cache', uri);

	let md5 = await (await fetch(uri + '.md5', noCacheInit)).text();
	try {
		const jsonStringInCache = await localforage.getItem('@' + prefix + '..' + uri);
		return new Promise((resolve, reject) => {
			resolve(JSON.parse(jsonStringInCache));
		});
	} catch (e) {
		console.log('cache lookup error', e);
		const data = await (await fetch(uri)).json();
		return new Promise((resolve, reject) => {
			resolve(data);
		});
	}
};

export const fetchJSON = async (uri) => {
	const data = await (await fetch(uri)).json();
	return new Promise((resolve, reject) => {
		resolve(data);
	});
};

// export const cachedBase64Image = async (prefix,uri) => {
// 	console.log('uri to fetch from cache', uri);

// 	let md5 = await (await fetch(uri + '.md5', noCacheInit)).text();
// 	try {
// 		const jsonStringInCache = await localforage.getItem('@'+prefix+'.image.' + uri);
// 		return new Promise((resolve, reject) => {
// 			resolve(JSON.parse(jsonStringInCache));
// 		});
// 	} catch (e) {
// 		console.log('cache lookup error', e);
// 		const data = await (await fetch(uri)).json();
// 		return new Promise((resolve, reject) => {
// 			resolve(data);
// 		});
// 	}
// };

export const md5FetchText = async (prefix, uri) => {
	console.log('uri to fetch', uri);

	let md5 = await (await fetch(uri + '.md5', noCacheInit)).text();
	try {
		const md5InCache = await localforage.getItem('@' + prefix + '..' + uri + '.md5');
		if (md5InCache !== null && md5InCache === md5) {
			console.log('cache hit');
			const textStringInCache = await localforage.getItem('@' + prefix + '..' + uri);
			return new Promise((resolve, reject) => {
				resolve(textStringInCache);
			});
		} else {
			console.log('cache miss');
			const data = await (await fetch(uri)).text();
			await localforage.setItem('@' + prefix + '..' + uri, data);
			await localforage.setItem('@' + prefix + '..' + uri + '.md5', md5);
			return new Promise((resolve, reject) => {
				resolve(data);
			});
		}
	} catch (e) {
		console.log('cache lookup error', e);
		const data = await (await fetch(uri)).text();
		return new Promise((resolve, reject) => {
			resolve(data);
		});
	}
};
