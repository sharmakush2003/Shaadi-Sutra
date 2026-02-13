# How to Generate a Google App Password

Since your Google Account uses **2-Step Verification (2FA)**, you cannot use your regular password for the email alert. You must generate a specific "App Password".

## Step-by-Step Guide

1.  **Go to your Google Account**:
    *   Click your profile picture in Chrome > **Manage your Google Account**.
    *   Or visit: [https://myaccount.google.com/](https://myaccount.google.com/)

2.  **Navigate to Security**:
    *   Click on the **Security** tab on the left sidebar.
    *   Scroll down to the **"How you sign in to Google"** section.

3.  **Enable 2-Step Verification** (if not already done):
    *   If it is "Off", click it and follow the steps to turn it on (using your phone number or authenticator app).
    *   *App Passwords are ONLY available if 2FA is ON.*

4.  **Find "App Passwords"**:
    *   **Note**: Google has hidden this setting recently.
    *   Use the **Search bar** at the very top of the page (magnifying glass).
    *   Type **"App passwords"** and select it from the results.

5.  **Create a New App Password**:
    *   **App name**: Type a custom name, e.g., `Wedding App`.
    *   Click **Create**.

6.  **Copy the Password**:
    *   Google will show you a 16-character password in a yellow bar (e.g., `abcd efgh ijkl mnop`).
    *   **Copy this password**. (You won't be able to see it again!).

7.  **Update your `.env.local`**:
    *   Paste it into your project's environment file:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=abcd efgh ijkl mnop  # Paste the 16-char code here (spaces don't matter)
    ```

8.  **Restart Server**:
    *   Stop the terminal (`Ctrl+C`) and run `npm run dev` again.
