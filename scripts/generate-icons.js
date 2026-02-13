#!/usr/bin/env node

/**
 * Script to generate PNG icons from SVG
 *
 * Usage:
 * 1. Install sharp: npm install --save-dev sharp
 * 2. Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  try {
    // Try to load sharp, if not available, provide instructions
    let sharp;
    try {
      sharp = require('sharp');
    } catch (err) {
      console.log('⚠️  sharp not found. To generate PNG icons, run:');
      console.log('   npm install --save-dev sharp');
      console.log('   node scripts/generate-icons.js');
      console.log('\nAlternatively, you can use the SVG icon which is already configured.');
      return;
    }

    const svgPath = path.join(__dirname, '..', 'public', 'icons', 'icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate 192x192
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'icons', 'icon-192.png'));

    // Generate 512x512
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'icons', 'icon-512.png'));

    console.log('✅ PNG icons generated successfully!');
    console.log('   - icon-192.png');
    console.log('   - icon-512.png');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('\nThe SVG icon is already configured and will work as a fallback.');
  }
}

generateIcons();
