def replace_id_key(d):
    """
    Replaces the _id key with the id key from a dictionary
    """
    new_dict = {}
    for key, value in d.items():
        new_key = key if key != "_id" else "id"
        if isinstance(value, dict):
            new_dict[new_key] = replace_id_key(value)
        elif isinstance(value, list):
            new_dict[new_key] = [
                replace_id_key(v) if isinstance(v, dict) else v for v in value
            ]
        else:
            new_dict[new_key] = value
    return new_dict
