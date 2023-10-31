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

    def test_get_user(self):
        user_id = "652fd057eb089f840ef53719"
        response = requests.get(f"{API_URL}/users/{user_id}")

        self.test_assert(response.status_code, 200, "GET /users/{user_id}: Status Code for retrieving user")

        expected_data = {
            'email': 'john.doe@example.com',
            'password': '$2b$12$IBb65vCTt.ceyjbPNGjQFe2oML..p60kpKDtWqGpQ6ebMEP9jMQha',
            'recovery_code': None,
            'status': 'active',
            'role': 'USER',
            'email_verified': False,
            'profile': {
                'first_name': 'John',
                'last_name': 'Doe',
                'language': 'English',
                'theme': 'dark'},
            'oauth': [

            ],
            'created_at': '2023-10-18T14:28:30.358000',
            'updated_at': '2023-10-18T14:28:30.358000',
            'id': '652fd057eb089f840ef53719'
        }
        self.test_assert(response.json(), expected_data, "GET /users/{user_id}: JSON Response for retrieving user")

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
