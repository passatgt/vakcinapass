import Document, { Html, Main, Head, NextScript } from 'next/document';
import React from 'react';
import Meta from '../components/meta';

class VakcinaPass extends Document {
	render() {
		return (
			<Html lang="hu">
				<Head>
					<script
					dangerouslySetInnerHTML={{
						__html: `if (document.URL.substring(0,5) == 'https:') window.location.replace('https:' + document.URL.substring(5));`
					}}
					/>
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
