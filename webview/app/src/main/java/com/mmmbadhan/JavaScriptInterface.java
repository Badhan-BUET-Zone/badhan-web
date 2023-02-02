package com.mmmbadhan;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;

public class JavaScriptInterface {
    private static String fileMimeType;
    private final Context context;
    public JavaScriptInterface(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void getBase64FromBlobData(String base64Data) throws IOException {
        Log.d("base64Data ====> ", base64Data);
        convertBase64StringToFileAndStoreIt(base64Data);
    }

    public static String getBase64StringFromBlobUrl(String blobUrl,String mimeType) {
        if(blobUrl.startsWith("blob")){
            Log.d("base64Data ====> ", blobUrl);
            fileMimeType = mimeType;
            return "javascript: var xhr = new XMLHttpRequest();" +
                    "xhr.open('GET', '"+ blobUrl +"', true);" +
                    "xhr.setRequestHeader('Content-type','" + mimeType +";charset=UTF-8');" +
                    "xhr.responseType = 'blob';" +
                    "xhr.onload = function(e) {" +
                    "    if (this.status == 200) {" +
                    "        var blobFile = this.response;" +
                    "        var reader = new FileReader();" +
                    "        reader.readAsDataURL(blobFile);" +
                    "        reader.onloadend = function() {" +
                    "            base64data = reader.result;" +
                    "            Android.getBase64FromBlobData(base64data);" +
                    "        }" +
                    "    }" +
                    "};" +
                    "xhr.send();";
        }
        return "javascript: console.log('It is not a Blob URL');";
    }
    private void convertBase64StringToFileAndStoreIt(String base64csv) throws IOException {
        MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
        String extension = mimeTypeMap.getExtensionFromMimeType(fileMimeType);
        Log.d("mimetype ====> ", fileMimeType);
        Log.d("extension ====> ", extension);
        final File dwldsPath = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS) + "/badhan_" + System.currentTimeMillis() + ".csv");

        String regex = "^data:" + fileMimeType + ";base64,";
        byte[] csvAsBytes = Base64.decode(base64csv.replaceFirst(regex, ""), 0);
        try {
            FileOutputStream os = new FileOutputStream(dwldsPath);
            os.write(csvAsBytes);
            os.flush();
            os.close();
        } catch (Exception e) {
            Toast.makeText(context, "FAILED TO DOWNLOAD THE FILE!", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
        Toast.makeText(context, "FILE DOWNLOADED!", Toast.LENGTH_SHORT).show();
    }
}
