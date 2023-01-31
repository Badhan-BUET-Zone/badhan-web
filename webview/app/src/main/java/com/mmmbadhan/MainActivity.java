package com.mmmbadhan;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebBackForwardList;
import android.webkit.WebHistoryItem;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.fragment.app.FragmentActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends FragmentActivity {
    private WebView mWebView;
    private static final String baseURL=BuildConfig.DEBUG?WrapperConfig.developmentBaseURL:WrapperConfig.productionBaseURL;
    private static final String noInternetHTML = "file:///android_asset/landing.html";
    private SwipeRefreshLayout mySwipeRefreshLayout;
    private static String appendBase(String subdomain) {
        return baseURL+subdomain;
    }

    @SuppressLint({"MissingInflatedId", "SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = (WebView) findViewById(R.id.webView);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS);
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        webSettings.setEnableSmoothTransition(true);
        WebViewClient webViewClient = new MyWebViewClient();

        mWebView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        mWebView.setWebViewClient(webViewClient);
        webSettings.setUserAgentString("Mozilla/5.0 (Linux; U;` Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17");
        loadCorrectUrl();

        mWebView.addJavascriptInterface(new Object()
        {
            @JavascriptInterface
            public void redirect()
            {
                mWebView.post(new Runnable() {
                    @Override
                    public void run() {
                        loadCorrectUrl();

                    }
                });
            }
        }, "browser");
    }

    private void loadCorrectUrl() {
        if (!DetectConnection.checkInternetConnection(this)) {
            mWebView.loadUrl(noInternetHTML);
        } else {
            mWebView.loadUrl(appendBase("/"));
        }
    }

    private class MyWebViewClient extends WebViewClient {
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            final Uri uri = Uri.parse(url);
            return handleUri(uri);
        }

        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            final Uri uri = request.getUrl();
            return handleUri(uri);
        }

        public boolean handleUri(final Uri uri) {
            final String host = uri.getHost();
            final String scheme = uri.getScheme();
            if (host.contains(baseURL)) {
                return false;
            } else {
                final Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
                return true;
            }
        }
    }


    boolean doubleBackToExitPressedOnce = false;

    @Override
    public void onBackPressed() {
        WebBackForwardList mWebBackForwardList = mWebView.copyBackForwardList();
        // int currIndex = mWebBackForwardList.getCurrentIndex();
        // WebHistoryItem item = mWebBackForwardList.getItemAtIndex(currIndex - 1);
        WebHistoryItem currentItem = mWebBackForwardList.getCurrentItem();

        if(currentItem.getUrl().equals(noInternetHTML)){
            super.onBackPressed();
            return;
        }

        boolean isPageExitable = false;
        for(String exitURL: WrapperConfig.listOfURLsForClosingApp){
            if(currentItem.getUrl().equals(appendBase(exitURL))){
                isPageExitable = true;
                break;
            }
        }

        if(!isPageExitable){
            mWebView.goBack();
            return;
        }

        if (doubleBackToExitPressedOnce) {
            super.onBackPressed();
            return;
        }
        this.doubleBackToExitPressedOnce = true;
        Toast.makeText(this, "Please click BACK again to exit", Toast.LENGTH_SHORT).show();
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                doubleBackToExitPressedOnce=false;
            }
            }, WrapperConfig.backButtonWaitTimeForExit);
    }
}
