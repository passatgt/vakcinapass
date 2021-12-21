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

const generatePass = async ({ firstName, lastName, idNumber, cardNumber, qr, passportNumber, shot, shotDate, shotDateSecond, boosterShot, boosterShotDate, icon, language }) => {
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
		if(!field.label) {
			field.label = i18n[field.key][language]
		}
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
		{
			key: 'idnumber',
			value: idNumber,
		},
		passportNumber && {
			key: 'passportnumber',
			value: passportNumber,
		},
	].filter(e=>e).map(setLabels);

	if(shot && shotDate && shotDateSecond && boosterShot && boosterShotDate) {
		pass.auxiliaryFields = [,
			{
				key: 'shotdate',
				value: shotDate + i18n['and'][language] + shotDateSecond,
				label: i18n['first_two'][language]+' ('+shotTypes[language][shot]+')'
			},
			{
				key: 'boostershotdate',
				value: shotTypes[language][boosterShot] + ' - ' + boosterShotDate,
			},
		].filter(e=>e).map(setLabels);
	} else {
		pass.auxiliaryFields = [,
			shot && {
				key: 'shot',
				value: shotTypes[language][shot],
			},
			shotDate && {
				key: 'shotdate',
				value: shotDate,
			},
			shotDateSecond && {
				key: 'shotdatesecond',
				value: shotDateSecond,
			}
		].filter(e=>e).map(setLabels);

	}

	return pass.generate();
};

export default generatePass;

const shotTypes = {
	hu: {
		pfizer: 'Pfizer',
		moderna: 'Moderna',
		sputnik: 'Szputnyik',
		astra: 'AstraZeneca',
		sinopharm: 'Sinopharm',
		janssen: 'Janssen'
	},
	en: {
		pfizer: 'Pfizer',
		moderna: 'Moderna',
		sputnik: 'Sputnik',
		astra: 'AstraZeneca',
		sinopharm: 'Sinopharm',
		janssen: 'Janssen'
	}
}

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
		hu: 'Első oltás',
		en: 'First vaccination'
	},
	shotdatesecond: {
		hu: 'Második',
		en: 'Second vaccination'
	},
	shot: {
		hu: 'Vakcina típusa',
		en: 'Type of vaccine'
	},
	boostershot: {
		hu: 'Emlékeztető oltás típusa',
		en: 'Type of booster vaccine'
	},
	boostershotdate: {
		hu: 'Emlékeztető',
		en: 'Booster'
	},
	passportnumber: {
		hu: 'Útlevél szám',
		en: 'Passport No.'
	},
	and: {
		hu: ' és ',
		en: ' &'
	},
	first_two: {
		hu: 'Első két oltás',
		en: 'First two vaccine'
	}
}
