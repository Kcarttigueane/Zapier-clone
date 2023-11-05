import time

from fastapi import Request

from app.repository.actions_repository import ActionRepository
from app.repository.service_repository import ServiceRepository
from app.repository.triggers_repository import TriggerRepository
from app.schemas.about_dto import About, Action, Client, Reaction, Server, Service


class AboutService:
    def __init__(self):
        self.s_repo = ServiceRepository()
        self.t_repo = TriggerRepository()
        self.a_repo = ActionRepository()

    async def generate_about_json(self, request: Request):
        my_services = await self.s_repo.get_all()
        my_triggers = await self.t_repo.get_all()
        my_actions = await self.a_repo.get_all()

        services_details = [
            self.create_service_detail(service, my_actions, my_triggers)
            for service in my_services
        ]

        about = About(
            client=Client(
                host=request.client.host,
                services=len(my_services),
                triggers=len(my_services),
                actions=len(my_actions),
            ),
            server=Server(
                current_time=int(time.time()),
                services=services_details,
            ),
        )
        return about

    def create_service_detail(self, service, actions, triggers):
        actions_list = self.create_actions_list(service, actions)
        reactions_list = self.create_reactions_list(service, triggers)
        return Service(
            name=service.name,
            icon_svg_base64=service.icon_svg_base64,
            actions=actions_list,
            reactions=reactions_list,
        )

    def create_actions_list(self, service, actions):
        return [
            Action(name=action.name, description=action.description)
            for action in actions
            if action.service_id == service.id
        ]

    def create_reactions_list(self, service, triggers):
        return [
            Reaction(name=trigger.name, description=trigger.description)
            for trigger in triggers
            if trigger.service_id == service.id
        ]
