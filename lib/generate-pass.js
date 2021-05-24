import { createPass } from 'passkit-generator';
import { getModelFolderContents } from 'passkit-generator/lib/parser';
import path from 'path';
import { v4 as randomUUID } from 'uuid';

async function generateModel({ icon }) {
	const { bundle } = await getModelFolderContents(path.resolve('./models/immunity.pass'));

	if (icon === 'country') {
		bundle['logo.png'] = bundle['logo-hun.png'];
		bundle['logo@2x.png'] = bundle['logo-hun@2x.png'];
		bundle['logo@3x.png'] = bundle['logo-hun@3x.png'];
	}
	return bundle;
}

const generatePass = async ({ firstName, lastName, idNumber, cardNumber, qr, passportNumber, shotDate, icon, language }) => {
	const pass = await createPass({
		model: await generateModel({ icon }),
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
		}
	].map(setLabels);

	pass.secondaryFields = [
		{
			key: 'name',
			value: lastName+' '+firstName,
		},
		{
			key: 'idnumber',
			value: idNumber,
		}
	].map(setLabels);

	pass.auxiliaryFields = [
		passportNumber && {
			key: 'passportnumber',
			value: passportNumber,
		},
		shotDate && {
			key: 'shotdate',
			value: shotDate,
		}
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
	}
}
