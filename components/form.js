import React, { Component, useState, useRef } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import classNames from "classnames";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false});
const Popup = dynamic(() => import("reactjs-popup"), { ssr: false});

const Form = () => {
	const router = useRouter()
	const [lastName, setLastName] = useState('');
	const handleLastNameChange = event => setLastName(event.target.value);
	const lastNameSettings = {
		value: lastName,
		onChange: handleLastNameChange,
		placeholder: 'Vezetéknév',
	};

	const [firstName, setFirstName] = useState('');
	const handleFirstNameChange = event => setFirstName(event.target.value);
	const firstNameSettings = {
		value: firstName,
		onChange: handleFirstNameChange,
		placeholder: 'Keresztnév',
	};

	const [cardNumber, setCardNumber] = useState('');
	const handleCardNumberChange = event => setCardNumber(event.target.value);
	const cardNumberSettings = {
		value: cardNumber,
		onChange: handleCardNumberChange,
		placeholder: 'A kártya sorszáma',
	};

	const [idNumber, setIDNumber] = useState('');
	const handleIDNumberChange = event => setIDNumber(event.target.value);
	const idNumberSettings = {
		value: idNumber,
		onChange: handleIDNumberChange,
		placeholder: 'Személyazonosító igazolvány száma',
	};

	const handleScan = data => {
    if (data) {
      setQR({
        result: data
      })
			closeModal()
    }
  }
  const handleError = err => {
    alert(err);
  }

	const handleSubmit = evt => {
    evt.preventDefault();
		var valid = true;
		var fields = [lastName, firstName, cardNumber, idNumber, qr.result];
		var fieldIds = ['lastName', 'firstName', 'cardNumber', 'idNumber', 'qrCodeField'];

		fields.forEach((field, i) => {
			if(field == '') {
				valid = false
				document.getElementById(fieldIds[i]).classList.add('shake');
			}
		});

		setTimeout(function(){
			fieldIds.forEach((item, i) => {
				document.getElementById(item).classList.remove('shake');
			});
		}, 500);

		if(valid) {

			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({firstName: firstName, lastName: lastName, idNumber: idNumber, cardNumber: cardNumber, qr: qr.result})
			};
			fetch('/api/generate', requestOptions)
				.then((res) => {
					return res.blob();
				})
				.then((blob) => {
					const href = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = href;
					link.setAttribute('download', firstName.toLowerCase()+'pass.pkpass'); //or any other extension
					document.body.appendChild(link);
					link.click();
				})
				.catch((err) => {
					return Promise.reject({ Error: 'Something Went Wrong', err });
				})
		}

  };

	const [qr, setQR] = useState({result: ''});
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);

	return (
		<form onSubmit={handleSubmit}>
			<p className={classNames({ valid: (lastName != '') })}>
				<input id="lastName" type="text" {...lastNameSettings} />
			</p>
			<p className={classNames({ valid: (firstName != '') })}>
				<input id="firstName" type="text" {...firstNameSettings} />
			</p>
			<p className={classNames({ valid: (idNumber != '') })}>
				<input id="idNumber" type="text" {...idNumberSettings} />
			</p>
			<p className={classNames({ valid: (cardNumber != '') })}>
				<input id="cardNumber" type="text" {...cardNumberSettings} />
			</p>
			<div className={classNames({ 'qr-code-input': true, valid: (qr.result != '') })}>
				<div id="qrCodeField">
					<span>QR kód</span>
					<button type="button" onClick={() => setOpen(o => !o)}>Beolvasás kamerával</button>
					<Popup open={open} closeOnDocumentClick onClose={closeModal}>
						<QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
						<small>Olvasd be a védettségi igazolványodon lévő QR kódot a telefonoddal</small>
				  </Popup>
				</div>
				<small>Olvasd be a védettségi igazolványodon lévő QR kódot a telefonoddal</small>
			</div>
			<p className="submit">
				<button type="submit">Hozzáadás a Wallet-hez</button>
			</p>
		</form>
	);
};

export default Form;
