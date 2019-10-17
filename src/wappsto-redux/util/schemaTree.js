let schemaTree = {
  "user": {
    "name": "users",
    "dependencies": []
  },
  "state": {
    "name": "states",
    "dependencies": []
  },
  "value": {
    "name": "values",
    "dependencies": [{
      "key": "state",
      "type": "many"
    }]
  },
  "device": {
    "name": "devices",
    "dependencies": [{
      "key": "value",
      "type": "many"
    }]
  },
  "network": {
    "name": "networks",
    "dependencies": [{
      "key": "device",
      "type": "many"
    }]
  }
}

export default schemaTree;
