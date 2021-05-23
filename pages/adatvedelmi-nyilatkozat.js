import Layout from '../components/layout';
import Link from 'next/link';

const PrivacyPolicy = () => {
	return (
		<Layout>
			<Link href="/"><h1>Adatvédelmi nyilatkozat</h1></Link>
			<p>Az oldal nem hoz létre sütiket és nem tartalmaz más oldalról beágyazott tartalmat.</p>
			<p>Az oldalon megadott személyes adatokat nem tárolom és nem továbbítom sehova.</p>
			<p>Szerveroldali feldolgozás szükséges ahhoz, hogy a Wallet-hez kompatibilis fájlt lehessen generálni, de ez sem tárolja, vagy továbbítja az adatot.</p>
			<p>A forráskód elérhető a láblécben lévő Github linken.</p>
		</Layout>
	);
};

export default PrivacyPolicy;
