VERSION = (0, 0, 1, 'alpha', 1)

def get_version(*args, **kwargs):
    from django.utils.version import get_version
    return get_version(*args, **kwargs)