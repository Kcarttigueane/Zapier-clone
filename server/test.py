import requests

# Replace these values with your actual endpoint and authorization token
endpoint_url = 'http://localhost:8080/api/services/google'
authorization_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5YW5uLmRlbXV5dEBnbWFpbC5jb20iLCJleHAiOjE2OTU4MzE3MDV9.erK6b5zhWtQWS07Xw6FqiToAqoBZ28V3XCdp482bUpE'

# Create a session to handle redirects and set the authorization header
session = requests.Session()
session.headers.update({'Authorization': f'Bearer {authorization_token}'})

# Make a GET request to the endpoint
response = session.get(endpoint_url, allow_redirects=True)