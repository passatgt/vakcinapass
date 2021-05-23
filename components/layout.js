import PropTypes from 'prop-types';
import Footer from './footer';

const Layout = ({ children }) => {
	return (
		<>
			<main>
				{children}
				<Footer />
			</main>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node,
};

export default Layout;
