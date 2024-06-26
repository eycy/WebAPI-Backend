export const dog = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/dog",
  "title": "dog",
  "description": "A dog in the listing",
  "type": "object",
  "properties": {
    "name": {
      "description": "The name of the dog",
      "type": "string"
    },
    "description": {
      "description": "Anything about the dog",
      "type": "string"
    },
    "breed_id": {
      "description": "The ID of the breed",
      "type": "integer"
    },
    "imageURL": {
      "description": "URL for main image to show in dog",
      "type": "uri"
    },
    "published": {
      "description": "Is the dog listing published or not",
      "type": "boolean"
    },
    "authorID": {
      "description": "User ID of the dog listing author",
      "type": "integer",
      "minimum": 0
    },
  },
  "required": ["name", "breed_id"]
}