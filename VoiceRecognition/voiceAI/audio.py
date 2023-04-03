class AudioSource(object):
    def __init__(self):
        raise NotImplementedError("Derived class does not implement __init__")

    def __enter__(self):
        raise NotImplementedError("Derived class does not implement __enter__")

    def __exit__(self, exc_type, exc_val, traceback):
        raise NotImplementedError("Derived class does not implement __exit__")
