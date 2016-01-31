environment = get_environment();

settings = {
	environment: environment,
	apiEndpoint: get_api_endpoint(environment)
}

function get_environment() {
	var url = window.location.href
	if (url.startsWith("file://")) return 'dev'
	else return 'production'
}

function get_api_endpoint(environment) {
	switch (environment) {
		case 'dev': return 'http://127.0.0.1:5000'
		case 'production': return 'https://ssp-api-v2.herokuapp.com'
	}
}
