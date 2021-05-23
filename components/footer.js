import Link from 'next/link'

const Footer = () => {
	return (
		<footer>
			<p>Ez a weboldal nem tárol és kezel adatot, de azért itt van a kötelező <Link href="/adatvedelmi-nyilatkozat"><a>adatvédelmi nyilatkozat</a></Link>. A forráskód elérhető a <a href="#">Github</a>-on. Ha tetszik, nézd meg a <a href="https://itunes.apple.com/hu/app/heart-reports/id1448243870" target="_blank">❤️ Heart Reports</a> appomat is. Kapcsolatba léphetsz velem az <a href="mailto:info@visztpeter.me">info@visztpeter.me</a> címen.</p>
		</footer>
	);
};

export default Footer;
