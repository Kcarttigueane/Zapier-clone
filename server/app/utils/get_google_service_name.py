def get_google_service_name(service):
    service_lower = service.lower()
    if service_lower.startswith('google'):
        return service.split(' ')[1]
    return service_lower
