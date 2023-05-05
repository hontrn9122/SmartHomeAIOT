import io
import os
import audioop
import wave
import platform
import tempfile
import aifc
import subprocess
import threading
import uuid
import math
import collections
import stat
import json
import log

try: #Attempt to use Python 2 modules
    from urllib import urlencode
    from urllib2 import Request, urlopen, URLError, HTTPError
except ImportError: #Use Python 3
    from urllib.parse import urlencode
    from urllib.request import Request, urlopen
    from urllib.error import URLError, HTTPError