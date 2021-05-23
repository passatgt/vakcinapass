import { createPass } from 'passkit-generator';
import path from 'path';
import { v4 as randomUUID } from 'uuid';

const generatePass = async ({ firstName, lastName, idNumber, cardNumber, qr }) => {
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
			serialNumber: randomUUID(),
			"logoText": i18n.title[language],
			"organizationName": i18n.title[language],
			"description": i18n.title[language],
		},
		shouldOverwrite: true,
	});

	pass.barcodes({
		message: qr,
		format: 'PKBarcodeFormatQR',
	});

	function setLabels(field) {
		field.label = i18n[field.key][language]
		return field
	}

	pass.primaryFields = [
		{
			key: 'cardNumber',
			value: cardNumber,
		},
	].map(setLabels);

	pass.secondaryFields = [
		{
			key: 'name',
			value: lastName+' '+firstName,
		},
		
	].map(setLabels);

	pass.auxiliaryFields = [
		shotDate && {
			key: 'shotdate',
			value: shotDate,
		},
		{
			key: 'idnumber',
			value: idNumber,
		},
		passportNumber && {
			key: 'passportnumber',
			value: passportNumber,
		},
	].filter(e=>e).map(setLabels);

	return pass.generate();
};

export default generatePass;

const i18n = {
	title: {
		hu: 'Védettségi igazolvány',
		en: 'Immunity Certificate'
	},
	cardNumber: {
		hu: 'A kártya sorszáma',
		en: 'Card Number'
	},
	name: {
		hu: 'Név',
		en: 'Name'
	},
	idnumber: {
		hu: 'Szig. szám',
		en: 'Identity card No.'
	},
	shotdate: {
		hu: 'Oltás ideje',
		en: 'Date of vaccination'
	},
	passportnumber: {
		hu: 'Útlevél szám',
		en: 'Passport No.'
	},
}