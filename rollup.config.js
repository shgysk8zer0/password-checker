import {terser} from 'rollup-plugin-terser';
export default {
	input: 'js/index.js',
	output: {
		file: 'js/index.min.js',
		format: 'iife',
		plugins: [
			terser(),
		],
		sourcemap: true,
	}
};
