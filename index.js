module.exports = function(app, options) {
	var opts = options || {};

	if (!opts.serviceName) {
		throw new Error("Missing configuration option.  Should include a 'serviceName' property.");
	}

	var serviceName = opts.serviceName;
	var serviceDescription = opts.serviceDescription || "No description";

	if (!opts.serviceVersions) {
		throw new Error("Missing configuration option. Should include a 'serviceVersions' property as an array of API version.");
	}

	var serviceVersions = opts.serviceVersions;
	var goodToGoCallback = opts.goodToGoCallback || defaultGoodToGo;
	var healthcheckCallback = opts.healthcheckCallback || defaultHealthCheck;

	// Create static web service description object based on supplied service versions.
	var indexInfo = {
		name: serviceName,
		versions: Object.keys(serviceVersions).map(function(version) {
			return "/" + version + "/";
		})
	};

	app.get(/^\/__about$/, function(req, res) {
		res.json(indexInfo);
	});

	// For each version create a static description object and create a new route for it.
	var serviceDecriptions = {};
	Object.keys(serviceVersions).forEach(function(version) {
		var versionInfo = serviceVersions[version];

		var info = {
			name: versionInfo.name || serviceName,
			apiVersion: Number(version.replace('v', '')),
			appVersion: versionInfo.appVersion,
			dateCreated: versionInfo.dateCreated.toISOString(),
			support: versionInfo.support,
			supportStatus: versionInfo.supportStatus
		};

		app.get(new RegExp("^\\/" + version + "\\/__about$"), function(req, res) {
			res.json(info);
		});
	});

	app.get(/\/__gtg$/, function(req, res) {

		res.set("Cache-Control", "no-cache");
		res.set("Content-Type", "text/plain;charset=utf-8");
		goodToGoCallback(function(error, result) {
			if (error || result === false) {
				res.statusCode = 503;
				res.send("Not OK");
			} else {
				res.send("OK");
			}
		});
	});

	app.get(/\/__health$/, function(req, res) {
		res.set('Cache-Control', 'no-cache');
		res.set('Content-Type', 'application/json;charset=utf-8');

		healthcheckCallback(function(error, checks) {
			// Construct a new object
			var healthcheck = {
				schemaVersion: 1,
				name: serviceName,
				description: serviceDescription,
				checks: checks
			};

			res.json(healthcheck);
		});
	});

	function defaultHealthCheck(cb) {
		process.nextTick(function() {
			cb(null, []);
		});
	}

	function defaultGoodToGo(cb) {
		process.nextTick(function() {
			cb(null, true);
		});
	}
};
