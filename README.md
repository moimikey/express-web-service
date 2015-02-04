# Express FT Web Service Description

Install routes for `__gtg`, `__health`, `__about` and version endpoints given
a configuration.

# Example

Basic example:

```JS
var ftwebservice = require('ftwebservice');
var express = require('express');
var app = express();

ftwebservice(app, {
	serviceName: "my-useful-service",
	serviceDesciption: "A useful description of my useful service.",
	serviceVersions: {
		v1: {
			dateCreated: new Date(2015, 1, 22),
			support: 'your.support.email@example.com',
			supportStatus: 'active'
		}
	}
});
```

Example with Good To Go logic and Healthcheck logic:

```JS
ftwebservice(app, {
	serviceName: "my-useful-service",
	serviceDesciption: "A useful description of my useful service.",
	serviceVersions: {
		v1: {
			dateCreated: new Date(2015, 1, 22),
			support: 'your.support.email@example.com',
			supportStatus: 'active'
		}
	},
	goodToGo: function() {
		return new Promise(function(resolve, reject) {
			resolve(isApplicationHappy());
		});
	},
	healthCheck: function() {
		// You might have several async checks that you need to perform or
		// collect the results from, this is a really simplistic example
		return new Promise(function(resolve, reject) {
			resolve([
				{
					name: "Database TCP connectivity",
					ok: false,
					severity: 2,
					businessImpact: "Article pages will not be available",
					technicalSummary: "The database is dead",
					panicGuide: "Check the health status of the database at host <database host>",
					checkOutput: "tcp connect failed after 10 seconds on destination port 3306 - destination unreachable",
					lastUpdated: new Date().toISOString()
				}
			]);
		});
	}
});
```

## Options

| Option | Description |
|--------|-------------|
| `serviceName` | The name of the web service |
| `serviceDescription` | A short description of the purpose of the service |
| `serviceVersions` | An object mapping service versions to their service descriptions.  See service version descriptions. |
| `goodToGoTest` | (Optional) A function that can be used to indicate the good to go status of the service, the function should return a Promise resolved with `true` to indicate a positive good to go status, and `false` to indicate a negative good to go status. |
| `healthCheck` | (Optional) A function that can be used to generate structured healthcheck information, the function should return a Promise resolved with an array of healthcheck objects. |


## Service version descriptions

A more complete overview of the options in this section can be found here [in the Origami spec](http://origami.ft.com/docs/syntax/web-service-description/)

| Option | Description |
|--------|-------------|
| `name` | (Optional) The name of the API endpoint (if different from the name of the service |
| `appVersion` | The deployed version of the code for this API endpoint |
| `dateCreated` | The date this version of the API was first released |
| `support` | The support URL or email address. See [support](http://origami.ft.com/docs/syntax/origamijson/) in the Origami spec. |
| `supportStatus` | The support status of the API version.  See [supportStatus](http://origami.ft.com/docs/syntax/origamijson/)  in the Origami spec. |

# License

MIT
