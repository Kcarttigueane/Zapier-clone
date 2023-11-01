from tests.base import TestCase
from app.core.config import API_URL
import requests

class GetActionTestCase(TestCase):

    def run_tests(self):
        self.test_get_action()

    def test_get_action(self):
        action_id = "652ad20b2af9c30350f8861b"
        response = requests.get(f"{API_URL}/actions/{action_id}")

        self.test_assert(response.status_code, 200, f"GET /actions/action_id: Status Code for getting action with id")

        data = response.json()
        self.test_assert("id" in data, True, f"GET /actions/action_id: Action should have an 'id' field")
        self.test_assert("service_id" in data, True, f"GET /actions/action_id: Action should have a 'service_id' field")
        self.test_assert("name" in data, True, f"GET /actions/action_id: Action should have a 'name' field")
        self.test_assert("description" in data, True, f"GET /actions/action_id: Action should have a 'description' field")

        self.test_assert(data["id"], action_id, f"GET /actions/action_id: 'id' value should match requested action_id")
