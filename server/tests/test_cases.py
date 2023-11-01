import requests
from app.core.config import API_URL

class TestCase():
    def __init__(self):
        self.success = 0
        self.failure = 0
        self.total = 0

    def test_assert(self, objectA, objectB, test_type):
        if objectA == objectB:
            self.success += 1
            print(f"Test success: {test_type}")
        else:
            self.failure += 1
            print(f"Test Failed: {test_type}")
        self.total += 1

    def print_results(self):
        print("======= Test Results ======== ")
        print(f"Success: {self.success} /  {self.total}")
        print(f"Failure: {self.failure} /  {self.total}")

class UsersTestCase(TestCase):

    def test_create_user(self):
        payload = {
            "email": "test@example.com",
            "password": "password123",
            "profile": {
                "first_name": "test",
                "last_name": "example"
            }
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        self.test_assert(response.status_code, 201, "POST /auth/register: Status Code for creating user")

        response_data = response.json()
        access_token_exists = isinstance(response_data.get('accessToken', None), str)
        self.test_assert(access_token_exists, True, "POST /auth/register: Access Token exists and is a string")

        token_type = response_data.get('tokenType', None)
        self.test_assert(token_type, 'bearer', "POST /auth/register: Token Type is Bearer")

    def test_missing_email(self):
        payload = {
            "password": "password123",
            "profile": {
                "first_name": "test",
                "last_name": "example"
            }
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        response_data = response.json()

        self.test_assert(response.status_code, 422, "POST /auth/register: Status code for missing email")

        error_msg = response_data.get("detail", [{}])[0].get("msg", "")
        expected_msg = "field required"
        self.test_assert(error_msg, expected_msg, "POST /auth/register: Error message for missing email")

        missing_field = response_data.get("detail", [{}])[0].get("loc", [])[-1]
        self.test_assert(missing_field, "email", "POST /auth/register: Missing field in error details")

    def test_invalid_email_format(self):
        payload = {
            "email": "invalidEmailFormat",
            "password": "password123",
            "profile": {
                "first_name": "test",
                "last_name": "example"
            }
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        response_data = response.json()

        self.test_assert(response.status_code, 422, "POST /auth/register: Status code for invalid email format")

        error_msg = response_data.get("detail", [{}])[0].get("msg", "")
        expected_msg = "value is not a valid email address"
        self.test_assert(error_msg, expected_msg, "POST /auth/register: Error message for invalid email format")

        error_field = response_data.get("detail", [{}])[0].get("loc", [])[-1]
        self.test_assert(error_field, "email", "POST /auth/register: Field in error details for invalid email format")
