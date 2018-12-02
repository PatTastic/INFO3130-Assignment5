# INFO3130 - Assignment 5

## Things You'll Need
- [nodejs](https://nodejs.org/en/download/)
- [GitHub Desktop](https://desktop.github.com/)

## Getting Started
1. After nodejs has completed downloading, run the following commands
    - `npm install -g @angular/cli`
    - `npm install -g cordova`
2. After the repository has been cloned, open a command prompt window in the `src` directory (Angular)
3. Type `npm install` to install dependencies
4. Type `ng build --prod` to generate the app content
5. Type `cd ../` to move up to the Cordova directory
6. Type `npm install` to install dependencies
7. Type `cordova platform add android`
8. Type `cordova prepare`

## The Website
In order to view/debug the website, type `ng s` in a console window in the `/src` directory.
This website is debugged just like any other website.

## The App
### Running
In the root directory, type the command `cordova run android` into a console window. If things seem to be behaving strangly, use the command `cordova platform remove android` followed by `cordova platform add android` (this can be thought of as the "clean" command).

To run the app on your device, simply have your device connected to the computer. If there is no device connected, cordova will attempt to launch an emulator.

### Debugging
To debug the app, run the app on your device, then navigate to `chrome://inspect/#devices` in Chrome. After a few moments, your device will appear in the list. Click "Inspect". Then, debug it as you would any other website.

## Development Flow
1. Edit the website in the `/src` directory
2. Test & Debug using `ng s` (only needs to be typed once, the website will refresh with every change)
3. When your changes are complete, type `ng build --prod` to build the website
4. Type `cd ../` to move up to the Cordova (app) directory
5. Type `cordova run android` to test your changes on your device
