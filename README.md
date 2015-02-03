# FT Express Web Service Description

Install routes for `__gtg`, `__health`, `__about` and version endpoints given
a configuration.

## Usage

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
