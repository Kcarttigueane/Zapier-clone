from tests.base import TestCase
from app.core.config import API_URL
import requests

class GetActionByServiceTestCase(TestCase):

    def run_tests(self):
        self.test_get_all_actions_by_service()

    def test_get_all_actions_by_service(self):
        service_id = "652ac02672b11ce150460caf"
        response = requests.get(f"{API_URL}/actions/service/{service_id}")

        self.test_assert(response.status_code, 200, f"GET /actions/service/service_id: Status Code for getting all actions by service_id")

        data = response.json()
        self.test_assert(isinstance(data, list), True, f"GET /actions/service/service_id: Response data should be a list")

        for action in data:
            self.test_assert("id" in action, True, f"GET /actions/service/service_id: Action should have an 'id' field")
            self.test_assert("service_id" in action, True, f"GET /actions/service/service_id: Action should have a 'service_id' field")
            self.test_assert("name" in action, True, f"GET /actions/service/service_id: Action should have a 'name' field")
            self.test_assert("description" in action, True, f"GET /actions/service/service_id: Action should have a 'description' field")
            self.test_assert(action["service_id"], service_id, f"GET /actions/service/service_id: 'service_id' value in action should match requested service_id")
