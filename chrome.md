# Publishing to Chrome Web Store

To publish your Radio Stream Player extension to the Chrome Web Store, follow these steps and considerations:

## 1. Update Manifest Version

Update your `manifest.json` to use Manifest V3:

Key changes:
- `manifest_version` is now 3
- `browser_action` is replaced with `action`
- `background.scripts` is replaced with `background.service_worker`

## 2. Update Background Script

Modify your `background.js` to work as a service worker. This may involve changes to how you handle long-lived connections and state management.

## 3. Content Security Policy

Add a `content_security_policy` to your manifest if you're loading resources from external domains.

## 4. Icons

Ensure you have all required icon sizes:
- 16x16
- 32x32
- 48x48
- 128x128

## 5. Privacy Policy

Prepare a privacy policy and have a URL ready for it when submitting to the Chrome Web Store.

## 6. Screenshots and Promotional Images

- Prepare at least one screenshot of your extension in action
- Optionally, create promotional images for the Chrome Web Store listing

## 7. Description and Metadata

- Write a detailed description
- Choose appropriate categories
- Fill out all required fields in the Chrome Web Store Developer Dashboard

## 8. Testing

Thoroughly test your extension in Chrome to ensure it works as expected with the Manifest V3 changes.

## 9. Developer Account

- Create a Chrome Web Store developer account if you haven't already
- Pay the one-time registration fee

## 10. Package Your Extension

Create a ZIP file of your extension's directory for uploading to the Chrome Web Store.

## Final Steps

After completing these preparations, submit your extension to the Chrome Web Store for review. Be prepared for the review process to take some time, and you may need to make additional adjustments based on feedback from the Chrome Web Store team.