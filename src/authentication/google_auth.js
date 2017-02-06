class GoogleAuth {
    _start(resourceName) {
        return () => {
            // 2. Initialize the JavaScript client library.
            gapi.client.init({
                'apiKey': 'YOUR_API_KEY',
                'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
                // clientId and scope are optional if auth is not required.
                'clientId': '47844778428-drrjnhimjebo5qo74c7gmbsgtkceue4j.apps.googleusercontent.com',
                'scope': 'profile',
            }).then(function () {
                // 3. Initialize and make the API request.
                return gapi.client.people.people.get({
                    resourceName: resourceName
                });
            }).then(function (response) {
                console.log(response.result);
            }, function (reason) {
                console.log('Error: ' + reason.result.error.message);
            });
        }
    }

    constructor(resourceName) {
        // 1. Load the JavaScript client library.
        gapi.load('client', this._start(resourceName));
    };
}
module.exports = GoogleAuth