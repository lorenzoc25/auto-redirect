# Auto Redirect
This is a chrome extension that allow you to open pages in current tab instead of new tab on customized domain.

## Install
### Download the Newest Release
Go to the [relase page](https://github.com/lorenzoc25/auto-redirect/releases/), download the newset release, unzip it and load it to the chrome extension, or

### Clone the Repo and Build it Manually(Not suggested)
```bash
git clone https://github.com/lorenzoc25/auto-redirect && cd auto-redirect
```
```
yarn && yarn build
```
or if you are using npm
```
npm i && npm build
```
The extension will then be built on `./auto-redirect/dist` path.

### Loading it to Chrome
Turn on the chrome developer mode by going to `chrome://extensions/` and toggle the developer mode on the upper-right corner.

After turning on the developer mode, select the 'load unpacked' option on the upper-left corner and select the directory of the unzipped/built file. You should then be ready to go!

## Usage
After loading the extension, you can find it on the chrome extension section. Clicking on the icon would give you an user interface. Simply type in the domain names and this extension will automatically work on them! 

Note: currently, the extension achieve its functionally by using `url.include('rules')` to detect if it should change new tab to redirect in `url`. Thus, a suggested way to include rules is to type the full domain name like `bilibili.com`.

## Future Plans
- [ ] Improve on UI
- [ ] Regex matching on rules
- [x] Deleting rules / temporarily disable them
- [ ] Forbid adding duplicate rules
- [ ] Add rules that open pages in new tab instead of redirection (WIP)

## Contributing
To contribute, please fork this repository and open a pull request