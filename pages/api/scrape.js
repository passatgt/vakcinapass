import cheerio from 'cheerio'

export default async (request, response) => {
	try {
		const { url } = request.body
		
		const page = await fetch(url, {
			mode: 'no-cors',
			headers: { 'Origin': 'https://www.eeszt.gov.hu/' }
		}).then(res => res.text())

		const $ = cheerio.load(page);

		const table = $('table .table-data')

		const parseColumn = (key) => {
			return $(`td:contains(${key})`, table).siblings().first().html()
		}

		const name = parseColumn('Név/Name:')
		const ni = name?.indexOf(' ')

		return response.json({
			lastName: name?.slice(0, ni),
			firstName: name?.slice(ni + 1),
			idNumber: parseColumn('Okmány azonosító/Personal identification:'),
			passportNumber: parseColumn('Útlevél szám/Passport number:'),
			shotDate: parseColumn('Oltás dátuma/Vaccination date:')
		})

	} catch (error) {
		response.status(500).json({ error: error.message });
	}
};