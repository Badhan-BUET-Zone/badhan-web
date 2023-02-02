package com.mmmbadhan;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

public class JavaScriptInterface {
    private static String fileMimeType;
    private final Context context;
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            android.Manifest.permission.READ_EXTERNAL_STORAGE,
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
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
            Log.d("fileMimeType ====> ", mimeType);
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
    private String processExtensionFromFileType(){
        try{
            MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
            String extension = mimeTypeMap.getExtensionFromMimeType(fileMimeType);
            if(extension!=null){
                return extension;
            }
            String[] stringSplits = fileMimeType.split("/");
            if(stringSplits.length!=2){
                Toast.makeText(context, "ERROR: fileMimeType found "+fileMimeType, Toast.LENGTH_SHORT).show();
                return "txt";
            }
            extension = stringSplits[1].toLowerCase(Locale.ROOT);
            if(extension.length()<3 || extension.length()>4){
                Toast.makeText(context, "ERROR: Extension found "+extension, Toast.LENGTH_SHORT).show();
                return "txt";
            }
            return extension;
        }catch (Exception e) {
            Toast.makeText(context, "ERROR: Failed to process file extension", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
            return "txt";
        }
    }
    private void convertBase64StringToFileAndStoreIt(String base64file) throws IOException {
        String extension = processExtensionFromFileType();
        final File dwldsPath = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS) + "/badhan_" + System.currentTimeMillis() + "."+extension);

        String regex = "^data:" + fileMimeType + ";base64,";
        byte[] fileAsBytes = Base64.decode(base64file.replaceFirst(regex, ""), 0);
        try {
            FileOutputStream os = new FileOutputStream(dwldsPath);
            os.write(fileAsBytes);
            os.flush();
            os.close();
        } catch (Exception e) {
            Toast.makeText(context, "ERROR: FAILED TO DOWNLOAD THE FILE!", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
        Toast.makeText(context, "File downloaded", Toast.LENGTH_SHORT).show();
    }
    public static void verifyStoragePermissions(Activity activity) {
        // Check if we have write permission
        int permission = ActivityCompat.checkSelfPermission(activity, android.Manifest.permission.WRITE_EXTERNAL_STORAGE);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    activity,
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }
    }

    public static DownloadListener getDownloadListener(Activity activity, WebView webview) {
        return new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {

                webview.loadUrl(JavaScriptInterface.getBase64StringFromBlobUrl(url,"text/csv"));
            }
        };
    }
}
