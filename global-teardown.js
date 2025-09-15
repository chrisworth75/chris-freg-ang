// Global teardown to ensure video files are properly finalized
module.exports = async () => {
  // Give browser contexts time to finalize video recording
  console.log('🎬 Waiting for video finalization...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ Video teardown complete');
};