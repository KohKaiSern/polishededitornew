import { bin2hex, hex2bin } from '$lib/utils';

function checksumMon(fileHex: string[], address: number): string[] {
	// Start with 127
	let x = 127;

	// For bytes 0-31, add the value times (byte + 1)
	for (let byte = 0; byte <= 31; byte++) {
		x += parseInt(fileHex[address + byte], 16) * (byte + 1);
	}

	// For bytes 32-48, add the value of the lower 7 bits times (byte + 2)
	for (let byte = 32; byte <= 48; byte++) {
		x += (parseInt(fileHex[address + byte], 16) & 0x7f) * (byte + 2);
	}

	// Clamp to two bytes and convert to 16-bit binary string
	const bits = (x & 0xffff).toString(2).padStart(16, '0');

	// Write bits to MSBs of bytes 32-47
	for (let byte = 32; byte <= 47; byte++) {
		fileHex[address + byte] = bin2hex(bits[byte - 32] + hex2bin(fileHex[address + byte]).slice(1));
	}

	// Clear the MSB of byte 48
	fileHex[address + 48] = bin2hex('0' + hex2bin(fileHex[address + 48]).slice(1));

	return fileHex;
}
export default checksumMon;
