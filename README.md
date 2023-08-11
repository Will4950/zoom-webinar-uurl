# Zoom Webinar Join URL List

This is a sample app for a specific Zoom use case.

scopes:
- webinar:read:admin

### Setup

First install nodejs 18 LTS on your machine.


```bash
# clone the repo
git clone https://github.com/Will4950/zoom-webinar-uurl.git

# Navigate into the cloned project directory
cd zoom-webinar-uurl

# edit .env
nano .env

# Install required dependencies
npm install 

# Start the app
npm start

```

The appplication is listening at localhost:3000.

Send a get request to localhost:3000/webinarID

> replace webinarID with your webinar ID.  Example: localhost:3000/8675309
