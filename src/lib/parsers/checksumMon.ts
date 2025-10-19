import { hex2bin } from '$lib/utils';

function checksumMon(fileHex: string[], address: number): string[] {
	// Start with 127
	let x: number | string = 127;

	// For bytes 0-31, add the value times (byte + 1)
	for (let byte = 0; byte <= 31; byte++) {
		x += parseInt(fileHex[address + byte], 16) * (byte + 1);
	}

	// For bytes 32-48, add the value of the lower 7 bits times (byte + 2)
	for (let byte = 32; byte <= 48; byte++) {
		x += parseInt(hex2bin(fileHex[address + byte]).slice(1), 2) * (byte + 2);
	}

	// Clamp to two bytes
	x = x & 65535;

	// Treat the two bytes as a series of bits
	x = x.toString(2).padStart(16, '0');

	// Write the most significant bit to byte 32's MSB
	// Continue with the 2nd most significant bit to byte 33's MSB
	// So on and so forth
	for (let byte = 32; byte <= 47; byte++) {
		let newByte = hex2bin(fileHex[address + byte]);
		newByte = x.at(byte - 32) + newByte.slice(1);
		fileHex[address + byte] = parseInt(newByte, 2).toString(16).padStart(2, '0').toUpperCase();
	}

	// Clear the MSB of byte 48 (since we only have 16 bits, not 17)
	let byte48 = hex2bin(fileHex[address + 48]);
	byte48 = '0' + byte48.slice(1); // Set MSB to 0
	fileHex[address + 48] = parseInt(byte48, 2).toString(16).padStart(2, '0').toUpperCase();

	return fileHex;
}
export default checksumMon;
