@app
reminder-app

@static
folder build
spa true

@http
get /api

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
