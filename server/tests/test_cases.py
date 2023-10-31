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
        print("----------------------------------------")

        user_id = "652fd057eb089f840ef53719"
        response = requests.get(f"{API_URL}/users/{user_id}")
        self.test_assert(response.status_code, 200, "Get User Status Code")

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

        self.test_assert(response.json(), expected_data, "Get User Json Response")