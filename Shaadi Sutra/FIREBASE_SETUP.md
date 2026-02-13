# How to Connect Firebase to Shaadi Sutra

Follow these steps to set up your free Firebase project and connect it to this application.

## 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** or **"Create a project"**.
3.  Enter a project name (e.g., `shaadi-sutra`) and click **Continue**.
4.  (Optional) Disable Google Analytics for now (simplifies setup), then click **Create project**.
5.  Wait for the project to be created and click **Continue**.

## 2. Register Your App
**(If you skipped this, scroll down to "Troubleshooting: I missed the config step!")**

1.  In the project overview page, click the **Web icon** (</>) under "Get started by adding Firebase to your app".
2.  Enter an App nickname (e.g., `Wedding Web App`).
3.  Click **Register app**.
4.  **Copy the `firebaseConfig` object keys**. You will see a code block with `apiKey`, `authDomain`, etc. Keep this page open or copy these values.

## 3. Enable Authentication
1.  In the left sidebar, click on **Build** > **Authentication**.
2.  Click **Get started**.
3.  **Email/Password**:
    *   Select **Email/Password** from the Sign-in method tab.
    *   Toggle **Enable** and click **Save**.
4.  **Google**:
    *   Click **Add new provider** and select **Google**.
    *   Toggle **Enable**. Select a support email for the project, then click **Save**.

## 4. Enable Firestore Database
1.  In the left sidebar, click on **Build** > **Firestore Database**.
2.  Click **Create database**.
3.  Choose a location (e.g., `us-central1` or based on your region) and click **Next**.
4.  Select **Start in test mode** (easier for development) and click **Create**.

## 5. Connect to Your Local App
1.  Open the file `.env.local` in your project root.
2.  Replace the placeholder values with the keys you copied in Step 2.

Example `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shaadi-sutra-123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shaadi-sutra-123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shaadi-sutra-123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 6. Restart Server
1.  Stop the running server (Ctrl+C).
2.  Run `npm run dev` again to load the new environment variables.

---

## Troubleshooting

### I missed the config step!
If you created the project but didn't copy the configuration keys:
1.  In the Firebase Console, click the **Gear icon (Settings)** next to "Project Overview".
2.  Select **Project settings**.
3.  Scroll down to the **"Your apps"** card.
    *   **If you see no apps:** Click the `</>` icon to register a new web app (Step 2 above).
    *   **If you see your app:** Select "Config" under "SDK setup and configuration".
4.  Copy the values from `const firebaseConfig = { ... }` and paste them into your `.env.local` file.

### Error: `auth/operation-not-allowed`
This means you haven't enabled the **Email/Password** sign-in method.
1.  Go to **Build** > **Authentication** in the Firebase Console.
2.  Click the **Sign-in method** tab.
3.  Click on **Email/Password**.
4.  Make sure the **Enable** toggle is on.
5.  Click **Save**.

### Error: `Missing or insufficient permissions` (Firestore)
This means your database security rules are blocking the write operation.
1.  Go to **Build** > **Firestore Database**.
2.  Click the **Rules** tab.
3.  Replace the rules with this code to allow any authenticated user to read/write:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
4.  Click **Publish**.
