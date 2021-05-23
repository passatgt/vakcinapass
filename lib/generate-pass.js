import { createPass } from 'passkit-generator';
import path from 'path';
const { randomUUID } = require('crypto');

const generatePass = async ({ firstName, lastName, idNumber, passportNumber, cardNumber, qr }) => {
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
			label: 'label_cardNumber',
			value: cardNumber,
		},
	];

	pass.secondaryFields = [
		{
			key: 'name',
			label: 'label_name',
			value: lastName+' '+firstName,
		},
		{
			key: 'idnumber',
			label: 'label_idnumber',
			value: idNumber,
		},
	];

	if(passportNumber != '') {
		pass.secondaryFields.push({
			key: 'passportnumber',
			label: 'label_passport',
			value: passportNumber,
		})
	}

	pass.localize("hu", {
		label_cardNumber: 'A kártya sorszáma',
		label_name: 'Név',
		label_idnumber: 'Szig. szám',
		label_passport: 'Útlevél száma',
		title: 'Védettségi igazolvány',
		created: 'Készítette'
	});

	pass.localize("en", {
		label_cardNumber: 'Card Number',
		label_name: 'Name',
		label_idnumber: 'No. of id. card',
		label_passport: 'No. of passport',
		title: 'Immunity Certificate',
		created: 'Created with'
	});

	return pass.generate();
};

export default generatePass;
