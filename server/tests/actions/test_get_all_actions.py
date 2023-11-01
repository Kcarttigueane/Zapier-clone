from tests.base import TestCase
from app.core.config import API_URL
import requests

class GetAllActionsTestCase(TestCase):

    def run_tests(self):
        self.test_get_all_actions()

    def test_get_all_actions(self):
        response = requests.get(f"{API_URL}/actions")

        self.test_assert(response.status_code, 200, "GET /actions - GET ALL ACTIONS: Status Code for getting all actions")

        data = response.json()
        self.test_assert(isinstance(data, list), True, "GET /actions - GET ALL ACTIONS: Response data should be a list")

        if len(data) > 0:
            action = data[0]
            self.test_assert("id" in action, True, "GET /actions - GET ALL ACTIONS: First action should have an 'id' field")
            self.test_assert("service_id" in action, True, "GET /actions - GET ALL ACTIONS: First action should have a 'service_id' field")
            self.test_assert("name" in action, True, "GET /actions - GET ALL ACTIONS: First action should have a 'name' field")
            self.test_assert("description" in action, True, "GET /actions - GET ALL ACTIONS: First action should have a 'description' field")
