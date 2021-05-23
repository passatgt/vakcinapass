import generatePass from '../../lib/generate-pass';

export default async (request, response) => {
	try {
		const { firstName, lastName, idNumber, cardNumber, qr, passportNumber, shotDate, icon, language } = request.body;

		const pass = await generatePass({ firstName, lastName, idNumber, cardNumber, qr, passportNumber, shotDate, icon, language });
		const filename = firstName.toLowerCase();
		response.setHeader('Content-Type', 'application/vnd.apple.pkpass');
		response.setHeader('Content-Disposition', `attachment; filename=${filename}.pkpass`);
		response.send(pass);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
};
