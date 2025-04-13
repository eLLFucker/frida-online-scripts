/*
Script hook ini dibuat untuk membuka full akses premium pada aplikasi Singapore VPN
Script ini membutuhkan frida gadget yang tertanam pada aplikasi untuk berjalan
Dibuat oleh eLL
Dibantu oleh GPT dan Grok
*/

Java.perform(() => {
    // ambil Log class buat debug ke logcat
    var Log = Java.use("android.util.Log");

    // ambil context aplikasi biar bisa akses shared preferences dll
    var context = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();

    // buat spoof android_id
    var SettingsSecure = Java.use("android.provider.Settings$Secure");

    // fungsi log custom dengan tag "eLLHooker"
    function sendLog(message) {
        Log.d("eLLHooker", message);
    }

    // fungsi buat spoof android_id biar keliatan kayak device premium
    function SpoofID() {
        try {
            SettingsSecure.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function (contentResolver, name) {
                if (name === "android_id") {
                    sendLog("Returning spoofed Android ID");
                    return "eLL Fucker";
                }
                return this.getString(contentResolver, name);
            };
            sendLog("SpoofID hook berhasil dijalankan.");
        } catch (e) {
            sendLog("Error pada SpoofID: " + e);
        }
    }

    // fungsi buat unlock akses premium lewat SharedPreferencesImpl hook
    function eLLXposedHook() {
        // isi data yang dipalsukan buat premium unlock
        var premiumPrefs = {
            "is_banner_ad": false,
            "payment_method": "GooglePlay",
            "premium_end_time": "2925-01-01T23:59:59.000Z",
            "is_premium": true,
            "is_native_ad": false,
            "is_rooted": "false",
            "unlock_by_ads": false,
            "is_banned": false,
            "first_ad_slot": false,
            "second_ad_slot": false,
            "is_interstitial_ad": false,
            "is_rewarded_ad": false,
            "register_time": "2025-01-01",
            "email": "ellmdz19@fucker",
            "name": "eLL Fucker",
            "premium_buy_time": "2025-01-01T23:59:59.000Z",
            "force_update": false,
            "maintenance": false,
            "refer_code": "Fucking Refer Code"
        };

        // ambil class SharedPreferencesImpl
        var SharedPreferencesImpl = Java.use("android.app.SharedPreferencesImpl");

        // intercept getBoolean dari sharedprefs
        SharedPreferencesImpl.getBoolean.overload('java.lang.String', 'boolean').implementation = function (key, defValue) {
            if (premiumPrefs.hasOwnProperty(key)) {
                sendLog("Intercept getBoolean: " + key + " => " + premiumPrefs[key]);
                return premiumPrefs[key];
            }
            return this.getBoolean(key, defValue);
        };

        // intercept getString dari sharedprefs
        SharedPreferencesImpl.getString.overload('java.lang.String', 'java.lang.String').implementation = function (key, defValue) {
            if (premiumPrefs.hasOwnProperty(key)) {
                sendLog("Intercept getString: " + key + " => " + premiumPrefs[key]);
                return premiumPrefs[key];
            }
            return this.getString(key, defValue);
        };

        sendLog("[*] Berhasil Unlock Full Premium Akses Singapore VPN");
        sendLog("[*] Hook Script by eLL");
    }

    // fungsi ini dijalankan hanya saat aplikasi pertama kali dibuka (first_open = true)
    function hookFirstOpen() {
        try {
            var SharedPreferences = Java.use("android.content.SharedPreferences");
            var Editor = Java.use("android.content.SharedPreferences$Editor");

            var fileName = "app_data"; // nama file shared prefs

            // akses sharedprefs app_data.xml
            var prefs = context.getSharedPreferences(fileName, 0);

            // cek apakah first_open masih true
            var isFirstOpen = prefs.getBoolean("first_open", true);
            sendLog("first_open: " + isFirstOpen);

            if (isFirstOpen) {
                // kalau first_open, langsung suntik config yang diinginkan
                var editor = prefs.edit();
                editor.putBoolean("first_open", false); // tandain udah pernah dibuka
                editor.putBoolean("settings.white_mode_switch", true); // aktifin white mode
                editor.putBoolean("settings.network_boost", true); // aktifin network boost
                editor.apply(); // commit perubahan
                sendLog("Injected first_open, white_mode_switch, network_boost ke app_data.xml");
            } else {
                sendLog("Udah bukan first open, skip injection.");
            }
        } catch (e) {
            sendLog("Error di hookFirstOpen: " + e);
        }
    }

    // eksekusi semua fungsi
    SpoofID();          // spoof android id
    eLLXposedHook();    // unlock premium
    hookFirstOpen();    // suntik config saat first open
});
