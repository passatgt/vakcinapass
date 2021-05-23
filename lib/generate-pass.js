import { createPass } from 'passkit-generator';
import path from 'path';
const { randomUUID } = require('crypto');

const generatePass = async ({ firstName, lastName, idNumber, cardNumber, qr }) => {
	console.log(process.env);
	const pass = await createPass({
		model: path.resolve('./models/immunity.pass'),
		certificates: {
			wwdr: Buffer.from(process.env.WWDR, 'base64').toString(),
			signerCert: Buffer.from(process.env.SIGNERCERT, 'base64').toString(),
			signerKey: {
				keyFile: Buffer.from(process.env.SIGNERKEY, 'base64').toString(),
				passphrase: process.env.PASS_KEY_PASSPHRASE,
			},
		},
		overrides: {
			serialNumber: randomUUID()
		},
		shouldOverwrite: true,
	});

	pass.barcodes({
		message: qr,
		format: 'PKBarcodeFormatQR',
	});

	pass.primaryFields = [
		{
			key: 'cardNumber',
			label: 'A kártya sorszáma',
			value: cardNumber,
		},
	];

	pass.secondaryFields = [
		{
			key: 'name',
			label: 'Név',
			value: lastName+' '+firstName,
		},
		{
			key: 'idnumber',
			label: 'Szig. szám',
			value: idNumber,
		},
	];

	return pass.generate();
};

export default generatePass;
