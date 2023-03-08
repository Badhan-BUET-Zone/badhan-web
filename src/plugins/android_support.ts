// TWA support
let isAndroidTwaSession: boolean
if (document.referrer.includes('android-app://com.mmmbadhan')) {
  isAndroidTwaSession = true;
  sessionStorage.setItem('has_android_twa_referrer', 'yes');
} else {
  isAndroidTwaSession = sessionStorage.getItem('has_android_twa_referrer') === 'yes';
}

export const getIsTWA = (): boolean => {
  return isAndroidTwaSession
}
