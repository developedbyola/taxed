import argon2 from 'argon2';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function verifyPassword(hash) {
  try {
    const password = await new Promise((resolve) => {
      rl.question('Enter password to verify: ', resolve);
    });

    const isValid = await argon2.verify(hash, password);
    console.log(isValid ? '✅ Password is valid!' : '❌ Invalid password!');
    return isValid;
  } catch (err) {
    console.error('Error verifying password:', err);
    return false;
  } finally {
    rl.close();
  }
}

async function generateHash() {
  try {
    const password = 'Sunshine99$'; // Default password for demo
    const hash = await argon2.hash(password);

    console.log('Generated hash:');
    console.log(hash);

    console.log('\nVerifying the password...');
    await verifyPassword(hash);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

generateHash();
verifyPassword(
  '$argon2id$v=19$m=65536,t=3,p=4$8DsTC9RMIe0LAlkt8ZRmpw$5YcrogI3SpPDSaEbg1BHDwxw0GeJLo01P160gGo11H8'
);
