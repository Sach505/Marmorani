/**
 * Texture Compression Script
 * 
 * Compresses all PNG textures in /public/textures/ to reduce file size.
 * Uses Sharp (already included with Next.js) for lossless/near-lossless compression.
 * 
 * Run with: node scripts/compress-textures.mjs
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const TEXTURES_DIR = './public/textures';

async function getFilesRecursively(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFilesRecursively(fullPath));
    } else if (extname(entry.name).toLowerCase() === '.png') {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function compressImage(filePath) {
  const originalSize = await getFileSize(filePath);
  
  // Read and compress the image
  const image = sharp(filePath);
  const metadata = await image.metadata();
  
  // Compress PNG with high quality
  const compressed = await image
    .png({
      compressionLevel: 9,      // Max compression
      palette: false,           // Keep true color for textures
      quality: 90,              // High quality
      effort: 10,               // Max effort for smallest file
    })
    .toBuffer();
  
  // Only save if smaller
  if (compressed.length < originalSize) {
    await sharp(compressed).toFile(filePath);
    const newSize = await getFileSize(filePath);
    return { originalSize, newSize, saved: originalSize - newSize };
  }
  
  return { originalSize, newSize: originalSize, saved: 0 };
}

async function main() {
  console.log('🖼️  Texture Compression Script\n');
  console.log(`📁 Scanning: ${TEXTURES_DIR}\n`);
  
  const files = await getFilesRecursively(TEXTURES_DIR);
  console.log(`Found ${files.length} PNG files\n`);
  
  let totalOriginal = 0;
  let totalNew = 0;
  let totalSaved = 0;
  
  for (const file of files) {
    const relativePath = file.replace('./public/', '');
    process.stdout.write(`Compressing ${relativePath}... `);
    
    try {
      const result = await compressImage(file);
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      totalSaved += result.saved;
      
      if (result.saved > 0) {
        const percent = ((result.saved / result.originalSize) * 100).toFixed(1);
        console.log(`✅ ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (-${percent}%)`);
      } else {
        console.log(`⏭️  Already optimized`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Original: ${formatBytes(totalOriginal)}`);
  console.log(`   Compressed: ${formatBytes(totalNew)}`);
  console.log(`   Saved: ${formatBytes(totalSaved)} (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));
  
  if (totalNew > 60 * 1024 * 1024) {
    console.log('\n⚠️  Still over 60MB budget. Consider:');
    console.log('   - Reducing resolution of normal/diffuse maps');
    console.log('   - Converting preview/hero to JPEG');
  } else {
    console.log('\n✅ Within 60MB texture budget!');
  }
}

main().catch(console.error);

