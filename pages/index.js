import PropTypes from 'prop-types';
import Layout from '../components/layout';
import Form from '../components/form';

const Index = () => {
	return (
		<Layout>
			<h1>Védettségi igazolvány hozzáadása Apple Wallet-hez</h1>
			<p>Fontos! Ez nem egy hivatalos alkalmazás és fogalmam sincs, hogy elfogadják e ezt a típusú megoldást akárhol is.</p>
			<Form />
		</Layout>
	);
};

export default Index;
