import argon2 from 'argon2';

async function generateHash() {
  try {
    const hash = await argon2.hash('Sunshine99$');
    console.log(hash);
    process.exit(0);
  } catch (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
}

generateHash();
