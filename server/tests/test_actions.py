import requests
from fastapi import status

from app.core.config import API_URL
from tests.base import TestCase


class GetActionTestCase(TestCase):
    def run_tests(self):
        self.test_get_all_actions()
        self.test_get_action()
        self.test_get_all_actions_by_service()

    def test_get_all_actions(self):
        response = requests.get(f"{API_URL}/actions")

        self.test_assert(
            response.status_code,
            status.HTTP_200_OK,
            "GET /actions: Status Code for getting all actions",
        )

        data = response.json()
        self.test_assert(
            isinstance(data, list), True, "GET /actions: Response data should be a list"
        )

        if len(data) > 0:
            action = data[0]
            self.test_assert(
                "id" in action,
                True,
                "GET /actions: First action should have an 'id' field",
            )
            self.test_assert(
                "service_id" in action,
                True,
                "GET /actions: First action should have a 'service_id' field",
            )
            self.test_assert(
                "name" in action,
                True,
                "GET /actions: First action should have a 'name' field",
            )
            self.test_assert(
                "description" in action,
                True,
                "GET /actions: First action should have a 'description' field",
            )

    def test_get_action(self):
        action_id = "652ad20b2af9c30350f8861b"
        response = requests.get(f"{API_URL}/actions/{action_id}")

        self.test_assert(
            response.status_code,
            status.HTTP_200_OK,
            "GET /actions/action_id: Status Code for getting action with id",
        )

        data = response.json()
        self.test_assert(
            "id" in data,
            True,
            "GET /actions/action_id: Action should have an 'id' field",
        )
        self.test_assert(
            "service_id" in data,
            True,
            "GET /actions/action_id: Action should have a 'service_id' field",
        )
        self.test_assert(
            "name" in data,
            True,
            "GET /actions/action_id: Action should have a 'name' field",
        )
        self.test_assert(
            "description" in data,
            True,
            "GET /actions/action_id: Action should have a 'description' field",
        )

        self.test_assert(
            data["id"],
            action_id,
            "GET /actions/action_id: 'id' value should match requested action_id",
        )

    def test_get_all_actions_by_service(self):
        service_id = "652ac02672b11ce150460caf"
        response = requests.get(f"{API_URL}/actions/service/{service_id}")

        self.test_assert(
            response.status_code,
            status.HTTP_200_OK,
            (
                "GET /actions/service/service_id: Status Code for getting all "
                "actions by service_id"
            ),
        )

        data = response.json()
        self.test_assert(
            isinstance(data, list),
            True,
            "GET /actions/service/service_id: Response data should be a list",
        )

        for action in data:
            self.test_assert(
                "id" in action,
                True,
                "GET /actions/service/service_id: Action should have an 'id' field",
            )
            self.test_assert(
                "service_id" in action,
                True,
                (
                    "GET /actions/service/service_id: Action should have "
                    "a 'service_id' field"
                ),
            )
            self.test_assert(
                "name" in action,
                True,
                "GET /actions/service/service_id: Action should have a 'name' field",
            )
            self.test_assert(
                "description" in action,
                True,
                (
                    "GET /actions/service/service_id: Action should have a "
                    "'description' field"
                ),
            )
            self.test_assert(
                action["service_id"],
                service_id,
                (
                    "GET /actions/service/service_id: 'service_id' value in action "
                    "should match requested service_id"
                ),
            )
