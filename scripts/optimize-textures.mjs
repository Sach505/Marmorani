/**
 * Aggressive Texture Optimization Script
 * 
 * Converts preview/hero to JPEG and applies stronger compression.
 * Target: Under 60MB total.
 * 
 * Run with: node scripts/optimize-textures.mjs
 */

import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const TEXTURES_DIR = './public/textures';

async function getFilesRecursively(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFilesRecursively(fullPath));
    } else if (['.png', '.jpg', '.jpeg'].includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function getFileSize(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function optimizeImage(filePath) {
  const originalSize = await getFileSize(filePath);
  const fileName = basename(filePath, extname(filePath));
  const dir = dirname(filePath);
  
  const image = sharp(filePath);
  const metadata = await image.metadata();
  
  // Determine optimization strategy based on file type
  const isPreviewOrHero = ['preview', 'hero'].includes(fileName);
  const isNormalOrRoughness = ['normal', 'roughness'].includes(fileName);
  
  let outputPath = filePath;
  let buffer;
  
  if (isPreviewOrHero) {
    // Convert to JPEG for preview/hero (much smaller, quality loss acceptable)
    outputPath = join(dir, `${fileName}.jpg`);
    buffer = await image
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
  } else if (isNormalOrRoughness) {
    // Strong PNG compression for normal/roughness maps
    // Reduce to 1024px if larger (acceptable for these technical maps)
    let pipeline = image;
    if (metadata.width > 1024 || metadata.height > 1024) {
      pipeline = pipeline.resize(1024, 1024, { fit: 'cover' });
    }
    buffer = await pipeline
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 80 })
      .toBuffer();
  } else {
    // Diffuse: keep quality but compress more aggressively
    buffer = await image
      .png({ compressionLevel: 9, effort: 10, quality: 85 })
      .toBuffer();
  }
  
  // Delete original PNG if converting to JPEG
  if (outputPath !== filePath && filePath.endsWith('.png')) {
    await unlink(filePath);
  }
  
  await sharp(buffer).toFile(outputPath);
  const newSize = await getFileSize(outputPath);
  
  return { 
    originalPath: filePath,
    outputPath,
    originalSize, 
    newSize, 
    saved: originalSize - newSize,
    converted: outputPath !== filePath
  };
}

async function main() {
  console.log('🚀 Aggressive Texture Optimization\n');
  console.log(`📁 Scanning: ${TEXTURES_DIR}\n`);
  console.log('Strategy:');
  console.log('  - preview/hero → JPEG 85% (smaller, acceptable quality)');
  console.log('  - normal/roughness → Resize to 1024px + strong compression');
  console.log('  - diffuse → Strong PNG compression\n');
  
  const files = await getFilesRecursively(TEXTURES_DIR);
  console.log(`Found ${files.length} image files\n`);
  
  let totalOriginal = 0;
  let totalNew = 0;
  let conversions = 0;
  
  for (const file of files) {
    const relativePath = file.replace('./public/', '');
    process.stdout.write(`Optimizing ${relativePath}... `);
    
    try {
      const result = await optimizeImage(file);
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      
      if (result.converted) {
        conversions++;
        const percent = ((result.saved / result.originalSize) * 100).toFixed(1);
        console.log(`🔄 → ${basename(result.outputPath)} (${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)}, -${percent}%)`);
      } else if (result.saved > 0) {
        const percent = ((result.saved / result.originalSize) * 100).toFixed(1);
        console.log(`✅ ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (-${percent}%)`);
      } else {
        console.log(`⏭️  Already optimized`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  const totalSaved = totalOriginal - totalNew;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Original: ${formatBytes(totalOriginal)}`);
  console.log(`   Optimized: ${formatBytes(totalNew)}`);
  console.log(`   Saved: ${formatBytes(totalSaved)} (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`   Conversions: ${conversions} files converted to JPEG`);
  console.log('='.repeat(60));
  
  if (totalNew > 60 * 1024 * 1024) {
    console.log(`\n⚠️  Still ${formatBytes(totalNew - 60 * 1024 * 1024)} over budget.`);
  } else {
    console.log('\n✅ Within 60MB texture budget!');
  }
}

main().catch(console.error);

