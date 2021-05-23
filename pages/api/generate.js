import generatePass from '../../lib/generate-pass';

export default async (request, response) => {
	try {
		const firstName = request.body.firstName;
		const lastName = request.body.lastName;
		const idNumber = request.body.idNumber;
		const cardNumber = request.body.cardNumber;
		const passportNumber = request.body.passportNumber;
		const qr = request.body.qr;
		const pass = await generatePass({ firstName, lastName, idNumber, passportNumber, cardNumber, qr });
		const filename = firstName.toLowerCase();
		response.setHeader('Content-Type', 'application/vnd.apple.pkpass');
		response.setHeader('Content-Disposition', `attachment; filename=${filename}.pkpass`);
		response.send(pass);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
};
