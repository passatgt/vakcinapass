import { createPass } from 'passkit-generator';
import path from 'path';
const { randomUUID } = require('crypto');

const generatePass = async ({ firstName, lastName, idNumber, cardNumber, qr }) => {
	const pass = await createPass({
		model: path.resolve('./models/immunity.pass'),
		certificates: {
			wwdr: path.resolve('./certificates/wwdr.pem'),
			signerCert: path.resolve('./certificates/signerCert.pem'),
			signerKey: {
				keyFile: path.resolve('./certificates/signerKey.pem'),
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
