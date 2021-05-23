import Document, { Html, Main, Head, NextScript } from 'next/document';
import React from 'react';
import Meta from '../components/meta';

class VakcinaPass extends Document {
	render() {
		return (
			<Html lang="hu">
				<Head>
					<Meta />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default VakcinaPass;
