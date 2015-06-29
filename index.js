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
	var goodToGoTest = opts.goodToGoTest || defaultGoodToGo;
	var healthCheck = opts.healthCheck || defaultHealthCheck;

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

		function notOk() {
			res.statusCode = 503;
			res.send("Not OK, see /__health endpoint");
		}

		function ok() {
			res.send("OK");
		}

		// The GTG generation must timeout after 3 seconds and provide notice
		// of the timeout
		var goodToGoTimeout;
		Promise.race([
			goodToGoTest(),
			new Promise(function(resolve, reject) {
				goodToGoTimeout = setTimeout(function() { res.send("gtg status generation timed out\n"); resolve(false) }, 3000);
			})
		]).then(function(isOk) {
			clearTimeout(goodToGoTimeout);
			if (isOk) {
				ok();
			} else {
				notOk();
			}
		}).catch(function(e) {
			notOk();
		});
	});

	app.get(/\/__health$/, function(req, res) {
		res.set('Cache-Control', 'no-cache');
		res.set('Content-Type', 'application/json;charset=utf-8');

		healthCheck().then(function(checks) {
			// Construct a new object
			var healthcheck = {
				schemaVersion: 1,
				name: serviceName,
				description: serviceDescription,
				checks: checks
			};

			res.json(healthcheck);
		}).catch(function(e) {
			// TODO
		});
	});

	function defaultHealthCheck() {
		return Promise.resolve([]);
	}

	function defaultGoodToGo() {
		return Promise.resolve(true);
	}
};
