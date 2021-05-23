import generatePass from '../../lib/generate-pass';

export default async (request, response) => {
	try {
		const firstName = request.query.firstName;
		const lastName = request.query.lastName;
		const idNumber = request.query.idNumber;
		const cardNumber = request.query.cardNumber;
		const qr = request.query.qr;
		const pass = await generatePass({ firstName, lastName, idNumber, cardNumber, qr });
		const filename = firstName.toLowerCase();
		response.setHeader('Content-Type', 'application/vnd.apple.pkpass');
		response.setHeader('Content-Disposition', `attachment; filename=${filename}.pkpass`);
		response.send(pass);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
};
